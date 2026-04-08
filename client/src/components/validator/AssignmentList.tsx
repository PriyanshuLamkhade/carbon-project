"use client";

import { useEffect, useState } from "react";

import { getAssignments, acceptAssignment, rejectAssignment } from "@/services/assignment";
import { Assignment } from "@/types/assignment";
import AssignmentCard from "./assignmentcard";

export default function AssignmentList() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const fetchData = async () => {
    const data = await getAssignments();
    setAssignments(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAccept = async (id: number) => {
    await acceptAssignment(id);
    fetchData();
  };

  const handleReject = async (id: number) => {
    await rejectAssignment(id);
    fetchData();
  };

  return (
    <div>
      {assignments.map((a) => (
        <AssignmentCard
          key={a.assignmentId}
          assignment={a}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      ))}
    </div>
  );
}