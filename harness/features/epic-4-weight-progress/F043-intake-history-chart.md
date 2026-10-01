# F043: Intake history

**Epic**: 4. Weight & progress · **Status**: Specified · **Depends on**: F021

## Goal

The day page answers "how am I doing today"; this answers "am I really holding the deficit?" — the question that explains the weight curve above it. Daily kcal are drawn as bars against each day's goal for the last 7 or 30 days, with the period average, and underneath the average protein, carbs and fat against their goals.

## Acceptance criteria

1. `Intake` shows one bar per day ending today for `7 d · 30 d` (default 7 d), each against a faint goal track, tinted under / on target / over. A goal change inside the period shows as a step in the track.
2. The header reads `Avg 2,610 kcal` with today's goal and a status pill. Days not logged are left out of every average, and the chart says how many (`2 days not logged`).
3. Tapping a bar shows that day's kcal, macros and goal; tapping it again opens that day.
4. Below the chart, `Average macros on logged days` shows three bars (`Avg 191 g / 200 g`). With fewer than two logged days, the section reads `Log at least two days to see a trend`.

## Layout & design

- **Where**: a glass `Card` on `/progress`, below the `WeightCard` (new). It is used once, so it stays a composition in the page.
- **Body**, top to bottom:
  - `CardHeader` `Intake` with a small `SegmentedToggle` `7 d · 30 d`.
  - The big `Avg 2,610 kcal`, today's goal and the intake `StatusPill`.
  - `IntakeTrendChart` — bars on per-day goal tracks with a dashed average line, `ChartTooltip` on tap, and the `2 days not logged` note under it.
  - `Average macros on logged days` — three full-width `MacroBar`s (average).
- **Empty**: with fewer than two logged days, an `EmptyState` `Log at least two days to see a trend` at the chart's height.
