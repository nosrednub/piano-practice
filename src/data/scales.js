export const jazzScales = [
  {
    id: 'major',
    name: 'Major Scale',
    description: 'The foundation of Western music, used extensively in jazz.',
    intervals: [0, 2, 4, 5, 7, 9, 11, 12], // Whole, Whole, Half, Whole, Whole, Whole, Half
    keyOffset: 0 // Starts on the key note (e.g., C in C major yep)
  },
  {
    id: 'dorian',
    name: 'Minor/Dorian Mode',
    description: 'Minor scale with a raised 6th, common in modal jazz.',
    intervals: [0, 2, 3, 5, 7, 9, 10, 12], // Whole, Half, Whole, Whole, Whole, Half, Whole
    keyOffset: 2 // Starts on the second degree (e.g., D in C major)
  },
  {
    id: 'mixolydian',
    name: 'Mixolydian Mode',
    description: 'Major scale with a flatted 7th, essential for dominant chords.',
    intervals: [0, 2, 4, 5, 7, 9, 10, 12], // Whole, Whole, Half, Whole, Whole, Half, Whole
    keyOffset: 7 // Starts on the fifth degree (e.g., G in C major)
  },
  {
    id: 'bebop',
    name: 'Bebop Scale',
    description: 'Dominant scale with an added chromatic passing tone.',
    intervals: [0, 2, 4, 5, 7, 9, 10, 11, 12], // Major scale with added ♭7 and ♮7
    keyOffset: 7 // Starts on the fifth degree like mixolydian
  },
  {
    id: 'blues',
    name: 'Blues Scale',
    description: 'Minor pentatonic with added ♭5, fundamental to jazz and blues.',
    intervals: [0, 3, 5, 6, 7, 10, 12], // Minor pentatonic with added ♭5
    keyOffset: 0 // Traditionally starts on the key note
  },
  {
    id: 'altered',
    name: 'Altered Scale',
    description: 'Modified dominant scale used over altered dominant chords.',
    intervals: [0, 1, 3, 4, 6, 8, 10, 12], // Half, Whole, Half, Whole, Whole, Whole, Whole
    keyOffset: 7 // Typically used on the dominant
  },
  {
    id: 'diminished',
    name: 'Diminished Scale',
    description: 'Symmetrical scale alternating whole and half steps.',
    intervals: [0, 2, 3, 5, 6, 8, 9, 11, 12], // Whole, Half, Whole, Half, Whole, Half, Whole, Half
    keyOffset: 0 // Can start on the key note
  },
  {
    id: 'wholeTone',
    name: 'Whole Tone Scale',
    description: 'Symmetrical scale using only whole steps.',
    intervals: [0, 2, 4, 6, 8, 10, 12], // All whole steps
    keyOffset: 7 // Often used on the dominant
  }
];

// Key signatures with their semitone distances from C
export const keySignatures = [
  { id: 'C', name: 'C', transpose: 0, midiBase: 60 }, // Middle C
  { id: 'F', name: 'F', transpose: 5, midiBase: 65 }, // F above middle C
  { id: 'Bb', name: 'B♭', transpose: 10, midiBase: 59 }, // B♭ below middle C
  { id: 'Eb', name: 'E♭', transpose: 3, midiBase: 63 }, // E♭ above middle C
  { id: 'Ab', name: 'A♭', transpose: 8, midiBase: 57 }, // A♭ below middle C
  { id: 'Db', name: 'D♭', transpose: 1, midiBase: 61 }, // D♭ above middle C
  { id: 'Gb', name: 'G♭', transpose: 6, midiBase: 54 }, // G♭ below middle C
  { id: 'B', name: 'B', transpose: 11, midiBase: 59 }, // B below middle C
  { id: 'E', name: 'E', transpose: 4, midiBase: 64 }, // E above middle C
  { id: 'A', name: 'A', transpose: 9, midiBase: 57 }, // A below middle C
  { id: 'D', name: 'D', transpose: 2, midiBase: 62 }, // D above middle C
  { id: 'G', name: 'G', transpose: 7, midiBase: 55 }, // G below middle C
];