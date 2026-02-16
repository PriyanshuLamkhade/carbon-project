"use client";
import React from "react";

interface RowData {
  historyId: number;
  submission: { location: string };
  status: string;
}

interface TableWithActionsProps {
  rows: RowData[];
  setPreviewData: (x: any) => void;
  setVisible: (x: boolean) => void;
  theme?: "light" | "dark"; // new optional prop
}

const TableWithActions: React.FC<TableWithActionsProps> = ({
  rows,
  setPreviewData,
  setVisible,
  theme = "light", // default to light
}) => {
  const isDark = theme === "dark";

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return isDark ? "bg-green-900 text-green-200" : "bg-green-100 text-green-800";
      case "inactive":
        return isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-800";
      case "pending":
        return isDark ? "bg-yellow-900 text-yellow-200" : "bg-yellow-100 text-yellow-800";
      case "rejected":
        return isDark ? "bg-red-900 text-red-200" : "bg-red-100 text-red-800";
      default:
        return isDark ? "bg-blue-900 text-blue-200" : "bg-blue-100 text-blue-800";
    }
  };

  // Theme-dependent styles
  const headerStyle = isDark
    ? "border border-gray-700 bg-gray-800 text-gray-200 text-left p-4 font-semibold"
    : "border border-[#ddd] bg-gray-200 text-left p-4 font-semibold";

  const cellStyle = isDark
    ? "border border-gray-700 p-4 text-gray-100"
    : "border border-[#ddd] p-4";

  const evenRowStyle = isDark ? "bg-gray-800" : "bg-white";
  const oddRowStyle = isDark ? "bg-gray-800" : "white";

  return (
    <table
      className={`shadow-[0px_0px_15px_rgba(0,0,0,0.09)] w-full border-collapse ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <thead>
        <tr>
          <th className={`${headerStyle} pr-1`}>Submission Id</th>
          <th className={headerStyle}>Location</th>
          <th className={headerStyle}>Status</th>
          <th className={headerStyle}>Action</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index} className={index % 2 === 0 ? evenRowStyle : oddRowStyle}>
            <td className={cellStyle}>{row.historyId}</td>
            <td className={cellStyle}>{row.submission.location}</td>
            <td className={cellStyle}>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                  row.status
                )}`}
              >
                {row.status}
              </span>
            </td>
            <td className={cellStyle}>
              <div className="flex gap-3">
                <button
                  onClick={async () => {
                    const res = await fetch("http://localhost:4000/users/previewData", {
                      method: "post",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ historyId: row.historyId }),
                      credentials: "include",
                    });
                    const data = await res.json();
                    if (res.ok && data) {
                      setPreviewData(data);
                      setVisible(true);
                    } else {
                      console.error("Error fetching preview:", data);
                      alert("Failed to fetch preview data");
                    }
                  }}
                  className={`font-medium cursor-pointer hover:underline ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  Preview
                </button>
                <button
                  onClick={async () => {
                    const res = await fetch("http://localhost:4000/users/deleteSubmission", {
                      method: "delete",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ historyId: row.historyId }),
                      credentials: "include",
                    });
                    window.location.reload();
                  }}
                  className={`font-medium cursor-pointer hover:underline ${
                    isDark ? "text-red-400" : "text-red-600"
                  }`}
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableWithActions;
