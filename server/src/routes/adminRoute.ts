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
      message: "Admin doesnot exists",
    });
    return;
  }
  if (password === admin.password) {
    const token = jwt.sign({ adminId: admin.adminId }, JWT_ADMIN_SECRET, {
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
  } else {
    res.json({ message: "Incorrect password" });
  }
});

adminRouter.get("/dashboard/home", adminMiddleware, async (req, res) => {
  try {
    if (!req.adminId) return res.status(401).json({ message: "Invalid token" });

    // Counts by status
    const counts = await db.history.groupBy({
      by: ["status"],
      _count: { status: true },
    });

    // Recent entries with related data
    const recentEntries = await db.history.findMany({
      orderBy: { timestamp: "desc" },
      take: 10,
      include: { carbon: true, submission: true, user: true }
    });

    // Prepare counts object
    const statusCounts = {
      PENDING: 0,
      INPROGRESS: 0,
      APPROVED: 0,
      REJECTED: 0,
    };
    counts.forEach(c => {
      statusCounts[c.status] = c._count.status;
    });

    // Map recent entries to simplified structure
    const usersData = recentEntries.map(e => ({
      SubmissionID: e.submission?.submissionId ?? null,
      SubmittedBy: e.user ? `${e.user.name} ${e.user.surname}` : null,
      AreaClaimed: e.submission?.areaclaim ?? null,
      DateSubmitted: e.submission?.submissionDate ?? e.timestamp,
      Location: e.submission?.location ?? null,
      Status: e.status
    }));

    res.json({
      counts: statusCounts,
      recent_entries: usersData
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

  adminRouter.get("/mapData",adminMiddleware,async (req,res)=>{
  try {
    if (!req.adminId) return res.status(401).json({ message: "Invalid token" });
    const entries = await db.history.findMany({
      include:{submission:{select:{latitude:true,longitude:true,location:true,submissionId:true}}}
    })
  
    const userData = entries.map((e)=>({
      latitude: e.submission?.latitude,
      longitude: e.submission?.longitude,
      label: e.submission?.location,
      status: e.status,
      submissionId: e.submission?.submissionId,
    }))
      res.json(userData);
  } catch (error) {
    console.error(error);
      res.status(500).json({ error: 'Server error' });
  }
    
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
