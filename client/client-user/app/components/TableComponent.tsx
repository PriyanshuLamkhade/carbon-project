import React, { ReactElement } from 'react';

interface RowData {
  submissionId: string | number;
  location: string;
  areaClaimed: string | number;
  status: string | ReactElement;
}

interface TableComponentProps {
  rows: RowData[];
}

const TableComponent: React.FC<TableComponentProps> = ({ rows }) => {
  // Map status to tailwind colors
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <table
      className="shadow-[0px_0px_15px_rgba(0,0,0,0.09)]"
      style={{ borderCollapse: 'collapse', width: '100%' }}
    >
      <thead>
        <tr>
          <th className={headerStyle}>Submission Id</th>
          <th className={headerStyle}>Location</th>
          <th className={headerStyle}>Area Claimed</th>
          <th className={headerStyle}>Status</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index} className={index % 2 === 0 ? evenRowStyle : oddRowStyle}>
            <td className={cellStyle}>{row.submissionId}</td>
            <td className={cellStyle}>{row.location}</td>
            <td className={cellStyle}>{row.areaClaimed}</td>
            <td className={`${cellStyle} px-3`}>
              <span
                className={`inline-block p-1 md:px-3 md:py-1 rounded-full font-semibold text-sm ${getStatusClass(
                  typeof row.status === 'string' ? row.status : ''
                )}`}
              >
                {row.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const headerStyle = "border border-b-1 border-[#ddd] md:p-5 p-0.5 bg-gray-200 text-left";
const cellStyle = 'border border-b-1 border-[#ddd] md:p-5 p-0.5';
const evenRowStyle = "bg-[#ffffff]";
const oddRowStyle = "bg-[#f9f9f9]";

export default TableComponent;
