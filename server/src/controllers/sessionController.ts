import { Request, Response } from "express";
import Session from "../models/session";
import User from "../models/user";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

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
