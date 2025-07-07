import express from "express";
import {
  getAvailability,
  addAvailability,
  deleteAvailability,
} from "../controllers/availabilityController";
import protect from "../middleware/authMiddleware";
import { isMentor } from "../middleware/roleMiddleware";

const router = express.Router();

router.use(protect); // All routes: must be logged in

// Allow all users to view availability (optionally restrict later)
router.get("/", getAvailability);

// Restrict to mentors for modifying availability
router.post("/", isMentor, addAvailability);
router.delete("/:id", isMentor, deleteAvailability);

export default router;
