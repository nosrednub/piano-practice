const noteIntervals = {
  '1': 0,
  'b3': 3,
  '3': 4,
  '4': 5,
  'b5': 6,
  '5': 7,
  'b7': 10,
  '7': 11,
  'bb7': 9
};

const noteMap = {
  'C': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  'D': ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
  'E': ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
  'F': ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
  'G': ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
  'A': ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
  'B': ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#']
};

const transposeNote = (root, interval) => {
  const chromaticScale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const rootIndex = chromaticScale.indexOf(root);
  if (rootIndex === -1) return root;

  const targetIndex = (rootIndex + interval) % 12;
  return chromaticScale[targetIndex];
};

export const keyTones = {
  'C': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  'G': ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
  'D': ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
  'A': ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
  'E': ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
  'B': ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'],
  'F': ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
  'Bb': ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'],
  'Eb': ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'],
  'Ab': ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G'],
  'Db': ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'],
  'Gb': ['Gb', 'Ab', 'Bb', 'Cb', 'Db', 'Eb', 'F']
};

export const getChordNotes = (chord) => {
  if (!chord) return ['B/4'];

  const root = chord.charAt(0);
  const quality = chord.slice(1).toLowerCase();

  // Define chord voicings with semitone intervals from root
  const voicings = {
    'maj7': [0, 4, 7, 11],    // 1, 3, 5, 7
    '7': [0, 4, 7, 10],       // 1, 3, 5, b7
    'm7': [0, 3, 7, 10],      // 1, b3, 5, b7
    'm7b5': [0, 3, 6, 10],    // 1, b3, b5, b7
    'dim7': [0, 3, 6, 9],     // 1, b3, b5, bb7
  };

  const intervals = voicings[quality] || voicings['7'];
  const octave = 4;

  // Generate notes and ensure they're in ascending order
  const notes = intervals.map(interval => {
    const note = transposeNote(root, interval);
    return { note, interval };
  }).sort((a, b) => a.interval - b.interval)
    .map(({ note }) => `${note}/${octave}`);

  console.log(`Generated notes for ${chord}:`, notes);
  return notes;
};

export const transposeChord = (chord, fromKey, toKey) => {
  if (!chord || !fromKey || !toKey) {
    console.warn('Invalid parameters for transposeChord:', { chord, fromKey, toKey });
    return chord;
  }

  const root = chord.charAt(0);
  const quality = chord.slice(1);

  if (!keyTones[fromKey] || !keyTones[toKey]) {
    console.warn('Invalid key for transposition:', { fromKey, toKey });
    return chord;
  }

  try {
    const fromScale = keyTones[fromKey];
    const toScale = keyTones[toKey];
    const rootIndex = fromScale.indexOf(root);
    
    if (rootIndex === -1) {
      console.warn(`Root note ${root} not found in key ${fromKey}`);
      return chord;
    }

    const newRoot = toScale[rootIndex];
    return newRoot + quality;
  } catch (error) {
    console.error('Error transposing chord:', error);
    return chord;
  }
};