# F012: Barcode scanner

**Epic**: 2. Food library · **Status**: Specified · **Depends on**: F010, F014, F015

## Goal

Point the phone at a yogurt and get it logged. The scanner reads the barcode, looks the product up in the user's own library first and then in Open Food Facts, and opens the amount sheet. Coverage of supermarket products is uneven, so "not found" is a designed two-tap path into a prefilled new-food form, not an error.

## Acceptance criteria

1. The camera starts only after the user taps `Start camera`. A scanned product the user already has opens straight away, without the network, and the user's own numbers are never replaced.
2. A product found online is saved to the library and offers `Log` (the amount sheet for the day and meal the user came from) and `Food details`.
3. A product that isn't found shows `Product not found` with `Create food`, which opens the new-food form with the barcode already filled in. After saving, the user is back in the amount sheet.
4. Without camera access, `Enter code` and `Take photo` still work. When the service is busy or offline the user sees a plain message, and `Create food` stays available.

## Layout & design

- **Template & route**: `/scan` uses Template D — the camera fills the screen, no `Header`, no nav.
- **Top**: a close `IconButton`, the title `Scan` and a torch `IconButton`, all `onCamera`, floating over the image.
- **Body**: a framed viewfinder with the hint `Fit the barcode inside the frame`; before permission, a primary `Button` `Start camera` in its place.
- **Bottom**: two secondary `Button`s (`onCamera`) — `Enter code` and `Take photo`. `Enter code` opens a small `Drawer` with a `NumericInput` (no grouping) and a primary `Button`.
- **Result sheet**: a `Drawer` — `DrawerHeader` with the product name and brand, kcal and `MacroInline` per 100 g, then a primary `Button` `Log` (→ `AmountSheet` (new)) and a secondary `Button` `Food details`.
- **Not found**: the same sheet holds an `EmptyState` `Product not found` with the action `Create food`. Busy or offline is a plain sentence in the sheet, not an `ErrorDialog`, and `Create food` stays.
