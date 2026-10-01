import { ChevronLeft } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { IconButton } from './ui/IconButton';
import { useGoBack } from '../hooks/useGoBack';

interface HeaderAction {
  icon: LucideIcon;
  onClick: () => void;
  'aria-label': string;
}

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: HeaderAction;
}

/**
 * Fixed glass header for "with header" pages (template B/C). Renders its own
 * `h-header-offset` spacer, so the page container below starts right under it.
 * Fixed height — no extra rows: search fields and filters go into the page body.
 * Back defaults to `useGoBack()` (history, else the parent route).
 */
export function Header({ title, showBack = false, onBack, rightAction }: HeaderProps) {
  const goBack = useGoBack();

  const handleBack = () => {
    if (onBack) onBack();
    else goBack();
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 pt-safe bg-white/80 dark:bg-dark-bg/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-dark-border/50">
        <div className="max-w-md mx-auto px-page py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center -ml-2.5">
              {showBack ? (
                <IconButton icon={ChevronLeft} label="Back" onClick={handleBack} iconSize={20} />
              ) : (
                <div className="w-9 h-9" />
              )}
            </div>

            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 text-center flex-1 mx-4 truncate">
              {title}
            </h1>

            <div className="flex items-center -mr-2.5">
              {rightAction ? (
                <IconButton
                  icon={rightAction.icon}
                  label={rightAction['aria-label']}
                  onClick={rightAction.onClick}
                />
              ) : (
                <div className="w-9 h-9" />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="h-header-offset shrink-0" aria-hidden="true" />
    </>
  );
}
