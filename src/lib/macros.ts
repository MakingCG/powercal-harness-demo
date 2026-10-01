import type { Macro } from '../types/nutrition';

/**
 * Macro identity — letter and name. Macros have no colours of their own:
 * bars are theme orange, letters neutral, the order is always P · C · F.
 */
export const MACROS: Record<Macro, { letter: string; name: string }> = {
  protein: { letter: 'P', name: 'Protein' },
  carbs: { letter: 'C', name: 'Carbs' },
  fat: { letter: 'F', name: 'Fat' },
};

export const MACRO_ORDER: Macro[] = ['protein', 'carbs', 'fat'];
