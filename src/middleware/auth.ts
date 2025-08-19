// src/middleware/auth.ts
import { Request, Response, NextFunction, RequestHandler } from "express";
import { verifyAccessToken } from "../utils/JWT";

export interface AuthRequest extends Request {
  userId?: number;
}

export const authMiddleware: RequestHandler = (req, res, next): void => {
  const auth = req.headers.authorization;

  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "No token" });
    return;
  }

  const token = auth.slice(7);
  try {
    const decoded = verifyAccessToken(token);
    if (!decoded.userId || Number.isNaN(decoded.userId)) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }
    (req as AuthRequest).userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
};