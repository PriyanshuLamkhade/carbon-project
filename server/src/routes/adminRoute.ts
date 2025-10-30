import express from "express";
import { db } from "../index.js";
import jwt from "jsonwebtoken";
import { adminMiddleware } from "../middleware/admin.js";
const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET;
if (!JWT_ADMIN_SECRET) {
  throw new Error(
    "JWT_ADMIN_SECRET is not defined in the environment variables"
  );
}
const adminRouter = express.Router();

adminRouter.post("/auth/signin", async (req, res) => {
  const { name, surname, phonenumber, email, password } = req.body;
  if (!name || !surname || !phonenumber || !email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }
  const admin = await db.admin.findUnique({
    where: { name, surname, phonenumber, email },
  });
  if (!admin) {
    res.json({
      message: "User doesnot exists",
    });
    return;
  }
  if (password === admin.password) {
    const token = jwt.sign({ userId: admin.adminId }, JWT_ADMIN_SECRET, {
      expiresIn: "24h",
    });
    res
      .cookie("token", token, {
        httpOnly: true, // Required for security
        secure: false, // false for localhost (true only on HTTPS)
        sameSite: "lax", // "lax" is fine for same-origin-ish setup
        // sameSite: "none",     // use this if frontend/backend are on different domains AND you're using HTTPS
        path: "/",
      })
      .json({ message: "Signin successful" });
  }else{
    res.json({message:"Incorrect password"})
  }
});

adminRouter.get("/recentSumissions",adminMiddleware,async(req,res)=>{
  
  await db.history.findMany({})

})
// adminRouter.get('requestsPending',(req,res)=>{

// })

// adminRouter.get('requestInfo',(req,res)=>{

// })

// adminRouter.post('verifyDataForm',(req,res)=>{

// })
// adminRouter.post('confirmSubmission',(req,res)=>{

// })
export default adminRouter;
