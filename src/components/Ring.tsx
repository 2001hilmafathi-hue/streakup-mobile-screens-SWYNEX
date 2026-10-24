/** Circular progress indicator used on the Today screen. */
export function Ring({ done, total }: { done: number; total: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const frac = total === 0 ? 0 : done / total;
  return (
    <div className="ring" role="img" aria-label={`${done} of ${total} habits done today`}>
      <svg viewBox="0 0 80 80" width="84" height="84">
        <circle cx="40" cy="40" r={r} className="ring__track" />
        <circle cx="40" cy="40" r={r} className="ring__fill"
          strokeDasharray={c} strokeDashoffset={c * (1 - frac)} transform="rotate(-90 40 40)" />
      </svg>
      <span className="ring__label">{done}/{total}</span>
    </div>
  );
}
