import { cn } from '../../lib/cn';

/**
 * On/off setting. Always inside a FieldRow, which carries the visible label;
 * `label` here is the accessible name.
 */
export function Switch({
  checked,
  onChange,
  label,
  disabled = false,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-10 rounded-full transition-all duration-200 active:scale-95 before:absolute before:content-[''] before:-inset-2.5",
        checked ? 'bg-theme-500 shadow-sm shadow-theme-500/30' : 'bg-gray-200 dark:bg-dark-border/70',
        disabled && 'opacity-50 pointer-events-none',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200',
          checked && 'translate-x-4',
        )}
      />
    </button>
  );
}
