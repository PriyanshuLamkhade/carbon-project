import { Router } from "express";
import { groq } from "../lib/groq.js";

const chatRouter = Router();

chatRouter.post("/", async (req, res) => {
  try {
    const { messages } = req.body;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are CarbonBot, the AI assistant for our Blue Carbon MRV Platform.

About the Platform:
- Users submit mangrove plantation records.
- Users upload geo-tagged plantation images.
- Validators verify plantation submissions.
- Admins approve or reject submissions.
- Carbon credits are generated from verified plantations.
- Blockchain provides transparency and traceability.

You can help users with:
- Blue Carbon
- Mangrove Restoration
- Carbon Credits
- MRV (Monitoring, Reporting and Verification)
- Verification Process
- Plantation Submissions
- Platform Features

Response Guidelines:
- Use Markdown formatting.
- Use headings (##) for major sections.
- Use bullet points for lists.
- Use numbered steps when explaining workflows.
- Continue the current conversation context.
- Answer platform-related questions using the platform information above.
- If information is not available, clearly say so instead of inventing details.

Response Length:
- Simple questions → short answers.
- "Explain", "Tell me more", "How does it work" → detailed answers.
- Maximum 300 words.

Tone:
- Professional
- Helpful
- Clear
- Easy to understand

Formatting Rules:
- Always use markdown.
- Use ## for section headings.
- Use ### for subheadings.
- Use bullet points using "-".
- Never write lists without bullet points.
- Leave a blank line between sections.
- Bold important terms using **text**.
- Use numbered lists for workflows.
- Structure responses like a documentation page.
`
        },
        ...messages,
      ],
    });

    const reply = completion.choices[0]?.message.content;

    return res.json({
      success: true,
      reply,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default chatRouter;
