# F026: Quick add

**Epic**: 3. Day page · **Status**: Specified · **Depends on**: F024

## Goal

Logging something that will never be a food in the library: a restaurant lunch, a colleague's cake, a rough estimate. Quick add takes a name and kcal, optionally macros, and adds it to the day. It keeps the day total honest when precision is impossible, and it lives in the same picker as everything else.

## Acceptance criteria

1. `Quick add` is always at the bottom of the add-food sheet. It asks for `Name` and `Calories (kcal)`, with the meal and date prefilled like the amount sheet.
2. `Add macros` reveals optional `Protein (g)`, `Carbs (g)` and `Fat (g)`. If kcal is left empty, it is calculated from the macros; a typed kcal always wins. `Log` needs a name and kcal above zero.
3. The entry appears in its meal marked `quick add` instead of an amount, and counts toward the totals like any other row.
4. Nothing is added to the library, `Recent` or `Favourites`.

## Layout & design

- **Where**: a secondary `Button` `Quick add` in the `FoodPickerSheet` (new) footer opens a `Drawer` stacked over the picker.
- **Sheet**, top to bottom:
  - `DrawerHeader` `Quick add`.
  - `TextField` `Name` and `NumericInput` `Calories (kcal)`.
  - A collapsed link `Button` `Add macros` that reveals three `NumericInput`s side by side — protein, carbs, fat.
  - Meal `ChipGroup` + `DateChips`, prefilled like the amount sheet.
  - `NutritionPreview` with the new day total, then a sticky primary `Button` `Log · <Meal>`.
- **In the diary**: the `EntryRow` (new) shows a `Tag` `quick add` in place of the amount.
