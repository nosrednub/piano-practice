'use client';

import { useState, useEffect } from 'react';
import ScaleSelector from '../components/ScaleSelector';
import KeySelector from '../components/KeySelector';
import StaffDisplay from '../components/StaffDisplay';
import ChordProgressionGenerator from '../components/ChordProgressionGenerator';
import OctaveSelector from '../components/OctaveSelector';
import PracticeSession from '../components/PracticeSession';
import MidiInputHandler from '../components/MidiInputHandler';
import SessionList from '../components/SessionList';
import { getSessions } from '../data/practiceSessions';

export default function Home() {
  // Initialize with default values
  const [selectedScale, setSelectedScale] = useState<string>('major');
  const [selectedKey, setSelectedKey] = useState<string>('C');
  const [selectedOctaves, setSelectedOctaves] = useState<number>(4);
  const [sessions, setSessions] = useState<any[]>([]); // Type sessions as any[] for now
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'scales' | 'chords'>('scales'); // State for active tab

  // Load preferences once on mount
  useEffect(() => {
    const savedScale = localStorage.getItem('selectedScale');
    const savedKey = localStorage.getItem('selectedKey');
    const savedOctaves = localStorage.getItem('selectedOctaves');
    const savedSessions = getSessions();
    
    let updates: any = {};
    if (savedScale) updates.scale = savedScale;
    if (savedKey) updates.key = savedKey;
    if (savedOctaves) updates.octaves = Number(savedOctaves);
    
    // Batch updates together
    if (savedScale) setSelectedScale(savedScale);
    if (savedKey) setSelectedKey(savedKey);
    if (savedOctaves) setSelectedOctaves(Number(savedOctaves));
    setSessions(savedSessions);
    setIsLoaded(true);
  }, []);

  // Event handlers
  const handleScaleChange = (scale: string) => {
    setSelectedScale(scale);
    localStorage.setItem('selectedScale', scale);
  };

  const handleKeyChange = (key: string) => {
    setSelectedKey(key);
    localStorage.setItem('selectedKey', key);
  };

  const handleOctavesChange = (octaves: number) => {
    setSelectedOctaves(octaves);
    localStorage.setItem('selectedOctaves', octaves.toString());
  };

  const handleSessionsUpdate = (updatedSessions: any[]) => { // Type updatedSessions as any[] for now
    setSessions(updatedSessions);
  };

  const handleTabChange = (tab: 'scales' | 'chords') => {
    setActiveTab(tab);
  };

  // Don't render until client-side hydration is complete
  if (!isLoaded) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Jazz Piano Practice Tools
        </h1>

        {/* Tabs */}
        <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
          <ul className="flex -mb-px text-sm font-medium text-center">
            <li className="mr-2">
              <button
                className={`inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 ${activeTab === 'scales' ? 'border-blue-500 text-blue-500 dark:text-blue-500 active' : 'text-gray-500 dark:text-gray-400'}`}
                onClick={() => handleTabChange('scales')}
              >
                Scale Practice
              </button>
            </li>
            <li className="mr-2">
              <button
                className={`inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 ${activeTab === 'chords' ? 'border-blue-500 text-blue-500 dark:text-blue-500 active' : 'text-gray-500 dark:text-gray-400'}`}
                onClick={() => handleTabChange('chords')}
              >
                Chord Progression Generator
              </button>
            </li>
          </ul>
        </div>

        <div className="max-w-4xl mx-auto">
          {activeTab === 'scales' && (
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
              {/* <MidiInputHandler>
                {({ detectedNotes }) => (
                  <StaffDisplay
                    selectedScale={selectedScale}
                    selectedKey={selectedKey}
                    selectedOctaves={selectedOctaves}
                    detectedNotes={detectedNotes}
                  />
                )}
              </MidiInputHandler> */}
            </div>
          )}

          {activeTab === 'chords' && (
            <ChordProgressionGenerator />
          )}

          <PracticeSession
            selectedScale={selectedScale}
            selectedKey={selectedKey}
            selectedOctaves={selectedOctaves}
            onSessionSaved={handleSessionsUpdate}
          />

          <SessionList
            sessions={sessions}
            onSessionsUpdate={handleSessionsUpdate}
          />
        </div>
      </main>
    </div>
  );
}