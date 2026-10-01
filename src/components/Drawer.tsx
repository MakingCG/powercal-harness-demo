import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useDragControls } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../lib/cn';
import { lockScroll, pushEscape } from '../lib/scrollLock';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

/**
 * Bottom sheet — the ONLY sheet in the app. Every picker, amount editor,
 * action list and small form is a Drawer child. Portals to <body>, springs in,
 * closes on backdrop tap, Escape (one overlay per press — the escape stack in
 * `lib/scrollLock`) and drag-down on the handle. Uses the ref-counted scroll
 * lock, caps at max-w-md and pads the safe-area bottom. Sits on top of the iOS
 * keyboard (`--keyboard-inset`) and is capped to the visible height (`--vv-height`).
 */
export function Drawer({ open, onClose, children, className }: DrawerProps) {
  const dragControls = useDragControls();
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const unlock = lockScroll();
    const popEscape = pushEscape(() => onCloseRef.current());
    return () => {
      popEscape();
      unlock();
    };
  }, [open]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) onClose();
            }}
            className={cn(
              'fixed bottom-[var(--keyboard-inset,0px)] left-0 right-0 mx-auto max-w-md',
              'max-h-[calc(var(--vv-height,var(--app-height,100vh))-3rem)] overflow-y-auto overscroll-contain',
              'rounded-t-3xl px-5 pt-3 pb-safe',
              'bg-white dark:bg-dark-card',
              className,
            )}
          >
            <div
              className="-mt-3 pt-3 pb-5 cursor-grab touch-none"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600 mx-auto" />
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/** Sheet title row: 18 px theme icon + bold title, optional one-line description. */
export function DrawerHeader({
  icon: Icon,
  title,
  description,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={18} className="text-theme-500 shrink-0" />}
        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 truncate">{title}</h2>
      </div>
      {description && (
        <p className={cn('text-xs text-gray-500 dark:text-gray-400 mt-1', Icon && 'pl-[26px]')}>
          {description}
        </p>
      )}
    </div>
  );
}

/**
 * One row of an action sheet (edit / move / delete) or a single-choice list
 * (sort by, meal slot). `active` marks the current choice; `danger` is for
 * destructive rows only. `description` = one muted line under the label
 * (e.g. the activity levels in Settings › Profile).
 */
export function DrawerAction({
  icon: Icon,
  label,
  description,
  onClick,
  tone = 'default',
  active = false,
  disabled = false,
  trailing,
}: {
  icon?: LucideIcon;
  label: string;
  description?: string;
  onClick: () => void;
  tone?: 'default' | 'danger';
  active?: boolean;
  disabled?: boolean;
  trailing?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active || undefined}
      className={cn(
        disabled && 'opacity-40 pointer-events-none',
        'w-full flex items-center gap-4 px-4 min-h-12 py-3 rounded-xl text-left text-sm font-medium',
        'transition-colors duration-150',
        tone === 'danger'
          ? 'text-red-600 dark:text-red-400 active:bg-red-50 dark:active:bg-red-950/20'
          : active
            ? 'bg-theme-500/10 dark:bg-theme-500/15 text-theme-600 dark:text-theme-400'
            : 'text-gray-700 dark:text-gray-200 active:bg-gray-100/50 dark:active:bg-dark-border/30',
      )}
    >
      {Icon && (
        <Icon
          size={20}
          className={cn(
            'shrink-0',
            tone === 'danger' ? 'text-red-500' : 'text-theme-600 dark:text-theme-500',
          )}
        />
      )}
      {description ? (
        <span className="flex-1 min-w-0">
          <span className="block truncate">{label}</span>
          <span className="block text-xs font-normal text-gray-500 dark:text-gray-400 mt-0.5">{description}</span>
        </span>
      ) : (
        <span className="flex-1 min-w-0 truncate">{label}</span>
      )}
      {trailing}
    </button>
  );
}

/** Groups DrawerAction rows with the canonical 4 px rhythm. */
export function DrawerActions({ children }: { children: ReactNode }) {
  return <div className="space-y-1">{children}</div>;
}
