/** Macro keys. UI labels: P (protein) · C (carbs) · F (fat). */
export type Macro = 'protein' | 'carbs' | 'fat';

export interface MacroTotals {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}
