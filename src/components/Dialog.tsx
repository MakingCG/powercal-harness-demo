import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../lib/cn';
import { lockScroll, pushEscape } from '../lib/scrollLock';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  /** The button row — one or two full-height `rounded-xl` buttons (see ConfirmDialog). */
  actions: ReactNode;
}

/**
 * Centered glass dialog — one focused question. Base shell for ConfirmDialog
 * and ErrorDialog; sits above drawers (z-[110]).
 */
export function Dialog({ open, onClose, title, description, actions }: DialogProps) {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Escape closes only the topmost overlay (shared escape stack with Drawer).
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
        <div className="fixed inset-0 z-[110] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            role="alertdialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ type: 'spring', duration: 0.3, bounce: 0.15 }}
            className={cn(
              'relative z-10 w-[calc(100%-2.5rem)] max-w-sm',
              'rounded-2xl p-6',
              'bg-white/90 dark:bg-dark-card/90 backdrop-blur-xl',
              'border border-gray-200/50 dark:border-dark-border/50',
              'shadow-2xl',
            )}
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
            {description && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {description}
              </p>
            )}
            <div className="mt-6 flex gap-3">{actions}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/** Dialog button — `h-12 rounded-xl`, the only buttons allowed inside a Dialog. */
export function DialogButton({
  children,
  onClick,
  variant = 'secondary',
}: {
  children: ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'destructive';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex-1 h-12 rounded-xl text-sm font-semibold active:scale-[0.98] transition-all duration-200',
        variant === 'secondary' &&
          'border border-gray-200/50 dark:border-dark-border/50 text-gray-700 dark:text-gray-300',
        variant === 'primary' && 'text-white bg-theme-500 shadow-lg shadow-theme-500/30',
        variant === 'destructive' && 'text-white bg-red-500 shadow-lg shadow-red-500/30',
      )}
    >
      {children}
    </button>
  );
}
