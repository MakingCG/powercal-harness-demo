import { Apple, CalendarDays, Plus, TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Ref } from 'react';
import { cn } from '../lib/cn';
import { NAV_ITEMS } from '../lib/routes';
import type { NavTab } from '../lib/routes';

export type { NavTab };

const ICONS: Record<NavTab, LucideIcon> = {
  day: CalendarDays,
  foods: Apple,
  progress: TrendingUp,
};

interface BottomNavProps {
  /** Highlighted tab — resolved from the route by AppShell. */
  active: NavTab | null;
  /** FAB — opens the add-food flow for the currently viewed day. */
  onAdd: () => void;
}

/**
 * The 280 px floating glass pill: three tabs on the left, the orange FAB on
 * the RIGHT, over an h-24 gradient fade. Never centered, never full width.
 * Presentational: routing and the active tab are resolved by AppShell.
 */
export function BottomNav({ ref, active, onAdd }: BottomNavProps & { ref?: Ref<HTMLElement> }) {
  return (
    <nav ref={ref} className="fixed bottom-0 left-0 right-0 z-50">
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-dark-bg to-transparent pointer-events-none" />

      <div className="mx-auto max-w-[280px] relative pb-safe-nav">
        <div className="relative bg-white/70 dark:bg-dark-bg/70 backdrop-blur-sm rounded-full shadow-xl border border-gray-200/50 dark:border-dark-border/50 px-2 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-around flex-1">
              {NAV_ITEMS.map((tab) => {
                const isActive = active === tab.id;
                const Icon = ICONS[tab.id];
                return (
                  <Link
                    key={tab.id}
                    to={tab.to}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'flex flex-col items-center justify-center py-1.5 px-3 min-w-[60px] min-h-11',
                      'transition-all duration-200 ease-out rounded-full',
                      isActive
                        ? 'text-theme-600 dark:text-theme-500'
                        : 'text-gray-600 dark:text-gray-400 active:scale-95',
                    )}
                  >
                    <div
                      className={cn(
                        'flex items-center justify-center w-5 h-5 transition-all duration-200 ease-out',
                        isActive && 'scale-110',
                      )}
                    >
                      <Icon size={16} strokeWidth={isActive ? 2.5 : 2} className="drop-shadow-sm" />
                    </div>
                    <span
                      className={cn(
                        'text-[9px] font-medium leading-tight mt-0.5 transition-all duration-200 ease-out',
                        isActive && 'font-semibold',
                      )}
                    >
                      {tab.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            <button
              type="button"
              onClick={onAdd}
              aria-label="Add food"
              className="ml-2 flex items-center justify-center w-12 h-12 rounded-full bg-theme-500 text-white shadow-xl shadow-theme-500/30 transition-all duration-300 active:scale-95 outline-none"
            >
              <Plus size={22} strokeWidth={2.25} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
