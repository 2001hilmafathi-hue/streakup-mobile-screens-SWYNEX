import type { Completions, Habit } from './types';

export const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];
export const WEEKDAYS = [1, 2, 3, 4, 5];
export const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const addDays = (d: Date, n: number) => {
  const c = startOfDay(d);
  c.setDate(c.getDate() + n);
  return c;
};

export const dateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const isScheduled = (h: Habit, d: Date) => h.days.includes(d.getDay());

export const isDone = (c: Completions, id: string, d: Date) => Boolean(c[id]?.[dateKey(d)]);

const createdDay = (h: Habit) => startOfDay(new Date(h.createdAt));

/** Consecutive scheduled days completed, ending today (or yesterday if today is still open). */
export function currentStreak(h: Habit, c: Completions, today: Date): number {
  const created = createdDay(h);
  let streak = 0;
  for (let i = 0; i < 730; i++) {
    const d = addDays(today, -i);
    if (d < created) break;
    if (!isScheduled(h, d)) continue;
    if (isDone(c, h.id, d)) streak++;
    else if (i === 0) continue; // today not done yet: streak is still alive
    else break;
  }
  return streak;
}

export function bestStreak(h: Habit, c: Completions, today: Date): number {
  let best = 0;
  let run = 0;
  for (let d = createdDay(h); d <= today; d = addDays(d, 1)) {
    if (!isScheduled(h, d)) continue;
    if (isDone(c, h.id, d)) {
      run++;
      best = Math.max(best, run);
    } else if (dateKey(d) !== dateKey(today)) {
      run = 0;
    }
  }
  return best;
}

/** Completed vs. scheduled days over the last `days` days (not before the habit existed). */
export function rate(h: Habit, c: Completions, today: Date, days: number) {
  const created = createdDay(h);
  let done = 0;
  let total = 0;
  for (let i = 0; i < days; i++) {
    const d = addDays(today, -i);
    if (d < created || !isScheduled(h, d)) continue;
    total++;
    if (isDone(c, h.id, d)) done++;
  }
  return { done, total, pct: total === 0 ? 0 : Math.round((done / total) * 100) };
}

export function describeDays(days: number[]): string {
  if (days.length === 7) return 'Every day';
  if (days.length === 5 && WEEKDAYS.every((d) => days.includes(d))) return 'Weekdays';
  return [...days].sort().map((d) => DAY_NAMES[d]).join(', ');
}

export const formatLong = (d: Date) =>
  d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
