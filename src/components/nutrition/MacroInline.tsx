import { cn } from '../../lib/cn';
import { formatDecimal } from '../../lib/format';
import { MACROS, MACRO_ORDER } from '../../lib/macros';

/**
 * The micro row under every entry / food: `P 19 · C 1 · F 25`.
 * Muted letters, neutral numbers — no colour.
 */
export function MacroInline({
  protein,
  carbs,
  fat,
  className,
}: {
  protein: number;
  carbs: number;
  fat: number;
  className?: string;
}) {
  const values = { protein, carbs, fat };
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-[11px] tabular-nums text-gray-500 dark:text-gray-400', className)}>
      {MACRO_ORDER.map((m, i) => (
        <span key={m} className="inline-flex items-center gap-1.5">
          {i > 0 && <span className="text-gray-300 dark:text-gray-600">·</span>}
          <span>
            <span className="font-semibold text-gray-400 dark:text-gray-500">{MACROS[m].letter}</span> {formatDecimal(values[m], 0)}
          </span>
        </span>
      ))}
    </span>
  );
}
