"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type User = {
  userId: number;
  name: string;
  email: string;
  phonenumber?: string;
  organisation?: string;
  role: string;
};

type Submission = {
  submissionId: number;
  location: string;
  areaclaim: number;
  submissionDate: string;
};

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/admin/users/${id}`,
          { credentials: "include" }
        );

        const data = await res.json();

        setUser(data.user);
        setSubmissions(data.submissions);

      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, [id]);

  if (!user) return <p className="text-white p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-[#0f172a] -m-5 text-white p-6">
      
      {/* 🔹 USER INFO CARD */}
      <div className="bg-[#1e293b] rounded-xl p-6 shadow mb-6">
        <h1 className="text-2xl font-bold mb-4">User Details</h1>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <p><span className="text-gray-400">Name:</span> {user.name}</p>
          <p><span className="text-gray-400">Email:</span> {user.email}</p>
          <p><span className="text-gray-400">Phone:</span> {user.phonenumber || "N/A"}</p>
          <p><span className="text-gray-400">Org:</span> {user.organisation || "N/A"}</p>
          <p>
            <span className="text-gray-400">Role:</span>{" "}
            <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
              {user.role}
            </span>
          </p>
        </div>
      </div>

      {/* 🔹 SUBMISSIONS */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Submissions</h2>

        {submissions.length === 0 && (
          <p className="text-gray-400">No submissions found</p>
        )}

        <div className="space-y-4">
          {submissions.map((sub) => (
            <div
              key={sub.submissionId}
              className="bg-[#1e293b] p-4 rounded-xl shadow hover:bg-[#334155] transition"
            >
              <h3 className="font-semibold text-lg">{sub.location}</h3>

              <p className="text-gray-400 text-sm">
                Area Claimed: {sub.areaclaim}
              </p>

              <p className="text-gray-500 text-sm">
                {new Date(sub.submissionDate).toLocaleDateString()}
              </p>

              <button
                onClick={() =>
                  router.push(
                    `/admin/dashboard/submissions/${sub.submissionId}`
                  )
                }
                className="mt-3 bg-gradient-to-r from-green-500 to-emerald-600 px-3 py-1.5 rounded text-sm"
              >
                View Submission →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}