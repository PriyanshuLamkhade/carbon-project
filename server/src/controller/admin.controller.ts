import { Request, Response } from "express";
import { db } from "../index.js";

import { ethers } from "ethers";

import tokenAbi from "../constant/C2Token.js";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await db.user.findMany({
      where: {
        role: "USER", // ✅ only normal users
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        userId: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching users" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const user = await db.user.findUnique({
      where: { userId: id },
      include: {
        history: {
          include: {
            submission: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Extract submissions from history
    const submissions = user.history
      .map((h) => h.submission)
      .filter((s) => s !== null);

    return res.json({
      user,
      submissions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching user" });
  }
};

export const getSubmissionById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const submission = await db.submission.findUnique({
      where: { submissionId: id },
      include: {
        assignments: {
          include: {
            validator: {
              include: {
                user: true,
              },
            },
          },
        },
        history: {
          include: {
            verification: true,
            carbon: true,
          },
        },
      },
    });

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    return res.json(submission);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching submission" });
  }
};

// 🔐 ENV
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
type User = {
  walletAddress: string;
};

const token = new ethers.Contract(
  process.env.TOKEN_ADDRESS!,
  tokenAbi as any,
  wallet,
);

export const mintTokens = async (req: Request, res: Response) => {
  const submissionId = Number(req.params.id);

  try {
    // 🔹 Fetch submission
    const submission = await db.submission.findUnique({
      where: { submissionId },
      include: {
        // ✅ IMPORTANT (wallet address)
        history: {
          include: {
            user: true,
            verification: true,
            carbon: true,
          },
        },
      },
    });

    if (!submission || !submission.history?.verification) {
      return res.status(400).json({ message: "No verification found" });
    }
    if (!submission.history?.verification) {
      return res.status(400).json({ message: "No verification found" });
    }
    const verification = submission.history.verification;

    // ❌ Only allow approved
    if (verification.decision !== "APPROVED") {
      return res.status(400).json({ message: "Not approved yet" });
    }

    // ❌ Prevent double mint
    if (submission.history.carbon?.tokensIssued) {
      return res.status(400).json({ message: "Already minted" });
    }
    const user = submission.history.user;
    // ❌ Ensure wallet exists
    if (!user.pubkey) {
      return res.status(400).json({ message: "User wallet not found" });
    }
    if (submission.history.carbon) {
      return res.status(400).json({ message: "Already minted" });
    }
    // 🔥 Calculate tokens
    const tokens =  Number(verification.annualCO2.toFixed(2));
    if (submission.history.carbon) {
      return res.status(400).json({ message: "Already minted" });
    }
    if (tokens <= 0) {
      return res.status(400).json({ message: "Invalid token amount" });
    }

    // 🔗 Convert to wei
    const amount = ethers.parseUnits(tokens.toString(), 18);

    // 🚀 CALL BLOCKCHAIN
    const tx = await (token as any).mintToLandowner(user.pubkey, amount);

    const receipt = await tx.wait();

    const txHash = receipt.hash;

    // 💾 Save in DB
    const carbon = await db.carbon.create({
      data: {
        carbonCleaned: verification.totalCarbon,
        tokensIssued: tokens,
        txHash: txHash,
        historyId: submission.historyId,
      },
    });
    const updateStatus = await db.history.update({
      where:{historyId : submission.historyId},
      data:{status:"APPROVED"}
    })
    console.log("Minting to:", user.pubkey);
    console.log("Tokens:", tokens);
    console.log("Submission:", submissionId);
    return res.json({
      message: "Tokens minted successfully",
      tokens,
      txHash,
      carbon,
    });
  } catch (error: any) {
    console.error("Mint Error:", error);

    return res.status(500).json({
      message: "Minting failed",
      error: error.message,
    });
  }
};
export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await db.user.count({
      where: { role: "USER" },
    });

    const totalSubmissions = await db.submission.count();

    const approved = await db.verification.count({
      where: { decision: "APPROVED" },
    });

    const pending = await db.verification.count({
      where: { decision: "PENDING" },
    });

    // 🔥 NEW STATS
    const totalCarbon = await db.verification.aggregate({
      _sum: { totalCarbon: true },
    });

    const totalTokens = await db.carbon.aggregate({
      _sum: { tokensIssued: true },
    });

    const validators = await db.validator.count({
      where: { status: "APPROVED" },
    });

    const avgScore = await db.verification.aggregate({
      _avg: { score: true },
    });

    const recentSubmissions = await db.submission.findMany({
      take: 5,
      orderBy: { submissionDate: "desc" },
    });

    res.json({
      totalUsers,
      totalSubmissions,
      approved,
      pending,
      totalCarbon: totalCarbon._sum.totalCarbon || 0,
      totalTokens: totalTokens._sum.tokensIssued || 0,
      validators,
      avgScore: Math.round(avgScore._avg.score || 0),
      recentSubmissions,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats" });
  }
};

export const getAllTokens = async (req: Request, res: Response) => {
  try {
    const tokens = await db.carbon.findMany({
      include: {
        history: {
          include: {
            user: true,
            submission: true,
          },
        },
      },
      orderBy: {
        carbonId: "desc",
      },
    });

    const formatted = tokens.map((t) => ({
      carbonId: t.carbonId,
      userName: t.history.user.name,
      submissionId: t.history.submission?.submissionId,
      location: t.history.submission?.location,
      carbonCleaned: t.carbonCleaned,
      tokensIssued: t.tokensIssued,
      txHash: t.txHash || "N/A",
      date: t.history.timestamp,
    }));

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching tokens" });
  }
};

export const mintMonitoringTokens = async (req: Request, res: Response) => {
  try {
    const monitoringId = Number(req.params.id);

    // 🔹 Get monitoring
    const monitoring = await db.monitoring.findUnique({
      where: { monitoringId },
      include: {
        history: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!monitoring) {
      return res.status(404).json({ message: "Monitoring not found" });
    }

    const user = monitoring.history.user;

    if (!user?.pubkey) {
      return res.status(400).json({ message: "User wallet not found" });
    }

    // ❌ Already minted
    if (monitoring.txHash) {
      return res.status(400).json({ message: "Already minted for this year" });
    }

    // 🔥 Tokens from monitoring
    const tokens = Math.floor(monitoring.annualCO2);

    if (tokens <= 0) {
      return res.status(400).json({ message: "Invalid token amount" });
    }

    // 🔗 Convert to wei
    const amount = ethers.parseUnits(tokens.toString(), 18);

    // 🚀 Blockchain call
    const tx = await (token as any).mintToLandowner(user.pubkey, amount);
    const receipt = await tx.wait();

    const txHash = receipt.hash;

    // 💾 Save in Monitoring table
    await db.monitoring.update({
      where: { monitoringId },
      data: {
        tokensIssued: tokens,
        txHash: txHash,
        mintedAt: new Date(),
      },
    });

    return res.json({
      message: "Monitoring tokens minted successfully",
      tokens,
      txHash,
    });
  } catch (error:any) {
    console.error("Monitoring Mint Error:", error);

    return res.status(500).json({
      message: "Minting failed",
      error: error.message ,
    });
  }
};