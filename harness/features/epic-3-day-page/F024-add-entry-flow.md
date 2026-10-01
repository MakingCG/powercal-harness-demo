# F024: Add entry flow

**Epic**: 3. Day page · **Status**: Specified · **Depends on**: F014, F015, F021, F023

## Goal

The flow the whole app is built around: from the day page to a logged food in three taps and under 15 seconds, for anything eaten before. The picker and amount sheet already exist; this feature ties them to the day on screen. The entry goes into the viewed day and meal, the sheet shows what the day total will become, and the new row lands on the page while the summary updates.

## Acceptance criteria

1. Tap `+` on a meal (or the add button), tap a recent food, tap `Log · Lunch` — the entry is saved to the viewed day with no typing, both sheets close and the summary updates.
2. The amount sheet defaults to the viewed day, not today, and to the chosen meal. Changing the meal or date in the sheet sends the entry there, and the app then shows that day.
3. The preview shows `New day total: 2,137 / 2,650 kcal`, updating as the amount changes.
4. Closing the amount sheet returns to the picker exactly where the user left it; a second close returns to the day.

## Layout & design

- **Template & route**: `/day/:date/add` — sheets stacked over the live day page; the nav is hidden while they're open.
- **Entry points**: the `+` `IconButton` on a `MealSection` (new) (meal preselected) or the add button in the `BottomNav`.
- **Sheets**, bottom to top:
  - `FoodPickerSheet` (new) (F014), with the chosen meal's `Chip` active.
  - `AmountSheet` (new) — `DrawerHeader` (food) → portion `SegmentedToggle` → `NumericInput` + `Stepper` → meal `ChipGroup` + `DateChips` (defaulting to the viewed day) → `NutritionPreview` with the footer `New day total: 2,137 / 2,650 kcal` → sticky primary `Button` `Log · <Meal>`.
- **Closing**: the first close returns to the picker exactly as it was; the second returns to the day.
- **After logging**: both sheets close, the new `EntryRow` (new) lands at the bottom of its `MealSection` and the `DaySummaryCard` (new) updates.
