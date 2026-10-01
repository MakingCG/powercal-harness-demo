/**
 * The one ±5 % intake band (DESIGN_SYSTEM §2.6), shared by the day summary
 * pill (F021), the month calendar tint (F042) and the intake bars (F043).
 * Pure, React-free.
 */
/** Lower edge of `On target` as a share of the goal kcal. */
export const IN_GOAL_LOW = 0.95;
/** Upper edge of `On target` as a share of the goal kcal. */
export const IN_GOAL_HIGH = 1.05;

export type IntakeStatus = 'notLogged' | 'under' | 'onTarget' | 'over';

/** `StatusPill` tones, mirrored here so `lib/` stays free of component types. */
export type IntakeTone = 'neutral' | 'accent' | 'good' | 'warn';

/**
 * Status of a day's kcal against its goal. No entries → `notLogged`; without a
 * usable goal (`null` / 0) there is no status to judge — callers hide the pill.
 */
export function intakeStatus(kcal: number, goalKcal: number | null | undefined, hasEntries: boolean): IntakeStatus | null {
  if (!hasEntries) return 'notLogged';
  const adherence = adherenceOf(kcal, goalKcal);
  return adherence === 'noGoal' ? null : adherence;
}

/** A logged day against its goal: below / within / above the band, or `noGoal` (neutral grey). */
export type Adherence = 'under' | 'onTarget' | 'over' | 'noGoal';

/**
 * Adherence of a LOGGED day (F042 tint, F043 bar): the same band as
 * `intakeStatus`, but a missing or zero goal is `noGoal` rather than hidden.
 */
export function adherenceOf(kcal: number, goalKcal: number | null | undefined): Adherence {
  if (!goalKcal || goalKcal <= 0) return 'noGoal';
  const ratio = kcal / goalKcal;
  if (ratio < IN_GOAL_LOW) return 'under';
  if (ratio <= IN_GOAL_HIGH) return 'onTarget';
  return 'over';
}

export const INTAKE_LABELS: Record<IntakeStatus, string> = {
  notLogged: 'Not logged',
  under: 'Under goal',
  onTarget: 'On target',
  over: 'Over goal',
};

export const INTAKE_TONES: Record<IntakeStatus, IntakeTone> = {
  notLogged: 'neutral',
  under: 'accent',
  onTarget: 'good',
  over: 'warn',
};

/* ------------------------------------------------------------ history (F042, F043) */

/** One day of the intake chart (F043). Unlogged days carry zeros and `logged: false`. */
export interface IntakePoint {
  /** `YYYY-MM-DD` */
  date: string;
  logged: boolean;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  /** `goalInForce(date)` kcal — `null` before the first goal or without goals (no track, grey bar). */
  goalKcal: number | null;
}

/** Month-grid tint of a logged day (F042); unlogged days have none. */
export type DayTint = Adherence;

export const ADHERENCE_LABELS: Record<Exclude<Adherence, 'noGoal'>, string> = {
  under: 'Under goal',
  onTarget: 'On target',
  over: 'Over goal',
};
