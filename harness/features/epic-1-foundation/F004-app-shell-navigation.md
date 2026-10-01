# F004: App shell & navigation

**Epic**: 1. Foundation · **Status**: Specified · **Depends on**: F002

## Goal

The frame that makes PowerCal feel like an app rather than a website. Three tabs — Today, Foods, Progress — and one orange add button. Every screen has a stable address with the day in it, so Back works and any day can be reopened. The add button always logs into the day that is on screen, so logging yesterday's dinner in the evening never lands on the wrong date.

## Acceptance criteria

1. The bottom nav shows exactly `Today · Foods · Progress` plus the add button; Settings is reached from the gear on the day page.
2. Tapping the add button while viewing 20 Aug opens the add-food sheet for 20 Aug. From any other tab it opens for today. When no meal is chosen, the meal defaults to the one that fits the time of day (for today) or `Breakfast` (for other days).
3. Opening the app, an unknown address or an invalid date always lands on today's day page. Until a profile and goal exist, every screen leads to onboarding.
4. Focused screens (add food, scan, onboarding, the food form) hide the nav and use the whole screen.

## Layout & design

- **Shell**: the one `AppShell` around every route — canvas, page crossfade and `ScrollToTop` on every navigation. Pages render only their content.
- **Nav**: `BottomNav` — a floating glass pill with the tabs `Today · Foods · Progress` on the left and the orange add button on its right. Never centred, never a fourth tab.
- **Visibility**: the nav hides on the focused routes in `ROUTES.md` (add food, scan, onboarding, the food form); the shell decides this from the route, not the page.
- **Page titles**: belong to each page's `PageTitle` or `Header`, not the shell. Settings opens from the gear `IconButton` on the day page's `PageTitle`.
