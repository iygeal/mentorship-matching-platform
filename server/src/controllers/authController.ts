import { Request, Response } from "express";
import User from "../models/user";
import validateEmail from "../utils/validateEmail";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateToken = (userId: string, role: string) => {
  const secret = process.env.JWT_SECRET as string;
  return jwt.sign({ userId, role }, secret, { expiresIn: "7d" });
};

// @desc    Register a new user
// @route   POST /auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    // Basic input validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    // Email format validation
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    // Create and save new user
    const user = new User({ name, email, password, role });
    await user.save();

    // Generate JWT token
    const token = generateToken(
      (user._id as mongoose.Types.ObjectId).toString(),
      user.role
    );

    // Respond with user info (excluding password)
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
