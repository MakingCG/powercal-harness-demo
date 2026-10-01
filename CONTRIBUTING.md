# Contributing

This repo is a harness, not an app. The app is thrown away and rebuilt from the harness, so **improvements belong in the harness**, never in generated app code.

## What makes a good contribution

- **A spec fix** (`harness/features/**`) — an acceptance criterion that was ambiguous, contradicted another doc, or let a build go wrong. Keep the format: Goal · Acceptance criteria (Given / then) · Edge cases · Layout & design.
- **A rule** (`DESIGN_SYSTEM.md`, `ARCHITECTURE.md`, `BOUNDARIES.md`, `ERRORS.md`, `DECISIONS.md`) — a rule that would have prevented a real mistake you saw in a build. Keep it short and write it as the target state, not as a story of what went wrong. The harness is a skeleton of rules, not a description of the finished app.
- **An audit check** (`.claude/commands/design-audit.md`, `code-audit.md`) — a deviation the audits missed. Say what to look for, where, and its severity.
- **A design-system fix** (`src/components/`, the showcase) — only together with its showcase entry and `COMPONENTS.md` row.
- **A new feature** — a roadmap row plus a spec, with its dependencies.

The best contributions come from a build: run "Build the whole app from the roadmap.", note where the result differs from what the harness intended, trace it to the harness, and fix it there.

## PR checklist

- [ ] The change is in the harness (docs, specs, audits, design system), not in generated app code.
- [ ] Docs stay consistent with each other — a rule changed in one place is changed everywhere it appears (CLAUDE.md, the harness files, specs, audits).
- [ ] New or changed UI copy follows the copy rules in `harness/DESIGN_SYSTEM.md`.
- [ ] Roadmap statuses stay `Specified`, and the living lists (what's built, domain components) stay at their starting state.
- [ ] `npm run lint` and `npm run build` pass.
- [ ] If you ran a build: say which epic or feature the change came from and what went wrong without it.

Keep PRs small and focused — one rule, one spec, one check.
