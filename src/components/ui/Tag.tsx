import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

/**
 * Static, non-interactive label: an amount (`150 g`), a count, a source
 * (`OFF`). `onHighlight` is the white-ish variant for use on a highlight card.
 */
export function Tag({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode;
  tone?: 'neutral' | 'onHighlight';
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold tabular-nums whitespace-nowrap',
        tone === 'neutral'
          ? 'bg-gray-100 text-gray-600 dark:bg-dark-border/50 dark:text-gray-400'
          : 'bg-white/60 dark:bg-dark-card/40 text-gray-600 dark:text-gray-300',
        className,
      )}
    >
      {children}
    </span>
  );
}
