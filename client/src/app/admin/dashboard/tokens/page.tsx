"use client";

import { useEffect, useState } from "react";

interface TokenRow {
  carbonId: number;
  userName: string;
  submissionId: number;
  location: string;
  carbonCleaned: number;
  tokensIssued: number;
  txHash: string;
  date: string;
}

export default function TokensPage() {
  const [data, setData] = useState<TokenRow[]>([]);

  useEffect(() => {
    const fetchTokens = async () => {
      const res = await fetch("http://localhost:4000/admin/tokens", {
        credentials: "include",
      });
      const result = await res.json();
      setData(result);
    };

    fetchTokens();
  }, []);

  return (
    <div className="p-6 text-white space-y-6">

      {/* 🔹 HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Carbon Tokens</h1>
        <p className="text-gray-400 text-sm">
          All minted tokens and carbon records
        </p>
      </div>

      {/* 🔹 TABLE */}
      <div className="bg-neutral-900 rounded-xl p-4 overflow-x-auto">
        <table className="w-full text-sm">

          <thead className="text-gray-400 border-b border-gray-700">
            <tr>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Carbon</th>
              <th className="p-3 text-left">Tokens</th>
              <th className="p-3 text-left">Tx Hash</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row) => (
              <tr
                key={row.carbonId}
                className="border-b border-gray-800 hover:bg-neutral-800"
              >
                <td className="p-3 font-medium">{row.userName}</td>

                <td className="p-3">{row.location}</td>

                <td className="p-3 text-green-400">
                  {row.carbonCleaned} tCO₂
                </td>

                <td className="p-3 text-purple-400 font-semibold">
                  {row.tokensIssued}
                </td>

                <td className="p-3">
                  {row.txHash !== "N/A" ? (
                    <a
                      href={`https://sepolia.etherscan.io/tx/${row.txHash}`}
                      target="_blank"
                      className="text-blue-400 underline"
                    >
                      View Tx
                    </a>
                  ) : (
                    <span className="text-gray-500">N/A</span>
                  )}
                </td>

                <td className="p-3 text-gray-400">
                  {new Date(row.date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>

        </table>

        {data.length === 0 && (
          <p className="text-center text-gray-400 py-6">
            No tokens minted yet
          </p>
        )}
      </div>
    </div>
  );
}