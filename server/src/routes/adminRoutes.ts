import express from "express";
import { getAllUsers } from "../controllers/adminController";
import protect from "../middleware/authMiddleware";
import { isAdmin } from "../middleware/roleMiddleware";

const router = express.Router();

// Protect + Admin-only
router.get("/users", protect, isAdmin, getAllUsers);

export default router;
