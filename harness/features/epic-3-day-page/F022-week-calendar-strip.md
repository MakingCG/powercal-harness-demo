# F022: Week strip

**Epic**: 3. Day page · **Status**: Specified · **Depends on**: F020

## Goal

A single Monday-to-Sunday row at the top of the day page. It shows where you are in the week, which days already have entries, which day you're looking at and which day is today, and it gets you to any of them in one tap. The last few days are the common case; the full month is one more tap away.

## Acceptance criteria

1. The strip shows the week of the viewed day, `M T W T F S S`, with a dot under every day that has at least one entry.
2. The viewed day is a filled orange pill and today has an orange ring. Tapping any day, including future ones, opens it.
3. The ‹ › arrows or a swipe on the strip browse weeks without changing the viewed day; `Back to today` appears whenever the user has wandered away.
4. Tapping the month label (`August 2026`) opens a month view with the logged days marked; picking a day opens it.

## Layout & design

- **Where**: `WeekStrip`, directly on the canvas between the `PageTitle` and the summary — not in a `Card`, so it reads as a control.
- **Body**: the month label with a chevron and the ‹ › week arrows on one line, then seven `DayCell`s `M T W T F S S` — a dot on logged days, the viewed day filled, today ringed.
- **Back to today**: a `Chip` that appears whenever the user has browsed away from the current week.
- **Month sheet**: the month label opens a `Drawer` holding `MonthCalendar` (F042) with the viewed day selected.
