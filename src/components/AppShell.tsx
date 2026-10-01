import { useEffect, useRef } from 'react';
import { useLocation, useNavigate, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BottomNav } from './BottomNav';
import { todayKey } from '../lib/date';
import { isStandalone } from '../lib/pwa';
import { activeTab, addPath, isFocusedRoute, pageKey, viewedDay } from '../lib/routes';

/** A keyboard, not toolbar noise: the inset must exceed this to count. */
const KEYBOARD_MIN_INSET = 100;
/** Delay before a focused field under the keyboard is scrolled into view. */
const FOCUS_SCROLL_DELAY_MS = 350;

/**
 * The one canonical app chrome: a viewport-tall, non-scrolling frame; each
 * page is an absolutely positioned scroll container that crossfades on route
 * change (keyed by `pageKey`, so `/day/:date/add` keeps the day mounted);
 * BottomNav floats on top. Pages never render their own nav. Resolves the
 * active tab and nav visibility from `lib/routes.ts`, and publishes the
 * viewport variables `--app-height`, `--vv-height`, `--keyboard-inset` (root)
 * and `--nav-clearance` (frame).
 */
export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  // Freeze the outlet element per render so the exiting page keeps ITS route
  // during the crossfade instead of re-rendering the new one.
  const outlet = useOutlet();
  const { pathname } = location;

  useEffect(() => {
    const root = document.documentElement;
    const standalone = isStandalone();

    const updateViewport = () => {
      const vv = window.visualViewport;
      const vvHeight = vv?.height ?? window.innerHeight;
      // In a standalone PWA, innerHeight excludes the Dynamic Island / status bar
      // area but outerHeight gives the real full-screen height. The frame keeps
      // that height when the keyboard opens; overlays follow --vv-height instead.
      const appHeight = standalone ? window.outerHeight || window.innerHeight : vvHeight;
      root.style.setProperty('--app-height', `${Math.round(appHeight)}px`);
      root.style.setProperty('--vv-height', `${Math.round(vvHeight)}px`);

      const unzoomed = !vv || Math.abs(vv.scale - 1) < 0.01;
      const inset = vv ? window.innerHeight - vv.height - vv.offsetTop : 0;
      root.style.setProperty('--keyboard-inset', unzoomed && inset > KEYBOARD_MIN_INSET ? `${Math.round(inset)}px` : '0px');
    };

    // A focused field that ends up under the keyboard is scrolled to the middle.
    let focusTimer: ReturnType<typeof setTimeout> | undefined;
    const onFocusIn = (e: FocusEvent) => {
      const el = e.target;
      if (!(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) return;
      clearTimeout(focusTimer);
      focusTimer = setTimeout(() => {
        const vvBottom = (window.visualViewport?.height ?? window.innerHeight) + (window.visualViewport?.offsetTop ?? 0);
        const rect = el.getBoundingClientRect();
        if (rect.bottom > vvBottom - 16 || rect.top < 0) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }, FOCUS_SCROLL_DELAY_MS);
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);
    window.visualViewport?.addEventListener('resize', updateViewport);
    window.visualViewport?.addEventListener('scroll', updateViewport);
    document.addEventListener('focusin', onFocusIn);

    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
      window.visualViewport?.removeEventListener('resize', updateViewport);
      window.visualViewport?.removeEventListener('scroll', updateViewport);
      document.removeEventListener('focusin', onFocusIn);
    };
  }, []);

  const showNav = !isFocusedRoute(pathname);

  // Nav clearance: how far the floating nav reaches up into the scroll frame,
  // measured, not assumed — on iOS the frame (`--app-height`) and the fixed
  // nav's viewport can differ, so a fixed bottom padding left the last card
  // under the nav. PageContainer pads by `--nav-clearance` (utility `pb-nav`).
  const frameRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const measure = () => {
      const nav = navRef.current;
      const covered = nav ? frame.getBoundingClientRect().bottom - nav.getBoundingClientRect().top : 0;
      frame.style.setProperty('--nav-clearance', `${Math.max(0, Math.round(covered))}px`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(frame);
    if (navRef.current) ro.observe(navRef.current);
    window.addEventListener('resize', measure);
    window.visualViewport?.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
      window.visualViewport?.removeEventListener('resize', measure);
    };
  }, [showNav]);

  return (
    <div
      ref={frameRef}
      className="relative overflow-hidden h-[var(--app-height,100vh)] bg-white dark:bg-dark-bg text-gray-900 dark:text-gray-100"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={pageKey(pathname)}
          data-page-scroll={pageKey(pathname)}
          className="absolute inset-0 overflow-y-auto overscroll-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        >
          {outlet}
        </motion.div>
      </AnimatePresence>
      {showNav && (
        <BottomNav
          ref={navRef}
          active={activeTab(pathname)}
          onAdd={() => navigate(addPath(viewedDay(pathname) ?? todayKey()))}
        />
      )}
    </div>
  );
}
