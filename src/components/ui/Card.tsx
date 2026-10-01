import type { HTMLAttributes, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** glass = every content surface · highlight = THE one emphasised card of a screen */
  tone?: 'glass' | 'highlight';
  padded?: boolean;
}

/**
 * Signature rules 1 + 2. Glass card for every surface; highlighted cards are
 * an orange GRADIENT, never a flat tint.
 */
export function Card({ children, tone = 'glass', padded = true, className, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl',
        tone === 'glass'
          ? 'bg-white/60 dark:bg-dark-card/60 backdrop-blur-sm border border-gray-200/50 dark:border-dark-border/50'
          : cn(
              'bg-gradient-to-br from-theme-500/10 to-theme-600/5 dark:from-theme-500/15 dark:to-theme-600/5',
              'border border-theme-500/20 dark:border-theme-500/15',
            ),
        padded && 'p-4',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

/** Card title row: 14 px theme icon + `text-xs font-semibold` title, optional trailing slot. */
export function CardHeader({
  icon: Icon,
  title,
  trailing,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  trailing?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center justify-between gap-2 min-h-7', className)}>
      <div className="flex items-center gap-2 min-w-0">
        {Icon && <Icon size={14} className="text-theme-600 dark:text-theme-400 shrink-0" />}
        <span className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">{title}</span>
      </div>
      {trailing}
    </div>
  );
}
