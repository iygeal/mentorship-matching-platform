import express from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import requestRoutes from "./requestRoutes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/requests", requestRoutes);

export default router;
