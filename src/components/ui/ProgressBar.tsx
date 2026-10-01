import { cn } from '../../lib/cn';

/**
 * Thin orange progress track (0–1). `onHighlight` swaps the track for use on
 * a highlight card. For macros use `nutrition/MacroBar`, not this.
 */
export function ProgressBar({
  value,
  size = 'md',
  tone = 'default',
  label,
}: {
  value: number;
  size?: 'sm' | 'md';
  tone?: 'default' | 'onHighlight';
  /** Accessible name. */
  label: string;
}) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        'rounded-full overflow-hidden',
        size === 'sm' ? 'h-1' : 'h-1.5',
        tone === 'default' ? 'bg-gray-100 dark:bg-dark-border/50' : 'bg-white dark:bg-dark-border/40',
      )}
    >
      <div
        className="h-full rounded-full bg-theme-500 transition-[width] duration-300 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
