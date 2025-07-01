import express from "express";
import { getMe, updateProfile, getMentors } from "../controllers/userController";
import protect from "../middleware/authMiddleware";

const router = express.Router();

router.get("/me", protect, getMe);
router.put("/me/profile", protect, updateProfile);
router.get("/mentors", getMentors);

export default router;
