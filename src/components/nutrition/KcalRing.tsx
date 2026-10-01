import { cn } from '../../lib/cn';
import { formatKcal } from '../../lib/format';

const STROKE = 10;

/**
 * Energy ring — the ONLY theme-orange element on the summary card.
 * Centre shows what is left (`kcal left`) or how much over (`kcal over`, amber
 * text — never red). Fill animates `stroke-dashoffset` 300 ms; the number does not count up.
 */
export function KcalRing({
  consumed,
  goal,
  size = 132,
  tone = 'default',
}: {
  consumed: number;
  goal: number;
  size?: number;
  /** onHighlight = white track, for use on a highlight Card. */
  tone?: 'default' | 'onHighlight';
}) {
  const r = (size - STROKE) / 2;
  const circumference = 2 * Math.PI * r;
  const ratio = goal > 0 ? Math.min(1, consumed / goal) : 0;
  const remaining = goal - consumed;
  const over = remaining < 0;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={STROKE}
          className={tone === 'default' ? 'stroke-gray-100 dark:stroke-dark-border/50' : 'stroke-white dark:stroke-dark-border/40'}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - ratio)}
          className="stroke-theme-500 transition-[stroke-dashoffset] duration-300 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span
          className={cn(
            'text-3xl font-bold tabular-nums leading-none',
            over ? 'text-amber-600 dark:text-amber-400' : 'text-gray-900 dark:text-gray-100',
          )}
        >
          {formatKcal(Math.abs(remaining))}
        </span>
        <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
          {over ? 'kcal over' : 'kcal left'}
        </span>
      </div>
      <span className="sr-only">
        {`Eaten ${formatKcal(consumed)} of ${formatKcal(goal)} kcal`}
      </span>
    </div>
  );
}
