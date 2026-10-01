import { useEffect, useSyncExternalStore } from 'react';
import { writeThemeMirror } from '../lib/theme';
import type { ResolvedTheme, Theme } from '../types/theme';

const QUERY = '(prefers-color-scheme: dark)';

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia(QUERY).matches ? 'dark' : 'light';
}

function subscribeToSystemTheme(callback: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', callback);
  document.addEventListener('visibilitychange', callback);
  return () => {
    mq.removeEventListener('change', callback);
    document.removeEventListener('visibilitychange', callback);
  };
}

/**
 * Applies a theme preference: toggles `.dark` on <html>, rewrites
 * <meta name="theme-color">, mirrors the choice to `localStorage['powercal:theme']`
 * (read by the pre-paint script in index.html) and, in `system`, follows
 * `prefers-color-scheme` live. The preference itself is owned by the caller —
 * `useAppTheme()` feeds it from `userProfile.settings.theme`; the showcase from local state.
 */
export function useTheme(theme: Theme = 'system') {
  const systemTheme = useSyncExternalStore(subscribeToSystemTheme, getSystemTheme);
  const resolvedTheme: ResolvedTheme = theme === 'system' ? systemTheme : theme;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute('content', resolvedTheme === 'dark' ? '#01080e' : '#ffffff');
  }, [resolvedTheme]);

  useEffect(() => {
    writeThemeMirror(theme);
  }, [theme]);

  return { theme, resolvedTheme };
}
