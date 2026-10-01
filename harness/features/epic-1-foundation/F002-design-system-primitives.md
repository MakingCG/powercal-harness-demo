# F002: Design system

**Epic**: 1. Foundation · **Status**: Specified · **Depends on**: F001

## Goal

The shared visual vocabulary of PowerCal: compact glass cards, bottom sheets, the pill navigation with its orange add button, inputs, pills, rings, bars and charts. The design system is already drawn and coded; this feature makes sure it is complete and true to `DESIGN_SYSTEM.md`, and that every later screen is assembled from these pieces instead of inventing its own.

## Acceptance criteria

1. The showcase page shows every component and page template, in light and dark, at 390 px and 320 px, with nothing overflowing.
2. The theme can be light, dark or follow the system, and switching it applies instantly across the app.
3. Number fields accept both `1.5` and `1,5`, never zoom the page on focus, and every tap target is at least 44 px.
4. Errors appear in one dialog (`Something went wrong` plus a plain sentence), never as toasts; invalid form input shows a quiet hint and disables the button instead of red text.

## Layout & design

- **Route**: `/design-system`, outside the onboarding gate. It mounts the real `AppShell`, never a demo shell.
- **Top bar**: a text-only `SegmentedToggle` `Light · Dark · System`, applied through `ThemeProvider`.
- **Body**: one section per group, each a grid of live demos — foundations, buttons, inputs, choices, pills, surfaces, headings, lists, nutrition, charts, calendar, sheets & dialogs, data states.
- **App shell & page templates**: phone frames showing the `AppShell` anatomy (`BottomNav`, `Header`, `PageContainer`) and templates A–D on their real routes.
- **Composition**: the reference compositions later screens mirror — day summary, meal section, food calculator, weight card, day weight card, settings group — built only from primitives.
