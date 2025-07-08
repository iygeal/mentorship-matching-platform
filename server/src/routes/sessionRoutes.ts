import express from "express";
import { bookSession, addFeedback, getMySessions } from "../controllers/sessionController";
import protect from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, bookSession);
router.put("/:id/feedback", protect, addFeedback);
router.get("/", protect, getMySessions);

export default router;
