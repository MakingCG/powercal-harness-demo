# F042: Month calendar

**Epic**: 4. Weight & progress · **Status**: Specified · **Depends on**: F022

## Goal

A month at a glance: which days were logged and how each one went against the calorie goal. It is the way into history — every day is one tap away — and it replaces scrolling back day by day to answer "did I log anything on Tuesday?". It opens from the week strip on the day page and sits at the bottom of Progress.

## Acceptance criteria

1. The grid starts on Monday, `M T W T F S S`, with today ringed and (from the day page) the viewed day filled. Tapping a past or present day opens it; future days are dimmed.
2. Logged days are tinted: under goal, on target (within 5 %) or over goal, each clearly different in light and dark. A day with no goal yet is neutral grey — it is never judged against a later goal.
3. The arrows move by month, and the footer sums it up: `18 of 31 days logged · avg 2,610 kcal`, with a small legend.

## Layout & design

- **Component**: `MonthCalendar` — month label with ‹ › arrows, the Monday-first grid of `DayCell`s (adherence tints, weigh-in dot, today ringed, future days dimmed), then the footer `18 of 31 days logged · avg 2,610 kcal` with a small legend.
- **Day page**: inside a `Drawer` opened from the `WeekStrip` month label, with the viewed day selected; picking a day closes the sheet and opens that day.
- **Progress**: the last glass `Card` on `/progress`, with a `CardHeader` and no selected day.
- **Loading**: the cells pulse in place — never an empty grid, no layout shift.
