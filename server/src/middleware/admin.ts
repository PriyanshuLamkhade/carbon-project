import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import 'dotenv/config';

const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET;
if (!JWT_ADMIN_SECRET) {
  throw new Error("JWT_ADMIN_SECRET is not defined in the environment variables");
}

// Extend Express Request type to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Token is missing" });
    }

    const decoded = jwt.verify(token, JWT_ADMIN_SECRET) as JwtPayload & { userId: number };

    if (!decoded.userId || typeof decoded.userId !== 'number') {
      return res.status(400).json({ message: "Invalid token payload" });
    }

    req.userId = decoded.userId;
    next();

  } catch (e) {
    return res.status(401).json({ message: "Invalid or expired token", error: e });
  }
};
