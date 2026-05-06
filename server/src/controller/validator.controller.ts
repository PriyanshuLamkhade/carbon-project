import { db } from "../index.js";
import { Request, Response } from "express";

export const getValidatorProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if(!userId){
        return res.json("Validator's userId not found")
    }
    const validator = await db.validator.findUnique({
      where: {
        userId,
      },

      include: {
        user: true,

        assignments: {
          include: {
            submission: true,
          },
        },

        verifications: true,
      },
    });

    if (!validator) {
      return res.status(404).json({
        message: "Validator not found",
      });
    }

    // 📊 STATS
    const completed = validator.assignments.filter(
      (a) => a.status === "COMPLETED"
    ).length;

    const pending = validator.assignments.filter(
      (a) => a.status === "PENDING"
    ).length;

    const inprogress = validator.assignments.filter(
      (a) => a.status === "ACCEPTED"
    ).length;

    const totalArea = validator.assignments.reduce(
      (acc, curr) =>
        acc + (curr.submission?.areaclaim || 0),
      0
    );

    res.json({
      validator,
      stats: {
        completed,
        pending,
        inprogress,
        totalArea,
      },
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to fetch validator profile",
    });
  }
};