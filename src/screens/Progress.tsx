import type { Completions, Habit } from '../types';
import { addDays, DAY_NAMES, isDone, isScheduled, rate } from '../dates';

export function Progress({ habits, completions, today }: { habits: Habit[]; completions: Completions; today: Date }) {
  const week = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6)).map((d) => {
    const due = habits.filter((h) => isScheduled(h, d) && d >= new Date(new Date(h.createdAt).toDateString()));
    const done = due.filter((h) => isDone(completions, h.id, d)).length;
    return { d, total: due.length, done, pct: due.length ? Math.round((done / due.length) * 100) : 0 };
  });

  const overall = habits.reduce(
    (acc, h) => {
      const r = rate(h, completions, today, 30);
      return { done: acc.done + r.done, total: acc.total + r.total };
    },
    { done: 0, total: 0 },
  );
  const overallPct = overall.total ? Math.round((overall.done / overall.total) * 100) : 0;

  return (
    <main className="screen">
      <h1 className="h1">Progress</h1>

      {habits.length === 0 ? (
        <div className="empty">
          <p className="empty__title">Nothing to chart yet</p>
          <p className="muted">Add a habit and check in for a day to see your progress.</p>
        </div>
      ) : (
        <>
          <section className="panel">
            <p className="muted">Last 30 days</p>
            <p className="big">{overallPct}%</p>
            <p className="muted">{overall.done} of {overall.total} check-ins completed</p>
          </section>

          <section>
            <h2 className="h2">This week</h2>
            <div className="bars" role="img" aria-label="Completion for each of the last 7 days">
              {week.map(({ d, pct, total }) => (
                <div key={d.toISOString()} className="bars__col">
                  <div className="bars__track">
                    <div className="bars__fill" style={{ height: `${total ? Math.max(pct, 6) : 0}%` }} />
                  </div>
                  <span className="bars__day">{DAY_NAMES[d.getDay()].slice(0, 2)}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="h2">By habit</h2>
            <ul className="list">
              {habits.map((h) => {
                const r = rate(h, completions, today, 30);
                return (
                  <li key={h.id} className="row">
                    <span className="row__icon" aria-hidden="true">{h.icon}</span>
                    <div className="row__main">
                      <div className="row__top"><span>{h.name}</span><b>{r.pct}%</b></div>
                      <div className="meter"><div className="meter__fill" style={{ width: `${r.pct}%` }} /></div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </>
      )}
    </main>
  );
}
