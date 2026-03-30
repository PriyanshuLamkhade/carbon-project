import express, { Router } from "express";
import { db } from "../index.js";
import jwt from "jsonwebtoken";
import { adminMiddleware } from "../middleware/admin.js";
import { userMiddleware } from "../middleware/users.js";
import { registerValidator } from "../controller/auth.js";
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

validatorRouter.post("/registerValidator", registerValidator);

validatorRouter.get("/dashboard/home", userMiddleware, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // 🔹 Get validator from userId
    const validator = await db.validator.findUnique({
      where: { userId: req.userId },
    });

    if (!validator) {
      return res.status(404).json({ message: "Validator not found" });
    }

    // 🔹 Get assignments for this validator
    const assignments = await db.assignment.findMany({
      where: {
        validatorId: validator.validatorId,
        isActive: true, // only current
      },
      include: {
        submission: {
          include: {
            history: true,
          },
        },
      },
      orderBy: {
        assignedAt: "desc",
      },
    });

    // 🔹 Count by AssignmentStatus
    const statusCounts = {
      PENDING: 0,
      ACCEPTED: 0,
      REJECTED: 0,
      COMPLETED: 0,
      EXPIRED: 0,
    };

    assignments.forEach((a) => {
      statusCounts[a.status]++;
    });

    // 🔹 Map to SAME UI STRUCTURE (important)
    const usersData = assignments.map((a) => ({
      SubmissionID: a.submission.submissionId,
      SubmittedBy: null, // optional (you can include user if needed)
      AreaClaimed: a.submission.areaclaim,
      DateSubmitted: a.submission.submissionDate,
      Location: a.submission.location,

      // 🔥 IMPORTANT: map AssignmentStatus → UI Status
      Status:
        a.status === "ACCEPTED"
          ? "INPROGRESS"
          : a.status === "PENDING"
          ? "PENDING"
          : a.status === "COMPLETED"
          ? "APPROVED"
          : a.status === "REJECTED"
          ? "REJECTED"
          : "PENDING",
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
             geoTag: true,
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
      geoTag: e.submission?.geoTag,
    }));
    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});


// })
export default validatorRouter;
