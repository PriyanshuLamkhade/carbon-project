import { db } from "../index.js"
import TryCatch from "../middleware/trycatch.js"


export const previewData = TryCatch(async (req, res) => {
  try {
    const userId = req.userId;
    const { historyId } = req.body;

    const parsedId = Number(historyId);

if (!parsedId) {
  return res.status(400).json({ message: "Invalid historyId" });
}
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!historyId) {
      return res.status(400).json({ message: "historyId required" });
    }

    // 🔹 Get validator from user
    const validator = await db.validator.findUnique({
      where: { userId },
    });

    if (!validator) {
      return res.status(404).json({ message: "Validator not found" });
    }

    // 🔹 Get submission
    const submission = await db.submission.findUnique({
      where: { historyId: parsedId },
    });

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // 🔥 IMPORTANT: check assignment
    const assignment = await db.assignment.findFirst({
      where: {
        submissionId: submission.submissionId,
        validatorId: validator.validatorId,
        isActive: true,
      },
    });

    if (!assignment) {
      return res.status(403).json({
        message: "You are not assigned to this submission",
      });
    }

    // ✅ Return only submission (as per your design)
    res.status(200).json({ submission });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});