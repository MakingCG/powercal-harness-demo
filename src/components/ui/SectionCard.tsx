import type { ReactNode } from 'react';
import { ChevronRight, Loader2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';

/**
 * Settings/form group: icon + bold title + caption ABOVE a glass card whose
 * children are FieldRows separated by hairlines.
 */
export function SectionCard({
  title,
  description,
  icon: Icon,
  children,
  className,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      <div className="flex items-center gap-2 mb-1 px-1">
        {Icon && <Icon className="w-4 h-4 text-theme-500" />}
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">{title}</h3>
      </div>
      {description ? (
        <p className={cn('text-xs text-gray-400 dark:text-gray-500 mb-3 px-1', Icon && 'pl-7')}>
          {description}
        </p>
      ) : (
        <div className="mb-2" />
      )}
      <div className="rounded-2xl bg-white/60 dark:bg-dark-card/60 backdrop-blur-sm border border-gray-200/50 dark:border-dark-border/50 divide-y divide-gray-100 dark:divide-dark-border/30 overflow-hidden">
        {children}
      </div>
    </section>
  );
}

/**
 * One row inside a SectionCard: label (+ hint) left, control right, ≥44 px.
 * With `onClick` the whole row is a button with a trailing chevron (navigates
 * or opens a sheet) and `children` is the current value. `disabled` dims it
 * and blocks taps; `loading` (a running action, e.g. `Export backup`) swaps
 * the chevron for a spinner and implies `disabled`.
 */
export function FieldRow({
  label,
  hint,
  children,
  onClick,
  disabled = false,
  loading = false,
}: {
  label: string;
  hint?: string;
  children?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  const inactive = disabled || loading;
  const body = (
    <>
      <div className="flex flex-col min-w-0 text-left">
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{label}</span>
        {hint && (
          <span className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 leading-snug tabular-nums">{hint}</span>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {children}
        {loading ? (
          <Loader2 size={14} className="animate-spin text-gray-400 dark:text-gray-500" />
        ) : (
          onClick && <ChevronRight size={14} className="text-gray-400 dark:text-gray-500" />
        )}
      </div>
    </>
  );

  const rowClass = 'flex w-full items-center justify-between px-4 py-3.5 gap-3 min-h-12';

  return onClick ? (
    <button
      type="button"
      onClick={onClick}
      disabled={inactive}
      aria-busy={loading || undefined}
      className={cn(
        rowClass,
        'transition-colors active:bg-gray-100/50 dark:active:bg-dark-border/30',
        inactive && 'opacity-50 pointer-events-none',
      )}
    >
      {body}
    </button>
  ) : (
    <div className={cn(rowClass, inactive && 'opacity-50')} aria-disabled={inactive || undefined}>
      {body}
    </div>
  );
}
