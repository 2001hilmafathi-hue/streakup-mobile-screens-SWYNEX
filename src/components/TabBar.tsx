import type { Route } from '../types';
import { ProgressIcon, SettingsIcon, TodayIcon } from './Icons';

type Tab = 'today' | 'progress' | 'settings';

const TABS: { id: Tab; label: string; icon: JSX.Element }[] = [
  { id: 'today', label: 'Today', icon: <TodayIcon /> },
  { id: 'progress', label: 'Progress', icon: <ProgressIcon /> },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
];

export function TabBar({ active, go }: { active: Tab; go: (r: Route) => void }) {
  return (
    <nav className="tabbar" aria-label="Main">
      {TABS.map((t) => (
        <button
          key={t.id}
          className={`tab ${active === t.id ? 'tab--active' : ''}`}
          aria-current={active === t.id ? 'page' : undefined}
          onClick={() => go({ name: t.id })}
        >
          {t.icon}
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}
