import type { ButtonHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: LucideIcon;
  /** Required — becomes `aria-label` (and `title`). */
  label: string;
  /** ghost: header/card chrome · soft: stepper ± / filled · outline: next to a CTA */
  variant?: 'ghost' | 'soft' | 'outline';
  /** lg = 44 px (soft ± next to a 44 px field) · md = 36 px visual · sm = 28 px (card kebab). All keep a ≥44 px hit area. */
  size?: 'lg' | 'md' | 'sm';
  /**
   * soft: `onHighlight` = white-ish fill, for use on a highlight Card.
   * ghost: `onCamera` = dark glass disc with a white icon, for controls over the
   * scanner's camera (template D). Never override the colours with `className`.
   */
  tone?: 'default' | 'onHighlight' | 'onCamera';
  iconSize?: number;
}

/**
 * Icon-only button with a mandatory label. The visual stays compact, an
 * invisible `before:` layer pads the hit area to 44 px.
 */
export function IconButton({
  icon: Icon,
  label,
  variant = 'ghost',
  size = 'md',
  iconSize,
  tone = 'default',
  className,
  type = 'button',
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'relative inline-flex items-center justify-center shrink-0 transition-all duration-200 active:scale-95',
        "before:absolute before:content-[''] before:-inset-1.5",
        size === 'lg' ? 'w-11 h-11' : size === 'md' ? 'w-9 h-9' : 'w-7 h-7 before:-inset-2',
        variant === 'ghost' &&
          tone === 'onCamera' &&
          'rounded-full bg-black/40 backdrop-blur-sm text-white',
        variant === 'ghost' &&
          tone !== 'onCamera' &&
          (size !== 'sm'
            ? 'rounded-full text-gray-700 dark:text-gray-300'
            : 'rounded-lg text-gray-400 dark:text-gray-500 hover:bg-white/60 dark:hover:bg-dark-card/40'),
        variant === 'soft' &&
          cn(
            size === 'lg' ? 'rounded-xl' : 'rounded-lg',
            tone === 'onHighlight'
              ? 'bg-white/60 dark:bg-dark-card/40 text-gray-700 dark:text-gray-300'
              : 'bg-gray-100 dark:bg-dark-border/50 text-gray-600 dark:text-gray-300',
          ),
        variant === 'outline' &&
          'rounded-full border border-gray-200/50 dark:border-dark-border/50 text-gray-500 dark:text-gray-400',
        rest.disabled && 'opacity-40 pointer-events-none',
        className,
      )}
      {...rest}
    >
      <Icon size={iconSize ?? (size === 'sm' ? 16 : 18)} />
    </button>
  );
}
