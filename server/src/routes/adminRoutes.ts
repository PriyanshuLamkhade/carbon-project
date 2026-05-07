import express from "express";
import { adminMiddleware } from "../middleware/admin.js";
import {
  getAdminStats,
  getAllTokens,
  getAllUsers,
  getCertificates,
  getPublicBlockchainRecords,
  getSubmissionById,
  getUserById,
  mintMonitoringTokens,
  mintTokens,
} from "../controller/admin.controller.js";
import { db } from "../index.js";
import jwt from "jsonwebtoken";

const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET;
if (!JWT_ADMIN_SECRET) {
  throw new Error(
    "JWT_ADMIN_SECRET is not defined in the environment variables",
  );
}
const adminRouter = express.Router();

// GET all users
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

adminRouter.get("/users", adminMiddleware, getAllUsers);
adminRouter.get("/users/:id", adminMiddleware, getUserById);
adminRouter.get("/submissions/:id", adminMiddleware, getSubmissionById);
adminRouter.post("/submissions/:id/mint", adminMiddleware, mintTokens);
adminRouter.post("/monitoring/:id/mint", adminMiddleware, mintMonitoringTokens);
adminRouter.get("/stats", adminMiddleware, getAdminStats);
adminRouter.get("/tokens", adminMiddleware, getAllTokens);
// GET /admin/validators?status=APPROVED | PENDING
adminRouter.get(
  "/public/blockchain-records",
  getPublicBlockchainRecords
);
adminRouter.get("/validators", adminMiddleware, async (req, res) => {
  try {
    const { status } = req.query;

    const validators = await db.validator.findMany({
      where: status ? { status: status as any } : {},
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formatted = validators.map((v) => ({
      validatorId: v.validatorId,
      name: v.user.name + " " + (v.user.surname || ""),
      email: v.user.email,
      role: v.user.role,
      status: v.status,
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch validators" });
  }
});
// PATCH /admin/validators/:id/approve

adminRouter.patch(
  "/validators/:id/approve",
  adminMiddleware,
  async (req, res) => {
    const id = Number(req.params.id);

    try {
      await db.validator.update({
        where: { validatorId: id },
        data: {
          status: "APPROVED",
          user: {
            update: {
              role: "VALIDATOR",
            },
          },
        },
      });

      res.json({ message: "Validator approved" });
    } catch (err) {
      res.status(500).json({ error: "Error approving validator" });
    }
  },
);
// PATCH /admin/validators/:id/reject

adminRouter.patch(
  "/validators/:id/reject",
  adminMiddleware,
  async (req, res) => {
    const id = Number(req.params.id);

    try {
      await db.validator.update({
        where: { validatorId: id },
        data: {
          status: "REJECTED",
        },
      });

      res.json({ message: "Validator rejected" });
    } catch (err) {
      res.status(500).json({ error: "Error rejecting validator" });
    }
  },
);
// PATCH /admin/validators/:id/remove

adminRouter.patch(
  "/validators/:id/remove",
  adminMiddleware,
  async (req, res) => {
    const id = Number(req.params.id);

    try {
      const validator = await db.validator.update({
        where: { validatorId: id },
        data: {
          status: "REJECTED",
          user: {
            update: {
              role: "USER",
            },
          },
        },
      });

      res.json({ message: "Validator removed (role downgraded)" });
    } catch (err) {
      res.status(500).json({ error: "Error removing validator" });
    }
  },
);

// GET industries
adminRouter.get("/industries", adminMiddleware, async (req, res) => {
  const { status } = req.query;

  const industries = await db.industry.findMany({
    where: status ? { status: status as any } : {},
    orderBy: { createdAt: "desc" },
  });

  res.json(industries);
});

// APPROVE
adminRouter.patch(
  "/industries/:id/approve",
  adminMiddleware,
  async (req, res) => {
    const id = Number(req.params.id);

    await db.industry.update({
      where: { industryId: id },
      data: { status: "APPROVED" },
    });

    res.json({ message: "Approved" });
  },
);

// REJECT
adminRouter.patch(
  "/industries/:id/reject",
  adminMiddleware,
  async (req, res) => {
    const id = Number(req.params.id);

    await db.industry.update({
      where: { industryId: id },
      data: { status: "REJECTED" },
    });

    res.json({ message: "Rejected" });
  },
);

adminRouter.get("/monitoring/:id", adminMiddleware, async (req, res) => {
  try {
    const monitoringId = Number(req.params.id);

    if (!monitoringId) {
      return res.status(400).json({ message: "Invalid monitoring id" });
    }

    // 🔹 Fetch monitoring with relations
    const monitoring = await db.monitoring.findUnique({
      where: { monitoringId },
      include: {
        history: {
          include: {
            submission: true,
            user: true,
          },
        },
      },
    });

    if (!monitoring) {
      return res.status(404).json({ message: "Monitoring not found" });
    }

    const submission = monitoring.history.submission;
    const user = monitoring.history.user;

    // 🔴 Check if tokens already minted for this year
    const alreadyMinted = await db.carbon.findFirst({
      where: {
        historyId: monitoring.historyId,
        createdAt: {
          gte: new Date(`${monitoring.year}-01-01`),
          lt: new Date(`${monitoring.year + 1}-01-01`),
        },
      },
    });

    return res.json({
      monitoring,
      submission,
      user,
      tokensMinted: !!alreadyMinted,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch monitoring data" });
  }
});
adminRouter.get("/monitorings", adminMiddleware, async (req, res) => {
  const monitorings = await db.monitoring.findMany({
    include: {
      history: {
        include: {
          submission: true,
          user: true,
        },
      },
    },
    orderBy: {
      monitoredAt: "desc",
    },
  });

  res.json({ monitorings });
});
adminRouter.get("/certificates", getCertificates);
export default adminRouter;
