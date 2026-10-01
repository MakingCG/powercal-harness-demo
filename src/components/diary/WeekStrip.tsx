import { useRef } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSwipe } from '../../hooks/useSwipe';
import { DAY_LETTERS, addDays, monthLabel, startOfWeek, todayKey, weekOf } from '../../lib/date';
import { Chip } from '../ui/Chip';
import { IconButton } from '../ui/IconButton';
import { DayCell } from './DayCell';

/**
 * Monday-first week row at the top of the day page (F022). The month label
 * opens the MonthCalendar sheet. The selected day lives in the URL
 * (`selectedDate` + `onSelectDate`); browsing other weeks is controlled
 * separately (`displayDate` + `onDisplayDateChange`) — chevrons and a swipe on
 * the strip move the displayed week WITHOUT changing the selection. Without
 * `onDisplayDateChange` the chevrons move the selection by a week (the
 * original, uncontrolled API). Carries `data-no-swipe`, so the day page's
 * day swipe ignores it.
 */
export function WeekStrip({
  selectedDate,
  trackedDates,
  onSelectDate,
  onOpenMonth,
  displayDate,
  onDisplayDateChange,
  today = todayKey(),
}: {
  selectedDate: string;
  trackedDates: ReadonlySet<string>;
  onSelectDate: (day: string) => void;
  onOpenMonth: () => void;
  /** Any day of the displayed week (defaults to the selected day). */
  displayDate?: string;
  onDisplayDateChange?: (day: string) => void;
  /** From `useToday()` so the today ring follows midnight. */
  today?: string;
}) {
  const shown = displayDate ?? selectedDate;
  const days = weekOf(shown);
  const browsing = startOfWeek(shown) !== startOfWeek(selectedDate);
  const showBack = onDisplayDateChange != null && (selectedDate !== today || startOfWeek(shown) !== startOfWeek(today));

  const shift = (weeks: number) => {
    if (onDisplayDateChange) onDisplayDateChange(addDays(shown, weeks * 7));
    else onSelectDate(addDays(selectedDate, weeks * 7));
  };

  const ref = useRef<HTMLDivElement>(null);
  useSwipe(ref, { onSwipeLeft: () => shift(1), onSwipeRight: () => shift(-1), respectNoSwipe: false });

  return (
    <div ref={ref} data-no-swipe="">
      <div className="flex items-center justify-between gap-2 mb-1">
        <button
          type="button"
          onClick={onOpenMonth}
          className="inline-flex items-center gap-1 min-w-0 min-h-11 text-sm font-bold text-gray-900 dark:text-gray-100 active:opacity-70"
        >
          <span className="truncate">{monthLabel(browsing ? shown : selectedDate)}</span>
          <ChevronDown size={14} className="shrink-0 text-gray-400 dark:text-gray-500" />
        </button>
        <div className="flex items-center gap-1 -mr-2 shrink-0">
          <IconButton icon={ChevronLeft} label="Previous week" onClick={() => shift(-1)} iconSize={16} />
          <IconButton icon={ChevronRight} label="Next week" onClick={() => shift(1)} iconSize={16} />
        </div>
      </div>

      <div className="grid grid-cols-7 justify-items-center">
        {DAY_LETTERS.map((letter, i) => (
          <span key={i} className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            {letter}
          </span>
        ))}
        {days.map((day) => (
          <DayCell
            key={day}
            day={day}
            selected={day === selectedDate}
            isToday={day === today}
            tracked={trackedDates.has(day)}
            muted={day > today}
            onSelect={onSelectDate}
          />
        ))}
      </div>

      {showBack && (
        <div className="flex justify-center mt-1">
          <Chip
            onClick={() => {
              onDisplayDateChange?.(today);
              onSelectDate(today);
            }}
          >
            Back to today
          </Chip>
        </div>
      )}
    </div>
  );
}
