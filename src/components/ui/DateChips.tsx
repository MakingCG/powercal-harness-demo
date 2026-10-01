import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { isDayKey, relativeChipLabel } from '../../lib/date';
import { Chip, ChipGroup } from './Chip';
import { TextField } from './TextField';

/**
 * A few quick date choices as chips (`Yesterday` · `2 days ago`, labelled
 * relative to today) plus `Other date`, which reveals a filled native date
 * input — no picker library. Used by the copy sheet (F027); any sheet that
 * picks a source day can reuse it.
 */
export function DateChips({
  dates,
  today,
  value,
  onChange,
  label = 'Date',
}: {
  /** The quick choices, in display order. */
  dates: readonly string[];
  today: string;
  value: string;
  onChange: (date: string) => void;
  /** Accessible name of the date input. */
  label?: string;
}) {
  const [other, setOther] = useState(() => !dates.includes(value));
  const otherActive = other || !dates.includes(value);
  return (
    <div className="space-y-3">
      <ChipGroup>
        {dates.map((d) => (
          <Chip
            key={d}
            active={!otherActive && d === value}
            onClick={() => {
              setOther(false);
              onChange(d);
            }}
          >
            {relativeChipLabel(d, today)}
          </Chip>
        ))}
        <Chip icon={CalendarDays} active={otherActive} onClick={() => setOther(true)}>
          Other date
        </Chip>
      </ChipGroup>
      {otherActive && (
        <TextField
          type="date"
          aria-label={label}
          value={value}
          onChange={(e) => {
            if (isDayKey(e.target.value)) onChange(e.target.value);
          }}
        />
      )}
    </div>
  );
}
