import express from "express";
import authRoutes from "./authRoutes";
// Future imports: userRoutes, sessionRoutes, etc.

const router = express.Router();

router.use("/auth", authRoutes);

export default router;
