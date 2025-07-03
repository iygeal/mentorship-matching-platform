import { Response } from "express";
import Session from "../models/session";
import User from "../models/user";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import MentorshipRequest from "../models/mentorshipRequest";

export const bookSession = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { mentorId, scheduledAt, notes } = req.body;
    if (!req.user?.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (req.user.role !== "mentee") {
      res.status(403).json({ message: "Only mentees can book sessions" });
      return;
    }

    const mentor = await User.findById(mentorId);
    if (!mentor || mentor.role !== "mentor") {
      res.status(404).json({ message: "Mentor not found" });
      return;
    }

    const request = await MentorshipRequest.findOne({
      mentee: req.user.userId,
      mentor: mentorId,
      status: "accepted",
    });

    if (!request) {
      res.status(403).json({
        message:
          "You must be matched with this mentor before booking a session",
      });
      return;
    }

    const session = new Session({
      mentor: mentorId,
      mentee: req.user.userId,
      scheduledAt,
      notes,
    });
    await session.save();

    res.status(201).json({ message: "Session booked successfully", session });
  } catch (error) {
    console.error("BookSession Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addFeedback = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { feedback, rating } = req.body;

    if (!req.user?.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!feedback || feedback.trim() === "") {
      res.status(400).json({ message: "Feedback cannot be empty" });
      return;
    }

    const session = await Session.findById(id);
    if (!session) {
      res.status(404).json({ message: "Session not found" });
      return;
    }

    const userId = req.user.userId;
    const isMentorOrMentee =
      session.mentor.toString() === userId ||
      session.mentee.toString() === userId;
    if (!isMentorOrMentee) {
      res.status(403).json({ message: "You are not part of this session" });
      return;
    }

    if (rating && (rating < 1 || rating > 5)) {
      res.status(400).json({ message: "Rating must be between 1 and 5" });
      return;
    }

    if (rating && session.mentee.toString() !== userId) {
      res.status(403).json({ message: "Only mentees can rate sessions" });
      return;
    }

    session.feedback = feedback;
    if (rating) session.rating = rating;
    await session.save();

    res
      .status(200)
      .json({ message: "Feedback submitted successfully", session });
  } catch (error) {
    console.error("AddFeedback Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
