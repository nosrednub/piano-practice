import React, { useEffect, useRef } from 'react';
import { Factory, Voice, StaveNote } from 'vexflow';

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
  console.group('generateScaleNotes Debug');
  try {
    // Validate inputs
    console.log('Input validation:', {
      key: `${key} (${typeof key})`,
      scale: `${scale} (${typeof scale})`,
      octaves: `${octaves} (${typeof octaves})`
    });

    // Check if key exists
    if (!NOTE_MAP[key]) {
      throw new Error(`Invalid key: ${key}. Available keys: ${Object.keys(NOTE_MAP).join(', ')}`);
    }

    // Check if scale exists
    if (!SCALE_PATTERNS[scale]) {
      throw new Error(`Invalid scale: ${scale}. Available scales: ${Object.keys(SCALE_PATTERNS).join(', ')}`);
    }

    // Check octaves
    if (octaves < 1 || octaves > 8) {
      throw new Error(`Invalid octave count: ${octaves}. Must be between 1 and 8`);
    }

    const notes = [];
    const baseNotes = NOTE_MAP[key];
    const startOctave = 4;

    console.log('Using base notes:', baseNotes);
    console.log('Starting octave:', startOctave);

    for (let octave = 0; octave < octaves; octave++) {
      const currentOctave = startOctave + octave;
      console.log(`Processing octave ${currentOctave}`);

      baseNotes.forEach((note, index) => {
        const noteKey = `${note}/${currentOctave}`;
        try {
          const staveNote = new StaveNote({
            keys: [noteKey],
            duration: 'q'
          });
          notes.push(staveNote);
          console.log(`✓ Created note: ${noteKey}`);
        } catch (noteError) {
          console.error(`✗ Failed to create note ${noteKey}:`, noteError);
        }
      });
    }

    console.log(`Successfully generated ${notes.length} notes`);
    return notes;

  } catch (error) {
    console.error('Fatal error in generateScaleNotes:', error);
    return [];
  } finally {
    console.groupEnd();
  }
}

// Add the export statement
export default StaffDisplay;