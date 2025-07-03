import { Response } from "express";
import MentorshipRequest from "../models/mentorshipRequest";
import User from "../models/user";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

interface RespondToRequestBody {
  status: "accepted" | "rejected";
}

// @desc Send mentorship request
export const sendRequest = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { mentorId } = req.body;

    if (!req.user?.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (req.user.role !== "mentee") {
      res.status(403).json({ message: "Only mentees can send requests" });
      return;
    }

    const mentor = await User.findById(mentorId);
    if (!mentor || mentor.role !== "mentor") {
      res.status(404).json({ message: "Mentor not found" });
      return;
    }

    const existing = await MentorshipRequest.findOne({
      mentee: req.user.userId,
      mentor: mentorId,
    });

    if (existing) {
      res.status(409).json({ message: "Request already sent" });
      return;
    }

    const request = new MentorshipRequest({
      mentee: req.user.userId,
      mentor: mentorId,
    });

    await request.save();

    res.status(201).json({
      message: "Mentorship request sent",
      request,
    });
  } catch (error) {
    console.error("SendRequest Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc View requests the mentee has sent
export const getSentRequests = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const requests = await MentorshipRequest.find({ mentee: req.user.userId })
      .populate("mentor", "firstName lastName email role")
      .sort({ createdAt: -1 });

    res.status(200).json({ requests });
  } catch (error) {
    console.error("GetSentRequests Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc View requests the mentor has received
export const getReceivedRequests = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const requests = await MentorshipRequest.find({ mentor: req.user.userId })
      .populate("mentee", "firstName lastName email role")
      .sort({ createdAt: -1 });

    res.status(200).json({ requests });
  } catch (error) {
    console.error("GetReceivedRequests Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Accept or reject a mentorship request
export const respondToRequest = async (
  req: AuthenticatedRequest<{ id: string }, {}, RespondToRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!req.user?.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (req.user.role !== "mentor") {
      res.status(403).json({ message: "Only mentors can respond to requests" });
      return;
    }

    if (!["accepted", "rejected"].includes(status)) {
      res.status(400).json({ message: "Invalid status" });
      return;
    }

    const request = await MentorshipRequest.findById(id);
    if (!request) {
      res.status(404).json({ message: "Request not found" });
      return;
    }

    if (request.mentor.toString() !== req.user.userId) {
      res
        .status(403)
        .json({ message: "Not authorized to update this request" });
      return;
    }

    request.status = status;
    await request.save();

    res.status(200).json({
      message: `Request ${status}`,
      request,
    });
  } catch (error) {
    console.error("RespondToRequest Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
