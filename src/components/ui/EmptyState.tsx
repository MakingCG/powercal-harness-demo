import type { LucideIcon } from 'lucide-react';
import { Button } from './Button';

/**
 * Calm, centred "nothing here yet" block (F070), always inside its host glass
 * card: a 32 px lucide icon (stroke 1.5, no background circle), a
 * `text-sm font-semibold` title, at most one short muted line, then 0–2
 * actions (44 px tall) — a primary pill and an optional ghost second action. No
 * illustrations. Hosts render skeletons while loading, never this.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void; icon?: LucideIcon };
  secondaryAction?: { label: string; onClick: () => void; icon?: LucideIcon };
}) {
  return (
    <div className="flex flex-col items-center text-center py-8 px-6 animate-fade-up">
      <Icon className="w-8 h-8 text-gray-400 dark:text-gray-500" strokeWidth={1.5} aria-hidden="true" />
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-3 max-w-[260px]">{title}</p>
      {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-[240px] text-center">{description}</p>}
      {(action || secondaryAction) && (
        <div className="flex flex-col items-center gap-1 mt-4">
          {action && (
            <Button icon={action.icon} onClick={action.onClick}>
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="ghost" icon={secondaryAction.icon} onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
