# F023: Meal sections

**Epic**: 3. Day page · **Status**: Specified · **Depends on**: F020

## Goal

The diary itself: one card per meal — Breakfast, Morning snack, Lunch, Afternoon snack and Dinner — each with its subtotal, its entries and a `+` that starts adding food straight into that meal. Every row shows kcal and P · C · F together, so the user never has to open an entry to see what it cost.

## Acceptance criteria

1. The day always shows the five meals in the order `Breakfast · Morning snack · Lunch · Afternoon snack · Dinner`. Each header shows the meal's kcal and a `P 60 · C 71 · F 21` subtotal.
2. Each entry shows its name, the amount (`150 g`, `1 pc (250 g)`), its kcal and a small `P · C · F` line. A new entry appears at the bottom of its meal, and entries logged together from a saved meal are visibly grouped.
3. The `+` opens the add-food sheet with that meal already selected. An empty meal shows a simple `Add food` link.
4. The ⋯ menu offers `Copy from…`, `Save as meal` and `Delete all`. `Delete all` asks first (`Delete all entries from Lunch?`); actions that make no sense for an empty meal are shown disabled.

## Layout & design

- **Where**: five `MealSection` (new) cards below the `DayWeightCard` (new), in slot order.
- **`MealSection`** — a glass `Card` without padding, mirroring the showcase composition:
  - Header row: meal icon · name · kcal subtotal, with the `MacroInline` subtotal under the name; `+` and ⋯ `IconButton`s at the right edge.
  - `EntryRow` (new) rows — `ListItem` with the name and `MacroInline` as subtitle, a trailing amount `Tag` and kcal. Entries logged from one saved meal are grouped by a thin accent bar.
  - An empty meal shows a link `Button` `Add food` instead of rows.
- **Menu**: the ⋯ opens a `Drawer` — `DrawerAction`s `Copy from…`, `Save as meal` and `Delete all` (danger, last). Rows that can't apply to an empty meal are disabled, not hidden.
- **Dialogs**: `Delete all` asks through a `ConfirmDialog` (destructive), `Delete all entries from Lunch?`.
- **Rows**: tapping an `EntryRow` opens the entry sheet (F025).
