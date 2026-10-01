import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from './Button';

/**
 * Title block of a HEADERLESS page (template A): big title + one muted line.
 * Pages with a Header never render this.
 */
export function PageTitle({ title, subtitle, trailing }: { title: string; subtitle?: ReactNode; trailing?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
      </div>
      {trailing && <div className="shrink-0 -mr-2.5">{trailing}</div>}
    </div>
  );
}

/** Title above a group of cards (`Recent weigh-ins` + `See all ›`). */
export function SectionHeader({
  title,
  action,
}: {
  title: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
      {action && (
        <Button variant="link" trailingIcon={ChevronRight} onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
