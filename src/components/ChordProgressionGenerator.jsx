import React, { useState, useRef, useEffect } from 'react';
import KeySelector from './KeySelector';
import { Factory, StaveNote } from 'vexflow';
import { getChordNotes, keyTones, transposeChord } from '../utils/chordNotation';

const ChordProgressionGenerator = () => {
  const containerRef = useRef(null);
  const [selectedKey, setSelectedKey] = useState('C');
  const [keyType, setKeyType] = useState('major');
  const [progressionType, setProgressionType] = useState('ii-V-I');
  const [chordProgression, setChordProgression] = useState([]);
  const [tempo, setTempo] = useState(120);

  useEffect(() => {
    if (!containerRef.current || !chordProgression.length) return;
  
    containerRef.current.innerHTML = '';
  
    try {
      const vf = new Factory({
        renderer: {
          elementId: containerRef.current.id,
          width: 800,
          height: 200,
          background: '#ffffff'
        }
      });
  
      const system = vf.System({
        width: 750,
        x: 25,
        y: 40,
      });
  
      const score = vf.EasyScore();
  
      // Calculate duration based on number of chords
      const duration = (() => {
        switch (chordProgression.length) {
          case 1: return 'w';  // whole note
          case 2: return 'h';  // half note
          case 3: return 'q.'; // dotted quarter
          case 4: return 'q';  // quarter note
          default: return '8'; // eighth note
        }
      })();
  
      // Create notes with proper duration
      const staveNotes = chordProgression.map(chord => {
        if (!chord) {
          return new StaveNote({
            keys: ['b/4'],
            duration: duration + 'r' // Add 'r' for rest
          });
        }
        
        const notes = getChordNotes(chord);
        console.log('Rendering chord:', chord, 'notes:', notes);
        
        try {
          // Create chord using StaveNote directly
          const staveNote = new StaveNote({
            keys: notes,
            duration: duration
          });
          
          // Add chord name above the notes
          const annotation = new vf.Annotation(chord)
            .setFont('Arial', 14)
            .setJustification(vf.Annotation.Justify.CENTER)
            .setVerticalJustification(vf.Annotation.VerticalJustify.TOP);
          
          staveNote.addModifier(annotation);
          return staveNote;
        } catch (noteError) {
          console.error(`Failed to create chord ${chord}:`, noteError);
          return new StaveNote({
            keys: ['b/4'],
            duration: duration + 'r'
          });
        }
      });
  
      // Create voice with complete measure
      const voice = score.voice(staveNotes, { time: '4/4' }).setStrict(false);
  
      system
        .addStave({
          voices: [voice]
        })
        .addClef('treble')
        .addTimeSignature('4/4');
  
      if (selectedKey !== 'C') {
        system.addKeySignature(selectedKey);
      }
  
      vf.draw();
      
    } catch (error) {
      console.error('VexFlow error:', error);
      console.log('Debug info:', {
        chordProgression,
        notesRendered: chordProgression.map(getChordNotes)
      });
      containerRef.current.innerHTML = `Error: ${error.message}`;
    }
  }, [chordProgression, selectedKey]);

  const handleKeyChange = (key) => {
    setSelectedKey(key);
  };

  const handleProgressionTypeChange = (event) => {
    setProgressionType(event.target.value);
    handleGenerateProgression();
  };

  const handleTempoChange = (event) => {
    setTempo(Number(event.target.value));
  };

  const handleGenerateProgression = () => {
    if (!selectedKey || !keyType || !progressionType) {
      console.warn('Missing required parameters:', { selectedKey, keyType, progressionType });
      return;
    }
  
    const chords = generateChordProgression(selectedKey, keyType, progressionType);
    if (chords.length > 0) {
      setChordProgression(chords);
    } else {
      console.warn('No chords generated for:', { selectedKey, keyType, progressionType });
    }
  };

  const chordProgressions = {
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

  const generateChordProgression = (key, keyType, progressionType) => {
    const progression = chordProgressions[progressionType]?.[keyType] || [];
    
    // If the key is C, return progression as is
    if (key === 'C') return progression;

    // Otherwise transpose the progression
    return progression.map(chord => {
      if (!chord) return chord; // Handle empty chord slots
      return transposeChord(chord, 'C', key);
    });
  };

  return (
    <div className="p-4">
      <h2>Chord Progression Generator</h2>
      <KeySelector selectedKey={selectedKey} onKeyChange={handleKeyChange} />

      <div 
        ref={containerRef}
        id="chord-progression-display"
        className="staff-container bg-white dark:bg-white p-4 rounded-lg shadow-sm min-h-[200px]"
      />

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
    </div>
  );
};

export default ChordProgressionGenerator;