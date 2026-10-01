/**
 * Shell routing helpers — the only place AppShell, BottomNav, Header and
 * ScrollToTop read route shapes from. Pure. Features add their own path
 * builders here (e.g. `foodPath`, `scanPath`) rather than writing literals.
 */
import { isDayKey, todayKey } from './date';

export type NavTab = 'day' | 'foods' | 'progress';

/** The three bottom-nav tabs. `path` decides the active state, `to` is the link target. */
export const NAV_ITEMS: readonly { id: NavTab; label: string; path: string; to: string }[] = [
  { id: 'day', label: 'Today', path: '/day', to: '/' },
  { id: 'foods', label: 'Foods', path: '/foods', to: '/foods' },
  { id: 'progress', label: 'Progress', path: '/progress', to: '/progress' },
];

export function dayPath(date: string): string {
  return `/day/${date}`;
}

/** The add-food sheet for a day. Without `meal` (the FAB) the picker picks its default slot. */
export function addPath(date: string, meal?: string): string {
  return meal ? `/day/${date}/add?meal=${meal}` : `/day/${date}/add`;
}

/** Routes that own the viewport: no bottom nav. */
const FOCUSED: readonly RegExp[] = [
  /^\/scan(\/|$)/,
  /^\/onboarding(\/|$)/,
  /^\/day\/[^/]+\/add(\/|$)/,
  /^\/foods\/new(\/|$)/,
  /^\/foods\/[^/]+\/edit(\/|$)/,
];

export function isFocusedRoute(pathname: string): boolean {
  return FOCUSED.some((re) => re.test(pathname));
}

/** Active tab: `path === '/' ? pathname === '/' : pathname.startsWith(path)`. `/settings` has none. */
export function activeTab(pathname: string): NavTab | null {
  if (pathname === '/') return 'day';
  return NAV_ITEMS.find((item) => pathname.startsWith(item.path))?.id ?? null;
}

/** The day the user is looking at (`/day/:date…`), or `null` off the day page. */
export function viewedDay(pathname: string): string | null {
  const date = /^\/day\/([^/]+)/.exec(pathname)?.[1];
  return date && isDayKey(date) ? date : null;
}

/**
 * Crossfade / scroll / error-boundary key. `/day/:date/add` shares the day's
 * key so the day page stays mounted (and keeps its scroll) under the add sheet.
 */
export function pageKey(pathname: string): string {
  const add = /^(\/day\/[^/]+)\/add(\/|$)/.exec(pathname);
  if (add) return add[1];
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
}

/** Where Back goes without in-app history: `/foods` for a food, the food for its edit form, the day for its add sheet, else today. */
export function parentRoute(pathname: string, today: string = todayKey()): string {
  const edit = /^\/foods\/([^/]+)\/edit/.exec(pathname);
  if (edit && edit[1] !== 'new') return `/foods/${edit[1]}`;
  if (/^\/foods\/[^/]+/.test(pathname)) return '/foods';
  const add = /^(\/day\/[^/]+)\/add/.exec(pathname);
  if (add) return add[1];
  return dayPath(today);
}
