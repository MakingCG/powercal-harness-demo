# F005: Profile & goals

**Epic**: 1. Foundation · **Status**: Specified · **Depends on**: F003, F004

## Goal

A short first-run setup that gives every number in the app a reference point: who the user is and what their daily target is. The goal is four numbers — kcal, protein, carbs and fat in grams — on one card, with the percentages shown as a read-out. Changing the goal later only applies from today, so raising it in September never re-scores August.

## Acceptance criteria

1. On first run the user goes through two steps, **Profile** then **Goal**. Profile asks sex, height, year of birth, current weight (optional) and activity level, and shows an estimated daily need (`Estimated TDEE ≈ 2,900 kcal · to lose weight ≈ 2,400 kcal`).
2. The goal card is prefilled with a sensible suggestion, every field is editable, and each macro shows its share of kcal (`30%`). An optional `Target weight (kg)` sits on the same card.
3. If the macros don't add up to the kcal, the card says `Macros don't match kcal` and offers `Adjust carbs`; a very low goal shows `Very low goal`. Both are warnings — saving is never blocked.
4. `Done` saves the profile, the goal and (if given) today's weight, and opens today. A later goal change takes effect from today; past days keep the goal they had.

## Layout & design

- **Template & route**: `/onboarding` uses Template C — `Header` + `PageContainer`, no nav.
- **Header**: `StepIndicator` (2 steps). Step 1 has no back control; step 2 goes back through the `Header` chevron and a ghost `Button` `Back` under the form, keeping all input.
- **Step 1 · Profile**: a `SectionCard` of `FieldRow`s — sex as a `SegmentedToggle`, height, year of birth and current weight (optional) as `NumericInput`s, and an activity-level row that opens the activity sheet. The TDEE estimate sits as a muted line under the card.
- **Step 2 · Goal**: `GoalCard` (new) — a `SectionCard` with a `FieldRow` + `NumericInput` for kcal, protein, carbs and fat, each macro with its share as a `Tag` (`30%`), and an optional `Target weight (kg)` row. `Macros don't match kcal` (with a link `Button` `Adjust carbs`) and `Very low goal` are quiet hints inside the card.
- **Footer**: a full-width primary `Button` last — `Next`, then `Done`.
- **Sheet**: activity level is a `Drawer` — `DrawerHeader` + four `DrawerAction`s, each with a one-line description; the current one is `active`.
- **Reuse**: the same `GoalCard` is the `Goals` section in Settings (F062).
