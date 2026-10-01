import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

/** F020 AC4: a swipe must travel more than this… */
export const SWIPE_MIN_PX = 60;
/** …and be at least this many times more horizontal than vertical. */
export const SWIPE_RATIO = 1.5;

/**
 * Horizontal swipe on an element via NATIVE touch listeners (portalled sheets
 * are outside the element's DOM, so their gestures never reach it). Gestures
 * that start inside a `[data-no-swipe]` region are ignored, so the week strip
 * and the weight card keep their own behaviour.
 */
export function useSwipe(
  ref: RefObject<HTMLElement | null>,
  {
    onSwipeLeft,
    onSwipeRight,
    respectNoSwipe = true,
  }: {
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
    /** `false` for a region that is itself `[data-no-swipe]` and swipes on its own (the week strip). */
    respectNoSwipe?: boolean;
  },
) {
  const handlers = useRef({ onSwipeLeft, onSwipeRight });
  useEffect(() => {
    handlers.current = { onSwipeLeft, onSwipeRight };
  }, [onSwipeLeft, onSwipeRight]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let start: { x: number; y: number } | null = null;

    const onStart = (e: TouchEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      if (e.touches.length !== 1 || (respectNoSwipe && target?.closest('[data-no-swipe]'))) {
        start = null;
        return;
      }
      start = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onEnd = (e: TouchEvent) => {
      if (!start) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      start = null;
      if (Math.abs(dx) <= SWIPE_MIN_PX || Math.abs(dx) < SWIPE_RATIO * Math.abs(dy)) return;
      if (dx < 0) handlers.current.onSwipeLeft();
      else handlers.current.onSwipeRight();
    };
    const onCancel = () => {
      start = null;
    };

    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchend', onEnd, { passive: true });
    el.addEventListener('touchcancel', onCancel, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchend', onEnd);
      el.removeEventListener('touchcancel', onCancel);
    };
  }, [ref, respectNoSwipe]);
}
