import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pageKey } from '../lib/routes';

/**
 * Scroll reset on page change. The body never scrolls — each page scrolls in
 * AppShell's `[data-page-scroll]` container, keyed by `pageKey`, so a new page
 * normally mounts a fresh container at the top; this resets it explicitly as
 * well. Keyed by `pageKey`, not the pathname: opening or closing the add sheet
 * (`/day/:date/add` ↔ `/day/:date`) must keep the day's scroll position.
 */
export function ScrollToTop() {
  const key = pageKey(useLocation().pathname);

  useEffect(() => {
    document.querySelectorAll<HTMLElement>(`[data-page-scroll="${CSS.escape(key)}"]`).forEach((el) => {
      el.scrollTop = 0;
    });
  }, [key]);

  return null;
}
