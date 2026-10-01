import { useEffect, useRef } from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '../../lib/cn';
import { formatDecimal } from '../../lib/format';
import { IconButton } from './IconButton';

interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  /** 5 for grams, 0.5 for portion counts, 0.1 for kg. */
  step?: number;
  min?: number;
  max?: number;
  unit?: string;
  decimals?: number;
  /** false = bare − + pair (44 px), for when a NumericInput next to it already shows the value. */
  showValue?: boolean;
  /** onHighlight = white-ish buttons, for use on a highlight Card. */
  tone?: 'default' | 'onHighlight';
}

/**
 * − value + with long-press repeat. The value itself is read-only here; pair
 * it with a NumericInput when free typing is needed.
 */
export function Stepper({
  value,
  onChange,
  step = 1,
  min = 0,
  max = Infinity,
  unit,
  decimals = 1,
  showValue = true,
  tone = 'default',
}: StepperProps) {
  const valueRef = useRef(value);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const bump = (dir: 1 | -1) => {
    const next = Math.round((valueRef.current + dir * step) * 1000) / 1000;
    const clamped = Math.min(max, Math.max(min, next));
    valueRef.current = clamped;
    onChange(clamped);
  };

  const startRepeat = (dir: 1 | -1) => {
    bump(dir);
    const repeat = (delay: number) => {
      timer.current = window.setTimeout(() => {
        bump(dir);
        repeat(Math.max(60, delay * 0.8));
      }, delay);
    };
    repeat(400);
  };

  const stop = () => window.clearTimeout(timer.current);

  const onKey = (e: React.KeyboardEvent, dir: 1 | -1) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      bump(dir);
    }
  };

  return (
    <div className={cn('inline-flex items-center', showValue ? 'gap-1' : 'gap-2')}>
      <IconButton
        icon={Minus}
        label="Decrease"
        variant="soft"
        size={showValue ? 'md' : 'lg'}
        tone={tone}
        iconSize={showValue ? 14 : 16}
        disabled={value <= min}
        onPointerDown={() => startRepeat(-1)}
        onPointerUp={stop}
        onPointerLeave={stop}
        onPointerCancel={stop}
        onKeyDown={(e) => onKey(e, -1)}
      />
      {showValue && (
        <div className="flex flex-col items-center min-w-[64px]">
          <span className="text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">
            {formatDecimal(value, decimals)}
          </span>
          {unit && <span className="text-[10px] text-gray-400 dark:text-gray-500 -mt-0.5">{unit}</span>}
        </div>
      )}
      <IconButton
        icon={Plus}
        label="Increase"
        variant="soft"
        size={showValue ? 'md' : 'lg'}
        tone={tone}
        iconSize={showValue ? 14 : 16}
        disabled={value >= max}
        onPointerDown={() => startRepeat(1)}
        onPointerUp={stop}
        onPointerLeave={stop}
        onPointerCancel={stop}
        onKeyDown={(e) => onKey(e, 1)}
      />
    </div>
  );
}
