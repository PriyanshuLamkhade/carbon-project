export function detectIntent(message: string) {
  const msg = message.toLowerCase();
 
  if (
  (msg.includes("analyze") || msg.includes("analyse")) &&
  msg.includes("all") &&
  msg.includes("project")
) {
  return "ALL_PROJECTS";
}
if (
  msg.includes("analyze") ||
  msg.includes("analyse") ||
  msg.includes("project feedback") ||
  msg.includes("review project")
) {
  return "ANALYZE_PROJECT";
}

  if (
    msg.includes("how many submissions") ||
    msg.includes("submission count")
  ) {
    return "SUBMISSION_COUNT";
  }

  if (msg.includes("latest submission")) {
    return "LATEST_SUBMISSION";
  }
  if (
    msg.includes("tell me about") ||
    msg.includes("project") ||
    msg.includes("submission")
  ) {
    return "PROJECT_SEARCH";
  }
  if (msg.includes("verification status")) {
    return "VERIFICATION_STATUS";
  }

  return "GENERAL";
}
