import express, { Router } from "express";
import { db } from "../index.js";
import { adminMiddleware } from "../middleware/admin.js";
import { userMiddleware } from "../middleware/users.js";
import { registerValidator } from "../controller/auth.js";

import multer from "multer";
import uploadImagesToCloudinary from "../utils/cloudinaryUpload.js";
import { assignValidator } from "../services/assignmentService.js";
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const validatorRouter: Router = express.Router();

validatorRouter.post("/registerValidator", registerValidator);
validatorRouter.get("/submission/:id",userMiddleware,async (req, res) => {
    try {
      const submissionId = Number(req.params.id);

      const submission = await db.submission.findUnique({
        where: { submissionId },
        include: {
          history: true,
          assignments: true,
        },
      });

      if (!submission) {
        return res.status(404).json({ message: "Submission not found" });
      }

      res.json(submission);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch submission" });
    }
  }
);
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
        status: {
          in: ["PENDING", "ACCEPTED", "COMPLETED"],
        }, // only current
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

    const counts = {
      PENDING: statusCounts.PENDING,
      INPROGRESS: statusCounts.ACCEPTED,
      APPROVED: statusCounts.COMPLETED,
      REJECTED: statusCounts.REJECTED,
    };

    res.json({
      counts,
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

validatorRouter.post("/submitVerification",userMiddleware,upload.array("images"),async (req, res) => {
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
      const history = await db.history.findUnique({
        where: { historyId: data.historyId },
        include: { submission: true },
      });
      if (!history?.submission?.submissionId) {
        return;
      }
      await db.assignment.updateMany({
        where: {
          submissionId: history?.submission?.submissionId,
          validatorId: validator.validatorId,
          isActive: true,
        },
        data: {
          status: "COMPLETED",
          isActive: false,
        },
      });

      // ✅ reduce active projects
      await db.validator.update({
        where: { validatorId: validator.validatorId },
        data: {
          activeProjects: { decrement: 1 },
          totalAccepted: { increment: 1 },
        },
      });

      // ✅ final decision
      await db.history.update({
        where: { historyId: data.historyId },
        data: {
          status: data.decision === "APPROVED" ? "APPROVED" : "REJECTED",
        },
      });
      await db.submission.update({
        where: { submissionId: history.submission.submissionId },
        data: {
          // optional: if you want explicit status field later
        },
      });
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
validatorRouter.get(
  "/assignments/available",
  userMiddleware,
  async (req, res) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ message: "Invalid token" });
      }
      const userId = req.userId;

      const validator = await db.validator.findUnique({
        where: { userId },
      });

      if (!validator) {
        return res.status(404).json({ message: "Validator not found" });
      }

      const assignments = await db.assignment.findMany({
        where: {
          validatorId: validator.validatorId,
          status: "PENDING",
          isActive: true,
        },
        include: {
          submission: true,
        },
      });

      res.json(assignments);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch available assignments" });
    }
  },
);
validatorRouter.get("/assignments/active", userMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return;
    }
    const validator = await db.validator.findUnique({
      where: { userId },
    });
    if (!validator?.validatorId) {
      return;
    }
    const assignments = await db.assignment.findMany({
      where: {
        validatorId: validator?.validatorId,
        status: "ACCEPTED",
        isActive: true,
      },
      include: {
        submission: true,
      },
    });

    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch active assignments" });
  }
});
validatorRouter.get( 
  "/assignments/history",
  userMiddleware,
  async (req, res) => {
    try {
      const userId = req.userId;
      if (!userId) {
        return;
      }
      const validator = await db.validator.findUnique({
        where: { userId },
      });
      if (!validator?.validatorId) {
        return;
      }
      const assignments = await db.assignment.findMany({
        where: {
          validatorId: validator?.validatorId,
          isActive: false,
        },
        include: {
          submission: true,
        },
        orderBy: {
          assignedAt: "desc",
        },
      });

      res.json(assignments);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch history" });
    }
  },
);
validatorRouter.post(
  "/assignment/:id/accept",
  userMiddleware,
  async (req, res) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ message: "Invalid token" });
      }
      const assignmentId = Number(req.params.id);
      const userId = req.userId;

      const validator = await db.validator.findUnique({
        where: { userId },
      });

      const assignment = await db.assignment.findUnique({
        where: { assignmentId },
        include: {
          submission: {
            include: {
              history: true,
            },
          },
        },
      });

      if (!assignment || assignment.validatorId !== validator?.validatorId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      // update assignment
      // ✅ 1. update assignment
      await db.assignment.update({
        where: { assignmentId },
        data: {
          status: "ACCEPTED",
        },
      });

      // ✅ 2. update submission status
      await db.history.update({
        where: { historyId: assignment.submission.history.historyId }, // or fetch properly
        data: {
          status: "INPROGRESS",
        },
      });

      res.json({ message: "Assignment accepted" });
    } catch (err) {
      res.status(500).json({ error: "Failed to accept assignment" });
    }
  },
);
validatorRouter.post(
  "/assignment/:id/reject",
  userMiddleware,
  async (req, res) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ message: "Invalid token" });
      }
      const assignmentId = Number(req.params.id);
      const userId = req.userId;

      const validator = await db.validator.findUnique({
        where: { userId },
      });

      const assignment = await db.assignment.findUnique({
        where: { assignmentId },
      });

      if (!assignment || assignment.validatorId !== validator?.validatorId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      const shouldReassign = assignment.isActive;

      // update assignment
      await db.assignment.update({
        where: { assignmentId },
        data: {
          status: "REJECTED",
          isActive: false,
        },
      });
      if (shouldReassign) {
        await assignValidator(assignment.submissionId);
      }
      // update validator stats
      if (assignment.status === "ACCEPTED") {
        await db.validator.update({
          where: { validatorId: validator.validatorId },
          data: {
            activeProjects: { decrement: 1 },
            totalRejected: { increment: 1 },
          },
        });
      } else {
        await db.validator.update({
          where: { validatorId: validator.validatorId },
          data: {
            totalRejected: { increment: 1 },
          },
        });
      }
      res.json({ message: "Assignment rejected" });
    } catch (err) {
      res.status(500).json({ error: "Failed to reject assignment" });
    }
  },
);

export default validatorRouter;
