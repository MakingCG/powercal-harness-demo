# F071: Crash screen

**Epic**: 6. Polish · **Status**: Specified · **Depends on**: F002, F060

## Goal

With no server there is no safety net and no support. If something breaks, the user must not be left with a white screen and their only copy of months of logging behind it. A crash shows a calm screen that offers a way back and, above all, a way to rescue the data even when the rest of the app is broken.

## Acceptance criteria

1. When a screen crashes, the user sees `Something went wrong` with `The app ran into an error. Your data on this phone is safe.` and the actions `Try again`, `Export data` and `Restart app`.
2. `Export data` opens the share sheet straight from the tap, even though the app is broken.
3. If `Try again` fails again right away, it is hidden and `Restart app` becomes the main action. Restarting never touches the data.
4. A crash in one screen leaves the nav usable. Nothing is ever sent anywhere; an `Error details` section shows the message and the recovery path (export, reinstall, restore).

## Layout & design

- **Where**: `CrashScreen` (new) — fills the page area inside `AppShell` so the nav stays usable, or the whole screen when the app failed to start.
- **Body**: a centred glass `Card` with an amber icon, `Something went wrong` and one sentence, then the actions — primary `Button` `Try again`, secondary `Button`s `Export data` and `Restart app`. When `Try again` is hidden, `Restart app` becomes the primary.
- **Details**: a collapsed `Error details` section with the message and the recovery path.
