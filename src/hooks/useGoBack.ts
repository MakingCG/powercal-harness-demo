import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { parentRoute } from '../lib/routes';
import { todayKey } from '../lib/date';

/** React Router keeps the session history index in `history.state.idx`. */
function hasInAppHistory(): boolean {
  const state = window.history.state as { idx?: number } | null;
  return (state?.idx ?? 0) > 0;
}

/**
 * Back: `navigate(-1)` when there is in-app history, otherwise the parent
 * route (`/foods` for a food, `/day/<today>` elsewhere, or `fallback`) — so a
 * cold deep link never "backs" out of the app.
 */
export function useGoBack(fallback?: string) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return useCallback(() => {
    if (hasInAppHistory()) navigate(-1);
    else navigate(fallback ?? parentRoute(pathname, todayKey()), { replace: true });
  }, [navigate, pathname, fallback]);
}
