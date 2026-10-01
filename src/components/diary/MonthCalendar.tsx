import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/cn';
import { DAY_LETTERS, addDays, addMonths, monthBounds, monthLabel, parseDayKey, todayKey } from '../../lib/date';
import { formatKcal } from '../../lib/format';
import { ADHERENCE_LABELS } from '../../lib/intake';
import type { DayTint } from '../../lib/intake';
import { IconButton } from '../ui/IconButton';
import { DayCell } from './DayCell';

/** Per-cell entrance stagger (F042 AC1). */
const STAGGER_MS = 12;

export interface MonthSummary {
  loggedDays: number;
  daysInMonth: number;
  /** Average kcal over logged days only; `null` without any. */
  avgKcal: number | null;
}

const LEGEND: { tint: Exclude<DayTint, 'noGoal'>; dot: string }[] = [
  { tint: 'under', dot: 'bg-theme-500/10 ring-1 ring-theme-500/40 dark:bg-theme-500/15' },
  { tint: 'onTarget', dot: 'bg-green-500/40 dark:bg-green-400/50' },
  { tint: 'over', dot: 'bg-amber-500/60 ring-1 ring-amber-600/60 dark:bg-amber-400/60' },
];

/**
 * Monday-first month grid in adherence mode (F042): each logged day is
 * tinted by kcal vs the goal in force on it (`tints`), a grey dot marks a
 * weigh-in (`weightDates`), today carries the orange ring, the selected date
 * (nullable — `/progress` has none) is solid orange. Adjacent-month cells
 * and future days are dimmed and disabled. `‹ September 2026 ›` moves the
 * month; the footer summarises it (`18 of 31 days logged · avg 2,610 kcal`)
 * with a one-line legend. `loading` renders pulsing circles in place — never
 * an empty grid. Lives in a Drawer on the day page and in a glass Card on
 * `/progress`.
 */
export function MonthCalendar({
  month,
  selectedDate,
  tints,
  weightDates,
  summary,
  loading = false,
  onSelectDate,
  onChangeMonth,
  today = todayKey(),
}: {
  /** `YYYY-MM` */
  month: string;
  selectedDate: string | null;
  tints?: ReadonlyMap<string, DayTint>;
  weightDates?: ReadonlySet<string>;
  summary?: MonthSummary;
  loading?: boolean;
  onSelectDate: (day: string) => void;
  onChangeMonth: (month: string) => void;
  /** From `useToday()` so the today ring follows midnight. */
  today?: string;
}) {
  const { from, to } = monthBounds(month);
  const lead = (parseDayKey(from).getDay() + 6) % 7;
  const cellCount = Math.ceil((lead + monthBounds(month).days) / 7) * 7;
  const cells = Array.from({ length: cellCount }, (_, i) => addDays(from, i - lead));

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <IconButton icon={ChevronLeft} label="Previous month" onClick={() => onChangeMonth(addMonths(month, -1))} iconSize={18} />
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{monthLabel(from)}</span>
        <IconButton icon={ChevronRight} label="Next month" onClick={() => onChangeMonth(addMonths(month, 1))} iconSize={18} />
      </div>

      <div className="grid grid-cols-7 justify-items-stretch">
        {DAY_LETTERS.map((letter, i) => (
          <span key={i} className="text-center text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            {letter}
          </span>
        ))}
        {cells.map((day, i) => {
          const outside = day < from || day > to;
          if (loading) {
            return (
              <span key={day} className="w-full h-12 flex items-center justify-center" aria-hidden="true">
                <span
                  className={cn(
                    'w-full max-w-9 aspect-square rounded-full',
                    outside ? 'bg-transparent' : 'bg-gray-100 dark:bg-dark-border/50 animate-pulse',
                  )}
                />
              </span>
            );
          }
          return (
            <DayCell
              key={day}
              day={day}
              fluid
              selected={!outside && day === selectedDate}
              isToday={!outside && day === today}
              muted={outside || day > today}
              disabled={outside || day > today}
              tint={outside ? undefined : tints?.get(day)}
              marker={!outside && weightDates?.has(day) ? 'weight' : undefined}
              style={{ animationDelay: `${i * STAGGER_MS}ms` }}
              className="animate-fade-up"
              onSelect={onSelectDate}
            />
          );
        })}
      </div>

      <div className="mt-2 space-y-1">
        <p className="text-xs text-gray-500 dark:text-gray-400 tabular-nums min-h-4">
          {loading || !summary
            ? '\u00a0'
            : summary.loggedDays === 0
              ? 'No days logged'
              : `${summary.loggedDays} of ${summary.daysInMonth} days logged${
                  summary.avgKcal != null ? ` · avg ${formatKcal(summary.avgKcal)} kcal` : ''
                }`}
        </p>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-500 dark:text-gray-400">
          {LEGEND.map(({ tint, dot }) => (
            <span key={tint} className="inline-flex items-center gap-1 whitespace-nowrap">
              <span className={cn('w-2 h-2 rounded-full', dot)} aria-hidden="true" />
              {ADHERENCE_LABELS[tint]}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
