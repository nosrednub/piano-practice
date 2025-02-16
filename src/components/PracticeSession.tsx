'use client';

import React, { useState, useEffect } from 'react';
import { defaultDurations, generateDefaultDescription, saveSession } from '../data/practiceSessions';

interface PracticeSessionProps {
  selectedScale: string;
  selectedKey: string;
  selectedOctaves: number;
  onSessionSaved?: (sessions: any[]) => void; // Type more specifically if possible
}

export default function PracticeSession({ selectedScale, selectedKey, selectedOctaves, onSessionSaved }: PracticeSessionProps) {
  const [duration, setDuration] = useState<number>(15); // Default to 15 minutes
  const [customDuration, setCustomDuration] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isCustomDuration, setIsCustomDuration] = useState<boolean>(false);

  // Generate default description when props change
  useEffect(() => {
    setDescription(generateDefaultDescription(selectedScale, selectedKey, selectedOctaves));
  }, [selectedScale, selectedKey, selectedOctaves]);

  const handleSave = () => {
    const session = {
      scale: selectedScale,
      key: selectedKey,
      octaves: selectedOctaves,
      duration: isCustomDuration ? parseInt(customDuration, 10) : duration,
      description,
      date: new Date().toISOString()
    };

    const updatedSessions = saveSession(session);
    if (onSessionSaved) {
      onSessionSaved(updatedSessions);
    }

    // Reset custom duration if it was used
    if (isCustomDuration) {
      setIsCustomDuration(false);
      setCustomDuration('');
      setDuration(15);
    }

    // Reset description to default
    setDescription(generateDefaultDescription(selectedScale, selectedKey, selectedOctaves));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-8">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Record Practice Session
      </h2>

      {/* Current Settings Summary */}
      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Currently practicing: <span className="font-medium">{selectedKey} {selectedScale}</span>
          <br />
          Range: <span className="font-medium">{selectedOctaves} octaves</span>
        </p>
      </div>

      {/* Duration Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Duration (minutes)
        </label>
        {!isCustomDuration ? (
          <div className="flex flex-wrap gap-2 mb-2">
            {defaultDurations.map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  duration === d
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {d} min
              </button>
            ))}
            <button
              onClick={() => setIsCustomDuration(true)}
              className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Custom
            </button>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <input
              type="number"
              value={customDuration}
              onChange={(e) => setCustomDuration(e.target.value)}
              min="1"
              className="block w-24 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Minutes"
            />
            <button
              onClick={() => setIsCustomDuration(false)}
              className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe your practice session..."
        />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isCustomDuration && !customDuration}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Save Practice Session
      </button>
    </div>
  );
}