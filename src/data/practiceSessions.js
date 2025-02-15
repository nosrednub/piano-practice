// Default practice durations in minutes
export const defaultDurations = [5, 10, 15, 20, 30, 45, 60];

// Default practice descriptions based on scale type
export const defaultDescriptions = {
  major: "Practice major scale patterns ascending and descending",
  dorian: "Focus on Dorian mode applications in jazz solos",
  mixolydian: "Work on dominant chord applications",
  bebop: "Practice bebop scale with chromatic passing tones",
  blues: "Blues scale patterns and licks",
  altered: "Altered scale over dominant chords",
  diminished: "Diminished scale patterns in all keys",
  wholeTone: "Whole tone scale in harmonic contexts"
};

// Helper function to generate a default description
export function generateDefaultDescription(scale, key, octaves) {
  const baseDescription = defaultDescriptions[scale] || "Practice scale patterns";
  return `${baseDescription} in ${key} through ${octaves} octaves`;
}

// Session storage key
export const STORAGE_KEY = 'jazz-practice-sessions';

// Helper functions for local storage
export function getSessions() {
  if (typeof window === 'undefined') return [];
  const sessions = localStorage.getItem(STORAGE_KEY);
  return sessions ? JSON.parse(sessions) : [];
}

export function saveSession(session) {
  const sessions = getSessions();
  sessions.push({
    ...session,
    id: Date.now(), // Use timestamp as unique ID
    createdAt: new Date().toISOString()
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  return sessions;
}

export function updateSession(sessionId, updatedData) {
  const sessions = getSessions();
  const index = sessions.findIndex(s => s.id === sessionId);
  if (index !== -1) {
    sessions[index] = { ...sessions[index], ...updatedData };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }
  return sessions;
}

export function deleteSession(sessionId) {
  const sessions = getSessions().filter(s => s.id !== sessionId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  return sessions;
}