import React, { ReactElement } from 'react';

interface RowData {
  submissionId: string | number;
  location: string;
  areaClaimed: string | number;
  status: string | ReactElement;
}

interface TableComponentProps {
  rows: RowData[];
  theme?: 'light' | 'dark'; // Optional theme prop
}

const TableComponent: React.FC<TableComponentProps> = ({ rows, theme = 'light' }) => {
  const isDark = theme === 'dark';

  // Map status to tailwind colors (supporting dark mode)
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return isDark ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800';
      case 'pending':
        return isDark ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return isDark ? 'bg-red-800 text-red-200' : 'bg-red-100 text-red-800';
      case 'in progress':
        return isDark ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800';
      default:
        return isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800';
    }
  };

  // Define styles dynamically based on theme
  const headerStyle = `
    border border-b-1 border-[#ddd]
    md:p-5 p-0.5 text-left
    ${isDark ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-gray-200 text-black'}
  `;

  const cellStyle = `
    border border-b-1 md:p-5 p-0.5
    ${isDark ? 'border-gray-700 text-gray-200' : 'border-[#ddd] text-black'}
  `;

  const evenRowStyle = isDark ? 'bg-gray-800' : 'bg-white';
  const oddRowStyle = isDark ? 'bg-gray-800' : 'bg-white';

  return (
    <table
      className={`shadow-[0px_0px_15px_rgba(0,0,0,0.09)] w-full ${
        isDark ? 'bg-gray-900 text-gray-200' : 'bg-white text-black'
      }`}
      style={{ borderCollapse: 'collapse' }}
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

export default TableComponent;
