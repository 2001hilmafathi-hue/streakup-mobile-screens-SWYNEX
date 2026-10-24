import { useEffect, useRef, useState } from 'react';
import type { Completions, Habit, Route, Settings } from './types';
import { dateKey, startOfDay } from './dates';
import { defaultSettings, sampleData, usePersistentState } from './storage';
import { TabBar } from './components/TabBar';
import { Welcome } from './screens/Welcome';
import { Today } from './screens/Today';
import { HabitForm } from './screens/HabitForm';
import { HabitDetail } from './screens/HabitDetail';
import { Progress } from './screens/Progress';
import { SettingsScreen } from './screens/SettingsScreen';

export default function App() {
  const [habits, setHabits] = usePersistentState<Habit[]>('streakup.habits', []);
  const [completions, setCompletions] = usePersistentState<Completions>('streakup.completions', {});
  const [settings, setSettings] = usePersistentState<Settings>('streakup.settings', defaultSettings);
  const [route, setRoute] = useState<Route>({ name: 'today' });
  const [today, setToday] = useState(() => startOfDay(new Date()));
  const content = useRef<HTMLDivElement>(null);

  // Apply theme and text size to the document.
  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme;
    document.documentElement.dataset.text = settings.largeText ? 'large' : 'normal';
  }, [settings.theme, settings.largeText]);

  // Roll "today" over if the app stays open past midnight.
  useEffect(() => {
    const id = setInterval(() => {
      const now = startOfDay(new Date());
      setToday((prev) => (dateKey(prev) === dateKey(now) ? prev : now));
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  // Start every screen at the top.
  useEffect(() => {
    content.current?.scrollTo(0, 0);
  }, [route]);

  const go = (r: Route) => setRoute(r);
  const update = (s: Partial<Settings>) => setSettings((prev) => ({ ...prev, ...s }));

  const toggle = (id: string, day: Date) => {
    const key = dateKey(day);
    setCompletions((prev) => {
      const log = { ...(prev[id] ?? {}) };
      if (log[key]) delete log[key];
      else log[key] = true;
      return { ...prev, [id]: log };
    });
  };

  const saveHabit = (data: Pick<Habit, 'name' | 'icon' | 'days'>, id?: string) => {
    if (id) {
      setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, ...data } : h)));
      go({ name: 'detail', id });
    } else {
      const habit: Habit = { ...data, id: `habit-${Date.now()}`, createdAt: new Date().toISOString() };
      setHabits((prev) => [...prev, habit]);
      go({ name: 'today' });
    }
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    setCompletions((prev) => {
      const { [id]: _removed, ...rest } = prev;
      return rest;
    });
    go({ name: 'today' });
  };

  const finishWelcome = (withSamples: boolean) => {
    if (withSamples) {
      const s = sampleData(today);
      setHabits(s.habits);
      setCompletions(s.completions);
    }
    update({ welcomed: true });
  };

  const resetAll = () => {
    setHabits([]);
    setCompletions({});
    setSettings({ ...defaultSettings, theme: settings.theme, largeText: settings.largeText });
    go({ name: 'today' });
  };

  let screen: JSX.Element;
  let tab: 'today' | 'progress' | 'settings' | null = null;

  if (!settings.welcomed) {
    screen = <Welcome onSample={() => finishWelcome(true)} onEmpty={() => finishWelcome(false)} />;
  } else if (route.name === 'add') {
    screen = <HabitForm onSave={(d) => saveHabit(d)} onCancel={() => go({ name: 'today' })} />;
  } else if (route.name === 'edit') {
    const habit = habits.find((h) => h.id === route.id);
    screen = habit ? (
      <HabitForm
        habit={habit}
        onSave={(d) => saveHabit(d, habit.id)}
        onDelete={() => deleteHabit(habit.id)}
        onCancel={() => go({ name: 'detail', id: habit.id })}
      />
    ) : <Today habits={habits} completions={completions} today={today} toggle={toggle} go={go} />;
  } else if (route.name === 'detail') {
    const habit = habits.find((h) => h.id === route.id);
    screen = habit ? (
      <HabitDetail
        habit={habit}
        completions={completions}
        today={today}
        toggle={toggle}
        onBack={() => go({ name: 'today' })}
        onEdit={() => go({ name: 'edit', id: habit.id })}
      />
    ) : <Today habits={habits} completions={completions} today={today} toggle={toggle} go={go} />;
  } else if (route.name === 'progress') {
    tab = 'progress';
    screen = <Progress habits={habits} completions={completions} today={today} />;
  } else if (route.name === 'settings') {
    tab = 'settings';
    screen = <SettingsScreen settings={settings} update={update} onReset={resetAll} />;
  } else {
    tab = 'today';
    screen = <Today habits={habits} completions={completions} today={today} toggle={toggle} go={go} />;
  }

  return (
    <div className="app">
      <div className="content" ref={content}>{screen}</div>
      {tab && <TabBar active={tab} go={go} />}
    </div>
  );
}
