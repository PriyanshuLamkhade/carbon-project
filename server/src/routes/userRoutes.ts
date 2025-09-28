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

userRouter.post("/auth/nonce",async  (req, res) => {
  const wallet = req.body.wallet 
  try {
    const checkNonce = await db.nonce.findOne({
      wallet : wallet
    })
  
    if(!checkNonce){
      const nonce = Math.random().toString(36).substring(2);
      await db.nonce.insertOne({
        wallet: wallet,
        nonce:nonce,
      })
      res.json({ nonce });
  
    }
    else{
      res.json({nonce: checkNonce.nonce });
    }
  } catch (error) {
    console.log(error)
    res.json("Error")
  }

});
userRouter.post("/auth/verify",async  (req, res) => {
  const { wallet, signature, nonce } = req.body;

  if (!wallet || !signature || !nonce) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const message = new TextEncoder().encode(`Please sign this message to verify ownership.\nNonce: ${nonce}`); //donot change this

  try {
    const pubKey = new PublicKey(wallet).toBytes(); // Convert base58 to Uint8Array
    const sigUint8 = bs58.decode(signature); // Decode signature from base58
    const storedNonce = await db.nonce.findOne({ wallet });
    if (!storedNonce || storedNonce.nonce !== nonce) {
      return res.status(400).json({ message: "Invalid or expired nonce" });
    }
    const verified = ed25519.verify(sigUint8, message, pubKey);

    if (!verified) {
      return res.status(401).json({ message: "Message signature invalid!" });
    }

    const nonceRecord = await db.users.findOne({
      wallet: wallet
    });

    if(!nonceRecord){
      //new user
      await db.users.insertOne({
        wallet: wallet
      })
      res.json({message:"new user"})
    }else{
      res.json({message:"exsisting user"})
    }


  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
userRouter.get("/history", (req, res) => {});

userRouter.get("/data", (req, res) => {});

userRouter.post("/userForm", (req, res) => {});
export default userRouter;
//   {
//   "userId": "12345",
//   "wallet": "Gabc123...",
//   "role": "ngo"
//   }
  