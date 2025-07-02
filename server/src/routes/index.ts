import express from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import requestRoutes from "./requestRoutes";
import sessionRoutes from "./sessionRoutes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/requests", requestRoutes);
router.use("/sessions", sessionRoutes);

export default router;
