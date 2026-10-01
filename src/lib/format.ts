/**
 * Number formatting — en-GB everywhere: decimal point, comma as the thousands
 * separator (`1,842`, `19.4`, `1,234.5`). kcal → integer, grams / kg → one
 * decimal. Always render the result inside `tabular-nums`.
 *
 * Input rule: an editable field never shows grouping (use `formatPlain`), and
 * the parser treats a comma as a DECIMAL separator, never as grouping — so a
 * user may type `1.5` or `1,5` and both mean 1.5. Because the input never
 * displays `1,500`, the comma is never ambiguous.
 */

const cache = new Map<string, Intl.NumberFormat>();

function formatter(decimals: number, grouping: boolean): Intl.NumberFormat {
  const key = `${decimals}:${grouping}`;
  let f = cache.get(key);
  if (!f) {
    f = new Intl.NumberFormat('en-GB', {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals,
      useGrouping: grouping,
    });
    cache.set(key, f);
  }
  return f;
}

/** `1842.4` → `1,842` */
export function formatKcal(value: number): string {
  return formatter(0, true).format(Math.round(value));
}

/** `19.44` → `19.4`, `1234.5` → `1,234.5` — macros, grams, weight. */
export function formatDecimal(value: number, decimals = 1): string {
  return formatter(decimals, true).format(value);
}

const FIXED_1 = new Intl.NumberFormat('en-GB', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** `89.44` → `89.4`, `85` → `85.0` — a weight number, always one decimal (big readouts with a separate unit). */
export function formatWeight(kg: number): string {
  return FIXED_1.format(Math.round(kg * 10) / 10);
}

/** `89.44` → `89.4 kg` — weights and targets, always one decimal (`85.0 kg`). */
export function formatKg(kg: number): string {
  return `${formatWeight(kg)} kg`;
}


/**
 * A signed delta with the true minus (`−1.4`, `+0.3`), fixed decimals —
 * weight changes (1) and paces (2). Rounds first; a zero reads `0`, never
 * `−0.0` (`0 kg / 7 days`).
 */
export function formatSignedDecimal(value: number, decimals = 1): string {
  const factor = 10 ** decimals;
  const rounded = Math.round(value * factor) / factor;
  const abs = (decimals === 1 ? FIXED_1 : new Intl.NumberFormat('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })).format(Math.abs(rounded));
  if (rounded === 0) return '0';
  return `${rounded < 0 ? '−' : '+'}${abs}`;
}

/** `1500` → `1500`, `1234.56` → `1234.6` — no grouping; for values shown inside an editable input. */
export function formatPlain(value: number, decimals = 1): string {
  return formatter(decimals, false).format(value);
}

/**
 * Parse user input; a comma is read as the decimal separator (`1,5` → 1.5).
 * Returns `null` when empty or invalid.
 */
export function parseDecimal(raw: string): number | null {
  if (raw.trim() === '') return null;
  const n = Number(raw.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

/** The only input shape numeric fields accept while typing: digits + one `.` or `,` (decimal). No grouping. */
export const DECIMAL_INPUT = /^\d*[.,]?\d*$/;

/** A whole-number count with grouping: `1842` → `1,842` (row counts, list sizes — not energy). */
export function formatCount(value: number): string {
  return formatter(0, true).format(Math.round(value));
}

/** `plural(1, 'item', 'items')` → `1 item`, `plural(3, …)` → `3 items`. Never hardcode a plural. */
export function plural(n: number, one: string, other: string): string {
  return `${formatKcal(n)} ${n === 1 ? one : other}`;
}

/** Storage sizes, en-GB: `4.2 MB`, `2 GB`, `512 kB`. */
export function formatBytes(bytes: number): string {
  if (bytes < 1000) return `${formatKcal(bytes)} B`;
  const units = ['kB', 'MB', 'GB', 'TB'];
  let value = bytes / 1000;
  let i = 0;
  while (value >= 1000 && i < units.length - 1) {
    value /= 1000;
    i += 1;
  }
  return `${formatDecimal(value, value >= 100 ? 0 : 1)} ${units[i]}`;
}

/** `30` → `30%` (no space). */
export function formatPercent(value: number): string {
  return `${formatKcal(value)}%`;
}
