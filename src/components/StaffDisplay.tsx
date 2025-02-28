import React, { useEffect, useRef } from 'react';
import { Factory, Voice, StaveNote } from 'vexflow';
import { jazzScales } from '@/data/scales';

interface StaffDisplayProps {
  selectedScale: string;
  selectedKey: string;
  selectedOctaves: number;
}

const StaffDisplay: React.FC<StaffDisplayProps> = ({ 
  selectedScale, 
  selectedKey, 
  selectedOctaves 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
  
    console.log('Props received:', {
      selectedKey,
      selectedScale,
      selectedOctaves
    });

    try {
      // Clear previous content
      containerRef.current.innerHTML = '';
  
      // Initialize VexFlow
      const vf = new Factory({
        elementId: containerRef.current.id,
        renderer: {
          elementId: containerRef.current.id,
          width: 800,
          height: 200,
        }
      });
  
      // Create a system
      const system = vf.System({
        x: 40,
        y: 40,
        width: 700,
        spaceBetweenStaves: 10
      });
  
      // Generate notes
      const notes = generateScaleNotes(selectedKey, selectedScale, selectedOctaves);
      
      if (notes.length === 0) {
        throw new Error('No valid notes generated');
      }
  
      // Create voice and add notes
      const voice = vf.Voice().setStrict(false);
      voice.addTickables(notes);
  
      // Create a stave
      const stave = system.addStave({
        voices: [voice]
      }).addClef('treble')
        .addTimeSignature('4/4')
        .addKeySignature(selectedKey);
  
      // Draw everything
      vf.draw();
    } catch (error) {
      console.error('Error rendering staff:', error);
      if (containerRef.current) {
        containerRef.current.innerHTML = 'Error rendering music notation';
      }
    }
  }, [selectedScale, selectedKey, selectedOctaves]);

  return (
    <div 
    ref={containerRef}
    id="staff-display"
    data-testid="staff-display"
    className="staff-container bg-white dark:bg-white p-4 rounded-lg shadow-sm"
  />
  );
};

const NOTE_MAP = {
  'C': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  'G': ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
  'D': ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
  'A': ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
  'E': ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
  'B': ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'],
  'F#': ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#'],
  'F': ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
  'Bb': ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'],
  'Eb': ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'],
  'Ab': ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G'],
  'Db': ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'],
  'Gb': ['Gb', 'Ab', 'Bb', 'Cb', 'Db', 'Eb', 'F']
};

// Update SCALE_PATTERNS to include bebop
const SCALE_PATTERNS = {
  'major': [0, 2, 4, 5, 7, 9, 11],
  'dorian': [0, 2, 3, 5, 7, 9, 10],
  'mixolydian': [0, 2, 4, 5, 7, 9, 10],
  'bebop': [0, 2, 4, 5, 7, 9, 10, 11],
  'blues': [0, 3, 5, 6, 7, 10],
  'altered': [0, 1, 3, 4, 6, 8, 10],
  'diminished': [0, 2, 3, 5, 6, 8, 9, 11],
  'wholeTone': [0, 2, 4, 6, 8, 10]
};
// Update the generateScaleNotes function with better debugging
function generateScaleNotes(key: string, scale: string, octaves: number) {
  try {
    const notes = [];
    const baseNotes = NOTE_MAP[key];
    const scalePattern = SCALE_PATTERNS[scale];
    const startOctave = 4;
    
    console.log('Generating scale with:', {
      key,
      scale,
      baseNotes,
      scalePattern
    });

    for (let octave = 0; octave < octaves; octave++) {
      const currentOctave = startOctave + octave;
      
      // Map intervals directly to scale degrees
      const degreeMap = {
        0: 0,  // root
        2: 1,  // second
        3: 2,  // minor third
        4: 2,  // major third
        5: 3,  // fourth
        6: 3,  // tritone
        7: 4,  // fifth
        8: 5,  // minor sixth
        9: 5,  // major sixth
        10: 6, // minor seventh
        11: 6  // major seventh
      };
      
      scalePattern.forEach((interval) => {
        const noteIndex = degreeMap[interval];
        const octaveOffset = Math.floor(interval / 12);
        const note = baseNotes[noteIndex];
        const noteOctave = currentOctave + octaveOffset;
        const noteKey = `${note}/${noteOctave}`;
        
        try {
          const staveNote = new StaveNote({
            keys: [noteKey],
            duration: 'q'
          });
          notes.push(staveNote);
          console.log(`Created note: ${noteKey} (scale degree: ${noteIndex + 1})`);
        } catch (noteError) {
          console.error(`Failed to create note ${noteKey}:`, noteError);
        }
      });
    }

    return notes;
  } catch (error) {
    console.error('Fatal error in generateScaleNotes:', error);
    return [];
  }
}

// Add the export statement
export default StaffDisplay;