import { Response } from "express";
import User from "../models/user";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

// @desc    Get current logged-in user's profile
export const getMe = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || !req.user.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
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

interface UpdateProfileBody {
  firstName?: string;
  lastName?: string;
  bio?: string;
  skills?: string[];
  goals?: string;
}

// @desc    Update current user's profile
export const updateProfile = async (
  req: AuthenticatedRequest<{}, {}, UpdateProfileBody>,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || !req.user.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const updates = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      bio: req.body.bio,
      skills: req.body.skills,
      goals: req.body.goals,
    };

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

// @desc    Get all mentors (with optional skill filter)
export const getMentors = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { skill } = req.query;

    const query: any = { role: "mentor" };

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
