# F062: Settings

**Epic**: 5. Backup & settings · **Status**: Specified · **Depends on**: F005, F006, F028, F060, F061

## Goal

One scrolling page with everything that can be set, and no tabs. There are barely twenty rows in total, so the user sees them all at once, and there is exactly one way to set a goal. It collects what earlier features built — profile and goal, saved meals, theme, backup — in one predictable order.

## Acceptance criteria

1. The gear on the day page opens `Settings` with sections in this order: `Profile · Goals · Saved meals · Display · Data · About`.
2. Profile fields save as soon as they're edited; `Current weight` comes from the latest weigh-in and opens the weigh-in sheet; `BMR / TDEE estimate` is shown for reference. `Goals` is the same goal card as onboarding, with `Save goal`.
3. `Saved meals` lists each saved meal (`3 items · 697 kcal`) and opens it for editing. `Display` has the theme and `Show more nutrients`.
4. `Data` has `Export backup`, `Import backup`, `Load demo data`, storage status and `Delete all data`, which asks first and returns to onboarding. `About` shows the version and the data credits, always visible.

## Layout & design

- **Template & route**: `/settings` uses Template B — `Header` `Settings` with back, opened from the day page's gear; nav visible with no active tab.
- **Body**: one `SectionCard` per section, in order, with `FieldRow`s (label left, value or control right):
  - **Profile** — inline `NumericInput`s, a `Current weight` row that opens the `WeightSheet` (new), an activity-level row that opens its sheet (F005), `BMR / TDEE estimate` read-only.
  - **Goals** — the `GoalCard` (new) with a primary `Button` `Save goal`.
  - **Saved meals** — one row per saved meal (`3 items · 697 kcal`) that opens its edit sheet (F028); `EmptyState` `No saved meals yet`.
  - **Display** — a text-only `SegmentedToggle` `Light · Dark · System` and a `Switch` `Show more nutrients`.
  - **Data** — `Export backup`, `Import backup`, `Load demo data`, storage status, then a danger `Button` `Delete all data` in the card's footer.
  - **About** — version and data credits.
- **Dialogs**: `ConfirmDialog` (destructive) before `Delete all data`; `ErrorDialog` on any failure.
