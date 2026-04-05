import express, { Router } from "express";
import { db } from "../index.js";
import { adminMiddleware } from "../middleware/admin.js";
import { userMiddleware } from "../middleware/users.js";
import { registerValidator } from "../controller/auth.js";

import multer from "multer";
import uploadImagesToCloudinary from "../utils/cloudinaryUpload.js";
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

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
    const usersData = assignments.map((a: any) => ({
      HistoryId: a.submission.history.historyId,
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

validatorRouter.post(
  "/submitVerification",
  userMiddleware,
  upload.array("images"),
  async (req, res) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ message: "Invalid token" });
      }
      const validator = await db.validator.findUnique({
        where: { userId: req.userId },
      });

      if (!validator) {
        return res.status(403).json({ message: "Validator not found" });
      }
      const rawData = req.body.data;
      const data = JSON.parse(rawData);

      const files = req.files as Express.Multer.File[];
      const imageFiles = files?.filter((file) =>
        file.mimetype.startsWith("image/"),
      );
      // 🧠 Extract data
      const v = data.verification;
      const cIn = data.carbonInput;
      const cOut = data.carbonOutput;

      // 📸 Upload to Cloudinary
      let uploadedImages: any[] = [];

      if (files && files.length > 0) {
        uploadedImages = await uploadImagesToCloudinary(files, "verified");
      }
      if (!req.body.data) {
        return res.status(400).json({ message: "Missing data" });
      }

      // 🧾 Save in DB
      const verification = await db.verification.create({
        data: {
          decision: data.decision,

          // 🟦 Section A
          location: v.location,
          actualArea: v.area,
          boundaryMatch: v.boundaryMatch,
          density: v.density,
          soilCondition: v.soilCondition,
          illegalActivity: v.illegalActivity,
          pollution: v.pollution,
          confidence: v.confidence,
          remarks: v.remarks,
          score: v.score,
          boundaryPoints: v.boundaryPoints,

          // 🟩 Section B
          survivalRate: cIn.survivalRate,
          avgHeight: cIn.avgHeight,
          plantationHealth: cIn.plantationHealth,
          waterCondition: cIn.waterCondition,
          soilQuality: cIn.soilQuality,
          plantingMethod: cIn.plantingMethod,
          mortalityCause: cIn.mortalityCause,

          // 🟨 Section C
          AGB: cOut.AGB,
          BGB: cOut.BGB,
          soilCarbon: cOut.soilCarbon,
          totalCarbon: cOut.totalCarbon,
          annualCO2: cOut.annualCO2,

          // 📸 Store Cloudinary response
          images: uploadedImages,

          // 🔗 Relations
          historyId: data.historyId, // IMPORTANT
          validatorId: validator.validatorId, // if auth middleware exists
        },
      });

      await db.history.update({
        where:{historyId:data.historyId}
        ,data:{status:"INPROGRESS"}})

      return res.json({
        success: true,
        message: "Verification stored successfully",
        verification,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        error: "Failed to store verification",
      });
    }
  },
);

export default validatorRouter;
