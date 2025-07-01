import { Request, Response } from "express";
import MentorshipRequest from "../models/mentorshipRequest";
import User from "../models/user";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

// @desc    Send mentorship request
// @route   POST /requests
// @access  Private (mentee only)
export const sendRequest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { mentorId } = req.body;

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Only mentees should send requests
    if (req.user.role !== "mentee") {
      return res
        .status(403)
        .json({ message: "Only mentees can send requests" });
    }

    // Check if mentor exists and is actually a mentor
    const mentor = await User.findById(mentorId);
    if (!mentor || mentor.role !== "mentor") {
      return res.status(404).json({ message: "Mentor not found" });
    }

    // Check if request already exists
    const existing = await MentorshipRequest.findOne({
      mentee: req.user.userId,
      mentor: mentorId,
    });

    if (existing) {
      return res.status(409).json({ message: "Request already sent" });
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

// @desc    View requests the mentee has sent
// @route   GET /requests/sent
// @access  Private (mentee)
export const getSentRequests = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const requests = await MentorshipRequest.find({ mentee: req.user.userId })
      .populate("mentor", "firstName lastName email role")
      .sort({ createdAt: -1 });

    res.status(200).json({ requests });
  } catch (error) {
    console.error("GetSentRequests Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    View requests the mentor has received
// @route   GET /requests/received
// @access  Private (mentor)
export const getReceivedRequests = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const requests = await MentorshipRequest.find({ mentor: req.user.userId })
      .populate("mentee", "firstName lastName email role")
      .sort({ createdAt: -1 });

    res.status(200).json({ requests });
  } catch (error) {
    console.error("GetReceivedRequests Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Accept or reject a mentorship request
// @route   PUT /requests/:id
// @access  Private (mentor only)
export const respondToRequest = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    // Must be a mentor
    if (req.user.role !== "mentor") {
      return res
        .status(403)
        .json({ message: "Only mentors can respond to requests" });
    }

    // Status must be valid
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const request = await MentorshipRequest.findById(id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Ensure mentor owns this request
    if (request.mentor.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this request" });
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
