# F061: Import backup

**Epic**: 5. Backup & settings · **Status**: Specified · **Depends on**: F060

## Goal

Getting a backup file back into the app — on a new phone, after deleting the icon, or after a reinstall. The flow is deliberately careful: pick the file, see what's in it before anything changes, then choose to replace everything or merge. Either it all works or nothing changes.

## Acceptance criteria

1. `Import backup` opens the file picker. A file that isn't a PowerCal backup, or comes from a newer version of the app, is refused with a clear sentence.
2. Before anything is written, `Restore from backup` shows the backup's date and what's in it (`Foods 214 · Diary entries 1,842 · …`) and offers `Merge` or `Replace`. Damaged records are counted and skipped.
3. `Replace` asks `Replace all data?` first, then swaps everything for the backup. `Merge` adds the backup's records and lets them win over matching ones, keeping everything else.
4. On success the app says `Import complete` and restarts with the restored data. On failure it says `Import failed. Your data hasn't changed.` — and it hasn't. A backup restored on a new phone brings back everything.

## Layout & design

- **Where**: a `FieldRow` `Import backup` in `Settings › Data`, and `Restore from backup` on onboarding (F070).
- **Preview sheet**: a `Drawer` — `DrawerHeader` `Restore from backup` with the backup's date → a `MiniStat` grid of counts (`Foods 214`, `Diary entries 1,842`, …) and the skipped-record count → primary `Button` `Merge` → danger `Button` `Replace`.
- **Dialogs**: `ConfirmDialog` (destructive) `Replace all data?`; `ErrorDialog` for a refused file and for `Import failed. Your data hasn't changed.`
