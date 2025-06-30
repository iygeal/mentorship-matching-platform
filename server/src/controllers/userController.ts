import { Response } from "express";
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
