# F041: Weight chart

**Epic**: 4. Weight & progress · **Status**: Specified · **Depends on**: F040

## Goal

The top of the Progress tab answers "is it going down?". Daily scale readings jump around by up to a kilo, so the chart draws a smoothed line as the signal, with the real readings available on tap. Under it sit the three numbers that describe the period and the list of recent weigh-ins, ready to correct.

## Acceptance criteria

1. The weight card shows the current weight (with the target beside it, when set), `Change over period`, and `Lowest · Highest · Average` for the chosen period `4 wk · 12 wk · All` (default 12 wk).
2. The chart shows a smoothed line where gaps between weigh-ins stretch over real time. Tapping a point shows its date and the actual weight — never the smoothed value.
3. With fewer than two weigh-ins in the period, the chart reads `Not enough data for a chart yet` at the same height.
4. `Recent weigh-ins` lists the last 10, newest first, each with its change from the one before (`−0.4`); tapping one opens it for editing.

## Layout & design

- **Template & route**: `/progress` uses Template A — `PageTitle` `Progress`, no header, nav visible with `Progress` active.
- **Weight card**: `WeightCard` (new) — the page's one highlight `Card`, mirroring the showcase composition:
  - `CardHeader` `Weight` with a small `SegmentedToggle` `4 wk · 12 wk · All` (`onHighlight`).
  - The current weight → target and the `PacePill` (new).
  - `MiniStat`s for `Change over period` and `Lowest · Highest · Average`.
  - `WeightTrendChart` (fill, dashed target line) with `ChartTooltip`; below two weigh-ins, an `EmptyState` `Not enough data for a chart yet` at the same height.
  - A soft `Button` `Log weight`.
- **Recent weigh-ins**: `SectionHeader` + a glass `Card` of `ListItem` rows — date, weight and a trailing `Tag` with the change (`−0.4`). Tapping one opens the `WeightSheet` (new) in edit mode (F040).
