import express from "express";
import bs58 from 'bs58';
import cookieParser from "cookie-parser";
import { PublicKey } from "@solana/web3.js";
import { ed25519 } from "@noble/curves/ed25519";
import jwt from 'jsonwebtoken'
import 'dotenv/config';
import { db } from "../index.js";
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables");
}

const app = express();
app.use(cookieParser());
app.use(express.json())
const userRouter = express.Router();

// Get nonce for a given wallet
userRouter.post("/auth/nonce", async (req, res) => {
  const wallet = req.body.wallet;

  try {
    const checkNonce = await db.nonce.findOne({ wallet });

    if (!checkNonce) {
      const nonce = Math.random().toString(36).substring(2);
      await db.nonce.insertOne({ wallet, nonce });
      return res.json({ nonce });
    } else {
      return res.json({ nonce: checkNonce.nonce });
    }
  } catch (error) {
    console.error("Nonce error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Shared signature verification
async function verifySignature(wallet: string, signature: string, nonce: string): Promise<boolean> {
  const storedNonce = await db.nonce.findOne({ wallet });
  if (!storedNonce || storedNonce.nonce !== nonce) return false;

  const message = new TextEncoder().encode(`Please sign this message to verify ownership.\nNonce: ${nonce}`);
  const pubKey = new PublicKey(wallet).toBytes();
  const sig = bs58.decode(signature);

  return ed25519.verify(sig, message, pubKey);
}

// Signup route
userRouter.post("/auth/signup", async (req, res) => {
  const { wallet, signature, nonce } = req.body;

  if (!wallet || !signature || !nonce) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const exists = await db.users.findOne({ wallet });
  if (exists) return res.status(409).json({ message: "User already exists" });

  const isValid = await verifySignature(wallet, signature, nonce);
  if (!isValid) return res.status(401).json({ message: "Invalid signature" });

  const { insertedId } = await db.users.insertOne({ wallet });
  await db.nonce.deleteOne({ wallet }); // Cleanup

  const token = jwt.sign({ userId: insertedId }, JWT_SECRET!, { expiresIn: "24h" });
  return res.cookie("token",token );
});

// Signin route
userRouter.post("/auth/signin", async (req, res) => {
  const { wallet, signature, nonce } = req.body;

  if (!wallet || !signature || !nonce) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const user = await db.users.findOne({ wallet });
  if (!user) return res.status(404).json({ message: "User not found" });

  const isValid = await verifySignature(wallet, signature, nonce);
  if (!isValid) return res.status(401).json({ message: "Invalid signature" });

  await db.nonce.deleteOne({ wallet }); // Cleanup
  const token = jwt.sign({ userId: user._id }, JWT_SECRET!, { expiresIn: "24h" });

  return res.cookie("token",token );
});











userRouter.get("/history", (req, res) => {});

userRouter.get("/data", (req, res) => {});

userRouter.post("/userForm", (req, res) => {});
export default userRouter;

function env(arg0: string) {
  throw new Error("Function not implemented.");
}
//   {
//   "userId": "12345",
//   "wallet": "Gabc123...",
//   "role": "ngo"
//   }

// userRouter.post("/auth/verify",async  (req, res) => {
//   const { wallet, signature, nonce } = req.body;

//   if (!wallet || !signature || !nonce) {
//     return res.status(400).json({ message: "Missing fields" });
//   }

//   const message = new TextEncoder().encode(`Please sign this message to verify ownership.\nNonce: ${nonce}`); //donot change this

//   try {
//     const pubKey = new PublicKey(wallet).toBytes(); // Convert base58 to Uint8Array
//     const sigUint8 = bs58.decode(signature); // Decode signature from base58
//     const storedNonce = await db.nonce.findOne({ wallet });
//     if (!storedNonce || storedNonce.nonce !== nonce) {
//       return res.status(400).json({ message: "Invalid or expired nonce" });
//     }
//     const verified = ed25519.verify(sigUint8, message, pubKey);

//     if (!verified) {
//       return res.status(401).json({ message: "Message signature invalid!" });
//     }

//     const nonceRecord = await db.users.findOne({
//       wallet: wallet
//     });

//     if(!nonceRecord){
//       //new user
//       await db.users.insertOne({
//         wallet: wallet
//       })
      
//     }
//     const getUser = await db.users.findOne({
//       wallet:wallet
//     })

//     const userId =  getUser._id
//     const token = jwt.sign({userId}, JWT_SECRET!, { expiresIn: "24h" })
//     res.cookie("token",token  )

//   } catch (error) {
//     console.error("Verification error:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// });
