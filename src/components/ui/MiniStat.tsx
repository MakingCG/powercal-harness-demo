import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';

const ICON_TONES = {
  theme: 'text-theme-600 dark:text-theme-400',
  good: 'text-green-600 dark:text-green-400',
  warn: 'text-amber-600 dark:text-amber-400',
  neutral: 'text-gray-500 dark:text-gray-400',
} as const;

/**
 * Small stat cell for 2-column grids inside a highlight card
 * (`42 days left`, `Change · 7 d −0.8 kg`). `compact` = the 3-column
 * variant that fits 320 px: text only (the icon is not rendered), label
 * above the value (`Lowest` / `89.6 kg`, F041).
 */
export function MiniStat({
  icon: Icon,
  label,
  value,
  tone = 'theme',
  wide = false,
  compact = false,
}: {
  /** Required for the default variant; `compact` never renders it. */
  icon?: LucideIcon;
  label: string;
  value: string;
  tone?: keyof typeof ICON_TONES;
  wide?: boolean;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className={cn('min-w-0 px-2.5 py-2 rounded-xl bg-white/60 dark:bg-dark-card/40', wide && 'col-span-2')}>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-none truncate">{label}</p>
        <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 mt-1 truncate tabular-nums">{value}</p>
      </div>
    );
  }
  return (
    <div className={cn('flex items-center gap-2 px-3 py-2 rounded-xl bg-white/60 dark:bg-dark-card/40', wide && 'col-span-2')}>
      {Icon && <Icon size={13} className={cn('shrink-0', ICON_TONES[tone])} />}
      <div className="min-w-0">
        <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-none">{label}</p>
        <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 mt-0.5 truncate tabular-nums">{value}</p>
      </div>
    </div>
  );
}
