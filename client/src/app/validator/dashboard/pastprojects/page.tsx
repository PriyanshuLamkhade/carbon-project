"use client";

import { authService } from "@/app/page";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PastProjects() {
  const [data, setData] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch(`${authService}/validator/assignments/history`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setData);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-600";
      case "REJECTED":
        return "bg-red-600";
      case "EXPIRED":
        return "bg-yellow-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Past Projects</h1>

      {data.length === 0 && (
        <p className="text-gray-400">No past projects yet</p>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        {data.map((a) => (
          <div
            key={a.assignmentId}
            className="bg-[#1e293b] p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">
                📍 {a.submission.location}
              </h2>

              <span
                className={`px-3 py-1 text-sm rounded-full ${getStatusColor(
                  a.status
                )}`}
              >
                {a.status}
              </span>
            </div>

            {/* DETAILS */}
            <div className="space-y-2 text-sm text-gray-300">
              <p>
                <span className="text-gray-400">Submission ID:</span>{" "}
                {a.submission.submissionId}
              </p>

              <p>
                <span className="text-gray-400">Assignment ID:</span>{" "}
                {a.assignmentId}
              </p>

              <p>
                <span className="text-gray-400">Area:</span>{" "}
                {a.submission.areaclaim || "N/A"} ha
              </p>

              <p>
                <span className="text-gray-400">Assigned At:</span>{" "}
                {new Date(a.assignedAt).toLocaleDateString()}
              </p>
            </div>

            {/* ACTION */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() =>
                  router.push(
                    `/validator/preview/${a.submission.submissionId}`
                  )
                }
                className="bg-violet-600 px-4 py-2 rounded-lg hover:bg-violet-500 transition"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}