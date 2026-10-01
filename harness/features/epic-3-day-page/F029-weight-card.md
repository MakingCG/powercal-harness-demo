# F029: Weight card

**Epic**: 3. Day page · **Status**: Specified · **Depends on**: F020

## Goal

Half the reason to track food is watching the number move. The day page carries a small weight card: the latest weight, how it changed over the last week and a mini trend line. Tapping it opens the weigh-in sheet, so logging weight is one tap from the day page.

## Acceptance criteria

1. The card shows the latest weigh-in on or before the viewed day (`89.4 kg`, always one decimal) with `today`, `on this day` or `3 days ago`. A past day never shows a later weight.
2. It shows the change over about a week (`▼ −0.6 kg / 7 days`, loss in green, gain in amber), a mini trend line, and `4.4 kg to go` when a target weight is set.
3. Tapping the card opens `Log weight` with `Weight`, `Date` and an optional `Note`, prefilled for the viewed day. One weigh-in per day: logging again replaces it.
4. With no weigh-ins yet, the card reads `Log your first weigh-in` with a `Log` button.

## Layout & design

- **Where**: `DayWeightCard` (new) — a glass `Card` between the `DaySummaryCard` (new) and the meals (the summary is the page's one highlight). The whole card opens `Log weight`.
- **Body**, top to bottom, mirroring the showcase composition:
  - `CardHeader` `Weight` with the `PacePill` (new) (F044).
  - The big weight (`89.4 kg`) with its age — `today`, `on this day`, `3 days ago`.
  - The change `▼ −0.6 kg / 7 days` (green loss, amber gain) and `4.4 kg to go`.
  - `WeightTrendChart`, compact.
- **Empty**: an `EmptyState` `Log your first weigh-in` with a `Log` action inside the card.
- **Sheet**: `WeightSheet` (new) — a short `Drawer`: `DrawerHeader` `Log weight` → `NumericInput` `Weight` (kg, focused first) → `DateChips` → `TextField` `Note` (optional) → primary `Button` `Save`. An out-of-range weight disables `Save` with a quiet hint.
