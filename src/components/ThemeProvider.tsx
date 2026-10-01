import type { ReactNode } from 'react';
import { useTheme } from '../hooks/useTheme';
import { readThemeMirror } from '../lib/theme';
import type { Theme } from '../types/theme';

/**
 * Mounts the theme side-effect at the root of the app. No context — the
 * preference comes in as a prop (F005 passes `userProfile.settings.theme` via
 * its `useAppTheme()` hook). Without a prop it falls back to the
 * `localStorage` mirror (`lib/theme`), then `system`.
 */
export function ThemeProvider({ theme, children }: { theme?: Theme; children: ReactNode }) {
  useTheme(theme ?? readThemeMirror() ?? 'system');
  return <>{children}</>;
}
