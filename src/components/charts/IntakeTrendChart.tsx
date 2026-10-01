import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Bar, BarChart, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CHART } from '../../lib/chartColors';
import { DAY_LETTERS, mediumDayLabel, parseDayKey, shortDayLabel } from '../../lib/date';
import { formatDecimal, formatKcal } from '../../lib/format';
import { adherenceOf } from '../../lib/intake';
import type { Adherence, IntakePoint } from '../../lib/intake';
import { ChartTooltip } from './ChartTooltip';

export type { IntakePoint } from '../../lib/intake';

/** Weekday letters up to this many days; beyond it every 5th date ending on today. */
const LETTER_WINDOW = 10;
/** Below this chart width the dated ticks thin to every 10th day so `25 Sep` labels never collide. */
const NARROW_PX = 340;

const TINT: Record<Adherence, string> = {
  under: CHART.kcal,
  onTarget: CHART.good,
  over: CHART.warn,
  noGoal: CHART.neutral,
};

interface Datum extends IntakePoint {
  /** Value bar: `null` for an unlogged day (no bar, track only). */
  value: number | null;
  /** Ghost track at the day's goal height; 0 without a goal. */
  track: number;
  tick: string;
}

/**
 * Daily kcal bars (F043) on ghost goal tracks: each day's track sits at the
 * goal valid on that date (a goal change shows as a step, drawn by a second
 * `Bar` on a hidden twin X axis). Value bars are tinted by the shared ±5 %
 * band (`adherenceOf`: under → accent, within → green, over → amber, no goal
 * → grey); unlogged days are a track only; a logged 0 kcal day is a 2 px
 * hairline. Dated ticks: every 5th day ending on today, every 10th when the
 * slot is narrower than 340 px. A dashed reference line marks `avgKcal` (`Avg 2,610`). Tapping a
 * bar shows the tooltip; a second tap on the same day calls `onOpenDay`.
 * Fixed `h-36`; `null` under two points.
 */
export function IntakeTrendChart({
  points,
  avgKcal,
  onOpenDay,
}: {
  points: IntakePoint[];
  avgKcal?: number | null;
  onOpenDay?: (date: string) => void;
}) {
  // Measure the slot so dated ticks thin out on narrow screens (320 px).
  const boxRef = useRef<HTMLDivElement>(null);
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setNarrow(entry.contentRect.width < NARROW_PX));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const step = narrow ? 10 : 5;

  const data: Datum[] = useMemo(() => {
    const last = points.length - 1;
    const letters = points.length <= LETTER_WINDOW;
    return points.map((p, i) => ({
      ...p,
      value: p.logged ? p.kcal : null,
      track: p.goalKcal ?? 0,
      tick: letters
        ? DAY_LETTERS[(parseDayKey(p.date).getDay() + 6) % 7]
        : (last - i) % step === 0
          ? shortDayLabel(p.date)
          : '',
    }));
  }, [points, step]);
  const ticks = useMemo(() => new Map(data.map((d) => [d.date, d.tick])), [data]);

  // Recharts keeps the first onClick it sees — route everything through refs. With the twin
  // X axes Recharts reports `activeLabel` as the category ordinal, so the day is resolved from
  // `activeTooltipIndex` against the current data instead.
  const lastTap = useRef<string | null>(null);
  const openRef = useRef(onOpenDay);
  const dataRef = useRef(data);
  useEffect(() => {
    openRef.current = onOpenDay;
    dataRef.current = data;
  }, [onOpenDay, data]);
  const onChartClick = useCallback((state: { activeTooltipIndex?: string | number | null } | null) => {
    const index = state?.activeTooltipIndex != null ? Number(state.activeTooltipIndex) : NaN;
    const date = Number.isInteger(index) ? dataRef.current[index]?.date : undefined;
    if (!date) return;
    if (lastTap.current === date) {
      lastTap.current = null;
      openRef.current?.(date);
    } else {
      lastTap.current = date;
    }
  }, []);

  const renderTooltip = useCallback(
    ({ active, payload }: { active?: boolean; payload?: readonly { payload?: Datum }[] }) => {
      const p = active ? payload?.[0]?.payload : undefined;
      if (!p) return null;
      const rows = p.logged
        ? [
            { label: 'Eaten', value: `${formatKcal(p.kcal)} kcal` },
            {
              label: '',
              value: `P ${formatDecimal(p.protein, 0)} · C ${formatDecimal(p.carbs, 0)} · F ${formatDecimal(p.fat, 0)}`,
            },
          ]
        : [{ label: '', value: 'Not logged' }];
      if (p.goalKcal != null) rows.push({ label: 'Goal', value: `${formatKcal(p.goalKcal)} kcal` });
      return <ChartTooltip title={mediumDayLabel(p.date)} rows={rows} />;
    },
    [],
  );

  if (data.length < 2) return null;

  return (
    <div ref={boxRef} className="h-36 -mx-1 text-gray-400 dark:text-gray-500 [&_.recharts-wrapper]:outline-none [&_svg]:outline-none">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 12, right: 52, bottom: 0, left: 4 }}
          barCategoryGap="28%"
          accessibilityLayer={false}
          onClick={onChartClick}
        >
          <XAxis
            xAxisId="value"
            dataKey="date"
            tickFormatter={(d: string) => ticks.get(d) ?? ''}
            interval={0}
            tick={{ fontSize: 10, fill: 'currentColor' }}
            tickLine={false}
            axisLine={false}
            height={20}
            className="text-gray-400 dark:text-gray-500"
          />
          <XAxis xAxisId="track" dataKey="date" hide height={0} />
          <YAxis hide domain={[0, (max: number) => Math.max(max, 1) * 1.1]} />
          <Tooltip content={renderTooltip} cursor={false} />
          <Bar
            xAxisId="track"
            dataKey="track"
            radius={5}
            maxBarSize={18}
            fill={CHART.track}
            fillOpacity={0.14}
            isAnimationActive={false}
            activeBar={false}
          />
          <Bar
            xAxisId="value"
            dataKey="value"
            radius={5}
            maxBarSize={18}
            minPointSize={(value) => (value === 0 ? 2 : 0)}
            isAnimationActive={false}
          >
            {data.map((d) => (
              <Cell key={d.date} fill={TINT[adherenceOf(d.kcal, d.goalKcal)]} />
            ))}
          </Bar>
          {avgKcal != null && (
            <ReferenceLine
              xAxisId="value"
              y={avgKcal}
              stroke={CHART.kcal}
              strokeOpacity={0.7}
              strokeDasharray="4 4"
              ifOverflow="extendDomain"
              label={{ value: `Avg ${formatKcal(avgKcal)}`, position: 'right', fontSize: 9, fill: CHART.kcal }}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
