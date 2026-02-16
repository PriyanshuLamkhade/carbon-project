"use client";
import React from "react";

interface Submission {
  SubmissionID: number | null;
  SubmittedBy: string | null;
  AreaClaimed: number | null;
  DateSubmitted: string | Date | null;
  Location: string | null;
  Status: string;
}

interface DetailedTableProps {
  rows: Submission[];
  onReview?: (row: Submission) => void;
  theme?: "light" | "dark";
}

const DetailedTable: React.FC<DetailedTableProps> = ({
  rows,
  onReview,
  theme = "light",
}) => {
  const isDark = theme === "dark";

  const getStatusClass = (status: string) => {
    switch (status) {
      case "PENDING":
        return isDark ? "bg-yellow-900 text-yellow-200" : "bg-yellow-100 text-yellow-800";
      case "INPROGRESS":
        return isDark ? "bg-blue-900 text-blue-200" : "bg-blue-100 text-blue-800";
      case "APPROVED":
        return isDark ? "bg-green-900 text-green-200" : "bg-green-100 text-green-800";
      case "REJECTED":
        return isDark ? "bg-red-900 text-red-200" : "bg-red-100 text-red-800";
      default:
        return isDark ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-800";
    }
  };

  const headerStyle = isDark
    ? "border border-gray-700 bg-gray-800 text-gray-200 text-left p-4 font-semibold"
    : "border border-[#ddd] bg-gray-200 text-left p-4 font-semibold";

  const cellStyle = isDark
    ? "border border-gray-700 p-4 text-gray-100"
    : "border border-[#ddd] p-4";

  const evenRowStyle = isDark ? "bg-gray-900" : "bg-white";
  const oddRowStyle = isDark ? "bg-gray-800" : "bg-gray-50";

  const formatDate = (date: string | Date | null) => {
    if (!date) return "-";
    const d = new Date(date);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
  };

  return (
    <table
      className={`shadow-[0px_0px_15px_rgba(0,0,0,0.09)] w-full border-collapse ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <thead>
        <tr>
          <th className={headerStyle}>Submission ID</th>
          <th className={headerStyle}>Submitted By</th>
          <th className={headerStyle}>Area Claimed (ha)</th>
          <th className={headerStyle}>Date Submitted</th>
          <th className={headerStyle}>Location</th>
          <th className={headerStyle}>Status</th>
          <th className={headerStyle}>Action</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={row.SubmissionID ?? index} className={index % 2 === 0 ? evenRowStyle : oddRowStyle}>
            <td className={cellStyle}>{row.SubmissionID ?? "-"}</td>
            <td className={cellStyle}>{row.SubmittedBy ?? "-"}</td>
            <td className={cellStyle}>{row.AreaClaimed ?? "-"}</td>
            <td className={cellStyle}>{formatDate(row.DateSubmitted)}</td>
            <td className={cellStyle}>{row.Location ?? "-"}</td>
            <td className={cellStyle}>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                  row.Status
                )}`}
              >
                {row.Status}
              </span>
            </td>
            <td className={cellStyle}>
              <button
                onClick={() => onReview && onReview(row)}
                className={`font-medium cursor-pointer hover:underline ${
                  isDark ? "text-indigo-400" : "text-indigo-600"
                }`}
              >
                Review
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DetailedTable;
