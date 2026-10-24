import { useState } from 'react';
import type { Settings } from '../types';

interface Props {
  settings: Settings;
  update: (s: Partial<Settings>) => void;
  onReset: () => void;
}

export function SettingsScreen({ settings, update, onReset }: Props) {
  const [confirm, setConfirm] = useState(false);

  return (
    <main className="screen">
      <h1 className="h1">Settings</h1>

      <section className="group">
        <h2 className="h2">Appearance</h2>
        <div className="setting">
          <span>Theme</span>
          <div className="segment">
            <button className={settings.theme === 'light' ? 'on' : ''} onClick={() => update({ theme: 'light' })}>Light</button>
            <button className={settings.theme === 'dark' ? 'on' : ''} onClick={() => update({ theme: 'dark' })}>Dark</button>
          </div>
        </div>
        <div className="setting">
          <span>Larger text</span>
          <button
            role="switch"
            aria-checked={settings.largeText}
            aria-label="Larger text"
            className={`switch ${settings.largeText ? 'switch--on' : ''}`}
            onClick={() => update({ largeText: !settings.largeText })}
          ><span /></button>
        </div>
      </section>

      <section className="group">
        <h2 className="h2">Your data</h2>
        <p className="muted small">Everything is stored on this device in your browser. Nothing is sent anywhere.</p>
        {confirm ? (
          <div className="confirm">
            <p>Delete all habits and history?</p>
            <button className="btn btn--danger" onClick={onReset}>Yes, delete everything</button>
            <button className="btn btn--ghost" onClick={() => setConfirm(false)}>Cancel</button>
          </div>
        ) : (
          <button className="btn btn--ghost btn--warn" onClick={() => setConfirm(true)}>Reset all data</button>
        )}
      </section>

      <section className="group">
        <h2 className="h2">About</h2>
        <p className="muted small">
          StreakUp 1.0. A mobile-first web app built with React, TypeScript and Vite. It is not a native iOS or Android app.
        </p>
      </section>
    </main>
  );
}
