import { FlameIcon } from '../components/Icons';

export function Welcome({ onSample, onEmpty }: { onSample: () => void; onEmpty: () => void }) {
  return (
    <main className="screen welcome">
      <div className="welcome__mark"><FlameIcon /></div>
      <h1 className="welcome__title">Check in.<br />Keep the streak.</h1>
      <p className="welcome__text">
        StreakUp counts the days you follow through. A daily check-in takes about ten seconds.
      </p>
      <div className="welcome__actions">
        <button className="btn btn--primary" onClick={onSample}>Start with sample habits</button>
        <button className="btn btn--ghost" onClick={onEmpty}>Start with a blank list</button>
      </div>
    </main>
  );
}
