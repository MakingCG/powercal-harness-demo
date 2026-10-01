import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { formatDecimal, formatKcal } from '../../lib/format';
import { MACROS, MACRO_ORDER } from '../../lib/macros';
import type { MacroTotals } from '../../types/nutrition';

/**
 * Live readout for an amount being edited: big kcal + three macro columns.
 * Sits directly above the save button of every amount editor, so kcal and
 * all three macros are visible at once while the amount changes.
 */
export function NutritionPreview({
  totals,
  caption,
  footer,
  tone = 'default',
}: {
  totals: MacroTotals;
  /** onHighlight = white-ish block, for use on a highlight Card. */
  tone?: 'default' | 'onHighlight';
  caption?: string;
  /** One muted line under a hairline — `New day total: 2,137 / 2,650 kcal` (F024 AC3). */
  footer?: ReactNode;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl px-4 py-3',
        tone === 'onHighlight' ? 'bg-white/60 dark:bg-dark-card/40' : 'bg-gray-100/70 dark:bg-dark-border/30',
      )}
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          {caption && <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-0.5">{caption}</p>}
          <p className="text-2xl font-bold tabular-nums text-gray-900 dark:text-gray-100 leading-none">
            {formatKcal(totals.kcal)}
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-1">kcal</span>
          </p>
        </div>
        <div className="flex gap-4">
          {MACRO_ORDER.map((m) => (
            <div key={m} className="text-center">
              <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500">{MACROS[m].letter}</p>
              <p className="text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">
                {formatDecimal(totals[m], 1)}
                <span className="text-[10px] font-normal text-gray-400 dark:text-gray-500"> g</span>
              </p>
            </div>
          ))}
        </div>
      </div>
      {footer && (
        <p className="mt-2.5 pt-2 border-t border-gray-200/70 dark:border-dark-border/50 text-[11px] tabular-nums text-gray-500 dark:text-gray-400">
          {footer}
        </p>
      )}
    </div>
  );
}
