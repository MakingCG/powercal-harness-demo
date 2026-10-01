# F013: Search Open Food Facts

**Epic**: 2. Food library · **Status**: Specified · **Depends on**: F010, F014

## Goal

Find a branded product by name when it wasn't scanned and isn't in the library yet. This is deliberately the second path: the user's own foods always come first and appear instantly, and the network never blocks logging. Anything the user picks from the results is saved locally, so it never has to be fetched again.

## Acceptance criteria

1. Typing in the `Search` tab shows the user's own matches instantly under `My foods`; after a short pause, online results appear below them under `Open Food Facts`.
2. A product the user already has shows only once, as their own row.
3. Tapping a complete result saves it to the library and opens the amount sheet. A result with missing nutrition is marked `Incomplete` and opens the new-food form prefilled instead.
4. If the service doesn't answer, local results stay on screen with the quiet line `Open Food Facts isn't responding right now` — never a crash or a dialog. Offline, the section reads `Offline — searching your library only`.

## Layout & design

- **Where**: no route of its own — the `Search` tab of the `FoodPickerSheet` (new) (F014), under its `SearchField`.
- **Body**, top to bottom:
  - `SectionHeader` `My foods` + `FoodRow` (new) rows, filtered instantly.
  - `SectionHeader` `Open Food Facts` + `FoodRow` rows, with a `SkeletonList` while waiting; a result missing nutrition carries a `StatusPill` (warn) `Incomplete`.
  - When the service doesn't answer or the phone is offline, one muted line replaces the online section — never an `ErrorDialog`.
  - The attribution `Data © Open Food Facts contributors, ODbL` at the bottom of the list.
- **Empty**: `EmptyState` `No results` — `Try another name or scan the barcode.`
