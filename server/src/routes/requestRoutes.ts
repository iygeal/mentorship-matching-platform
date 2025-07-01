import express from "express";
import {
  sendRequest,
  getReceivedRequests,
  getSentRequests,
} from "../controllers/requestController";
import protect from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, sendRequest);
router.get("/received", protect, getReceivedRequests);
router.get("/sent", protect, getSentRequests);

export default router;
