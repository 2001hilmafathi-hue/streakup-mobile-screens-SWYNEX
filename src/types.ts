export interface Habit {
  id: string;
  name: string;
  icon: string;
  days: number[]; // 0 = Sunday ... 6 = Saturday
  createdAt: string; // ISO date
}

// habitId -> { 'YYYY-MM-DD': true }
export type Completions = Record<string, Record<string, true>>;

export interface Settings {
  theme: 'light' | 'dark';
  largeText: boolean;
  welcomed: boolean;
}

export type Route =
  | { name: 'today' }
  | { name: 'progress' }
  | { name: 'settings' }
  | { name: 'add' }
  | { name: 'edit'; id: string }
  | { name: 'detail'; id: string };
