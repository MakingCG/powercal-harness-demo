import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';

export type StatusTone = 'neutral' | 'good' | 'accent' | 'warn';

const TONES: Record<StatusTone, string> = {
  neutral: 'bg-gray-100 text-gray-600 dark:bg-dark-border/50 dark:text-gray-400',
  good: 'bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20',
  accent: 'bg-theme-500/10 text-theme-700 dark:text-theme-300 border border-theme-500/20',
  warn: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20',
};

/**
 * Status in four tones. There is no red tone — red means destroy, never
 * "you ate too much".
 */
export function StatusPill({
  label,
  tone,
  icon: Icon,
  className,
}: {
  label: string;
  tone: StatusTone;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap',
        TONES[tone],
        className,
      )}
    >
      {Icon && <Icon size={11} />}
      {label}
    </span>
  );
}
