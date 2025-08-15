// src/utils/jwt.ts
import * as jwt from "jsonwebtoken";

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET!;

// Tipa exactamente como lo espera jsonwebtoken
const JWT_EXPIRES: jwt.SignOptions["expiresIn"] =
  (process.env.JWT_EXPIRES ?? "1d") as jwt.SignOptions["expiresIn"];

export function signAccessToken(userId: number): string {
  const payload: jwt.JwtPayload = {};
  const options: jwt.SignOptions = {
    algorithm: "HS256",
    expiresIn: JWT_EXPIRES,
    subject: String(userId),
  };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyAccessToken(token: string) {
  const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
  const userId = decoded.sub ? Number(decoded.sub) : undefined;
  return { ...decoded, userId };
}
