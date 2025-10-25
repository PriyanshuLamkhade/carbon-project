'use client'
import React from 'react';

interface RowData {
  historyId: number;
  submission: {location: string};
  status: string;
}

interface TableWithActionsProps {
  rows: RowData[];
  onEdit?: (row: RowData) => void;
  onDelete?: (row: RowData) => void;
}

const TableWithActions: React.FC<TableWithActionsProps> = ({ rows, onEdit, onDelete }) => {
  // Optional: Color classes for status
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <table className="shadow-[0px_0px_15px_rgba(0,0,0,0.09)] w-full border-collapse">
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
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(row.status)}`}>
                {row.status}
              </span>
            </td>
            <td className={cellStyle}>
              <div className="flex gap-3">
                <button
                  onClick={() =>{}}
                  className="text-blue-600 hover:underline font-medium cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() =>{} }
                  className="text-red-600 hover:underline font-medium cursor-pointer"
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

// Tailwind styles
const headerStyle = 'border border-[#ddd] bg-gray-200 text-left p-4 font-semibold';
const cellStyle = 'border border-[#ddd] p-4';
const evenRowStyle = 'bg-white';
const oddRowStyle = 'bg-gray-50';

export default TableWithActions;
