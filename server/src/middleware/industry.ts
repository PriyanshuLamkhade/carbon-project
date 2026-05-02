
import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import 'dotenv/config';
const JWT_INDUSTRY_SECRET = process.env.JWT_INDUSTRY_SECRET;
if (!JWT_INDUSTRY_SECRET) {
  throw new Error("JWT_INDUSTRY_SECRET is not defined in the environment variables");
}
declare global {
  namespace Express {
    interface Request {
      industryId?: number;
    }
  }
}

export const industryMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.industry_token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_INDUSTRY_SECRET) as JwtPayload & { industryId: number }
    if (!decoded.industryId || typeof decoded.industryId !== 'number') {
      return res.status(400).json({ message: "Invalid token payload" });
    }
    req.industryId = decoded.industryId;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};