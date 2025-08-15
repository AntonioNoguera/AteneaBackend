import { Request, Response, NextFunction, RequestHandler } from "express";
import { verifyAccessToken } from "../utils/JWT";

export interface AuthRequest extends Request {
  userId?: number;
}

export const authMiddleware: RequestHandler = (req, res, next): void => {
  const auth = req.headers.authorization;

  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token no proporcionado" });
    return;
  }

  const token = auth.slice(7);
  try {
    const decoded = verifyAccessToken(token);
    if (!decoded.userId || Number.isNaN(decoded.userId)) {
      res.status(401).json({ error: "Token inválido" });
      return;
    }
    (req as AuthRequest).userId = decoded.userId;
    next(); // importante: no devolver nada
  } catch {
    res.status(401).json({ error: "Token inválido o expirado" });
    return;
  }
};