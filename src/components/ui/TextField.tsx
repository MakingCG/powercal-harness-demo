import type { InputHTMLAttributes, ReactNode } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../lib/cn';

/** The filled input shell — one shape for every input in the app. */
export const FIELD_SHELL =
  'flex items-center h-11 px-3 rounded-xl bg-gray-100 dark:bg-dark-border/50 text-gray-900 dark:text-gray-100';

/** FIELD_SHELL on a highlight Card: white-ish fill instead of gray (DESIGN_SYSTEM §2.4). */
export const FIELD_SHELL_ON_HIGHLIGHT =
  'flex items-center h-11 px-3 rounded-xl bg-white/60 dark:bg-dark-card/40 text-gray-900 dark:text-gray-100';

/** Text treatment of every input (no layout). */
export const FIELD_TEXT =
  'bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 outline-none placeholder:text-gray-300 dark:placeholder:text-gray-600';

/** An input that fills its FIELD_SHELL. */
export const FIELD_INPUT = `flex-1 min-w-0 w-full ${FIELD_TEXT}`;

/**
 * Field envelope: small label above, optional hint below. There is NO error
 * slot — failures go to ErrorDialog, invalid input is prevented, not scolded.
 */
export function Field({
  label,
  optional = false,
  hint,
  children,
  className,
  as: Tag = 'label',
}: {
  label?: string;
  optional?: boolean;
  hint?: string;
  children: ReactNode;
  className?: string;
  /** `div` (a labelled `group`) for a set of buttons such as a chip row — a `<label>` would forward taps on its text to the first chip. */
  as?: 'label' | 'div';
}) {
  return (
    <Tag className={cn('block', className)} {...(Tag === 'div' ? { role: 'group', 'aria-label': label } : {})}>
      {label && (
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1.5">
          {label}
          {optional && <span className="font-normal"> (optional)</span>}
        </span>
      )}
      {children}
      {hint && <span className="block text-[11px] text-gray-400 dark:text-gray-500 mt-1.5 leading-snug">{hint}</span>}
    </Tag>
  );
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  optional?: boolean;
  hint?: string;
  /** Unit badge on the right, e.g. `g`, `kcal`. */
  suffix?: string;
}

/**
 * Filled text input (also `type="date"`). For numbers use NumericInput —
 * never `type="number"`.
 */
export function TextField({ label, optional, hint, suffix, className, ...rest }: TextFieldProps) {
  return (
    <Field label={label} optional={optional} hint={hint} className={className}>
      <div className={FIELD_SHELL}>
        <input className={cn(FIELD_INPUT, 'appearance-none')} {...rest} />
        {suffix && <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">{suffix}</span>}
      </div>
    </Field>
  );
}

/** Filled search input with a leading magnifier and a clear button. */
export function SearchField({
  value,
  onChange,
  placeholder = 'Search',
  autoFocus,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(FIELD_SHELL, 'gap-2', className)}>
      <Search size={16} className="text-gray-400 dark:text-gray-500 shrink-0" />
      <input
        type="search"
        enterKeyHint="search"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(FIELD_INPUT, '[&::-webkit-search-cancel-button]:hidden')}
      />
      {value !== '' && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear"
          className="-mr-1 w-8 h-8 inline-flex items-center justify-center rounded-full text-gray-400 dark:text-gray-500 active:scale-95"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
