# F064: Demo data

**Epic**: 5. Backup & settings · **Status**: Specified · **Depends on**: F011, F024, F026, F028, F061, F062

## Goal

Let anyone see PowerCal full of realistic data in one tap — to explore the app without weeks of logging, or to record a demo. The app generates about six weeks of history ending today: a profile and goal, meals across all five slots, saved meals, favourites and weigh-ins slowly trending toward a target. It needs no network, and the same day always gives the same data.

## Acceptance criteria

1. `Settings › Data › Load demo data` (hint `About 6 weeks of sample meals and weigh-ins`) fills the app and opens a populated day page.
2. If the user already has data, it first asks `Replace your data with demo data?`. If loading fails, nothing changes.
3. The data looks real: a few untracked days, weekdays near the goal, a couple of weekend days over, some quick adds, three saved meals, six favourites, and a weight going down about 0.4 kg per week so the pace reads `On track`.
4. Once loaded, demo data is ordinary data: it is exported, imported and deleted like anything the user logged. There is no demo mode.

## Layout & design

- **Settings**: a `FieldRow` `Load demo data` in `Settings › Data`, below `Import backup`, with the hint `About 6 weeks of sample meals and weigh-ins`.
- **Onboarding**: the same action as a secondary `Button` `Explore with demo data` (F070).
- **Dialogs**: `ConfirmDialog` (destructive) `Replace your data with demo data?` when data exists; `ErrorDialog` if loading fails.
