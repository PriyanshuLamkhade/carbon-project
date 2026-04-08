"use client";

import { Assignment } from "@/types/assignment";

interface Props {
  assignment: Assignment;
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
}

export default function AssignmentCard({ assignment, onAccept, onReject }: Props) {
  return (
    <div className="bg-[#1e293b] p-4 rounded-xl shadow-md mb-4">
      <h2 className="text-lg font-semibold">
        📍 {assignment.submission.location}
      </h2>

      <p className="text-sm text-gray-400">
        Area: {assignment.submission.area} ha
      </p>

      <p className="text-sm text-gray-400">
        Deadline: {new Date(assignment.deadline).toLocaleDateString()}
      </p>

      <p className="mt-2 text-yellow-400">
        Status: {assignment.status}
      </p>

      {assignment.status === "PENDING" && (
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => onAccept(assignment.assignmentId)}
            className="bg-green-600 px-3 py-1 rounded"
          >
            Accept
          </button>

          <button
            onClick={() => onReject(assignment.assignmentId)}
            className="bg-red-600 px-3 py-1 rounded"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}