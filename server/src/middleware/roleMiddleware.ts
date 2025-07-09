import { RequestHandler } from "express";

export const isAdmin: RequestHandler = (req, res, next) => {
  const user = (req as any).user;

  if (!user || user.role !== "admin") {
    res.status(403).json({ message: "Access denied. Admins only." });
    return;
  }

  next();
};

export const isMentor: RequestHandler = (req, res, next) => {
  const user = (req as any).user;

  if (!user || user.role !== "mentor") {
    res.status(403).json({ message: "Access denied. Mentors only." });
    return;
  }

  next();
};
