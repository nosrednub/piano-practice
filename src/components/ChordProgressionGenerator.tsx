import React, { useState } from 'react';
import KeySelector from './KeySelector';

interface ChordProgressions {
  'ii-V-I': { major: string[]; minor: string[] };
  'blues': { major: string[]; minor: string[] };
  'rhythm-changes': { major: string[]; minor: string[] };
  'autumn-leaves': { major: string[]; minor: string[] };
}

const ChordProgressionGenerator: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<string>('C');
  const [keyType, setKeyType] = useState<'major' | 'minor'>('major');
  const [progressionType, setProgressionType] = useState<keyof ChordProgressions>('ii-V-I');
  const [chordProgression, setChordProgression] = useState<string[]>([]);
  const [tempo, setTempo] = useState<number>(120);

  const handleKeyChange = (key: string) => {
    setSelectedKey(key);
  };

  const handleProgressionTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setProgressionType(event.target.value as keyof ChordProgressions);
    handleGenerateProgression();
  };

  const handleTempoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTempo(Number(event.target.value));
  };

  const handleGenerateProgression = () => {
    const chords = generateChordProgression(selectedKey, keyType, progressionType);
    setChordProgression(chords);
  };

  const chordProgressions: ChordProgressions = {
    'ii-V-I': {
      major: ['Dm7', 'G7', 'CMaj7'],
      minor: ['Dm7b5', 'G7', 'Cm7'],
    },
    'blues': {
      major: ['C7', 'F7', 'C7', 'C7', 'F7', 'F7', 'C7', 'C7', 'G7', 'F7', 'C7', 'G7'],
      minor: ['Cm7', 'Fm7', 'Cm7', 'Cm7', 'Fm7', 'Fm7', 'Cm7', 'Cm7', 'Gm7', 'Fm7', 'Cm7', 'Gm7'],
    },
    'rhythm-changes': {
      major: ['CMaj7', 'A7', 'Dm7', 'G7', 'CMaj7', 'A7', 'Dm7', 'G7', 'Dm7', 'G7', 'CMaj7', 'CMaj7'],
      minor: ['Cm7', 'Eb7', 'Dm7b5', 'G7', 'Cm7', 'Eb7', 'Dm7b5', 'G7', 'Dm7b5', 'G7', 'Cm7', 'Cm7'],
    },
    'autumn-leaves': {
      major: ['Dm7', 'G7', 'CMaj7', 'Am7', 'Dm7', 'G7', 'CMaj7', ''],
      minor: ['Dm7b5', 'G7', 'Cm7', 'AbMaj7', 'Dm7b5', 'G7', 'Cm7', ''],
    },
  };

  const generateChordProgression = (key: string, keyType: 'major' | 'minor', progressionType: keyof ChordProgressions) => {
    const romanToChord = {
      'i': 'm',
      'ii': 'm',
      'iii': 'm',
      'iv': 'm',
      'v': '',
      'vi': 'm',
      'vii': 'dim',
      'I': 'maj',
      'II': 'maj',
      'III': 'maj',
      'IV': 'maj',
      'V': 'dom',
      'VI': 'maj',
      'VII': 'dim',
    };

    const keyTones = {
      'C': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
      'D': ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
      'E': ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
      'F': ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
      'G': ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
      'A': ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
      'B': ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'],
    };

    const progression = chordProgressions[progressionType]?.[keyType] || [];
    return progression;
  };

  return (
    <>
      <h2>Chord Progression Generator</h2>
      <KeySelector selectedKey={selectedKey} onKeyChange={handleKeyChange} />

      <div>
        <label htmlFor="progression-type">Progression Type:</label>
        <select id="progression-type" value={progressionType} onChange={handleProgressionTypeChange}>
          <option value="">Select Progression</option>
          <option value="ii-V-I">ii-V-I</option>
          <option value="blues">Blues</option>
          <option value="rhythm-changes">Rhythm Changes</option>
          <option value="autumn-leaves">Autumn Leaves</option>
        </select>
      </div>

      <div>
        <label htmlFor="tempo">Tempo (BPM):</label>
        <input type="number" id="tempo" value={tempo} onChange={handleTempoChange} />
      </div>
      
      <div>
        <h3>Chord Progression:</h3>
        <p>{chordProgression.join(' | ')}</p>
      </div>
    </>
  );
};

export default ChordProgressionGenerator;