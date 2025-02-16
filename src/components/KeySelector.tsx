'use client';

import React from 'react';
import { keySignatures } from '../data/scales';

interface KeySelectorProps {
  selectedKey: string;
  onKeyChange: (key: string) => void;
}

export default function KeySelector({ selectedKey, onKeyChange }: KeySelectorProps) {
  return (
    <div className="mb-4">
      <label htmlFor="key-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Key Signature
      </label>
      <select
        id="key-select"
        value={selectedKey}
        onChange={(e) => onKeyChange(e.target.value)}
        className="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {keySignatures.map((key) => (
          <option key={key.id} value={key.id}>
            {key.name}
          </option>
        ))}
      </select>
    </div>
  );
}