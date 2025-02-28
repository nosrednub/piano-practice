'use client';

import React, { useState, useEffect } from 'react';
import { saveSession, generateDefaultDescription, PracticeSession as PracticeSessionType } from '../data/practiceSessions';

interface PracticeSessionProps {
  selectedScale: string;
  selectedKey: string;
  selectedOctaves: number;
  onSessionSaved: (sessions: PracticeSessionType[]) => void;
}

const PracticeSession: React.FC<PracticeSessionProps> = ({ selectedScale, selectedKey, selectedOctaves, onSessionSaved }) => {
  const [duration, setDuration] = useState<number>(15);
  const [customDuration, setCustomDuration] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isCustomDuration, setIsCustomDuration] = useState<boolean>(false);

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
          Octaves: <span className="font-medium">{selectedOctaves}</span>
        </p>
      </div>

      {/* Duration */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Duration (minutes)
        </label>
        <input
          type="number"
          value={isCustomDuration ? customDuration : duration}
          onChange={(e) => isCustomDuration ? setCustomDuration(e.target.value) : setDuration(parseInt(e.target.value, 10))}
          className="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="mt-2">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={isCustomDuration}
              onChange={(e) => setIsCustomDuration(e.target.checked)}
              className="form-checkbox"
            />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">Custom Duration</span>
          </label>
        </div>
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
};

export default PracticeSession;