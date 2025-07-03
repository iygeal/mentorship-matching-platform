import { Request, Response } from "express";
import User from "../models/user";
import MentorshipRequest from "../models/mentorshipRequest";
import Session from "../models/session";

// @desc    Get all users
// @route   GET /admin/users
// @access  Private (Admin only)
export const getAllUsers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      message: "All users retrieved successfully",
      users,
    });
  } catch (error) {
    console.error("GetAllUsers Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    View all accepted mentorship matches
// @route   GET /admin/matches
// @access  Private (Admin)
export const getAllMatches = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const matches = await MentorshipRequest.find({ status: "accepted" })
      .populate("mentee", "firstName lastName email")
      .populate("mentor", "firstName lastName email");

    res.status(200).json({
      message: "All accepted mentorship matches",
      matches,
    });
  } catch (error) {
    console.error("GetAllMatches Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get number of sessions held
// @route   GET /admin/sessions/stats
// @access  Private (Admin)
export const getSessionStats = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const totalSessions = await Session.countDocuments();
    const feedbackGiven = await Session.countDocuments({
      feedback: { $exists: true },
    });

    res.status(200).json({
      message: "Session stats",
      totalSessions,
      withFeedback: feedbackGiven,
    });
  } catch (error) {
    console.error("GetSessionStats Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Manually assign mentor to mentee
// @route   PUT /admin/assign
// @access  Private (Admin)
interface AssignBody {
  mentorId: string;
  menteeId: string;
}

export const assignMentor = async (
  req: Request<{}, {}, AssignBody>,
  res: Response
): Promise<void> => {
  try {
    const { mentorId, menteeId } = req.body;

    if (!mentorId || !menteeId) {
      res.status(400).json({ message: "mentorId and menteeId are required" });
      return;
    }

    const existing = await MentorshipRequest.findOne({
      mentor: mentorId,
      mentee: menteeId,
    });

    if (existing) {
      existing.status = "accepted";
      await existing.save();
      res
        .status(200)
        .json({ message: "Match updated to accepted", match: existing });
      return;
    }

    const match = new MentorshipRequest({
      mentor: mentorId,
      mentee: menteeId,
      status: "accepted",
    });

    await match.save();

    res.status(201).json({
      message: "Mentor assigned successfully",
      match,
    });
  } catch (error) {
    console.error("AssignMentor Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
