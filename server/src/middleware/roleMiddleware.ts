import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./authMiddleware";

export const isAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  return next();
};
