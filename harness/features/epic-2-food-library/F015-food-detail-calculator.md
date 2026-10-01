# F015: Food detail & amount sheet

**Epic**: 2. Food library · **Status**: Specified · **Depends on**: F010

## Goal

Pick an amount, see kcal and P · C · F for exactly that amount, then log it into a meal. The food's detail page shows everything the app knows about it — values per 100 g, portions, source — and the same calculator appears as the amount sheet whenever the user logs a food. The live preview means the user never saves a number they haven't seen.

## Acceptance criteria

1. The calculator opens on the food's default portion. Changing the amount or portion updates kcal and P · C · F on every keystroke, and the logged entry has exactly the values the preview showed.
2. The amount sheet shows the food, the calculator, the meal chips and date, the preview and a `Log · Lunch` button. Logging saves the entry and returns to that day; a double tap never logs twice.
3. The detail page shows the values `Per 100 g` (with `Calculated from macros` when kcal was missing), all portions, and where the food comes from, with the Open Food Facts credit for scanned products.
4. An archived food can still be logged, and an unusually large amount gets a gentle `Double-check this amount` rather than a limit.

## Layout & design

- **Template & route**: `/foods/:id` uses Template C — `Header` with the food name, back and a ⋯ right action.
- **Body**, top to bottom:
  - `FoodCalculatorCard` (new) — the page's highlight `Card`, every control `onHighlight`: thumbnail, name and ★ → portion `SegmentedToggle` → `NumericInput` + `Stepper` → `NutritionPreview` → primary `Button` `Log to…`.
  - `SectionCard` `Per 100 g` — `FieldRow`s for kcal and P · C · F (plus more nutrients), with a `Tag` `Calculated from macros` when kcal was derived.
  - `SectionCard` `Portions` — one `FieldRow` per portion, the default marked with a `Tag`; an `Edit portions ›` row opens the portion sheet (F016).
  - `SectionCard` `Source` — custom, generic or Open Food Facts, with the Open Food Facts credit for scanned foods.
- **Menu**: the ⋯ opens a `Drawer` of `DrawerAction`s — favourite, edit (or make a copy), edit portions, and archive last as danger.
- **Amount sheet**: `AmountSheet` (new) — a `Drawer`: `DrawerHeader` (food · kcal / 100 g) → portion `SegmentedToggle` → `NumericInput` + `Stepper` → meal `ChipGroup` + `DateChips` → `NutritionPreview` → a sticky primary `Button` `Log · <Meal>` (`Save` when editing) that stays above the keyboard. `Double-check this amount` is a quiet hint under the amount.
