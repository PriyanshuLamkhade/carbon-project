import { Router } from "express";
import { groq } from "../lib/groq.js";
import { userMiddleware } from "../middleware/users.js";
import { db } from "../index.js";
import { detectIntentAI } from "../lib/aiIntent.js";

const chatRouter = Router();
async function extractProjectName(message: string) {
  const extraction = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `
Extract only the project name.

Examples:

"Give recommendations for Sundarbans"
→ Sundarbans

"Analyze Ratnagiri plantation"
→ Ratnagiri

"How can I improve my Alibaug project?"
→ Alibaug

Return ONLY the project name.
`,
      },
      {
        role: "user",
        content: message,
      },
    ],
  });

  return (
    extraction.choices[0]?.message.content?.trim() || ""
  );
}
chatRouter.post("/", userMiddleware, async (req, res) => {
  try {
    const { messages } = req.body;
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const lastMessage = Array.isArray(messages)
      ? messages[messages.length - 1]?.content || ""
      : "";

    const intent = await detectIntentAI(lastMessage);

    console.log("AI Intent:", intent);

    if (intent === "ANALYZE_PROJECT") {
      const extraction = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        temperature: 0,
        messages: [
          {
            role: "system",
            content: `
Extract only the project name from the user message.

Examples:

"Tell me about Sundarbans Mangrove Forest"
→ Sundarbans Mangrove Forest

"Show details of Ratnagiri Project"
→ Ratnagiri Project

"Can you explain my Sundarbans plantation?"
→ Sundarbans
`,
          },
          {
            role: "user",
            content: lastMessage,
          },
        ],
      });

      const projectName = extraction.choices[0]?.message.content?.trim() || "";
      const submission = await db.submission.findFirst({
        where: {
          location: {
            contains: projectName,
          },
          history: {
            userId,
          },
        },
        include: {
          history: {
            include: {
              verification: true,
              carbon: true,
            },
          },
        },
      });

      if (!submission) {
        return res.json({
          success: true,
          reply: "Project not found.",
        });
      }

      const verification = submission.history?.verification;

      const analysis = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `
You are a Blue Carbon MRV analyst.

Analyze the plantation project and provide:

# Project Score (1-10)

## Strengths

## Weaknesses

## Risks

## Carbon Potential

## Community Impact

## Recommendations

Rules:
- Use markdown.
- Be specific.
- Use project data provided.
- Keep response under 300 words.
- Give actionable recommendations.
`,
          },
          {
            role: "user",
            content: `
Project Data:

${JSON.stringify({
  submission,
  verification,
})}

Analyze this mangrove restoration project.
`,
          },
        ],
      });

      return res.json({
        success: true,
        reply: analysis.choices[0]?.message.content,
      });
    }
    if (intent === "TOP_PROJECT") {

  const projects = await db.history.findMany({
    where: {
      userId,
      verification: {
        isNot: null,
      },
    },
    include: {
      submission: true,
      verification: true,
    },
  });

  if (!projects.length) {
    return res.json({
      success: true,
      reply: "No verified projects found.",
    });
  }

  const bestProject = projects.sort(
    (a, b) =>
      (b.verification?.score || 0) -
      (a.verification?.score || 0)
  )[0];

  return res.json({
    success: true,
    reply: `
# Best Performing Project

## ${bestProject?.submission?.location}

- Verification Score: ${bestProject?.verification?.score}
- Survival Rate: ${bestProject?.verification?.survivalRate}%
- Plantation Health: ${bestProject?.verification?.plantationHealth}
- Annual CO₂: ${bestProject?.verification?.annualCO2}

This is currently your highest-performing project.
`,
  });
}
if (intent === "WORST_PROJECT") {

  const projects = await db.history.findMany({
    where: {
      userId,
      verification: {
        isNot: null,
      },
    },
    include: {
      submission: true,
      verification: true,
    },
  });

  if (!projects.length) {
    return res.json({
      success: true,
      reply: "No verified projects found.",
    });
  }

  const weakestProject = projects.sort(
    (a, b) =>
      (a.verification?.score || 0) -
      (b.verification?.score || 0)
  )[0];

  return res.json({
    success: true,
    reply: `
# Project Needing Attention

## ${weakestProject?.submission?.location}

- Verification Score: ${weakestProject?.verification?.score}
- Survival Rate: ${weakestProject?.verification?.survivalRate}%
- Plantation Health: ${weakestProject?.verification?.plantationHealth}
- Annual CO₂: ${weakestProject?.verification?.annualCO2}

This project currently has the lowest score and may need additional monitoring.
`,
  });
}
if (intent === "CARBON_RANKING") {

  const projects = await db.history.findMany({
    where: {
      userId,
      verification: {
        isNot: null,
      },
    },
    include: {
      submission: true,
      verification: true,
    },
  });

  if (!projects.length) {
    return res.json({
      success: true,
      reply: "No verified projects found.",
    });
  }

  const ranked = projects.sort(
    (a, b) =>
      (b.verification?.annualCO2 || 0) -
      (a.verification?.annualCO2 || 0)
  );

  let reply = "# Carbon Potential Ranking\n\n";

  ranked.forEach((project, index) => {
    reply += `
${index + 1}. **${project.submission?.location}**
   - Annual CO₂: ${project.verification?.annualCO2}
   - Score: ${project.verification?.score}

`;
  });

  return res.json({
    success: true,
    reply,
  });
}
if (intent === "PROJECT_RECOMMENDATION") {

  const projectName = await extractProjectName(
    lastMessage
  );

  const submission = await db.submission.findFirst({
    where: {
      location: {
        contains: projectName,
        mode: "insensitive",
      },
      history: {
        userId,
      },
    },
    include: {
      history: {
        include: {
          verification: true,
          carbon: true,
        },
      },
    },
  });

  if (!submission) {
    return res.json({
      success: true,
      reply:
        "I could not find that project in your submissions.",
    });
  }

  const verification =
    submission.history?.verification;

  const carbon =
    submission.history?.carbon;

  const recommendation =
    await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are a Blue Carbon Restoration Expert.

Analyze the project and provide:

# Current Assessment

# Improvement Opportunities

# Carbon Credit Growth Potential

# Plantation Health Improvements

# Monitoring Recommendations

# Priority Actions

Rules:

- Use markdown.
- Be practical.
- Give actionable recommendations.
- Refer to project data.
- Keep response under 400 words.
- Focus on increasing survival rate,
  carbon sequestration,
  plantation health,
  community engagement,
  and verification scores.
`,
        },
        {
          role: "user",
          content: JSON.stringify({
            submission,
            verification,
            carbon,
          }),
        },
      ],
    });

  return res.json({
    success: true,
    reply:
      recommendation.choices[0]?.message.content,
  });
}
    if (intent === "ALL_PROJECTS") {
      console.log("ANALYZE_ALL_PROJECTS HIT");
      const projects = await db.history.findMany({
        where: {
          userId,
          submission: {
            isNot: null,
          },
        },
        include: {
          submission: true,
          verification: true,
          carbon: true,
        },
      });
      console.log("Projects found:", projects.length);
      if (projects.length === 0) {
        return res.json({
          success: true,
          reply: "You do not have any projects yet.",
        });
      }

      const analysis = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `
You are a Blue Carbon MRV portfolio analyst.

Analyze all projects and provide:

# Portfolio Score (1-10)

## Summary
- Total Projects
- Verified Projects
- Pending Projects

## Best Performing Projects

## Weakest Projects

## Common Risks

## Carbon Potential

## Community Impact

## Recommendations

Use markdown.
Keep response under 400 words.
Focus on actionable insights.
`,
          },
          {
            role: "user",
            content: JSON.stringify(projects),
          },
        ],
      });

      return res.json({
        success: true,
        reply: analysis.choices[0]?.message.content,
      });
    }
    if (intent === "SUBMISSION_COUNT") {
      const count = await db.history.count({
        where: {
          userId,
          submission: {
            isNot: null,
          },
        },
      });

      return res.json({
        success: true,
        reply: `You currently have ${count} submissions.`,
      });
    }
    if (intent === "PROJECT_SEARCH") {
      const extraction = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        temperature: 0,
        messages: [
          {
            role: "system",
            content: `
Extract only the project name from the user message.

Examples:

"Tell me about Sundarbans Mangrove Forest"
→ Sundarbans Mangrove Forest

"Show details of Ratnagiri Project"
→ Ratnagiri Project

"Can you explain my Sundarbans plantation?"
→ Sundarbans
`,
          },
          {
            role: "user",
            content: lastMessage,
          },
        ],
      });

      const projectName = extraction.choices[0]?.message.content?.trim() || "";
      const submission = await db.submission.findFirst({
        where: {
          location: {
            contains: projectName,
            mode: "insensitive",
          },
          history: {
            userId,
          },
        },
        include: {
          history: {
            include: {
              verification: true,
            },
          },
        },
      });

      if (!submission) {
        return res.json({
          success: true,
          reply: "Project not found.",
        });
      }

      return res.json({
        success: true,
        reply: buildProjectSummary(
          submission,
          submission.history?.verification,
        ),
      });
    }
    if (intent === "LATEST_SUBMISSION") {
      const latest = await db.history.findFirst({
        where: {
          userId,
          submission: {
            isNot: null,
          },
        },
        include: {
          submission: true,
        },
        orderBy: {
          timestamp: "desc",
        },
      });

      if (!latest?.submission) {
        return res.json({
          success: true,
          reply: "You do not have any submissions yet.",
        });
      }

      return res.json({
        success: true,
        reply: `
# Latest Submission

## Plantation Details

- **Location:** ${latest.submission.location}
- **Species 1:** ${latest.submission.species1}
- **Count:** ${latest.submission.species1_count}
- **Area Claimed:** ${latest.submission.areaclaim}
- **Plantation Date:** ${latest.submission.plantationDate}

## Community Information

- **Community Involvement:** ${latest.submission.CommunityInvolvementLevel}
- **MGNREGA Person Days:** ${latest.submission.MGNREGAPersonDays}

## Description

${latest.submission.description || "No description available"}
`,
      });
    }

    if (intent === "VERIFICATION_STATUS") {
      const verification = await db.history.findFirst({
        where: {
          userId,
          verification: {
            isNot: null,
          },
        },
        include: {
          verification: true,
        },
        orderBy: {
          timestamp: "desc",
        },
      });

      if (!verification?.verification) {
        return res.json({
          success: true,
          reply: "No verification records found.",
        });
      }

      return res.json({
        success: true,
        reply: `
## Verification Status Of Latest Project:

- **Status:** ${verification.verification.decision}
- **Score:** ${verification.verification.score}
`,
      });
    }

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
`,
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
function buildProjectSummary(submission: any, verification?: any) {
  return `
# ${submission.location}

## Plantation Details

- **Species 1:** ${submission.species1}
- **Count:** ${submission.species1_count}

${submission.species2 ? `- **Species 2:** ${submission.species2}` : ""}

- **Area Claimed:** ${submission.areaclaim}
- **Plantation Date:** ${submission.plantationDate}

## Community Information

- **Community Involvement:** ${submission.CommunityInvolvementLevel}
- **MGNREGA Person Days:** ${submission.MGNREGAPersonDays}

## Description

${submission.description || "No description available"}

${
  verification
    ? `
## Verification

- **Status:** ${verification.decision}
- **Score:** ${verification.score}
- **Survival Rate:** ${verification.survivalRate}%
- **Plantation Health:** ${verification.plantationHealth}
- **Annual CO₂:** ${verification.annualCO2}
`
    : `
## Verification

Not yet verified.
`
}
`;
}
export default chatRouter;
