"use client";

import { useEffect, useState } from "react";

interface IndustryRow {
  industryId: number;
  companyName: string;
  email: string;
  status: string;
}

export default function IndustriesPage() {
  const [data, setData] = useState<IndustryRow[]>([]);
  const [view, setView] = useState<"APPROVED" | "PENDING">("PENDING");

  const fetchIndustries = async () => {
    const res = await fetch(
      `http://localhost:4000/admin/industries?status=${view}`,
      { credentials: "include" }
    );

    const result = await res.json();
    setData(result);
  };

  useEffect(() => {
    fetchIndustries();
  }, [view]);

  const approve = async (id: number) => {
    await fetch(`http://localhost:4000/admin/industries/${id}/approve`, {
      method: "PATCH",
      credentials: "include",
    });
    fetchIndustries();
  };

  const reject = async (id: number) => {
    await fetch(`http://localhost:4000/admin/industries/${id}/reject`, {
      method: "PATCH",
      credentials: "include",
    });
    fetchIndustries();
  };

  return (
    <div className="p-6 text-white space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Industries</h1>
        <p className="text-gray-400 text-sm">
          Manage industry onboarding
        </p>
      </div>

      {/* TOGGLE */}
      <div className="flex gap-3">
        <button
          onClick={() => setView("PENDING")}
          className={`px-4 py-2 rounded ${
            view === "PENDING"
              ? "bg-yellow-600"
              : "bg-neutral-800"
          }`}
        >
          Requests
        </button>

        <button
          onClick={() => setView("APPROVED")}
          className={`px-4 py-2 rounded ${
            view === "APPROVED"
              ? "bg-green-600"
              : "bg-neutral-800"
          }`}
        >
          Approved
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-neutral-900 rounded-xl p-4">
        <table className="w-full text-sm">

          <thead className="text-gray-400 border-b border-gray-700">
            <tr>
              <th className="p-3 text-left">Company</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row) => (
              <tr key={row.industryId} className="border-b border-gray-800">
                <td className="p-3 font-medium">{row.companyName}</td>
                <td className="p-3">{row.email}</td>

                <td
                  className={`p-3 ${
                    row.status === "APPROVED"
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}
                >
                  {row.status}
                </td>

                <td className="p-3 flex gap-2">

                  {view === "PENDING" && (
                    <>
                      <button
                        onClick={() => approve(row.industryId)}
                        className="bg-green-600 px-3 py-1 rounded"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => reject(row.industryId)}
                        className="bg-red-600 px-3 py-1 rounded"
                      >
                        Reject
                      </button>
                    </>
                  )}

                </td>
              </tr>
            ))}
          </tbody>

        </table>

        {data.length === 0 && (
          <p className="text-center text-gray-400 py-6">
            No industries found
          </p>
        )}
      </div>
    </div>
  );
}