# F044: Target weight & pace

**Epic**: 4. Weight & progress · **Status**: Specified · **Depends on**: F041, F029, F005

## Goal

A target weight turns the chart into a verdict. PowerCal compares how fast the weight has actually moved over the last four weeks with how fast it should move on the current calorie goal, and says `On track`, `Ahead` or `Behind`. It also estimates when the target will be reached, so the diet has a horizon.

## Acceptance criteria

1. With a target weight set and at least three weigh-ins over two weeks, a pace pill and the actual pace (`Pace −0.42 kg/wk`) appear on Progress and on the day-page weight card. With less data the card says `Log a few more weigh-ins to see your pace`.
2. The pill reads `On track` when the actual pace is close to the expected one, `Ahead` when clearly faster, `Behind` when slower, flat or moving away. The expected pace comes from the calorie goal and the profile's activity level, or a default 0.5 kg per week when that is unknown (`Based on 0.5 kg/wk`).
3. Moving toward the target, a line reads `85.0 kg by ≈ 11 Nov 2026`; otherwise `No clear trend` or `Moving away from target`. Once reached, the pill says `Target reached`.
4. On a past day, the pace uses only weigh-ins up to that day. The Progress chart shows the target as a dashed line.

## Layout & design

- **Pill**: `PacePill` (new) — a `StatusPill` with an icon, mapped as in the showcase: `On track`, `Ahead`, `Behind`, `Target reached`, `Not enough data`. It sits next to the current weight on the `WeightCard` (new) and in the `DayWeightCard` (new) header.
- **Progress**: under the `WeightCard`'s `MiniStat`s, a muted pace line (`Pace −0.42 kg/wk · Based on 0.5 kg/wk`) and the arrival line (`85.0 kg by ≈ 11 Nov 2026`, `No clear trend` or `Moving away from target`).
- **Chart**: the target is the dashed line of `WeightTrendChart`.
- **Not enough data**: `Log a few more weigh-ins to see your pace` replaces the pace line.
- **Setting the target**: the `Target weight (kg)` row on the `GoalCard` (new) (F005, F062).
