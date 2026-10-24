import type { Completions, Habit, Route } from '../types';
import { currentStreak, formatLong, isDone, isScheduled } from '../dates';
import { CheckIcon, FlameIcon, PlusIcon } from '../components/Icons';
import { Ring } from '../components/Ring';

interface Props {
  habits: Habit[];
  completions: Completions;
  today: Date;
  toggle: (id: string, day: Date) => void;
  go: (r: Route) => void;
}

export function Today({ habits, completions, today, toggle, go }: Props) {
  const due = habits.filter((h) => isScheduled(h, today));
  const doneCount = due.filter((h) => isDone(completions, h.id, today)).length;
  const allDone = due.length > 0 && doneCount === due.length;

  return (
    <main className="screen">
      <header className="today-head">
        <div>
          <p className="muted">{formatLong(today)}</p>
          <h1 className="h1">{allDone ? 'All done for today' : 'Today'}</h1>
          <p className="muted">
            {due.length === 0 ? 'Nothing scheduled' : `${doneCount} of ${due.length} habits done`}
          </p>
        </div>
        <Ring done={doneCount} total={due.length} />
      </header>

      {habits.length === 0 ? (
        <div className="empty">
          <p className="empty__title">No habits yet</p>
          <p className="muted">Add one small habit you can do every day.</p>
          <button className="btn btn--primary" onClick={() => go({ name: 'add' })}>Add your first habit</button>
        </div>
      ) : due.length === 0 ? (
        <div className="empty">
          <p className="empty__title">Rest day</p>
          <p className="muted">None of your habits are scheduled for today.</p>
        </div>
      ) : (
        <ul className="list">
          {due.map((h) => {
            const done = isDone(completions, h.id, today);
            const streak = currentStreak(h, completions, today);
            return (
              <li key={h.id} className={`habit ${done ? 'habit--done' : ''}`}>
                <button className="habit__open" onClick={() => go({ name: 'detail', id: h.id })}>
                  <span className="habit__icon" aria-hidden="true">{h.icon}</span>
                  <span className="habit__text">
                    <span className="habit__name">{h.name}</span>
                    <span className="habit__streak">
                      <FlameIcon /> {streak} {streak === 1 ? 'day' : 'days'}
                    </span>
                  </span>
                </button>
                <button
                  className="check"
                  role="checkbox"
                  aria-checked={done}
                  aria-label={`${h.name}: mark ${done ? 'not done' : 'done'}`}
                  onClick={() => toggle(h.id, today)}
                >
                  {done && <CheckIcon size={28} />}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <button className="fab" aria-label="Add habit" onClick={() => go({ name: 'add' })}>
        <PlusIcon /> <span>Add habit</span>
      </button>
    </main>
  );
}
