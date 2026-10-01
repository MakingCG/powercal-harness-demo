import type { CSSProperties } from 'react';
import { cn } from '../../lib/cn';
import { longDayLabel, parseDayKey } from '../../lib/date';
import type { DayTint } from '../../lib/intake';

/** Adherence fills of the month grid (F042): accent under · green within · amber over · grey without a goal. */
const TINTS: Record<DayTint, string> = {
  under: 'bg-theme-500/10 text-theme-600 dark:bg-theme-500/15 dark:text-theme-400',
  onTarget: 'bg-green-500/15 text-green-700 dark:bg-green-500/20 dark:text-green-300',
  over: 'bg-amber-500/25 text-amber-800 ring-1 ring-inset ring-amber-500/50 dark:bg-amber-500/30 dark:text-amber-200',
  noGoal: 'bg-gray-100 text-gray-700 dark:bg-dark-border/60 dark:text-gray-300',
};

/**
 * One calendar day: number in a 36 px circle inside a 44 px hit area.
 * Selected = solid orange; today = orange ring (on top of any tint). Below the
 * number an optional marker: `tracked` = the orange "logged" dot (week strip
 * only), `marker="weight"` = a small grey weigh-in dot (month grid).
 * `tint` = the month grid's adherence fill. `disabled` = future days and
 * adjacent-month cells (dimmed, not tappable). Shared by WeekStrip and MonthCalendar.
 */
export function DayCell({
  day,
  selected,
  isToday,
  tracked = false,
  muted = false,
  tint,
  marker,
  disabled = false,
  fluid = false,
  style,
  className,
  onSelect,
}: {
  day: string;
  selected: boolean;
  isToday: boolean;
  tracked?: boolean;
  /** Future days and days outside the viewed month. */
  muted?: boolean;
  tint?: DayTint;
  marker?: 'weight';
  disabled?: boolean;
  /** Fill the grid column (month grid) instead of the fixed 44 px width; the circle shrinks to fit 320 px. */
  fluid?: boolean;
  /** Data-driven only (the grid's `animationDelay` stagger). */
  style?: CSSProperties;
  className?: string;
  onSelect: (day: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(day)}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={longDayLabel(day)}
      style={style}
      className={cn(
        'flex flex-col items-center justify-center transition-transform',
        fluid ? 'w-full min-w-0 h-12' : 'w-11 h-12',
        disabled ? 'cursor-default' : 'active:scale-95',
        className,
      )}
    >
      <span
        className={cn(
          'rounded-full flex items-center justify-center text-sm font-semibold tabular-nums transition-colors',
          fluid ? 'w-full max-w-9 aspect-square' : 'w-9 h-9',
          selected
            ? 'bg-theme-500 text-white shadow-lg shadow-theme-500/30'
            : cn(
                tint && !muted ? TINTS[tint] : muted ? 'text-gray-300 dark:text-gray-600' : 'text-gray-600 dark:text-gray-300',
                isToday && 'ring-2 ring-theme-500 ring-offset-0',
                isToday && !tint && 'text-gray-900 dark:text-gray-100',
              ),
        )}
      >
        {parseDayKey(day).getDate()}
      </span>
      <span
        className={cn(
          'mt-0.5 w-1 h-1 rounded-full',
          marker === 'weight' && !muted
            ? 'bg-gray-400 dark:bg-gray-500'
            : tracked
              ? 'bg-theme-500'
              : 'bg-transparent',
        )}
      />
    </button>
  );
}
