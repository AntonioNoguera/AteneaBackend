import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/JWT";

export interface AuthRequest extends Request {
  userId?: number;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  // Espera formato: "Bearer <token>"
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Formato de autorización inválido" });
  }

  try {
    const decoded = verifyAccessToken(token);

    if (!decoded.userId) {
      return res.status(401).json({ error: "Token inválido" });
    }

    // Guarda el ID del usuario en la request
    req.userId = decoded.userId;
    next();

  } catch (error) {
    console.error("[authMiddleware]", error);
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}
