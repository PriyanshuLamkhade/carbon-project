import express, { Router } from "express";
import { db } from "../index.js";
import jwt from "jsonwebtoken";
import { adminMiddleware } from "../middleware/admin.js";
import { userMiddleware } from "../middleware/users.js";
const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET;
if (!JWT_ADMIN_SECRET) {
  throw new Error(
    "JWT_ADMIN_SECRET is not defined in the environment variables",
  );
}
const validatorRouter: Router = express.Router();

// validatorRouter.post("/auth/signin", async (req, res) => {
//   const { name, surname, phonenumber, email, password } = req.body;
//   if (!name || !surname || !phonenumber || !email || !password) {
//     return res.status(400).json({ message: "Missing fields" });
//   }
//   const admin = await db.admin.findUnique({
//     where: { name, surname, phonenumber, email },
//   });
//   if (!admin) {
//     res.json({
//       message: "Admin doesnot exists",
//     });
//     return;
//   }
//   if (password === admin.password) {
//     const token = jwt.sign({ adminId: admin.adminId }, JWT_ADMIN_SECRET, {
//       expiresIn: "24h",
//     });
//     res
//       .cookie("token", token, {
//         httpOnly: true, // Required for security
//         secure: false, // false for localhost (true only on HTTPS)
//         sameSite: "lax", // "lax" is fine for same-origin-ish setup
//         // sameSite: "none",     // use this if frontend/backend are on different domains AND you're using HTTPS
//         path: "/",
//       })
//       .json({ message: "Signin successful" });
//   } else {
//     res.json({ message: "Incorrect password" });
//   }
// });

validatorRouter.get("/dashboard/home", userMiddleware, async (req, res) => {
  try {
    if (!req.userId) return res.status(401).json({ message: "Invalid token" });

    // Counts by status
    const counts = await db.history.groupBy({
      by: ["status"],
      _count: { status: true },
    });

    // Recent entries with related data
    const recentEntries = await db.history.findMany({
      orderBy: { timestamp: "desc" },
      take: 10,
      include: { carbon: true, submission: true, user: true },
    });

    interface Count {
      status: "PENDING" | "INPROGRESS" | "APPROVED" | "REJECTED";
      _count: { status: number };
    }
    const statusCounts: Record<Count["status"], number> = {
      PENDING: 0,
      INPROGRESS: 0,
      APPROVED: 0,
      REJECTED: 0,
    };
    counts.forEach((c: Count) => {
      statusCounts[c.status] = c._count.status;
    });

    // Map recent entries to simplified structure
    const usersData = recentEntries.map((e) => ({
      SubmissionID: e.submission?.submissionId ?? null,
      SubmittedBy: e.user ? `${e.user.name} ${e.user.surname}` : null,
      AreaClaimed: e.submission?.areaclaim ?? null,
      DateSubmitted: e.submission?.submissionDate ?? e.timestamp,
      Location: e.submission?.location ?? null,
      Status: e.status,
    }));

    res.json({
      counts: statusCounts,
      recent_entries: usersData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

validatorRouter.get("/mapData", userMiddleware, async (req, res) => {
  try {
    if (!req.userId) return res.status(401).json({ message: "Invalid token" });
    const entries = await db.history.findMany({
      include: {
        submission: {
          select: {
            latitude: true,
            longitude: true,
            location: true,
            submissionId: true,
          },
        },
      },
    });

    const userData = entries.map((e) => ({
      latitude: e.submission?.latitude,
      longitude: e.submission?.longitude,
      label: e.submission?.location,
      status: e.status,
      submissionId: e.submission?.submissionId,
    }));
    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// validatorRouter.get('requestsPending',(req,res)=>{

// })

// validatorRouter.get('requestInfo',(req,res)=>{

// })

// validatorRouter.post('verifyDataForm',(req,res)=>{

// })
// validatorRouter.post('confirmSubmission',(req,res)=>{

// })
export default validatorRouter;
