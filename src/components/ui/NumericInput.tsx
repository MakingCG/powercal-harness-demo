import { useState } from 'react';
import { cn } from '../../lib/cn';
import { DECIMAL_INPUT, formatDecimal, formatPlain, parseDecimal } from '../../lib/format';
import { FIELD_INPUT, FIELD_SHELL, FIELD_SHELL_ON_HIGHLIGHT, FIELD_TEXT, Field } from './TextField';

interface NumericInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  unit?: string;
  placeholder?: string;
  /** Clamped on blur. */
  min?: number;
  max?: number;
  decimals?: number;
  /** inline = right-aligned inside a FieldRow · filled = its own labelled field */
  variant?: 'inline' | 'filled';
  /** filled: the visible label · inline: the input's accessible name (the FieldRow shows the visible one). */
  label?: string;
  hint?: string;
  /** `numeric` only for integer counts; default `decimal`. */
  inputMode?: 'decimal' | 'numeric';
  /** Thousands separator in the blurred display (`1,500`). `false` for years and codes (`1991`, not `1,991`). Never applied while focused. */
  grouping?: boolean;
  /** Focus on mount (the one field of a small sheet, e.g. log weight). */
  autoFocus?: boolean;
  /** filled only: `onHighlight` = white-ish shell for use on a highlight Card. */
  tone?: 'default' | 'onHighlight';
}

/**
 * Comma-tolerant number input: `type="text"`, accepts `1.5` and `1,5` (both
 * mean 1.5 — a comma is always a decimal separator here). Blurred, it shows
 * the en-GB display (`1,500.5`, or ungrouped with `grouping={false}`); on focus
 * the draft switches to `formatPlain` (`1500.5`) so the grouping comma is
 * never re-read as a decimal. Selects on focus, clamps to min/max on blur.
 */
export function NumericInput({
  value,
  onChange,
  unit,
  placeholder,
  min,
  max,
  decimals = 1,
  variant = 'inline',
  label,
  hint,
  inputMode = 'decimal',
  grouping = true,
  autoFocus = false,
  tone = 'default',
}: NumericInputProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const display = (v: number) => (grouping ? formatDecimal(v, decimals) : formatPlain(v, decimals));
  const shown = draft ?? (value != null ? display(value) : '');

  const input = (
    <input
      type="text"
      inputMode={inputMode}
      autoFocus={autoFocus}
      aria-label={variant === 'inline' ? label : undefined}
      value={shown}
      placeholder={placeholder}
      onFocus={(e) => {
        setDraft(value != null ? formatPlain(value, decimals) : '');
        const el = e.currentTarget;
        requestAnimationFrame(() => el.select());
      }}
      onChange={(e) => {
        const raw = e.target.value;
        if (!DECIMAL_INPUT.test(raw)) return;
        setDraft(raw);
        onChange(parseDecimal(raw));
      }}
      onBlur={() => {
        setDraft(null);
        if (value == null) return;
        const clamped = Math.min(max ?? Infinity, Math.max(min ?? -Infinity, value));
        if (clamped !== value) onChange(clamped);
      }}
      className={cn(
        variant === 'inline' ? cn(FIELD_TEXT, 'w-20 text-right') : FIELD_INPUT,
        'tabular-nums',
      )}
    />
  );

  const unitBadge = unit && (
    <span className={cn('text-xs text-gray-400 dark:text-gray-500', variant === 'inline' ? 'w-8' : 'ml-2')}>
      {unit}
    </span>
  );

  if (variant === 'inline') {
    return (
      <span className="inline-flex items-center gap-2">
        {input}
        {unitBadge}
      </span>
    );
  }

  return (
    <Field label={label} hint={hint}>
      <div className={tone === 'onHighlight' ? FIELD_SHELL_ON_HIGHLIGHT : FIELD_SHELL}>
        {input}
        {unitBadge}
      </div>
    </Field>
  );
}
