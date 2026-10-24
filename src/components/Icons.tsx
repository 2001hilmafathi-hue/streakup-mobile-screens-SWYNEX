import type { ReactNode } from 'react';

function Svg({ children, size = 24 }: { children: ReactNode; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

export const CheckIcon = ({ size }: { size?: number }) => (
  <Svg size={size}><path d="M5 12.5l4.5 4.5L19 7" /></Svg>
);
export const PlusIcon = () => (
  <Svg><path d="M12 5v14M5 12h14" /></Svg>
);
export const BackIcon = () => (
  <Svg><path d="M15 5l-7 7 7 7" /></Svg>
);
export const TodayIcon = () => (
  <Svg><rect x="4" y="5" width="16" height="15" rx="3" /><path d="M8 3v4M16 3v4M4 10h16" /></Svg>
);
export const ProgressIcon = () => (
  <Svg><path d="M5 20V11M12 20V5M19 20v-6" /></Svg>
);
export const SettingsIcon = () => (
  <Svg><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" /></Svg>
);
export const FlameIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M12 2c1 3.5-1.5 5-2.5 7.2C8.6 11 9 12.5 10 13c-.2-1.6.7-2.8 2-3.8 1.4 2.4 4.5 3.7 4.5 7.3A4.5 4.5 0 0 1 12 21a5.5 5.5 0 0 1-5.5-5.5C6.5 11 11 9.5 12 2z" />
  </svg>
);
