export const getAssignments = async () => {
  const res = await fetch("/api/validator/assignments");
  return res.json();
};

export const acceptAssignment = async (id: number) => {
  await fetch(`/api/assignment/${id}/accept`, {
    method: "POST",
  });
};

export const rejectAssignment = async (id: number) => {
  await fetch(`/api/assignment/${id}/reject`, {
    method: "POST",
  });
};