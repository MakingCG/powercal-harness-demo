# F001: App skeleton

**Epic**: 1. Foundation · **Status**: Specified · **Depends on**: —

## Goal

The empty PowerCal app that everything else is built into. It builds cleanly, opens on the phone as PowerCal with its own name, icon and colours, and can be added to the Home Screen. Nothing user-facing happens yet, but every later feature assumes this skeleton exists and that the code rules in the harness are enforced from the first commit, not added later.

## Acceptance criteria

1. A clean checkout installs, builds and lints with zero errors.
2. Opened on an iPhone, the app is called PowerCal, shows its own icon, uses the right status-bar colour and never flashes the wrong theme on a cold start.
3. Breaking one of the layering rules in `BOUNDARIES.md` (for example a screen reading the database directly) fails the lint.

## Layout & design

None — F001 has no screens. The only visible page is the design-system showcase (`/design-system`, F002), which stays reachable for review.
