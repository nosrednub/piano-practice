'use client';

import { useState, useEffect } from 'react';
import ScaleSelector from '../components/ScaleSelector';
import KeySelector from '../components/KeySelector';
import StaffDisplay from '../components/StaffDisplay';
import OctaveSelector from '../components/OctaveSelector';
import PracticeSession from '../components/PracticeSession';
import SessionList from '../components/SessionList';
import { getSessions } from '../data/practiceSessions';

export default function Home() {
  const [selectedScale, setSelectedScale] = useState('major');
  const [selectedKey, setSelectedKey] = useState('C');
  const [selectedOctaves, setSelectedOctaves] = useState(4);
  const [sessions, setSessions] = useState([]);

  // Load preferences and sessions from localStorage on mount
  useEffect(() => {
    const savedScale = localStorage.getItem('selectedScale');
    const savedKey = localStorage.getItem('selectedKey');
    const savedOctaves = localStorage.getItem('selectedOctaves');
    const savedSessions = getSessions();
    
    if (savedScale) setSelectedScale(savedScale);
    if (savedKey) setSelectedKey(savedKey);
    if (savedOctaves) setSelectedOctaves(Number(savedOctaves));
    setSessions(savedSessions);
  }, []);

  // Save preferences to localStorage when changed
  const handleScaleChange = (scale) => {
    setSelectedScale(scale);
    localStorage.setItem('selectedScale', scale);
  };

  const handleKeyChange = (key) => {
    setSelectedKey(key);
    localStorage.setItem('selectedKey', key);
  };

  const handleOctavesChange = (octaves) => {
    setSelectedOctaves(octaves);
    localStorage.setItem('selectedOctaves', octaves.toString());
  };

  // Handle practice session updates
  const handleSessionsUpdate = (updatedSessions) => {
    setSessions(updatedSessions);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Jazz Piano Scale Practice
        </h1>
        
        <div className="max-w-4xl mx-auto">
          {/* Scale Selection and Staff Display */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <ScaleSelector 
                selectedScale={selectedScale} 
                onScaleChange={handleScaleChange} 
              />
              <KeySelector 
                selectedKey={selectedKey} 
                onKeyChange={handleKeyChange} 
              />
              <OctaveSelector
                selectedOctaves={selectedOctaves}
                onOctavesChange={handleOctavesChange}
              />
            </div>
            
            <div className="mt-8">
              <StaffDisplay 
                selectedScale={selectedScale} 
                selectedKey={selectedKey}
                selectedOctaves={selectedOctaves}
              />
            </div>
          </div>

          {/* Practice Session Recording */}
          <PracticeSession
            selectedScale={selectedScale}
            selectedKey={selectedKey}
            selectedOctaves={selectedOctaves}
            onSessionSaved={handleSessionsUpdate}
          />

          {/* Practice History */}
          <SessionList
            sessions={sessions}
            onSessionsUpdate={handleSessionsUpdate}
          />
        </div>
      </main>
    </div>
  );
}
