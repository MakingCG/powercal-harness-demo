import { cn } from '../../lib/cn';
import { formatDecimal } from '../../lib/format';
import { MACROS } from '../../lib/macros';
import type { Macro } from '../../types/nutrition';

/**
 * One macro vs its goal: letter + name, `92 / 160 g`, and a plain-div bar
 * (not Recharts) in the theme orange — the same bar for P, C and F. Past the goal the bar stays full
 * width and the overflow share renders as a striped segment at the end — never a wider bar.
 * `compact` never truncates the numbers: below ~88 px it drops the ` g` unit.
 */
export function MacroBar({
  macro,
  grams,
  goalGrams,
  compact = false,
  average = false,
  tone = 'default',
}: {
  macro: Macro;
  grams: number;
  goalGrams: number;
  /** compact = letter only (3-column layouts). */
  compact?: boolean;
  /** Period average (F043): reads `Avg 191 g / 200 g`. */
  average?: boolean;
  /** onHighlight = white track, for use on a highlight Card. */
  tone?: 'default' | 'onHighlight';
}) {
  const meta = MACROS[macro];
  const over = grams > goalGrams && goalGrams > 0;
  const fill = goalGrams > 0 ? Math.min(1, grams / goalGrams) : 0;
  const overShare = over ? (grams - goalGrams) / grams : 0;

  return (
    <div className={cn('min-w-0', compact && '@container')}>
      <div className={cn('flex items-baseline justify-between mb-1.5', compact ? 'gap-1' : 'gap-2')}>
        <span className={cn('text-xs font-semibold text-gray-900 dark:text-gray-100', compact ? 'shrink-0' : 'truncate')}>
          {meta.letter}
          {!compact && <span className="font-medium text-gray-500 dark:text-gray-400"> · {meta.name}</span>}
        </span>
        <span className="text-[11px] tabular-nums text-gray-500 dark:text-gray-400 whitespace-nowrap">
          {average && 'Avg '}
          <span className={cn('font-semibold', over ? 'text-amber-600 dark:text-amber-400' : 'text-gray-900 dark:text-gray-100')}>
            {formatDecimal(grams, 0)}
          </span>
          {average ? ' g / ' : ' / '}
          {formatDecimal(goalGrams, 0)}
          {/* Compact columns drop the unit when too narrow (320 px) rather than truncating the numbers. */}
          <span className={cn(compact && 'hidden @[5.5rem]:inline')}> g</span>
        </span>
      </div>
      <div
        className={cn(
          'relative h-2 rounded-full overflow-hidden',
          tone === 'default' ? 'bg-gray-100 dark:bg-dark-border/50' : 'bg-white dark:bg-dark-border/40',
        )}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-theme-500 transition-[width] duration-300 ease-out"
          style={{ width: `${fill * 100}%` }}
        />
        {over && (
          <div
            className="absolute inset-y-0 right-0 bg-theme-500 bg-stripes"
            style={{ width: `${overShare * 100}%` }}
          />
        )}
      </div>
    </div>
  );
}
