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
        user: true, // ✅ IMPORTANT (wallet address)
        history: {
          include: {
            verification: true,
            carbon: true,
          },
        },
      },
    });

    if (!submission || !submission.history?.verification) {
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
    const user = submission.user as User;
    // ❌ Ensure wallet exists
    if (!user.walletAddress) {
      return res.status(400).json({ message: "User wallet not found" });
    }

    // 🔥 Calculate tokens
    const tokens = Math.floor(verification.totalCarbon);

    if (tokens <= 0) {
      return res.status(400).json({ message: "Invalid token amount" });
    }

    // 🔗 Convert to wei
    const amount = ethers.parseUnits(tokens.toString(), 18);

    // 🚀 CALL BLOCKCHAIN
    const tx = await (token as any).mintToLandowner(user.walletAddress, amount);

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
