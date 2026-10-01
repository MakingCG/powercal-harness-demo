import type { ReactNode } from 'react';

/**
 * The shared glass tooltip shell for every Recharts chart. Content is
 * `title` + key/value rows; a row with an empty `label` renders its value
 * alone (the `P 191 · C 245 · F 78` line).
 */
export function ChartTooltip({ title, rows }: { title: string; rows: { label: string; value: ReactNode }[] }) {
  return (
    <div className="rounded-xl px-3 py-2.5 shadow-lg text-xs bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm border border-gray-200/50 dark:border-dark-border/50">
      <p className="font-semibold text-gray-900 dark:text-gray-100 mb-0.5">{title}</p>
      {rows.map((r, i) => (
        <p key={i}>
          {r.label && <span className="text-gray-500 dark:text-gray-400">{r.label}: </span>}
          <span className="font-semibold text-gray-900 dark:text-gray-100 tabular-nums">{r.value}</span>
        </p>
      ))}
    </div>
  );
}
