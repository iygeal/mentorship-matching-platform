import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

// Extend Request type to include `user`
export interface AuthenticatedRequest extends Request {
  user?: { userId: string; role: string };
}

const protect: RequestHandler = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET as string;

    const decoded = jwt.verify(token, secret) as {
      userId: string;
      role: string;
    };

    (req as AuthenticatedRequest).user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default protect;
