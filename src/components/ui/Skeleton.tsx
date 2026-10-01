import { cn } from '../../lib/cn';

/**
 * Shape-matched loading placeholder. Only for cold start (useLiveQuery ===
 * undefined) — size it like the real content: summary card `h-40`,
 * meal card `h-24`, list row `h-11`.
 */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('bg-gray-100/60 dark:bg-dark-card/40 animate-pulse rounded-xl', className)} />;
}

/** N list-row skeletons with the list rhythm. */
export function SkeletonList({ rows = 3, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)} aria-busy="true">
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="h-11" />
      ))}
    </div>
  );
}
