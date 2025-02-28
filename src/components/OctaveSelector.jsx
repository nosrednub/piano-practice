'use client';

import React from 'react';

export default function OctaveSelector({ selectedOctaves, onOctavesChange }) {
  return (
    <div className="mb-4">
      <label htmlFor="octave-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Number of Octaves
      </label>
      <select
        id="octave-select"
        value={selectedOctaves}
        onChange={(e) => onOctavesChange(Number(e.target.value))}
        className="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {[1, 2, 3, 4].map((num) => (
          <option key={num} value={num}>
            {num} {num === 1 ? 'Octave' : 'Octaves'}
          </option>
        ))}
      </select>
    </div>
  );
}
