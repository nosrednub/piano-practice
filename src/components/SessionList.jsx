'use client';

import React, { useState } from 'react';
import { updateSession, deleteSession } from '../data/practiceSessions';

const SessionList = ({ sessions, onSessionsUpdate }) => {
  const [editingSession, setEditingSession] = useState(null);
  const [editDescription, setEditDescription] = useState('');

  const handleEdit = (session) => {
    setEditingSession(session);
    setEditDescription(session.description);
  };

  const handleSaveEdit = () => {
    if (editingSession) {
      const updatedSessions = updateSession(editingSession.id, { description: editDescription });
      onSessionsUpdate(updatedSessions);
      setEditingSession(null);
    }
  };

  const handleDelete = (sessionId) => {
    const updatedSessions = deleteSession(sessionId);
    onSessionsUpdate(updatedSessions);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (!sessions || sessions.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
        No practice sessions recorded yet.
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Practice History
      </h2>
      <div className="space-y-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
          >
            {editingSession?.id === session.id ? (
              // Edit mode
              <div className="space-y-3">
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setEditingSession(null)}
                    className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              // View mode
              <>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {session.key} {session.scale}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(session.date)} • {session.duration} minutes • {session.octaves} octaves
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(session)}
                      className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(session.id)}
                      className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{session.description}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionList;
