# F070: Empty states & onboarding

**Epic**: 6. Polish · **Status**: Specified · **Depends on**: F005, F006, F061, F064

## Goal

Every screen in PowerCal starts empty, and the first minutes decide whether the app gets used. This feature shapes the first run — install first, then set up, or restore a backup, or explore with demo data — and gives every empty list a short, useful message, so the app is never a blank card with nothing to tap.

## Acceptance criteria

1. Onboarding step 1 offers, below the profile, `Restore from backup` and `Explore with demo data`. Both work without a confirm (there's nothing to lose yet) and land on a filled day page. Onboarding is the only way to restore on a new phone, because Settings isn't reachable before setup.
2. In a Safari tab, the install hint is the first thing on onboarding, with the same wording as on the day page.
3. While the diary is brand new, an empty day shows `Log your first food` with `Tap + on a meal, or the orange button below.` It disappears after the first few entries.
4. Every empty list has its own short message — for example `Nothing logged yet`, `No favourites yet`, `No saved meals yet`, `Log your first weigh-in`, `Not enough data for a chart yet` — with at most two lines and two actions. Loading data shows placeholders, never an empty state.

## Layout & design

- **Empty states**: an `EmptyState` inside its host glass `Card` — icon, title, at most two lines and two actions, no illustrations. While loading, the card shows `Skeleton`s instead.
- **First day**: while the diary is brand new, a glass `Card` with an `EmptyState` `Log your first food` — `Tap + on a meal, or the orange button below.`
- **Onboarding step 1**, around the profile form:
  - `NoticeCard` (new) with the install hint first, in a Safari tab only.
  - A small glass `Card` `Have a backup?` with a secondary `Button` `Restore from backup`.
  - A full-width secondary `Button` `Explore with demo data` with a sparkle icon, above `Next`.
- **Copy**: short and calm — `Nothing logged yet`, `No favourites yet`, `No saved meals yet`, `Log your first weigh-in`, `Not enough data for a chart yet`.
