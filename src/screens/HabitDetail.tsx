import type { Completions, Habit } from '../types';
import {
  addDays, bestStreak, currentStreak, DAY_LETTERS, describeDays, isDone, isScheduled, rate, startOfDay,
} from '../dates';
import { BackIcon, CheckIcon } from '../components/Icons';

interface Props {
  habit: Habit;
  completions: Completions;
  today: Date;
  toggle: (id: string, day: Date) => void;
  onBack: () => void;
  onEdit: () => void;
}

export function HabitDetail({ habit, completions, today, toggle, onBack, onEdit }: Props) {
  const streak = currentStreak(habit, completions, today);
  const best = bestStreak(habit, completions, today);
  const r = rate(habit, completions, today, 30);
  const created = startOfDay(new Date(habit.createdAt));

  // Five weeks, ending with the week that contains today (Sunday-first).
  const start = addDays(today, -today.getDay() - 28);
  const cells = Array.from({ length: 35 }, (_, i) => addDays(start, i));

  return (
    <main className="screen">
      <header className="bar">
        <button className="icon-btn" onClick={onBack} aria-label="Back"><BackIcon /></button>
        <h1 className="bar__title">{habit.name}</h1>
        <button className="link-btn" onClick={onEdit}>Edit</button>
      </header>

      <div className="detail-hero">
        <span className="detail-hero__icon" aria-hidden="true">{habit.icon}</span>
        <p className="muted">{describeDays(habit.days)}</p>
      </div>

      <section className="stats" aria-label="Statistics">
        <div className="stat stat--hero"><b>{streak}</b><span>day streak</span></div>
        <div className="stat"><b>{best}</b><span>best streak</span></div>
        <div className="stat"><b>{r.pct}%</b><span>last 30 days</span></div>
      </section>

      <section>
        <h2 className="h2">Last five weeks</h2>
        <div className="cal" role="grid" aria-label="Completion calendar">
          {DAY_LETTERS.map((l, i) => <span key={i} className="cal__head">{l}</span>)}
          {cells.map((d) => {
            const future = d > today;
            const before = d < created;
            const sched = isScheduled(habit, d);
            const done = isDone(completions, habit.id, d);
            const disabled = future || before || !sched;
            const label = `${d.toDateString()}${done ? ', done' : sched ? ', not done' : ', not scheduled'}`;
            return (
              <button
                key={d.toISOString()}
                className={`cell ${done ? 'cell--done' : ''} ${sched && !future && !before && !done ? 'cell--miss' : ''} ${future || before ? 'cell--void' : ''}`}
                disabled={disabled}
                aria-label={label}
                onClick={() => toggle(habit.id, d)}
              >
                {done ? <CheckIcon size={16} /> : d.getDate()}
              </button>
            );
          })}
        </div>
        <p className="muted small">Tap a past day to fix a missed check-in.</p>
      </section>
    </main>
  );
}
