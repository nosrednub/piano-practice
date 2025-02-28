'use client';

import React from 'react';
import { jazzScales } from '../data/scales';

export default function ScaleSelector({ selectedScale, onScaleChange }) {
  return (
    <div className="mb-4">
      <label htmlFor="scale-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Select Scale
      </label>
      <select
        id="scale-select"
        value={selectedScale}
        onChange={(e) => onScaleChange(e.target.value)}
        className="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {jazzScales.map((scale) => (
          <option key={scale.id} value={scale.id}>
            {scale.name}
          </option>
        ))}
      </select>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {jazzScales.find(scale => scale.id === selectedScale)?.description}
      </p>
    </div>
  );
}
