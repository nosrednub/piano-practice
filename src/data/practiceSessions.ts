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

export interface PracticeSession {
  id: string;
  scale: string;
  key: string;
  octaves: number;
  duration: number;
  description: string;
  date: string;
  createdAt: string;
}

// Helper function to generate a default description
export function generateDefaultDescription(scale: string, key: string, octaves: number): string {
  const baseDescription = defaultDescriptions[scale as keyof typeof defaultDescriptions] || "Practice scale patterns";
  return `${baseDescription} in ${key} through ${octaves} octaves`;
}

// Session storage key
export const STORAGE_KEY = 'jazz-practice-sessions';

// Helper functions for local storage
export function getSessions(): PracticeSession[] {
  if (typeof window === 'undefined') return [];
  const sessions = localStorage.getItem(STORAGE_KEY);
  return sessions ? JSON.parse(sessions) : [];
}

interface NewPracticeSessionInput {
  scale: string;
  key: string;
  octaves: number;
  duration: number;
  description: string;
  date: string;
}

export function saveSession(session: NewPracticeSessionInput): PracticeSession[] {
  const sessions = getSessions();
  const newSession: PracticeSession = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    ...session
  };
  sessions.push(newSession);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  return sessions;
}

export function updateSession(sessionId: string, updatedData: Partial<PracticeSession>): PracticeSession[] {
  const sessions = getSessions();
  const index = sessions.findIndex(s => s.id === sessionId);
  if (index !== -1) {
    const sessionToUpdate = sessions[index]!; // Non-null assertion here
    const updatedSession: PracticeSession = {
      id: sessionToUpdate.id, // Keep the existing ID
      scale: updatedData.scale !== undefined ? updatedData.scale : sessionToUpdate.scale,
      key: updatedData.key !== undefined ? updatedData.key : sessionToUpdate.key,
      octaves: updatedData.octaves !== undefined ? updatedData.octaves : sessionToUpdate.octaves,
      duration: updatedData.duration !== undefined ? updatedData.duration : sessionToUpdate.duration,
      description: updatedData.description !== undefined ? updatedData.description : sessionToUpdate.description,
      date: updatedData.date !== undefined ? updatedData.date : sessionToUpdate.date,
      createdAt: sessionToUpdate.createdAt, // Keep the original createdAt
    };
    sessions[index] = updatedSession;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }
  return sessions;
}

export function deleteSession(sessionId: string): PracticeSession[] {
  const sessions = getSessions().filter(s => s.id !== sessionId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  return sessions;
}