# F028: Saved meals

**Epic**: 3. Day page · **Status**: Specified · **Depends on**: F024

## Goal

The breakfast someone eats every day — milk 300 ml, rolled oats 80 g, one yogurt — saved once from a real meal and logged afterwards in one tap. A saved meal is just a named list of items. Logging it adds each item as its own entry, so every row stays editable. No recipes, no steps, no photos.

## Acceptance criteria

1. `Save as meal` in a meal's menu saves its foods under a name (prefilled like `Breakfast 27 Aug`) and a default meal. Quick adds are left out, and the sheet says so.
2. The `Saved` tab of the picker lists saved meals with their kcal, macros and item count. Tapping one logs all its items at once into the chosen meal (or its default meal).
3. The ⋯ on a saved meal opens a sheet with `×0.5 · ×1 · ×2`, the items, meal and date and the new day total, before `Log · <Meal>`.
4. A saved meal logs exactly what was saved, even if its foods were edited or deleted since. An edit sheet lets the user rename a saved meal, change its default meal, adjust or remove items, or delete it.

## Layout & design

- **Save as meal**: a `Drawer` — `DrawerHeader` `Save as meal` → `TextField` name (prefilled) → default-meal `ChipGroup` → the items as `EntryRow` (new) lines with `NutritionPreview` totals and a note that quick adds were left out → primary `Button` `Save`.
- **Saved tab**: in the `FoodPickerSheet` (new) — a `ListItem` per saved meal with kcal, `MacroInline`, an item-count `Tag` and a ⋯ `IconButton`; tapping the row logs it at once. `EmptyState` `No saved meals yet`.
- **Log sheet**: a `Drawer` from the ⋯ — `DrawerHeader` → `SegmentedToggle` `×0.5 · ×1 · ×2` → items with live amounts → meal `ChipGroup` + `DateChips` → `NutritionPreview` with the new day total → sticky primary `Button` `Log · <Meal>`.
- **Edit sheet**: opened from Settings (F062) — `TextField` name, default-meal `ChipGroup`, items with a `NumericInput` amount and a remove `IconButton`, primary `Button` `Save`, and a danger `Button` `Delete saved meal` behind a `ConfirmDialog`.
- **In the diary**: logged items sit grouped in their `MealSection` (new) with a thin accent bar.
