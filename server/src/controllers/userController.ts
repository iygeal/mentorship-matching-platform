import { Request, Response } from "express";
import User from "../models/user";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

// @desc    Get current logged-in user's profile
// @route   GET /users/me
// @access  Private
export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Ensure user is attached from JWT
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("GetMe Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update current user's profile
// @route   PUT /users/me/profile
// @access  Private
export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const updates = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      bio: req.body.bio,
      skills: req.body.skills,
      goals: req.body.goals,
    };

    // Remove undefined fields (only update what's sent)
    Object.keys(updates).forEach((key) => {
      if (updates[key as keyof typeof updates] === undefined) {
        delete updates[key as keyof typeof updates];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("UpdateProfile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all mentors (optional skill filter)
// @route   GET /users/mentors
// @access  Public (or protect if needed)
export const getMentors = async (req: Request, res: Response) => {
  try {
    const { skill } = req.query;

    // Build query
    const query: any = { role: "mentor" };

    // If skill is provided, filter mentors who have that skill
    if (skill) {
      query.skills = {
        $elemMatch: { $regex: new RegExp(skill as string, "i") },
      };
    }

    const mentors = await User.find(query).select("-password");

    res.status(200).json({
      message: "Mentors fetched successfully",
      mentors,
    });
  } catch (error) {
    console.error("GetMentors Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
