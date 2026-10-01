# F040: Log & correct weight

**Epic**: 4. Weight & progress · **Status**: Specified · **Depends on**: F029

## Goal

The weigh-in sheet from the day page becomes the tool for the whole weight history. The user can log a weigh-in from the Progress tab, and fix a mistyped value, move a weigh-in to the right date or delete it. Every chart, the pace and the day-page card read what this sheet writes, and Progress is the one place a wrong weigh-in can be fixed.

## Acceptance criteria

1. `Log weight` on Progress opens the same sheet as on the day page, dated today.
2. Tapping a past weigh-in opens it for editing with `Correct the value or delete the weigh-in.`; `Delete weigh-in` asks `Delete this weigh-in?` first.
3. Changing the date moves the weigh-in: afterwards there is exactly one weigh-in, on the new date.
4. The chart, stats, list, pace and day-page card all update right away after any change.

## Layout & design

- **Sheet**: the same `WeightSheet` (new) as the day page (F029) — weight, date, note, `Save`. `Log weight` on Progress opens it dated today.
- **Edit mode**: tapping a row in `Recent weigh-ins` (F041) opens it with `Correct the value or delete the weigh-in.` as the `DrawerHeader` description and a danger `DrawerAction` `Delete weigh-in` last.
- **Dialogs**: `ConfirmDialog` (destructive) `Delete this weigh-in?`; `ErrorDialog` on a failed save.
