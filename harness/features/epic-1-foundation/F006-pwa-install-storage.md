# F006: Install & offline

**Epic**: 1. Foundation · **Status**: Specified · **Depends on**: F004

## Goal

Everything that lets PowerCal live safely as a Home Screen app. On iPhone, data logged in a Safari tab doesn't carry over to the installed app, so the user must be told to install first. The app asks the phone to keep its storage, works fully offline, and never reloads itself in the middle of a half-typed entry when a new version arrives.

## Acceptance criteria

1. In a Safari tab, the day page (and onboarding) opens with a dismissible card `Add PowerCal to your Home Screen` explaining that data logged in Safari won't appear in the installed app, with a `How to` link. Once installed, it never shows.
2. When a new version is ready, a bar reads `A new version is ready` with `Update` and `Later`. It waits until any open sheet is closed and never reloads on its own.
3. Offline, every screen works; only Open Food Facts lookups say `Offline — searching your library only`.
4. In Settings the user can pick `Light · Dark · System` and see whether storage is persistent and how much is used.

## Layout & design

- **Install hint**: `NoticeCard` (new) — a glass `Card` with an amber icon, the title `Add PowerCal to your Home Screen`, one sentence, a link `Button` `How to` and a close `IconButton`. First thing on the day page, and on onboarding (F070).
- **Update prompt**: `UpdatePrompt` (new) — the one overlay allowed besides sheets and dialogs: a glass bar floating just above the `BottomNav`, text on the left, a small primary `Button` `Update` and a ghost `Button` `Later`.
- **Settings**: the theme is a text-only `SegmentedToggle` `Light · Dark · System` in `Display`; storage is a `FieldRow` in `Data` with a `StatusPill` (persistent or not) and the space used as its hint.
- **Offline**: the only offline message lives in the picker's `Search` tab (F013), never as a banner.
