/**
 * The `localStorage` mirror of the theme preference. `index.html`'s pre-paint
 * script reads the same key and sets `.dark` before React mounts, so a cold
 * start never flashes the wrong theme. The source of truth stays
 * `userProfile.settings.theme` (via `useAppTheme`).
 */
import type { Theme } from '../types/theme';

export const THEME_STORAGE_KEY = 'powercal:theme';

export function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system';
}

export function readThemeMirror(): Theme | null {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(v) ? v : null;
  } catch {
    return null;
  }
}

export function writeThemeMirror(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Private mode / storage full: the mirror is a nicety, the profile is the truth.
  }
}
