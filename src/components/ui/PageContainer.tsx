import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

/**
 * The page column. Every route renders exactly one, directly inside AppShell's
 * scroll container.
 * - `headerless` (template A): starts under the notch with `pt-safe-page`.
 * - `withHeader` (template B/C): sits below `<Header>` (which renders its own spacer).
 * `pb-nav` keeps the last card clear of the floating nav (height measured by AppShell).
 */
export function PageContainer({
  children,
  variant = 'headerless',
  className,
}: {
  children: ReactNode;
  variant?: 'headerless' | 'withHeader';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'max-w-md mx-auto px-page pb-nav space-y-5',
        variant === 'headerless' ? 'pt-safe-page' : 'pt-5',
        className,
      )}
    >
      {children}
    </div>
  );
}
