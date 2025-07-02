import { Request, Response } from "express";
import Session from "../models/session";
import User from "../models/user";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import MentorshipRequest from "../models/mentorshipRequest";

// @desc    Book a mentorship session
// @route   POST /sessions
// @access  Private
export const bookSession = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { mentorId, scheduledAt, notes } = req.body;

    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    // Only mentees can book sessions
    if (req.user.role !== "mentee") {
      return res
        .status(403)
        .json({ message: "Only mentees can book sessions" });
    }

    const mentor = await User.findById(mentorId);
    if (!mentor || mentor.role !== "mentor") {
      return res.status(404).json({ message: "Mentor not found" });
    }

    // Check if mentorship request has been accepted
    const request = await MentorshipRequest.findOne({
      mentee: req.user.userId,
      mentor: mentorId,
      status: "accepted",
    });

    if (!request) {
      return res.status(403).json({
        message:
          "You must be matched with this mentor before booking a session",
      });
    }

    const session = new Session({
      mentor: mentorId,
      mentee: req.user.userId,
      scheduledAt,
      notes,
    });

    await session.save();

    res.status(201).json({
      message: "Session booked successfully",
      session,
    });
  } catch (error) {
    console.error("BookSession Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Add feedback to a session
// @route   PUT /sessions/:id/feedback
// @access  Private (mentor or mentee only)
export const addFeedback = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { feedback, rating } = req.body;

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!feedback || feedback.trim() === "") {
      return res.status(400).json({ message: "Feedback cannot be empty" });
    }

    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const userId = req.user.userId;

    // Only mentor or mentee in the session can submit feedback
    if (
      session.mentor.toString() !== userId &&
      session.mentee.toString() !== userId
    ) {
      return res
        .status(403)
        .json({ message: "You are not part of this session" });
    }

    // Rating validation and access check
    if (rating && (rating < 1 || rating > 5)) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    // Only mentees can rate the session
    if (rating && session.mentee.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Only mentees can rate sessions" });
    }

    session.feedback = feedback;

    if (rating) {
      session.rating = rating;
    }

    await session.save();

    res.status(200).json({
      message: "Feedback submitted successfully",
      session,
    });
  } catch (error) {
    console.error("AddFeedback Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
