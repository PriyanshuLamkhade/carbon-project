import express from "express";
import bs58 from 'bs58';
import cookieParser from "cookie-parser";
import { PublicKey } from "@solana/web3.js";
import { ed25519 } from "@noble/curves/ed25519";
import jwt from 'jsonwebtoken'
const app = express();
app.use(cookieParser());
app.use(express.json())
const userRouter = express.Router();

userRouter.get("/auth/nonce", (req, res) => {
  const nonce = Math.random().toString(36).substring(2);
  res.json({ nonce });
});
userRouter.post("/auth/verify", (req, res) => {
  const { wallet, signature, nonce } = req.body;

  if (!wallet || !signature || !nonce) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const message = new TextEncoder().encode(`Please sign this message to verify ownership.\nNonce: ${nonce}`);

  try {
    const pubKey = new PublicKey(wallet).toBytes(); // Convert base58 to Uint8Array
    const sigUint8 = bs58.decode(signature); // Decode signature from base58

    const verified = ed25519.verify(sigUint8, message, pubKey);

    if (!verified) {
      return res.status(401).json({ message: "Message signature invalid!" });
    }

    // TODO: optionally issue JWT or session here

    return res.json({ message: "Verified" });
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
userRouter.get("/history", (req, res) => {});

userRouter.get("/data", (req, res) => {});

userRouter.post("/userForm", (req, res) => {});
export default userRouter;
