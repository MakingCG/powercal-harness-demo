import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface ListItemProps {
  title: string;
  subtitle?: ReactNode;
  /** Thumbnail / icon slot, 36–40 px. */
  leading?: ReactNode;
  /** Right side: kcal, a Tag, an IconButton, a chevron. */
  trailing?: ReactNode;
  onClick?: () => void;
  /** card = standalone glass card (list of cards) · row = inside a Card/SectionCard with hairlines */
  variant?: 'card' | 'row';
  /** Position in the list — staggers the CSS fade-up entrance (40 ms steps). */
  index?: number;
}

/**
 * The tappable list row. `card` stacks as separate glass cards with
 * `space-y-2`; `row` sits in a `divide-y` container.
 */
export function ListItem({ title, subtitle, leading, trailing, onClick, variant = 'row', index }: ListItemProps) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      {...(onClick ? { type: 'button' as const, onClick } : {})}
      style={index != null ? { animationDelay: `${index * 40}ms` } : undefined}
      className={cn(
        'w-full flex items-center gap-3 text-left min-h-11',
        index != null && 'animate-fade-up',
        variant === 'card'
          ? 'p-4 rounded-2xl bg-white/60 dark:bg-dark-card/60 backdrop-blur-sm border border-gray-200/50 dark:border-dark-border/50'
          : 'px-4 py-3',
        onClick &&
          (variant === 'card'
            ? 'active:scale-[0.98] transition-all duration-200'
            : 'transition-colors active:bg-gray-100/50 dark:active:bg-dark-border/30'),
      )}
    >
      {leading && <div className="shrink-0">{leading}</div>}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{title}</p>
        {subtitle && <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{subtitle}</div>}
      </div>
      {trailing && <div className="shrink-0 flex items-center gap-2">{trailing}</div>}
    </Tag>
  );
}
