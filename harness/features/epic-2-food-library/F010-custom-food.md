# F010: Custom food

**Epic**: 2. Food library · **Status**: Specified · **Depends on**: F003

## Goal

Creating a food by hand in about twenty seconds. Many everyday products will never resolve from a scan, so manual entry is a main path into the library, not a fallback. The user copies the "per 100 g" column off the label, names any portions worth having, and saves. Editing a food later is safe: what was already logged never changes.

## Acceptance criteria

1. The form asks for `Name`, `Brand` (optional), `g · ml`, then `Calories (kcal)`, `Protein (g)`, `Carbs (g)`, `Fat (g)` per 100 g, an optional `More nutrients` section (sugars, fibre, salt) and portions. `Save food` is enabled once there is a name and a calorie value.
2. If kcal is left empty, the app calculates it from the macros and shows it as `Calculated from macros`. If a typed kcal is far off the macros, an advisory `kcal don't match macros` appears — the label value always wins.
3. Editing your own food changes it in place and leaves past entries untouched. Editing a bundled or Open Food Facts food saves your own copy and keeps the original.
4. Deleting a food that was already logged or used in a saved meal archives it instead: it disappears from the library, and history stays as it was. An unused food is deleted after a confirm.

## Layout & design

- **Template & route**: `/foods/new` and `/foods/:id/edit` use Template C — `Header` `New food` / `Edit food` with back and a ✓ right action to save; no nav.
- **Body**, top to bottom:
  - A glass `Card` with `TextField` `Name`, `TextField` `Brand` (optional) and a full-width `SegmentedToggle` `Per 100 g · Per 100 ml`.
  - `SectionCard` `Nutrition facts` — one `FieldRow` + inline `NumericInput` each for kcal, protein, carbs and fat; the kcal row's hint reads `Calculated from macros` when derived, `kcal don't match macros` when far off.
  - A collapsible `SectionCard` `More nutrients` — sugars, fibre and salt as the same rows.
  - `PortionEditor` (new) (F016).
  - `NutritionPreview` for 100 g, then the full-width primary `Button` `Save food` last.
- **Dialogs**: `ConfirmDialog` (destructive) before deleting an unused food; `ErrorDialog` on a failed save.
- **Flow**: opened from the picker or a failed scan, saving returns straight to the `AmountSheet` (new) for the new food.
