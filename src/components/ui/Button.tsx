import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'soft' | 'danger' | 'ghost' | 'link';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: 'md' | 'sm';
  icon?: LucideIcon;
  trailingIcon?: LucideIcon;
  fullWidth?: boolean;
  loading?: boolean;
  /**
   * `onCamera` (secondary only) = dark glass pill with white text, for actions
   * over the scanner's camera (template D). `cn()` does not merge classes, so
   * colours are never overridden via `className` — use a variant or this tone.
   */
  tone?: 'default' | 'onCamera';
}

const VARIANTS: Record<ButtonVariant, string> = {
  // Signature rule 4: anything primary carries the coloured shadow.
  primary: 'bg-theme-500 text-white shadow-lg shadow-theme-500/30',
  secondary:
    'bg-white/60 dark:bg-dark-card/60 border border-gray-200/50 dark:border-dark-border/50 text-gray-700 dark:text-gray-300',
  // The white button that sits ON a highlighted (orange-gradient) card.
  soft: 'bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100 shadow-sm',
  danger: 'border border-red-200 dark:border-red-500/20 text-red-500',
  ghost: 'text-gray-600 dark:text-gray-400',
  link: 'text-theme-500',
};

const ON_CAMERA = 'bg-black/40 border border-white/20 text-white backdrop-blur-sm';

/**
 * The one button. Pill-shaped (`rounded-full`) except `ghost`/`link`.
 * Size `md` = h-11 (form & sheet CTA), `sm` = h-9 visual (inside cards) with
 * an invisible layer padding its hit area to 44 px.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  trailingIcon: TrailingIcon,
  fullWidth = false,
  loading = false,
  tone = 'default',
  disabled,
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  const isLink = variant === 'link';
  const inactive = disabled || loading;
  return (
    <button
      type={type}
      disabled={inactive}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 outline-none',
        isLink
          ? 'gap-0.5 text-xs font-medium active:opacity-70'
          : cn(
              'active:scale-[0.98]',
              // sm is 36 px visually; an invisible layer pads the hit area to 44 px (like IconButton).
              size === 'md' ? 'h-11 px-5 text-sm' : "relative h-9 px-4 text-xs before:absolute before:content-[''] before:inset-x-0 before:-inset-y-1",
              variant === 'ghost' ? 'rounded-xl font-medium' : 'rounded-full',
            ),
        tone === 'onCamera' && variant === 'secondary' ? ON_CAMERA : VARIANTS[variant],
        fullWidth && 'w-full',
        inactive && 'opacity-50 pointer-events-none shadow-none',
        className,
      )}
      {...rest}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        Icon && <Icon size={isLink || size === 'sm' ? 14 : 16} className="shrink-0" />
      )}
      {children}
      {TrailingIcon && <TrailingIcon size={14} className="shrink-0" />}
    </button>
  );
}
