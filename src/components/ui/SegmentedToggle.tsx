import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  icon?: LucideIcon;
}

interface SegmentedToggleProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** md = forms & settings · sm = chart period switch (7 d / 30 d) */
  size?: 'md' | 'sm';
  fullWidth?: boolean;
  /** onHighlight = soft orange track + orange active label, for use on a highlight Card. */
  tone?: 'default' | 'onHighlight';
  'aria-label'?: string;
}

/**
 * 2–4 mutually exclusive options on a gray track; the active one is a white
 * raised segment. Used for theme, unit, portion and chart-period switches.
 */
export function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
  size = 'md',
  fullWidth = false,
  tone = 'default',
  'aria-label': ariaLabel,
}: SegmentedToggleProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        'items-center p-0.5',
        tone === 'onHighlight' ? 'bg-theme-500/10 dark:bg-theme-500/15' : 'bg-gray-100 dark:bg-dark-border/50',
        size === 'md' ? 'rounded-xl' : 'rounded-lg',
        fullWidth ? 'flex w-full' : 'inline-flex',
      )}
    >
      {options.map(({ value: v, label, icon: Icon }) => {
        const active = v === value;
        return (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(v)}
            className={cn(
              'relative inline-flex items-center justify-center gap-1.5 whitespace-nowrap min-w-0 transition-all duration-200',
              // Invisible hit area: the visual segment is compact, the touch target ≥ 44 px tall.
              "before:absolute before:content-[''] before:inset-x-0",
              size === 'md' ? 'before:-inset-y-1.5' : 'before:-inset-y-3',
              fullWidth && 'flex-1',
              size === 'md'
                ? 'px-3 py-1.5 min-h-8 rounded-lg text-xs font-medium'
                : 'px-2.5 py-1 rounded-md text-[10px] font-semibold',
              active
                ? tone === 'onHighlight'
                  ? 'bg-white dark:bg-dark-card shadow-sm shadow-theme-500/15 text-theme-600 dark:text-theme-400'
                  : 'bg-white dark:bg-dark-card shadow-sm text-gray-900 dark:text-gray-100'
                : tone === 'onHighlight'
                  ? 'text-theme-700/70 dark:text-theme-300/70'
                  : 'text-gray-500 dark:text-gray-400',
            )}
          >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            {label}
          </button>
        );
      })}
    </div>
  );
}
