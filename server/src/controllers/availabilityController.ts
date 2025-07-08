import { Response } from "express";
import Availability from "../models/availability";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

// @desc    Get all availability slots for the logged-in mentor
export const getAvailability = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const slots = await Availability.find({ mentor: req.user.userId });
    res.status(200).json({ availability: slots });
  } catch (error) {
    console.error("GetAvailability Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Add a new availability slot
export const addAvailability = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { day, startTime, endTime } = req.body;

    if (!day || !startTime || !endTime) {
      res.status(400).json({ message: "All fields are required." });
      return;
    }

    const newSlot = await Availability.create({
      mentor: req.user.userId,
      day,
      startTime,
      endTime,
    });

    res.status(201).json({ message: "Availability slot added", slot: newSlot });
  } catch (error) {
    console.error("AddAvailability Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete an availability slot
export const deleteAvailability = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const deleted = await Availability.findOneAndDelete({
      _id: req.params.id,
      mentor: req.user.userId,
    });

    if (!deleted) {
      res.status(404).json({ message: "Slot not found or not authorized." });
      return;
    }

    res.status(200).json({ message: "Slot deleted" });
  } catch (error) {
    console.error("DeleteAvailability Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all availability slots for a specific mentor
export const getAvailabilityByMentor = async (
  req: AuthenticatedRequest<{ mentorId: string }>,
  res: Response
) => {
  try {
    const { mentorId } = req.params;
    const slots = await Availability.find({ mentor: mentorId });
    res.status(200).json({ availability: slots });
  } catch (error) {
    console.error("getAvailabilityByMentor Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
