"use client";

import { authService } from "@/app/page";
import { useEffect, useState } from "react";

interface Assignment {
  assignmentId: number;
  status: string;
  deadline: string;

  submission: {
    submissionId: number;
    location: string;
    area: number;
  };
}

export default function AvailableSubmissions() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const fetchAssignments = async () => {
    const res = await fetch(`${authService}/validator/assignments/available`, {
      credentials: "include",
    });

    const data = await res.json();
    setAssignments(data);
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleAccept = async (id: number) => {
    await fetch(`${authService}/assignment/${id}/accept`, {
      method: "POST",
      credentials: "include",
    });

    fetchAssignments();
  };

  const handleReject = async (id: number) => {
    await fetch(`${authService}/assignment/${id}/reject`, {
      method: "POST",
      credentials: "include",
    });

    fetchAssignments();
  };

  return (
    <div className="text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        Available Submissions
      </h1>

      {assignments.length === 0 && (
        <p className="text-gray-400">No assignments available</p>
      )}

      {assignments.map((a) => (
        <div
          key={a.assignmentId}
          className="bg-neutral-800 p-5 rounded-xl mb-4"
        >
          <h2 className="text-xl font-semibold">
            📍 {a.submission.location}
          </h2>

          <p>Area: {a.submission.area} ha</p>
          <p className="text-gray-400">
            Deadline: {new Date(a.deadline).toLocaleDateString()}
          </p>

          <div className="flex gap-4 mt-4">
            <button
              onClick={() => handleAccept(a.assignmentId)}
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-500"
            >
              Accept
            </button>

            <button
              onClick={() => handleReject(a.assignmentId)}
              className="bg-red-600 px-4 py-2 rounded hover:bg-red-500"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}