import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import 'dotenv/config';
import { User } from "@prisma/client";

export interface AuthenticatedRequest extends Request {
  user?: User | null;
}

// Extending Express Request type to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export const userMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const jwtSecret = process.env.JWT_USER_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ message: "JWT_USER_SECRET is not configured on the server" });
    }

    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Token is missing" });
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload & { userId: number };

    if (!decoded.userId || typeof decoded.userId !== 'number') {
      return res.status(400).json({ message: "Invalid token payload" });
    }

    req.userId = decoded.userId;
    next();

  } catch (e) {
    return res.status(401).json({ message: "Invalid or expired token", error: e });
  }
};