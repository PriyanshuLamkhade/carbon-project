"use client";

import { useEffect, useState } from "react";

interface ValidatorRow {
  validatorId: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

export default function ValidatorsPage() {
  const [data, setData] = useState<ValidatorRow[]>([]);
  const [view, setView] = useState<"APPROVED" | "PENDING">("APPROVED");

  const fetchValidators = async () => {
    const res = await fetch(
      `http://localhost:4000/admin/validators?status=${view}`,
      { credentials: "include" }
    );
    const result = await res.json();
    setData(result);
  };

  useEffect(() => {
    fetchValidators();
  }, [view]);

  const approve = async (id: number) => {
    await fetch(`http://localhost:4000/admin/validators/${id}/approve`, {
      method: "PATCH",
      credentials: "include",
    });
    fetchValidators();
  };

  const reject = async (id: number) => {
    await fetch(`http://localhost:4000/admin/validators/${id}/reject`, {
      method: "PATCH",
      credentials: "include",
    });
    fetchValidators();
  };

  const remove = async (id: number) => {
    await fetch(`http://localhost:4000/admin/validators/${id}/remove`, {
      method: "PATCH",
      credentials: "include",
    });
    fetchValidators();
  };

  return (
    <div className="p-6 text-white space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Validators</h1>
        <p className="text-gray-400 text-sm">
          Manage validator accounts
        </p>
      </div>

      {/* TOGGLE */}
      <div className="flex gap-3">
        <button
          onClick={() => setView("APPROVED")}
          className={`px-4 py-2 rounded-lg ${
            view === "APPROVED"
              ? "bg-purple-600"
              : "bg-neutral-800 hover:bg-neutral-700"
          }`}
        >
          Approved
        </button>

        <button
          onClick={() => setView("PENDING")}
          className={`px-4 py-2 rounded-lg ${
            view === "PENDING"
              ? "bg-yellow-600"
              : "bg-neutral-800 hover:bg-neutral-700"
          }`}
        >
          Requests
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-neutral-900 rounded-xl p-4 overflow-x-auto">
        <table className="w-full text-sm">

          <thead className="text-gray-400 border-b border-gray-700">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row) => (
              <tr
                key={row.validatorId}
                className="border-b border-gray-800 hover:bg-neutral-800"
              >
                <td className="p-3 font-medium">{row.name}</td>

                <td className="p-3">{row.email}</td>

                <td className="p-3 text-blue-400">{row.role}</td>

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
                        onClick={() => approve(row.validatorId)}
                        className="px-3 py-1 bg-green-600 rounded"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => reject(row.validatorId)}
                        className="px-3 py-1 bg-red-600 rounded"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {view === "APPROVED" && (
                    <button
                      onClick={() => remove(row.validatorId)}
                      className="px-3 py-1 bg-red-600 rounded"
                    >
                      Remove
                    </button>
                  )}

                </td>
              </tr>
            ))}
          </tbody>

        </table>

        {data.length === 0 && (
          <p className="text-center text-gray-400 py-6">
            No validators found
          </p>
        )}
      </div>
    </div>
  );
}