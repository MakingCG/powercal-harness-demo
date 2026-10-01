# F025: Edit or delete an entry

**Epic**: 3. Day page · **Status**: Specified · **Depends on**: F024

## Goal

Fixing a logged row without redoing it: "I said 150 g but it was 200 g", or "that was actually the afternoon snack". Tap the entry, choose what to do. Editing works from the entry's own logged values, so a food changed since then never rewrites the past, and deleting always asks first.

## Acceptance criteria

1. Tapping an entry opens a sheet with its name, amount and `kcal · P · C · F`, and the actions `Edit amount`, `Move to another meal`, `Duplicate` and `Delete`; entries from a saved meal also offer `Delete whole meal (3 entries)`.
2. `Edit amount` opens the amount sheet with `Save`, starting from the logged amount and portion. The new values scale from what was logged, never from the food's current values. Saving without changes leaves the entry exactly as it was.
3. `Move to another meal` lists the five meals and moves the entry to the end of the chosen one; `Duplicate` adds a copy to the same meal.
4. `Delete` asks `Delete entry?` with `This can't be undone.` before removing anything. The summary and subtotal update immediately after any change.

## Layout & design

- **Where**: tapping an `EntryRow` (new) opens a `Drawer` over the day page.
- **Sheet**, top to bottom:
  - `DrawerHeader` with the entry name and `150 g · 212 kcal · Breakfast` as its description, `MacroInline` under it.
  - `DrawerActions`: `Edit amount`, `Move to another meal`, `Duplicate`, then the danger rows last — `Delete`, and for saved-meal entries `Delete whole meal (3 entries)`.
- **Move**: the same `Drawer` swaps its actions for five `DrawerAction`s, one per meal, the current one `active`.
- **Edit**: `Edit amount` opens the `AmountSheet` (new) with `Save` instead of `Log · <Meal>`.
- **Dialogs**: `ConfirmDialog` (destructive) `Delete entry?` — `This can't be undone.`
