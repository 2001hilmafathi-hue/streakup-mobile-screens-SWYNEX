import { useState } from 'react';
import type { Habit } from '../types';
import { ALL_DAYS, DAY_LETTERS, DAY_NAMES, WEEKDAYS } from '../dates';
import { BackIcon } from '../components/Icons';

const ICONS = ['💧', '📖', '🏃', '🧘', '🥗', '💤', '✍️', '🎸', '🧹', '💊', '🚶', '🌱'];

interface Props {
  habit?: Habit;
  onSave: (data: Pick<Habit, 'name' | 'icon' | 'days'>) => void;
  onDelete?: () => void;
  onCancel: () => void;
}

export function HabitForm({ habit, onSave, onDelete, onCancel }: Props) {
  const [name, setName] = useState(habit?.name ?? '');
  const [icon, setIcon] = useState(habit?.icon ?? ICONS[0]);
  const [days, setDays] = useState<number[]>(habit?.days ?? ALL_DAYS);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const toggleDay = (d: number) =>
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError('Give your habit a name.');
    if (days.length === 0) return setError('Pick at least one day.');
    onSave({ name: name.trim(), icon, days });
  };

  const same = (a: number[], b: number[]) => a.length === b.length && b.every((x) => a.includes(x));

  return (
    <main className="screen">
      <header className="bar">
        <button className="icon-btn" onClick={onCancel} aria-label="Cancel"><BackIcon /></button>
        <h1 className="bar__title">{habit ? 'Edit habit' : 'New habit'}</h1>
      </header>

      <form className="form" onSubmit={submit} noValidate>
        <label className="field">
          <span className="field__label">Name</span>
          <input
            className="input"
            value={name}
            maxLength={40}
            placeholder="e.g. Read 20 pages"
            onChange={(e) => { setName(e.target.value); setError(''); }}
          />
        </label>

        <fieldset className="field">
          <legend className="field__label">Icon</legend>
          <div className="icons">
            {ICONS.map((i) => (
              <button type="button" key={i} aria-pressed={icon === i}
                className={`icon-opt ${icon === i ? 'icon-opt--on' : ''}`} onClick={() => setIcon(i)}>
                {i}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="field">
          <legend className="field__label">Repeat</legend>
          <div className="segment">
            <button type="button" className={same(days, ALL_DAYS) ? 'on' : ''} onClick={() => setDays(ALL_DAYS)}>Every day</button>
            <button type="button" className={same(days, WEEKDAYS) ? 'on' : ''} onClick={() => setDays(WEEKDAYS)}>Weekdays</button>
          </div>
          <div className="days">
            {DAY_LETTERS.map((l, d) => (
              <button type="button" key={d} aria-pressed={days.includes(d)} aria-label={DAY_NAMES[d]}
                className={`day ${days.includes(d) ? 'day--on' : ''}`} onClick={() => toggleDay(d)}>
                {l}
              </button>
            ))}
          </div>
        </fieldset>

        {error && <p className="error" role="alert">{error}</p>}

        <button className="btn btn--primary" type="submit">{habit ? 'Save changes' : 'Add habit'}</button>

        {habit && onDelete && (
          confirmDelete ? (
            <div className="confirm">
              <p>Delete this habit and its history?</p>
              <button type="button" className="btn btn--danger" onClick={onDelete}>Yes, delete</button>
              <button type="button" className="btn btn--ghost" onClick={() => setConfirmDelete(false)}>Keep it</button>
            </div>
          ) : (
            <button type="button" className="btn btn--ghost btn--warn" onClick={() => setConfirmDelete(true)}>Delete habit</button>
          )
        )}
      </form>
    </main>
  );
}
