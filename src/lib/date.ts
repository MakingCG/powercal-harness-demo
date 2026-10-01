/**
 * Day keys are local `YYYY-MM-DD` strings (never UTC ISO dates).
 * Weeks start on Monday. Labels are English (en-GB order: day before month).
 * Month and weekday names are hardcoded on purpose — `Intl` en-GB returns
 * `Sept`, and the week start must not depend on locale data.
 */

/** Monday-first, index-keyed (the duplicate letters are fine). */
export const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

export const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const;

/** Monday-first, like DAY_LETTERS. */
export const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

export const WEEKDAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export function toDayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseDayKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function todayKey(): string {
  return toDayKey(new Date());
}

export function addDays(key: string, days: number): string {
  const d = parseDayKey(key);
  d.setDate(d.getDate() + days);
  return toDayKey(d);
}

/** Monday of the week that contains `key`. */
export function startOfWeek(key: string): string {
  const d = parseDayKey(key);
  const offset = d.getDay() === 0 ? -6 : 1 - d.getDay();
  d.setDate(d.getDate() + offset);
  return toDayKey(d);
}

/** Seven day keys, Monday → Sunday, of the week containing `key`. */
export function weekOf(key: string): string[] {
  const monday = startOfWeek(key);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

/** Monday-first weekday index (0 = Monday … 6 = Sunday). */
function weekdayIndex(d: Date): number {
  return (d.getDay() + 6) % 7;
}

/** `2026-09-27` → `September 2026` */
export function monthLabel(key: string): string {
  const d = parseDayKey(key);
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** `2026-09-29` → `29 Sep` — chart axes, chips, tooltips. */
export function shortDayLabel(key: string): string {
  const d = parseDayKey(key);
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
}

/** `2026-09-29` → `Tue, 29 Sep` — day-page title, chart tooltip title. */
export function mediumDayLabel(key: string): string {
  const d = parseDayKey(key);
  return `${WEEKDAYS_SHORT[weekdayIndex(d)]}, ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
}

/** `2026-09-29` → `Tuesday, 29 September` — page subtitle. */
export function longDayLabel(key: string): string {
  const d = parseDayKey(key);
  return `${WEEKDAYS[weekdayIndex(d)]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

/** `2026-09-29` → `29 Sep 2026` — dates outside the current context (backups, ETA, "valid from"). */
export function fullDayLabel(key: string): string {
  const d = parseDayKey(key);
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

/** `true` for a real local calendar day in `YYYY-MM-DD` form (`2026-13-45` and `2026-02-30` are not). */
export function isDayKey(value: string | undefined | null): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return toDayKey(parseDayKey(value)) === value;
}

/** Whole days from `from` to `to` (local days, DST-safe). */
export function daysBetween(from: string, to: string): number {
  const a = parseDayKey(from);
  const b = parseDayKey(to);
  return Math.round((Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / 86_400_000);
}

/** `Today` · `Yesterday` · `Tomorrow`, otherwise the medium format (`Tue, 29 Sep`). */
export function relativeDayLabel(key: string, today: string): string {
  const diff = daysBetween(today, key);
  if (diff === 0) return 'Today';
  if (diff === -1) return 'Yesterday';
  if (diff === 1) return 'Tomorrow';
  return mediumDayLabel(key);
}

/** Milliseconds until the next local midnight (plus a small margin). */
export function msUntilMidnight(now: Date = new Date()): number {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1);
  return next.getTime() - now.getTime();
}

/**
 * Source-day chip label (F027): `Today` · `Yesterday` · `2 days ago` relative
 * to TODAY, otherwise the short format (`26 Sep`). Not the page-title form
 * (`relativeDayLabel`), which never says "days ago".
 */
export function relativeChipLabel(key: string, today: string): string {
  const diff = daysBetween(key, today);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff === 2) return '2 days ago';
  return shortDayLabel(key);
}

/** Relative age in lowercase (DESIGN_SYSTEM §5): `today` · `yesterday` · `3 days ago`. */
export function daysAgoLabel(days: number): string {
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  return `${days} days ago`;
}

/** `YYYY-MM` of a day key. */
export function monthOf(key: string): string {
  return key.slice(0, 7);
}

/** First and last day key of a `YYYY-MM` month and its length (local calendar, never ms arithmetic). */
export function monthBounds(month: string): { from: string; to: string; days: number } {
  const from = `${month}-01`;
  const d = parseDayKey(from);
  const to = toDayKey(new Date(d.getFullYear(), d.getMonth() + 1, 0));
  return { from, to, days: daysBetween(from, to) + 1 };
}

/** `2026-09` shifted by `delta` months → `2026-10`. */
export function addMonths(month: string, delta: number): string {
  const d = parseDayKey(`${month}-01`);
  return monthOf(toDayKey(new Date(d.getFullYear(), d.getMonth() + delta, 1)));
}
