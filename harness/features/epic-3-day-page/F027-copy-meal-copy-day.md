# F027: Copy meal or day

**Epic**: 3. Day page · **Status**: Specified · **Depends on**: F023

## Goal

"Same breakfast as yesterday" in two taps. Most people eat repeating meals, so copying a meal — or a whole day — covers most of the repetition without building anything first. The copy is exactly what was logged back then, even if the foods have changed since.

## Acceptance criteria

1. `Copy from…` in a meal's menu opens `Copy into Lunch` with date chips (`Yesterday`, `2 days ago`, `Other date`) and meal chips, defaulting to the same meal the day before, and previews what will be copied with its totals.
2. `Copy` adds those entries to the end of the target meal. It never replaces what's there, and the sheet says so (`Adds to the 2 existing entries`).
3. When there is nothing to copy, or the source is the target itself, `Copy` is disabled with the reason written under it.
4. `Copy whole day` from the day menu previews the meals of the source day and offers `Add to day`, or — if the target day has entries — `Replace day`, which asks first.

## Layout & design

- **Where**: `CopySheet` (new) — one `Drawer` for both modes, opened from `Copy from…` in a `MealSection` (new) menu or `Copy whole day` in the day page's ⋯ menu.
- **Sheet**, top to bottom:
  - `DrawerHeader` — `Copy into Lunch`, or `Copy whole day`.
  - `DateChips` — `Yesterday`, `2 days ago`, `Other date`.
  - Meal `ChipGroup` for the source meal (meal mode only).
  - The preview: one compact `EntryRow` (new) per entry (grouped by meal in day mode), then `NutritionPreview` with the totals and `Adds to the 2 existing entries` as its footer.
  - A primary `Button` `Copy` / `Add to day`; a danger `Button` `Replace day` when the target day already has entries.
- **Disabled**: with nothing to copy, the primary button is disabled and the reason is a quiet line under it.
- **Dialogs**: `Replace day` asks through a `ConfirmDialog` (destructive).
