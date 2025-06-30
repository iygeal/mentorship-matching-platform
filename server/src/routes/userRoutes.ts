import express from "express";
import { getMe } from "../controllers/userController";
import protect from "../middleware/authMiddleware";

const router = express.Router();

// GET /users/me → requires token
router.get("/me", protect, getMe);

export default router;

