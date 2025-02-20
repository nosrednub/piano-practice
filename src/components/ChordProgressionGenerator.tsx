import React from 'react';
import KeySelector from './KeySelector';

const ChordProgressionGenerator: React.FC = () => {
interface ChordProgressions {
  'ii-V-I': { major: string[]; minor: string[] };
  'blues': { major: string[]; minor: string[] };
  'rhythm-changes': { major: string[]; minor: string[] };
  'autumn-leaves': { major: string[]; minor: string[] };
}

  const [selectedKey, setSelectedKey] = React.useState('C'); // Default to C major
  const [keyType, setKeyType] = React.useState<'major' | 'minor'>('major');
  const [progressionType, setProgressionType] = React.useState<keyof ChordProgressions>('ii-V-I'); // Ensure progressionType is a key of ChordProgressions
  const [tempo, setTempo] = React.useState(120);
  const [chordProgression, setChordProgression] = React.useState<string[]>([]);

  const handleKeyChange = (key: string) => {
    setSelectedKey(key);
  };

  const handleKeyTypeChange = (newKeyType: 'major' | 'minor') => {
    setKeyType(newKeyType);
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

  const chordProgressions = {
    'ii-V-I': {
      major: ['Dm7', 'G7', 'CMaj7'], // Corrected chords for ii-V-I in C major
      minor: ['Dm7b5', 'G7', 'Cm7'], // Corrected chords for ii-V-I in C minor
    },
    'blues': {
      major: ['C7', 'F7', 'C7', 'C7', 'F7', 'F7', 'C7', 'C7', 'G7', 'F7', 'C7', 'G7'], // Blues in C major
      minor: ['Cm7', 'Fm7', 'Cm7', 'Cm7', 'Fm7', 'Fm7', 'Cm7', 'Cm7', 'Gm7', 'Fm7', 'Cm7', 'Gm7'], // Blues in C minor
    },
    'rhythm-changes': {
      major: ['CMaj7', 'A7', 'Dm7', 'G7', 'CMaj7', 'A7', 'Dm7', 'G7', 'Dm7', 'G7', 'CMaj7', 'CMaj7'], // Rhythm Changes in C major
      minor: ['Cm7', 'Eb7', 'Dm7b5', 'G7', 'Cm7', 'Eb7', 'Dm7b5', 'G7', 'Dm7b5', 'G7', 'Cm7', 'Cm7'], // Rhythm Changes in C minor
    },
    'autumn-leaves': {
      major: ['Dm7', 'G7', 'CMaj7', 'Am7', 'Dm7', 'G7', 'CMaj7', ''], // Autumn Leaves in C major
      minor: ['Dm7b5', 'G7', 'Cm7', 'AbMaj7', 'Dm7b5', 'G7', 'Cm7', ''], // Autumn Leaves in C minor
    },
  };


  const generateChordProgression = (key: string, keyType: 'major' | 'minor', progressionType: keyof ChordProgressions) => {
    const romanToChord = { // Basic roman numeral to chord mapping - needs to be expanded and improved
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

    const keyTones = { // Basic key to tones mapping - needs to be expanded for sharps/flats and minor keys
      'C': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
      'D': ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
      'E': ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
      'F': ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
      'G': ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
      'A': ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
      'B': ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'],
    };


    const progression = chordProgressions[progressionType]?.[keyType] || [];
    return progression; // Return the chord progression directly - transposition and key logic will be added later
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
        {/* <p>{chordProgression.join(' | ')}</p> */}
      </div>
      {/* UI elements will be added here */}
    </>
  );
};
export default ChordProgressionGenerator;