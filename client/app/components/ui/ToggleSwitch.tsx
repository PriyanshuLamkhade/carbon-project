'use client';

import React, { useState } from 'react';

const ToggleSwitch = () => {
  const [enabled, setEnabled] = useState(false);

  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 
        ${enabled ? 'bg-green-500' : 'bg-gray-300'}`}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300
          ${enabled ? 'translate-x-6' : 'translate-x-0'}`}
      />
    </button>
  );
};

export default ToggleSwitch;
