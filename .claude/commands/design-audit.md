---
description: Audit built screens against harness/DESIGN_SYSTEM.md and the live showcase. Reports deviations with file:line citations. Does not fix anything.
---

## User input

```text
$ARGUMENTS
```

- Feature IDs (`F023` or `F020 F021 F022`) — the files those features touched, plus the components their screens render.
- A route (`/foods`) — the page at that route and what it composes.
- A glob (`src/components/diary/**`).
- `all` or empty — every `.tsx` under `src/pages/` (except `DesignSystem.tsx`) and `src/components/`.

## Your role

You are a design-system reviewer. You compare the screens against the binding manual in `harness/DESIGN_SYSTEM.md` and the canonical patterns in the showcase, `src/pages/DesignSystem.tsx`. You report concrete deviations with citations. You don't fix them: the agent that grades the work is never the one that did it.

Build agents drift. After a few screens they work from memory instead of reading the showcase: a page renders its own nav, re-types the page column, adds a flat orange card, a red "over goal", a toast, a `type="number"`, a Title Case button. Your job is to catch that after the fact.

## Process

### Step 1: Read the contract (every time, never from memory)

1. `harness/DESIGN_SYSTEM.md` — all of it. These are the rules you grade against.
2. `src/pages/DesignSystem.tsx` — always `ShellSection` and `PageTemplatesSection` (templates A–D), then the sections that match the scope: `CompositionSection` and `OverlaysSection` for the day page and sheets, `InputsSection` and `ChoicesSection` for forms, `NutritionSection`, `ChartsSection`, `CalendarSection`, `SurfacesSection`, `DataStatesSection`.
3. `harness/COMPONENTS.md` and `harness/ROUTES.md`.
4. `src/index.css`, `src/lib/chartColors.ts`, `src/lib/format.ts`, `src/lib/date.ts`.

### Step 2: Resolve the scope

- Feature ID → its spec in `harness/features/`. An epic under the gate is usually uncommitted, so the scope is the whole working-tree diff (`git status --porcelain`, untracked files included) plus the files the spec names.
- Add the components the scoped screens render, even if they're older. A component that overflows at 320 px is a finding on the screen that uses it.
- Route → trace it from the router to the page and its imports.

Print the resolved file list before reading.

### Step 3: Check the rubric (cite `file:line` for every finding)

**A. Shell and nav (§2.1, §2.2)** — pages render only content; no page renders the nav, its own add button, a canvas colour or a second shell; nav visibility and the active tab come from the shell and `lib/routes.ts`.

**B. Page templates (§2.3)** — every screen matches template A, B, C or D; it uses `PageContainer` without re-typing the column; `Header` or `PageTitle`, never both; pickers and small forms are sheets, not routes; the primary button is last.

**C. Surfaces (§2.4, §2.5)** — every surface is a `Card` or `SectionCard`; at most one highlight card per screen; everything on it passes `tone="onHighlight"`; editor sheets follow the fixed order; only sheets and dialogs overlay the app.

**D. Tokens and anti-patterns (§7)** — grep for hex outside `chartColors.ts`, colour or layout in `style={{`, raw `env(safe-area`, `type="number"`, red for anything but delete, a new hue, a toast, inline error text, a third-party UI import.

**E. Component selection (§3)** — every element maps to a building block: a raw `<button>` where `Button` fits, a raw `<input>` where `TextField` or `NumericInput` fits, a freehand pill, a raw heading, a home-made empty state. Recurring blocks mirror `CompositionSection`.

**F. Energy and macros (§2.6)** — orange is the only accent; macros told apart by letter and P · C · F order; kcal and macros shown together; over goal amber, never red.

**G. Copy and locale (§5)** — English, sentence case, British spelling, no exclamation marks; the core terms (`log`, `entry`, `food`, `portion`, `saved meal`, `weigh-in`, `goal`) used consistently; meal names capitalised; numbers only through `lib/format.ts` and dates only through `lib/date.ts`; no `toLocaleDateString` or `Intl` month names.

**H. Mobile and iOS (§2.7)** — touch targets ≥ 44 px; every input has an accessible name; safe areas through utilities; toggle labels on one line.

**I. Icons (§6)** — Lucide only, sizes by context, colour through `text-*`.

**J. Show what you built (§1)** — every component in `src/components/` has a `Showpiece` in the showcase and a row in `COMPONENTS.md`.

### Step 4: Runtime check (static reading misses overlap and clipping)

1. Start `npm run dev -- --port 5184 --strictPort` in the background and stop it afterwards.
2. Load data: `Load demo data` in Settings or on onboarding once it exists; before that, complete onboarding through the UI.
3. Open every route in scope with the browser tools at **390 × 844** and **320 × 568**, in light and dark, and open each sheet and dialog the scope adds, including with the keyboard field focused.
4. Look for horizontal overflow, text that wraps where it must stay on one line, clipped numbers, overlapping controls, and content hidden under a sheet footer or the nav. Pages scroll inside the shell's container, not the window, so scroll that container and take several screenshots.
5. Check the console: zero errors, zero React warnings.
6. Save screenshots under `.qa/` (gitignored) and list them in the report.

### Step 5: Write the report

```markdown
# Design audit — {scope}

**Date**: {YYYY-MM-DD} · **Files checked**: {N}

## Summary
- {N} blocking · {N} should-fix · {N} nits

## Blocking
### B-1: {short title}
- **File**: `src/pages/Day.tsx:42`
- **Rule**: DESIGN_SYSTEM.md §2.3
- **Found**: {what the code does}
- **Expected**: {what the manual or showcase says}
- **Fix**: {one sentence}

## Should-fix
## Nits

## Deviations
- {code that follows the winning side of a conflict between harness docs, one line each, for the epic commit}

## Harness gaps
- {where the manual, showcase or catalog is silent or contradicts itself, quoting both sides. Not counted as findings.}

## Runtime evidence
- {routes × widths × themes checked, screenshot paths}
```

**Severity**
- **Blocking** — wrong shell or nav, wrong template or page column, a second highlight card, raw hex, an invented token, variant or tone, a third overlay type, a toast, red for over goal, a third-party UI library, a wrong term for a core concept (meal names, P · C · F, log).
- **Should-fix** — freehand markup where a building block exists, formatting outside `lib/format.ts` or `lib/date.ts`, a touch target under 44 px, an input without a name, overflow at 320 px, a missing showcase entry or catalog row, Title Case or American spelling.
- **Nit** — spacing within tolerance, copy register.

## Rules

- **Read-only.** Screenshots under `.qa/` are the only files you write. Fixes are a separate pass: in an autonomous run the orchestrator sends blocking and should-fix findings to an implementer and runs this audit again.
- **Cite the file, the line and the rule** for every finding. A finding without them doesn't count.
- **When harness docs disagree**, layout follows the manual and the showcase over a spec's sketch. Code that follows the winning side is not a finding; list it under *Deviations*.
- **Don't propose new building blocks** to absorb a deviation. If the system can't express it, that's a harness gap.
- Keep the report under ~80 findings; beyond that, the top 10 per file.
- **Zero blocking findings is the gate.**
