import express from "express";
import {
  getAllUsers,
  getAllMatches,
  getSessionStats,
  assignMentor,
} from "../controllers/adminController";
import protect from "../middleware/authMiddleware";
import { isAdmin } from "../middleware/roleMiddleware";

const router = express.Router();

// Protect + Admin-only
router.get("/users", protect, isAdmin, getAllUsers);
router.get("/matches", protect, isAdmin, getAllMatches);
router.get("/sessions/stats", protect, isAdmin, getSessionStats);
router.put("/assign", protect, isAdmin, assignMentor);

export default router;
