"use client";

import { authService } from "@/app/page";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ActiveSubmissions() {
  const [data, setData] = useState<any[]>([]);
  const router = useRouter();

  const fetchData = async () => {
    const res = await fetch(`${authService}/validator/assignments/active`, {
      credentials: "include",
    });

    const d = await res.json();
    setData(d);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Active Submissions</h1>

      {data.map((a) => (
        <div key={a.assignmentId} className="bg-neutral-800 p-5 rounded-xl mb-4">
          <h2>📍 {a.submission.location}</h2>
          <p>Area: {a.submission.area}</p>

          <button
            onClick={() =>
              router.push(`/validator/verification/${a.submission.submissionId}`)
            }
            className="mt-3 bg-blue-600 px-4 py-2 rounded"
          >
            Start Verification
          </button>
        </div>
      ))}
    </div>
  );
}