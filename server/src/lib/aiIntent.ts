import { groq } from "./groq.js";

export async function detectIntentAI(message: string) {
    
  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `
You are an intent classifier.

Return ONLY ONE of these values:

SUBMISSION_COUNT
LATEST_SUBMISSION
PROJECT_SEARCH
VERIFICATION_STATUS
ANALYZE_PROJECT
ALL_PROJECTS
TOP_PROJECT
WORST_PROJECT
CARBON_RANKING
PROJECT_RECOMMENDATION
GENERAL

Examples:

"How many submissions do I have?"
→ SUBMISSION_COUNT

"Show my latest project"
→ LATEST_SUBMISSION

"Tell me about Sundarbans"
→ PROJECT_SEARCH

"What is my verification status?"
→ VERIFICATION_STATUS

"Analyze Sundarbans project"
→ ANALYZE_PROJECT

"Analyze all my projects"
→ ALL_PROJECTS

"How am I doing overall?"
→ ALL_PROJECTS

"Give me portfolio insights"
→ ALL_PROJECTS

"Review my plantations"
→ ALL_PROJECTS

"How can I improve my project?"
→ PROJECT_RECOMMENDATION

"Give recommendations for Sundarbans"
→ PROJECT_RECOMMENDATION

"What should I improve in my plantation?"
→ PROJECT_RECOMMENDATION

"How can I increase carbon credits?"
→ PROJECT_RECOMMENDATION

"Which project is performing best?"
→ TOP_PROJECT

"Best project?"
→ TOP_PROJECT

"Which project needs attention?"
→ WORST_PROJECT

"Worst project?"
→ WORST_PROJECT

"Highest carbon project?"
→ CARBON_RANKING

"Rank my projects by carbon potential"
→ CARBON_RANKING
`,
      },
      {
        role: "user",
        content: message,
      },
    ],
  });
const intent =
  response.choices[0]?.message.content?.trim();

const validIntents = [
  "SUBMISSION_COUNT",
  "LATEST_SUBMISSION",
  "PROJECT_SEARCH",
  "VERIFICATION_STATUS",
  "ANALYZE_PROJECT",
  "ALL_PROJECTS",
  "TOP_PROJECT",
"WORST_PROJECT",
"CARBON_RANKING",
  "PROJECT_RECOMMENDATION",
  "GENERAL",
];

return validIntents.includes(intent || "")
  ? intent
  : "GENERAL";  
}