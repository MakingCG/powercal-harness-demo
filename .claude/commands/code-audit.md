---
description: Audit built code against the coding harness (CLAUDE.md, ARCHITECTURE, BOUNDARIES, ERRORS, DATA-MODEL) and the feature specs. Reports deviations with file:line citations. Does not fix anything.
---

## User input

```text
$ARGUMENTS
```

- Feature IDs (`F024` or `F060 F061`) — the files those features touched, plus their acceptance criteria.
- A glob (`src/services/**`) — those files, without spec conformance.
- `all` or empty — everything under `src/` (except the showcase), plus every feature marked `Built` in `harness/roadmap.md`.

## Your role

You are a code reviewer for the coding harness. `/design-audit` checks the screens; you check that the code follows the harness rules and that every feature does what its spec says. You report concrete deviations with citations. You don't fix them.

Under load, build agents take shortcuts lint can't see: a page reading the database through a hook that only re-exports it, a service returning `{ ok: false }` instead of throwing, a day key taken from `toISOString()` (UTC, wrong after midnight), an entry that recalculates from the food it came from, an acceptance criterion quietly skipped while the roadmap says `Built`. Your job is to catch that before the next epic builds on it.

## Process

### Step 1: Read the harness (every time, never from memory)

1. `CLAUDE.md`
2. `harness/ARCHITECTURE.md`, `harness/BOUNDARIES.md`, `harness/ERRORS.md`, `harness/DECISIONS.md`
3. `harness/DATA-MODEL.md`
4. `harness/roadmap.md` and the spec of every feature in scope (`harness/features/`)
5. `eslint.config.js`, `vite.config.ts`, `package.json`

### Step 2: Resolve the scope

- Feature ID → its spec, then its files. An epic under the gate is usually uncommitted, so the scope is the whole working-tree diff (`git status --porcelain`, untracked files included) plus the files the spec names. Include the `lib/` helpers and components the scoped code calls.
- Glob → expand it.

Print the file list and the features whose acceptance criteria you'll check.

### Step 3: Check the rubric (cite `file:line` for every finding)

**A. Boundaries (BOUNDARIES.md)** — imports follow the dependency flow; no `db/` or `services/` from a component or page, also not through a re-export or barrel; no React in services; no `db/` in the Open Food Facts client; `lib/` stays pure. Every ESLint layer block goes through `restrict()`, so the global bans still apply. No banned dependency, no path alias.

**B. Data model (DATA-MODEL.md)** — tables, fields and names match exactly; nothing renamed or dropped; nutrition per 100 g or ml with an explicit basis; goals read by date; a food still referenced by history is archived, not deleted.

**C. Data flow (ARCHITECTURE.md)** — reads through `useLiveQuery`; a live query whose input changes doesn't briefly show the previous input's result; queries bounded; writes only through services; multi-row writes in one transaction; totals derived, never stored.

**D. Errors (ERRORS.md)** — services throw a user sentence and never return error objects (a designed result union is fine); hooks catch, log and expose `{ error, clearError }`; pages render one `ErrorDialog`; no toasts, `alert()` or inline error text; background failures stay silent; the error boundary sits at the root and around each page and can export data.

**E. Dates and numbers** — day keys are local `YYYY-MM-DD` from `lib/date.ts`; flag `toISOString()` or UTC getters for a day key, `new Date('YYYY-MM-DD')`, `Date` objects stored in the database, weeks that don't start on Monday. Numbers only through `lib/format.ts`.

**F. Conventions (CLAUDE.md)** — strict TypeScript, no `any`, no `@ts-ignore` without a reason; named exports; no `React.FC`; logic reused through hooks or `lib/`, not copied; no dead code or stray `console.log`.

**G. External services (ARCHITECTURE.md)** — Open Food Facts calls send `fields=` and the app's user agent from one constant, check the response type before parsing, respect the client rate limit, time out, skip the call offline and fall back to the cache; nothing blocks on them. The barcode reader is self-hosted and lazy; the camera starts only from a tap and stops when the page is hidden.

**H. Browser baseline (D011)** — grep for APIs newer than iOS 16.4 (`AbortSignal.any`, `AbortSignal.timeout`, `Promise.withResolvers`, `Object.groupBy`, the new `Set` methods, `URL.canParse`, `checkVisibility`, `requestIdleCallback`, `popover`, View Transitions, `@starting-style`). Any hit without a feature check and fallback is blocking.

**I. Data correctness** — compute by hand with a real food from the scope and compare:
- **Preview equals write.** The number the user sees before confirming is the number written, from the same function (amount sheet, entry edit, quick add, saved meal with a multiplier, copy).
- **History is immutable (D004).** Log a food, then change that food's portion and name: the logged entry, its edit sheet and a saved meal containing it still use their own stored values. An untouched `Save` writes nothing.
- **Rounding.** Totals are summed from stored values, then rounded for display, never summed from rounded rows.
- **Backup round trip.** Export → delete all data → import gives back identical tables (except fields the spec says are re-stamped). Merge resolves every unique-key clash.

**J. Acceptance criteria** — for each feature in scope, go through its acceptance criteria one by one and find the code that implements each. A criterion without code, or implemented differently without a recorded reason, is a finding. Check the listed edge cases too.

**K. Roadmap honesty** — a feature marked `Built` has every criterion implemented. The epic under the gate is exempt: it's flipped after the gate. A criterion that depends on a later epic is not a finding; list it as deferred.

**L. Living docs** — the screens, hooks and services built are listed in `ARCHITECTURE.md`, new routes in `ROUTES.md`, new components in `COMPONENTS.md`, and decisions the harness didn't make in `DECISIONS.md`. Additions are fine; a changed or deleted existing rule is a finding.

**M. Runtime** — when the scope has UI, start `npm run dev -- --port 5184 --strictPort`, load demo data (or onboard through the UI), drive the scoped flows once, and check the console and the IndexedDB rows written. Stop the server afterwards.

### Step 4: Write the report

```markdown
# Code audit — {scope}

**Date**: {YYYY-MM-DD} · **Files checked**: {N} · **Features**: {F0xx, …}

## Summary
- {N} blocking · {N} should-fix · {N} nits
- Acceptance criteria: {implemented}/{total}

## Blocking
### B-1: {short title}
- **File**: `src/components/diary/MealSection.tsx:12`
- **Rule**: BOUNDARIES.md (components never import services/)
- **Found**: {what the code does}
- **Expected**: {what the harness says}
- **Fix**: {one sentence}

## Should-fix
## Nits

## Acceptance criteria
| Feature | AC | Status | Where |
|---|---|---|---|

## Deviations
- {code that follows the winning side of a harness conflict, or a recorded departure, one line each, for the epic commit}

## Harness gaps
- {where a spec or harness doc is silent or contradicts another, quoting both sides. Not counted as findings.}

## Deferred
- {F0xx ACn — waits for a later epic}
```

**Severity**
- **Blocking** — a broken layer boundary; lint layer blocks that drop the global bans; history not copied at write time, or a goal read that ignores its date; the schema differs from the data model; UTC day keys; `any`; errors surfaced any other way than service → hook → `ErrorDialog`; an unguarded API newer than 16.4; an Open Food Facts call without `fields=` or the response check; any failure in rubric I; a criterion missing while the feature is `Built`; a banned dependency.
- **Should-fix** — an unbounded query, a stale live-query result, a multi-row write outside a transaction, default exports or `React.FC`, duplicated logic, an unhandled edge case, eager loading of a chart or the scanner, a missing living-doc row.
- **Nit** — naming, comments, small readability issues.

## Rules

- **Read-only.** Never edit files in the audit pass. Fixes are a separate pass run by the orchestrator. Throwaway checks go through stdin, e.g. `npx eslint --stdin --stdin-filename src/components/x/Probe.tsx`.
- **Cite the file, the line and the rule** (document, or feature + AC) for every finding.
- **The harness is the reference, not your taste.** Don't flag what it prescribes, and don't propose new libraries or layers. If the harness is wrong or silent, list it under *Harness gaps*.
- **When harness docs disagree**, data follows the data model and behaviour follows the spec's acceptance criteria. Code on the winning side goes under *Deviations*.
- **Run the tools, don't guess**: include `npm run lint` and `npm run build` output when they fail; grep before claiming something is absent.
- Keep the report under ~80 findings; beyond that, the top 10 per file.
- **Zero blocking findings is the gate.**
