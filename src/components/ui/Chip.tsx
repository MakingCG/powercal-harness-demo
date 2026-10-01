import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';

/**
 * Selectable chip — filters (All / Custom / OFF) and wrap-around single
 * choice (meal slot). Active = solid orange with coloured shadow.
 */
export function Chip({
  children,
  active = false,
  onClick,
  icon: Icon,
  tone = 'default',
}: {
  children: ReactNode;
  active?: boolean;
  onClick: () => void;
  icon?: LucideIcon;
  /** onHighlight = white-ish inactive fill, for use on a highlight Card. */
  tone?: 'default' | 'onHighlight';
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 min-h-8 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95',
        active
          ? 'bg-theme-500 text-white shadow-sm shadow-theme-500/30'
          : tone === 'onHighlight'
            ? 'bg-white/60 dark:bg-dark-card/40 text-gray-600 dark:text-gray-400'
            : 'bg-gray-100 dark:bg-dark-border/50 text-gray-500 dark:text-gray-400',
      )}
    >
      {Icon && <Icon size={13} />}
      {children}
    </button>
  );
}

export function ChipGroup({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-wrap gap-1.5', className)}>{children}</div>;
}
