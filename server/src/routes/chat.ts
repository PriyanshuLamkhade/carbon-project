// import express from "express";
// import OpenAI from "openai";

// import { db } from "../index.js";
// import { userMiddleware } from "../middleware/users.js";

// const router = express.Router();


// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// router.post("/chat", userMiddleware, async (req, res) => {
//   try {
//     // ✅ Get from middleware (NOT frontend)
//     const userId = req.userId;

//     if (!userId) {
//       return res.status(401).json({ error: "Unauthorized" });
//     }

//     const { message } = req.body;

//     // ✅ Fetch ONLY this user's data
//     const history = await db.history.findMany({
//       where: { userId },
//       include: {
//         submission: true,
//         carbon: true,
//         verification: true,
//       },
//       orderBy: {
//         timestamp: "desc",
//       },
//       take: 5,
//     });

//     // ✅ Compute insights (VERY IMPORTANT)
//     const totalProjects = history.length;

//     const totalCarbon = history.reduce(
//       (sum, h) => sum + (h.carbon?.tokensIssued || 0),
//       0,
//     );

//     const approvedProjects = history.filter(
//       (h) => h.status === "APPROVED",
//     ).length;

//     // Example survival logic (dummy for now)
//     const avgArea =
//       history.reduce((sum, h) => sum + (h.submission?.area || 0), 0) /
//       (history.length || 1);

//     const insights = {
//       totalProjects,
//       totalCarbon,
//       approvedProjects,
//       avgArea,
//     };

//     // ✅ Send CLEAN data to GPT
//     const response = await client.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "system",
//           content: `
// You are a carbon project assistant.
// - Explain clearly
// - Give actionable suggestions
// - Use provided insights
//           `,
//         },
//         {
//           role: "user",
//           content: `
// User question: ${message}

// User Insights:
// ${JSON.stringify(insights, null, 2)}
//           `,
//         },
//       ],
//     });

//     const reply = response.choices?.[0]?.message?.content;

// if (!reply) {
//   return res.status(500).json({
//     error: "No response from AI",
//   });
// }

// res.json({ reply });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Chat failed" });
//   }
// });

// export default router;
