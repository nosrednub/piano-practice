'use client';

import { useEffect, useRef } from 'react';
import { Factory, Voice, Formatter } from 'vexflow';
import { jazzScales, keySignatures, noteStrings } from '../data/scales';

export default function StaffDisplay({ selectedScale, selectedKey, selectedOctaves }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous content
    containerRef.current.innerHTML = '';

    try {
      // Initialize VexFlow with dynamic height based on octaves
      const vf = new Factory({
        renderer: { 
          elementId: containerRef.current, 
          width: 800, 
          height: Math.max(200, selectedOctaves * 50 + 100)
        }
      });

      const context = vf.getContext();
      const stave = vf.Stave({ x: 10, y: 40, width: 750 })
        .addClef('treble')
        .addTimeSignature('4/4')
        .addKeySignature(selectedKey);

      // Get the selected scale and key information
      const scale = jazzScales.find(s => s.id === selectedScale);
      const key = keySignatures.find(k => k.id === selectedKey);
      
      if (!scale || !key) return;

      // Calculate the starting note
      const keyBase = key.midiBase; // Base note for the key (e.g., middle C = 60)
      const scaleStart = keyBase + scale.keyOffset; // Apply scale degree offset
      
      // Generate notes for the selected number of octaves
      const notes = [];
      
      // Generate ascending notes
      const ascendingNotes = [];
      
      // Generate ascending pattern
      for (let octave = 0; octave < selectedOctaves; octave++) {
        // For each octave, calculate the starting note
        const octaveStart = scaleStart + (octave * 12);
        
        // Add notes for this octave
        scale.intervals.forEach((interval, index) => {
          // Skip root notes at octave boundaries except first octave and last note
          if (index === 0 && octave > 0) return;
          
          const noteValue = octaveStart + interval;
          ascendingNotes.push(noteValue);
        });
      }
      
      // Add the final root note at the top octave
      ascendingNotes.push(scaleStart + (selectedOctaves * 12));
      
      // Generate descending notes
      const descendingNotes = [...ascendingNotes]
        .reverse()
        .slice(1, -1); // Remove first and last notes to avoid repetition
      
      // Combine ascending and descending patterns
      const allNotes = [...ascendingNotes, ...descendingNotes];
      
      // Convert MIDI notes to VexFlow notes
      const vexflowNotes = allNotes.map(midiNote => {
        // Get the note name in the correct format for VexFlow
        const noteName = midiToNoteName(midiNote, key.name);
        return vf.StaveNote({ keys: [noteName], duration: 'q' });
      });

      // Create a voice and add notes to it
      const voice = new Voice({ num_beats: vexflowNotes.length, beat_value: 4 });
      voice.addTickables(vexflowNotes);

      // Format and justify the notes
      new Formatter()
        .joinVoices([voice])
        .format([voice], 700);

      // Render the stave and notes
      stave.setContext(context).draw();
      voice.draw(context, stave);

    } catch (error) {
      console.error('Error rendering staff:', error);
    }
  }, [selectedScale, selectedKey, selectedOctaves]);

  return (
    <div 
      ref={containerRef}
      data-testid="staff-display"
      className="w-full overflow-x-auto bg-white dark:bg-gray-800 p-4 rounded-lg shadow-inner"
    />
  );
}

// Helper function to convert MIDI note numbers to note names
function midiToNoteName(midi, keySignature = 'C') {
  // Define both sharp and flat note names
  const sharpNoteNames = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
  const flatNoteNames = ['c', 'db', 'd', 'eb', 'e', 'f', 'gb', 'g', 'ab', 'a', 'bb', 'b'];

  // Define key signatures that use flats
  const flatKeys = ['F', 'B♭', 'E♭', 'A♭', 'D♭', 'G♭', 'C♭'];
  
  // Calculate the note index and octave
  const noteIndex = midi % 12;
  const octave = Math.floor(midi / 12) - 1;

  // Choose whether to use sharp or flat notes based on key signature
  const noteNames = flatKeys.includes(keySignature) ? flatNoteNames : sharpNoteNames;
  const note = noteNames[noteIndex];

  return `${note}/${octave}`;
}