import express from "express";
import bs58 from 'bs58';
import cookieParser from "cookie-parser";
import { PublicKey } from "@solana/web3.js";
import { ed25519 } from "@noble/curves/ed25519";
import jwt from 'jsonwebtoken'
import { db } from "../index.js";
import { z } from "zod";
import 'dotenv/config';
import { userMiddleware } from "../middleware/users.js";
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables");
}

const app = express();
app.use(cookieParser());
app.use(express.json())
const userRouter = express.Router();
const phoneSchema = z.string().regex(/^[0-9]{10}$/, "Phone must be 10 digits");

// Get nonce for a given pubkey
userRouter.post("/auth/nonce", async (req, res) => {
  const pubkey = req.body.pubkey;
 if (!pubkey) {
    return res.status(400).json({ message: "Missing pubkey in request body" });
  }
  try {
    const checkNonce = await db.nonce.findUnique({ where: { pubkey: pubkey } });

    if (!checkNonce) {
      const nonce = Math.random().toString(36).substring(2);
      await db.nonce.create({
        data: { pubkey, nonce },
      });
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
async function verifySignature(pubkey: string, signature: string, nonce: string): Promise<boolean> {
  const storedNonce = await db.nonce.findUnique({ where: { pubkey: pubkey } });
  if (!storedNonce || storedNonce.nonce !== nonce) return false;

  const message = new TextEncoder().encode(`Please sign this message to verify ownership.\nNonce: ${nonce}`);
  const pubKey = new PublicKey(pubkey).toBytes();
  const sig = bs58.decode(signature);

  return ed25519.verify(sig, message, pubKey);
}

// Signup route
userRouter.post("/auth/signup", async (req, res) => {
  const { pubkey, signature, nonce, name, surname, phonenumber, organisation } = req.body;
  const validatedPhoneNumber =  phoneSchema.safeParse(phonenumber)

  if(!validatedPhoneNumber.success){
    res.json({message:"Incorrect format",error: validatedPhoneNumber.error})
    return
  }
  if (!pubkey || !signature || !nonce)
    return res.status(400).json({ message: "Missing fields" });

  const existingUser = await db.user.findUnique({ where: { pubkey: pubkey } });
  if (existingUser) return res.status(409).json({ message: "User already exists" });

  const isValid = await verifySignature(pubkey, signature, nonce);
  if (!isValid) return res.status(401).json({ message: "Invalid signature" });

  const newUser = await db.user.create({
    data: {
      name,
      surname,
      phonenumber:validatedPhoneNumber.data,
      organisation,
      pubkey,
    },
  });

  await db.nonce.delete({ where: { pubkey: pubkey } });

  const token = jwt.sign({ userId: newUser.userId }, JWT_SECRET, { expiresIn: "24h" });
  return res.cookie("token", token).json({ message: "Signup successful" });
});


// Signin route
userRouter.post("/auth/signin", async (req, res) => {
  const { pubkey, signature, nonce } = req.body;

  if (!pubkey || !signature || !nonce)
    return res.status(400).json({ message: "Missing fields" });

  const user = await db.user.findUnique({ where: { pubkey: pubkey } });
  if (!user) return res.status(404).json({ message: "User not found" });

  const isValid = await verifySignature(pubkey, signature, nonce);
  if (!isValid) return res.status(401).json({ message: "Invalid signature" });

  await db.nonce.delete({ where: { pubkey: pubkey } });

  const token = jwt.sign({ userId: user.userId }, JWT_SECRET, { expiresIn: "24h" });
  return res.cookie("token", token).json({ message: "Signin successful" });
});














userRouter.get("/history",userMiddleware, (req, res) => {});

userRouter.get("/data", (req, res) => {});

userRouter.post("/userForm", (req, res) => {});
export default userRouter;

function env(arg0: string) {
  throw new Error("Function not implemented.");
}
