import { useEffect, useState } from 'react';
import type { Completions, Habit, Settings } from './types';
import { addDays, dateKey, ALL_DAYS, WEEKDAYS } from './dates';

/** useState that mirrors its value into localStorage. */
export function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or blocked: keep working in memory */
    }
  }, [key, value]);
  return [value, setValue] as const;
}

export const defaultSettings: Settings = { theme: 'light', largeText: false, welcomed: false };

/** Three sample habits with two weeks of history so the Progress screen has something to show. */
export function sampleData(today: Date): { habits: Habit[]; completions: Completions } {
  const created = addDays(today, -14).toISOString();
  const habits: Habit[] = [
    { id: 'sample-water', name: 'Drink 2L of water', icon: '💧', days: ALL_DAYS, createdAt: created },
    { id: 'sample-read', name: 'Read 20 pages', icon: '📖', days: ALL_DAYS, createdAt: created },
    { id: 'sample-run', name: 'Go for a run', icon: '🏃', days: WEEKDAYS, createdAt: created },
  ];
  const completions: Completions = {};
  habits.forEach((h, hi) => {
    completions[h.id] = {};
    for (let i = 1; i <= 13; i++) {
      const d = addDays(today, -i);
      const skip = hi === 0 ? i === 6 : hi === 1 ? i % 4 === 0 : i % 3 === 0;
      if (h.days.includes(d.getDay()) && !skip) completions[h.id][dateKey(d)] = true;
    }
  });
  return { habits, completions };
}
