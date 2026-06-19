"use client";

import { useEffect, useState } from "react";

interface IndustryRow {
  industryId: number;
  companyName: string;
  email: string;
  status: string;
}

export default function IndustriesPage() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [data, setData] = useState<IndustryRow[]>([]);
  const [view, setView] = useState<"APPROVED" | "PENDING">("PENDING");

  const fetchIndustries = async () => {
    const res = await fetch(
      `http://localhost:4000/admin/industries?status=${view}`,
      { credentials: "include" }
    );

    const result = await res.json();
    setData(result);

    const certRes = await fetch(
  "http://localhost:4000/admin/certificates",
  {
    credentials: "include",
  }
);

const certData = await certRes.json();

setCertificates(certData);
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
      {/* 🔥 CERTIFICATES */}
<div className="mt-12">

  {/* HEADER */}
  <div className="flex justify-between items-center mb-6 flex-wrap gap-4">

    <div>

      <h2 className="text-4xl font-black">
        Retirement Certificates
      </h2>

      <p className="text-gray-400 mt-2">
        Blockchain verified carbon retirement records
      </p>

    </div>

    <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-4 rounded-2xl shadow-xl">

      <p className="text-sm text-white/80">
        Total Certificates
      </p>

      <h3 className="text-4xl font-black">
        {certificates.length}
      </h3>

    </div>

  </div>

  {/* GRID */}
  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

    {certificates.map((c) => (

      <div
        key={c.certificateId}
        className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-3xl p-6 shadow-2xl"
      >

        {/* TOP */}
        <div className="flex justify-between items-start gap-4 mb-6">

          <div>

            <h3 className="text-2xl font-bold">
              {c.companyName}
            </h3>

            <p className="text-gray-400 text-sm mt-1">
              {c.email}
            </p>

          </div>

          <div className="bg-green-500/10 text-green-300 border border-green-500/20 px-4 py-2 rounded-xl text-sm font-bold">

            RETIRED

          </div>

        </div>

        {/* INFO GRID */}
        <div className="grid grid-cols-2 gap-4 mb-6">

          {/* TOKENS */}
          <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">

            <p className="text-xs text-gray-400 mb-2">
              Tokens Retired
            </p>

            <h4 className="text-3xl font-black text-green-400">
              {c.tokensRetired}
            </h4>

          </div>

          {/* LOCATION */}
          <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">

            <p className="text-xs text-gray-400 mb-2">
              Project Location
            </p>

            <h4 className="text-sm font-bold text-cyan-300">
              {c.location || "-"}
            </h4>

          </div>

        </div>

        {/* HASH */}
        <div className="bg-black/40 border border-slate-700 rounded-2xl p-4 mb-6 overflow-hidden">

          <p className="text-xs text-gray-400 mb-2">
            Blockchain Transaction
          </p>

          <p className="text-xs text-green-400 break-all font-mono">
            {c.txHash}
          </p>

        </div>

        {/* FOOTER */}
        <div className="flex justify-between items-center flex-wrap gap-4">

          <div>

            <p className="text-xs text-gray-400">
              Retirement Date
            </p>

            <h4 className="font-semibold">
              {new Date(
                c.createdAt
              ).toLocaleDateString()}
            </h4>

          </div>

          <div className="flex gap-3">

            {/* VIEW TX */}
            <a
              href={`https://sepolia.etherscan.io/tx/${c.txHash}`}
              target="_blank"
              className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl text-sm font-semibold"
            >
              View TX
            </a>

            {/* DOWNLOAD */}
            <a
              href={c.certificateUrl}
              target="_blank"
              className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-xl text-sm font-semibold"
            >
              Download
            </a>

          </div>

        </div>

      </div>
    ))}

  </div>

  {/* EMPTY */}
  {certificates.length === 0 && (

    <div className="bg-neutral-900 rounded-2xl p-10 text-center border border-neutral-800">

      <h3 className="text-2xl font-bold mb-2">
        No Certificates Yet
      </h3>

      <p className="text-gray-400">
        Retirement certificates will appear here
      </p>

    </div>

  )}

</div>
    </div>
  );
}