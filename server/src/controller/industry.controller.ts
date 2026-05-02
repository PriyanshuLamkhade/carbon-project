import { db } from "../index.js";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
const JWT_INDUSTRY_SECRET = process.env.JWT_INDUSTRY_SECRET!;
// 🔹 Signup
export const industrySignup = async (req: Request, res: Response) => {
  const { companyName, email, password, phone, address } = req.body;

  try {
    await db.industry.create({
      data: {
        companyName,
        email,
        password,
        phone,
        address,
      },
    });

    res.json({ message: "Request submitted for approval" });
  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
};

// 🔹 Login
export const industryLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const industry = await db.industry.findUnique({
    where: { email },
  });

  if (!industry || industry.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (industry.status !== "APPROVED") {
    return res.status(403).json({ message: "Not approved yet" });
  }

  const token = jwt.sign(
    { industryId: industry.industryId },
    JWT_INDUSTRY_SECRET,
    { expiresIn: "24h" }
  );

  res
    .cookie("industry_token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    })
    .json({ message: "Login successful" });
};

// 🔹 Get current industry
export const getIndustryMe = async (req: Request, res: Response) => {
    if(!req.industryId){
        return res.status(401).json({ message: "Unauthorized" });
    }
  const industry = await db.industry.findUnique({
    where: { industryId: req.industryId },
  });

  res.json(industry);
};

export const retireAndGenerateCertificate = async (req: Request, res: Response) => {
  try {
    const { tokens, txHash, walletAddress, reason } = req.body;
    if(!req.industryId){
      return res.status(401).json({ message: "Unauthorized" });
    }

    const industry = await db.industry.findUnique({
      where: { industryId: req.industryId },
    });
    if(!industry){
      return res.status(401).json({ message: "Unauthorized" });
    }
    const certificateId = uuidv4();

    const cert = await db.certificate.create({
      data: {
        certificateId,
        industryId: industry.industryId,
        walletAddress,
        tokensRetired: Number(tokens),
        carbonOffset: Number(tokens), // 1 token = 1 CO2
        txHash,
        reason,
      },
    });

    res.json({
      message: "Certificate created",
      certificateId,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
};