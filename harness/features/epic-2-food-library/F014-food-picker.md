# F014: Food picker & library

**Epic**: 2. Food library · **Status**: Specified · **Depends on**: F010, F011, F015

## Goal

The sheet between "I ate something" and a diary row — the most used surface in PowerCal. Most entries are the same handful of foods, so it opens on `Recent` with them already on screen: no typing, no searching. Scanning and creating a food are one tap away, so a missing food never dead-ends. The same list powers the Foods tab, the user's whole library.

## Acceptance criteria

1. The add button opens `Add food` on the `Recent` tab with the keyboard down. Tabs are `Recent · Favourites · Saved · Search`, and a row of meal chips shows which meal the food goes into.
2. Every row shows the name, brand and kcal per 100 g, and a ★ that favourites it without leaving the sheet. Tapping the row opens the amount sheet, so a recent food is logged in three taps: add, food, `Log`.
3. Typing in the search box filters the library instantly (`quark low` finds `Quark, low-fat`). `Scan` and `+ New food` are always at the bottom and bring the user back to this sheet with the new food ready to log.
4. The Foods tab lists the whole library with filters `All · Favourites · Custom · OFF · Generic`, a search box and an always-visible `+ New food`.

## Layout & design

- **Template & route**: `/day/:date/add` is a sheet — `FoodPickerSheet` (new), a `Drawer` over the still-visible day page, no nav.
- **Sheet**, top to bottom:
  - `DrawerHeader` `Add food` with the date as its description.
  - `Field` `Add to:` with a `ChipGroup` of the five meal `Chip`s.
  - `SearchField` — the keyboard stays down when the sheet opens.
  - A full-width `SegmentedToggle` `Recent · Favourites · Saved · Search`.
  - The list: `FoodRow` (new) — `ListItem` with a thumbnail, name, brand · source, kcal / 100 g and a ★ `IconButton`. Each tab has its own `EmptyState` (`No favourites yet`).
  - A sticky footer with secondary `Button`s `Scan` and `New food` (and `Quick add`, F026).
- **Foods tab**: `/foods` uses Template B — `Header` `Foods` with a scan right action → `SearchField` → `ChipGroup` `All · Favourites · Custom · OFF · Generic` → an always-visible secondary `Button` `New food` → `SectionHeader` + the `FoodRow` list in a glass `Card`.
