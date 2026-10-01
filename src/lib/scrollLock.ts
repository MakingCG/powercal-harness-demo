/**
 * Overlay bookkeeping shared by Drawer and Dialog.
 *
 * - Reference-counted body scroll lock: two overlays open at once (a dialog on
 *   top of a drawer) must not unlock the body when only one of them closes.
 * - Open-overlay count (`openOverlayCount` / `subscribeOverlays`): the SW
 *   update prompt (F006) waits until no overlay is open.
 * - Escape stack (`pushEscape`): Escape closes ONE overlay per press — only the
 *   topmost registered handler runs.
 */
let locks = 0;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

export function lockScroll(): () => void {
  locks += 1;
  if (locks === 1) document.body.style.overflow = 'hidden';
  notify();
  let released = false;
  return () => {
    if (released) return;
    released = true;
    locks -= 1;
    if (locks === 0) document.body.style.overflow = '';
    notify();
  };
}

/** Number of overlays (drawers + dialogs) currently open. */
export function openOverlayCount(): number {
  return locks;
}

/** Subscribe to changes of `openOverlayCount()` (useSyncExternalStore-compatible). */
export function subscribeOverlays(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const escapeStack: (() => void)[] = [];

function onKeyDown(e: KeyboardEvent) {
  if (e.key !== 'Escape' || escapeStack.length === 0) return;
  e.preventDefault();
  escapeStack[escapeStack.length - 1]();
}

/**
 * Register an Escape handler on top of the stack; returns the unregister
 * function. Only the topmost handler runs per key press.
 */
export function pushEscape(handler: () => void): () => void {
  if (escapeStack.length === 0) window.addEventListener('keydown', onKeyDown);
  escapeStack.push(handler);
  return () => {
    const i = escapeStack.lastIndexOf(handler);
    if (i !== -1) escapeStack.splice(i, 1);
    if (escapeStack.length === 0) window.removeEventListener('keydown', onKeyDown);
  };
}
