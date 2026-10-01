# F016: Custom portions

**Epic**: 2. Food library · **Status**: Specified · **Depends on**: F010

## Goal

Nobody weighs a yogurt — they log `1 pc`. Every food can carry named portions: some come with the product (`1 serving`, `whole pack`), some the user invents (`my bowl = 45 g`). One of them is the default the calculator opens on. The amount is always "N × a named portion" or plain grams, never a confusing "N × 1 g".

## Acceptance criteria

1. Every food always has a `100 g` (or `100 ml`) base portion that can't be removed. The user can add, rename, re-weigh and delete other portions, and mark one as `Default`.
2. A new portion (`my bowl` = 45) appears in the calculator right away, and the default one is what every amount sheet for that food opens on.
3. Changing or deleting a portion never changes what was already logged. Entries read as `150 g`, `1 pc (58 g)`, `2 pc (116 g)` or `0.5 pack (125 g)`.
4. Portions of bundled and scanned foods can be edited without turning the food into a personal copy.

## Layout & design

- **Where**: `PortionEditor` (new) — inside the food form (F010), and as a `Drawer` from `Edit portions ›` on the detail page, with the `DrawerHeader` `Portions — <food name>`.
- **Rows**: one per portion — a `Default` radio, a `TextField` for the name, a `NumericInput` for the grams and a remove `IconButton`. The `100 g` / `100 ml` base row has no remove.
- **Footer**: a link `Button` `Add portion`, then the full-width primary `Button` `Save` last.
- **Validation**: an incomplete row shows a quiet `Field` hint and disables `Save`.
- **Copy**: amounts always read as grams or N × a named portion — `150 g`, `1 pc (58 g)`, `0.5 pack (125 g)` — never `N × 1 g`.
