import { db } from "../index.js";

// 📏 calculate distance (Haversine formula)
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// 🎯 MAIN FUNCTION
export async function assignValidator(submissionId: number, radius = 10) {
  // 1. get submission
  const submission = await db.submission.findUnique({
    where: { submissionId },
  });

  if (!submission || !submission.latitude || !submission.longitude) {
    console.log("No location data");
    return;
  }

  // 2. get validators
  const validators = await db.validator.findMany({
    where: {
      isAvailable: true,
      status: "APPROVED",
    },
  });

  // 3. filter eligible
  const previousAssignments = await db.assignment.findMany({
    where: { submissionId },
    select: { validatorId: true },
  });

  const excludedIds = previousAssignments.map((a) => a.validatorId);

  // ✅ filter eligible validators
  const eligible = validators.filter(
    (v) =>
      v.activeProjects < v.maxActiveProjects &&
      !excludedIds.includes(v.validatorId),
  );

  // 4. find nearby validators
  const nearby = eligible
    .map((v: any) => ({
      ...v,
      distance: getDistance(
        submission.latitude!,
        submission.longitude!,
        v.latitude,
        v.longitude,
      ),
    }))
    .filter((v: any) => v.distance <= radius)
    .sort((a: any, b: any) => a.distance - b.distance);

  // 5. fallback logic
  let selected = nearby[0];

  if (!selected) {
    console.log("No nearby validators, expanding radius...");

    if (radius < 50) {
      return assignValidator(submissionId, radius + 20); // expand
    }

    // last fallback → assign ANY validator
    selected = eligible.sort(
      (a: any, b: any) => a.activeProjects - b.activeProjects,
    )[0];
  }

  if (!selected) {
    console.log("No validators available at all");
    return;
  }

  // 6. create assignment
  await db.assignment.create({
    data: {
      validatorId: selected.validatorId,
      submissionId,
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    },
  });

  // 7. update validator stats
  await db.validator.update({
    where: { validatorId: selected.validatorId },
    data: {
      activeProjects: { increment: 1 },
      totalAssigned: { increment: 1 },
    },
  });

  console.log(`Assigned to validator ${selected.validatorId}`);
}
