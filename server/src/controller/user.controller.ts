import { db } from "../index.js";
import { Request, Response } from "express";
export const getUserDashboard = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if(!userId){
        return res.json("Userid not found")
    }
    // 🟢 Get all histories
    const histories = await db.history.findMany({
      where: {
        userId,
      },
      include: {
        submission: true,
        verification: true,
        carbon: true,
        monitorings: true,
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    // 🔹 Recent table data
    const recentSubmissions = histories.map((h: any) => ({
      submissionId: h.submission?.submissionId,
      location: h.submission?.location,
      areaClaimed: `${h.submission?.areaclaim || 0} ha`,
      status: h.status,
    }));

    // 🟢 Analytics
    let totalAreaClaimed = 0;
    let totalAreaVerified = 0;
    let totalTokens = 0;
    let pendingVerifications = 0;

    histories.forEach((h: any) => {
      const submission = h.submission;
      const verification = h.verification;

      if (submission) {
        totalAreaClaimed += submission.areaclaim || 0;
      }

      if (verification?.decision === "APPROVED") {
        totalAreaVerified += verification.actualArea || 0;
      }

      // initial carbon
      if (h.carbon?.tokensIssued) {
        totalTokens += h.carbon.tokensIssued;
      }

      // yearly monitoring tokens
      h.monitorings?.forEach((m: any) => {
        if (m.tokensIssued) {
          totalTokens += m.tokensIssued;
        }
      });

      if (h.status === "PENDING") {
        pendingVerifications++;
      }
    });

    // 🟢 Extra analytics
    const approvedProjects = histories.filter(
      (h: any) => h.verification?.decision === "APPROVED"
    ).length;

    const monitoringCompleted = histories.reduce(
      (acc: number, h: any) => acc + h.monitorings.length,
      0
    );

    const yearlyCarbon = histories.flatMap((h: any) =>
      h.monitorings.map((m: any) => ({
        year: m.year,
        carbon: m.annualCO2,
      }))
    );
    const statusAnalytics = [
  {
    name: "Approved",
    value: histories.filter(
      (h: any) => h.status === "APPROVED"
    ).length,
  },

  {
    name: "Pending",
    value: histories.filter(
      (h: any) => h.status === "PENDING"
    ).length,
  },

  {
    name: "Rejected",
    value: histories.filter(
      (h: any) => h.status === "REJECTED"
    ).length,
  },

  {
    name: "In Progress",
    value: histories.filter(
      (h: any) => h.status === "INPROGRESS"
    ).length,
  },
];

    res.json({
      cards: {
        totalAreaClaimed,
        totalAreaVerified,
        totalTokens,
        pendingVerifications,
      },

      recentSubmissions,

      analytics: {
        statusAnalytics,
        approvedProjects,
        monitoringCompleted,
        yearlyCarbon,
      },
    });
    
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to fetch dashboard",
    });
  }
};

export const getSubmissionDetails = async (req: Request, res: Response) => {
  try {
    const historyId = Number(req.params.historyId);

    const history = await db.history.findUnique({
      where: { historyId },

      include: {
        submission: true,

        verification: {
          include: {
            validator: {
              include: {
                user: true,
              },
            },
          },
        },

        monitorings: true,

        carbon: true,
      },
    });

    if (!history) {
      return res.status(404).json({
        message: "Submission not found",
      });
    }

    res.json(history);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to fetch details",
    });
  }
};
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const {
      name,
      email,
      phonenumber,
      organisation,
    } = req.body;
    if(!userId){
      return res.json("UserId not defined")
    }
    const updatedUser = await db.user.update({
      where: {
        userId,
      },

      data: {
        name,
        email,
        phonenumber,
        organisation,
      },
    });

    res.json({
      message: "Profile updated",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to update profile",
    });
  }
};