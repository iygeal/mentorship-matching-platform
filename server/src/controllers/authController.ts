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
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { firstName, lastName, email, password, role, skills, goals, bio } =
      req.body;

    if (!firstName || !lastName || !email || !password) {
      res.status(400).json({ message: "Please fill all required fields" });
      return;
    }

    if (!validateEmail(email)) {
      res.status(400).json({ message: "Invalid email format" });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: "Email is already registered" });
      return;
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role,
      skills,
      goals,
      bio,
    });
    await user.save();

    const token = generateToken(
      (user._id as mongoose.Types.ObjectId).toString(),
      user.role
    );

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        skills: user.skills,
        goals: user.goals,
        bio: user.bio,
      },
      token,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN CONTROLLER
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const normalizedEmail = validateEmail(email);
    if (!normalizedEmail) {
      res.status(400).json({ message: "Invalid email format" });
      return;
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = generateToken(
      (user._id as mongoose.Types.ObjectId).toString(),
      user.role
    );

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        skills: user.skills,
        goals: user.goals,
        bio: user.bio,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
