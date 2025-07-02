import express from "express";
import { bookSession, addFeedback } from "../controllers/sessionController";
import protect from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, bookSession);
router.put("/:id/feedback", protect, addFeedback);

export default router;
