import { useCallback, useId, useMemo } from 'react';
import { Area, ComposedChart, ReferenceLine, ResponsiveContainer, Scatter, Tooltip, XAxis, YAxis } from 'recharts';
import { CHART } from '../../lib/chartColors';
import { cn } from '../../lib/cn';
import { mediumDayLabel, parseDayKey, shortDayLabel, toDayKey } from '../../lib/date';
import { formatKg } from '../../lib/format';
import { ChartTooltip } from './ChartTooltip';

export interface WeightPoint {
  /** `YYYY-MM-DD` */
  date: string;
  /** The raw weigh-in (tooltip only). */
  weightKg: number;
  /** 3-point smoothed value — the drawn line, never shown as a number. */
  trendKg: number;
}

interface ChartPoint extends WeightPoint {
  /** Local midnight of `date`, ms — the time-scale X. */
  t: number;
}

const tickLabel = (t: number) => shortDayLabel(toDayKey(new Date(t)));

/**
 * The weight trend: a gradient area of the 3-point smoothed series with a dot
 * on the curve per weigh-in, on a real time-scale X axis (gaps stretch; local
 * midnight ms), Y auto-padded by `max(range × 0.15, 0.5)`. The tooltip shows
 * the medium date and the RAW weight only. `targetKg` adds a dashed reference
 * line, kept inside the padded domain. Returns `null` under two points.
 * Sizes: default `h-36` · `fill` = `h-full` of a fixed-height parent slot
 * (`/progress`, `h-44`) · `compact` = `h-16`, area only (the day-page card).
 */
export function WeightTrendChart({
  points,
  targetKg,
  className,
  compact = false,
  fill = false,
}: {
  points: WeightPoint[];
  targetKg?: number;
  className?: string;
  compact?: boolean;
  fill?: boolean;
}) {
  // Unique per instance: two charts on one page must not share a <linearGradient> id.
  const gradientId = `weightTrend${useId().replace(/:/g, '')}`;
  const data: ChartPoint[] = useMemo(() => points.map((p) => ({ ...p, t: parseDayKey(p.date).getTime() })), [points]);
  const target = compact ? undefined : targetKg;

  const [yMin, yMax] = useMemo(() => {
    if (!data.length) return [0, 1];
    const values = data.map((d) => d.trendKg);
    if (target != null) values.push(target);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const pad = Math.max((max - min) * 0.15, 0.5);
    return [min - pad, max + pad];
  }, [data, target]);

  const renderTooltip = useCallback(
    ({ active, payload }: { active?: boolean; payload?: readonly { payload?: ChartPoint }[] }) => {
      const p = active ? payload?.[0]?.payload : undefined;
      if (!p) return null;
      return <ChartTooltip title={mediumDayLabel(p.date)} rows={[{ label: 'Weight', value: formatKg(p.weightKg) }]} />;
    },
    [],
  );

  if (data.length < 2) return null;

  return (
    <div
      className={cn(
        compact ? 'h-16' : fill ? 'h-full' : 'h-36 -mb-2',
        'w-full text-gray-400 dark:text-gray-500 [&_.recharts-wrapper]:outline-none [&_svg]:outline-none',
        className,
      )}
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={compact ? { top: 4, right: 0, bottom: 0, left: 0 } : { top: 8, right: 8, bottom: 0, left: 8 }}
          accessibilityLayer={false}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART.weight} stopOpacity={0.5} />
              <stop offset="50%" stopColor={CHART.weight} stopOpacity={0.2} />
              <stop offset="100%" stopColor={CHART.weight} stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="t"
            type="number"
            scale="time"
            domain={['dataMin', 'dataMax']}
            hide={compact}
            tickFormatter={tickLabel}
            tick={{ fontSize: 10, fill: 'currentColor' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            minTickGap={24}
            className="text-gray-400 dark:text-gray-500"
          />
          <YAxis hide domain={[yMin, yMax]} allowDataOverflow />
          {!compact && <Tooltip content={renderTooltip} cursor={false} />}
          {target != null && (
            <ReferenceLine y={target} stroke={CHART.weight} strokeOpacity={0.6} strokeDasharray="4 4" />
          )}
          <Area
            type="monotone"
            dataKey="trendKg"
            stroke={CHART.weight}
            strokeWidth={1.5}
            fill={`url(#${gradientId})`}
            baseValue={yMin}
            isAnimationActive={false}
            activeDot={false}
          />
          {!compact && (
            <Scatter
              dataKey="trendKg"
              isAnimationActive={false}
              shape={(props: { cx?: number; cy?: number }) =>
                props.cx == null || props.cy == null ? <g /> : <circle cx={props.cx} cy={props.cy} r={3} fill={CHART.weight} />
              }
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
