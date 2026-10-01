# F060: Export backup

**Epic**: 5. Backup & settings · **Status**: Specified · **Depends on**: F003, F011

## Goal

There is no server, so the backup file is the only safety net. Home Screen apps aren't part of the phone's cloud backup, and deleting the icon deletes the data. One tap saves everything to a single file through the iPhone share sheet — to Files, AirDrop or Mail — and the app remembers when that last happened.

## Acceptance criteria

1. `Settings › Data › Export backup` opens the share sheet straight away with a file named `powercal-2026-09-30.json` that holds all the user's data.
2. The row shows `Last backup: 3 days ago` (or `never`, `today`). A completed share or download updates it; cancelling the share sheet changes nothing and shows no error.
3. If the phone can't share the file, the app falls back to a download, and as a last resort shows the backup text with a `Copy` button. Copying doesn't count as a backup.
4. Bundled foods the user never touched are left out of the file; favourites, portions and usage on bundled foods are kept.

## Layout & design

- **Where**: a `FieldRow` `Export backup` in the `Data` `SectionCard` of Settings, with `Last backup: 3 days ago` as its hint.
- **Running**: the row swaps its chevron for a spinner and the other action rows are disabled until it finishes.
- **Copy fallback**: a `Drawer` — `DrawerHeader` with one line of explanation, the backup text in a read-only field and a primary `Button` `Copy`.
- **Errors**: a cancelled share sheet shows nothing; a real failure goes to `ErrorDialog`.
