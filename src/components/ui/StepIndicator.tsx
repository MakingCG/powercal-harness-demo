import { cn } from '../../lib/cn';

/**
 * Progress dots for a short multi-step flow (onboarding): the current step is
 * a 24 px orange pill, the others 8 px grey dots. Decorative for sighted
 * users; announces `Step 1 of 2`. The step's own SectionCard carries its name.
 */
export function StepIndicator({ step, total, className }: { step: number; total: number; className?: string }) {
  return (
    <div className={cn('flex items-center gap-1.5', className)} role="img" aria-label={`Step ${step} of ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cn(
            'h-2 rounded-full transition-all duration-200',
            i + 1 === step ? 'w-6 bg-theme-500' : 'w-2 bg-gray-200 dark:bg-dark-border',
          )}
        />
      ))}
    </div>
  );
}
