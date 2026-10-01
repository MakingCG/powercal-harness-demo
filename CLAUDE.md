# PowerCal

A lite calorie and macro tracker for iPhone. This repo is a master harness: the rules, the specs and a coded design system, but no app yet. The app is built from the harness, and can be thrown away and rebuilt from it at any time.

## Quick reference
- **Stack**: React 19 + Vite + TypeScript strict + Tailwind v4 + Dexie (IndexedDB) + Recharts + Framer Motion + Lucide.
- **No backend.** Everything runs in the browser. IndexedDB is the database, a JSON export is the backup.
- **Target**: iPhone Safari 16.4+, installed from the Home Screen as a PWA, offline-first.
- **Language**: code and docs in English, UI copy in English (en-GB).

## The harness
Don't read everything up front. Read the file that relates to the problem you're solving right now.

**What to build**
- `harness/PRD.md` — what the app is, who it's for, what's in and out of scope
- `harness/roadmap.md` — epics and features in build order, with statuses
- `harness/features/` — one short spec per feature: goal, acceptance criteria, layout & design
- `harness/DATA-MODEL.md` — the entities. A finished input: build the database exactly from it

**How to build it**
- `harness/ARCHITECTURE.md` — the parts of the app and how they talk, plus a living list of what's built
- `harness/BOUNDARIES.md` — what may import what, and what we deliberately don't use
- `harness/DESIGN_SYSTEM.md` — the binding design manual: templates, surfaces, copy, anti-patterns
- `harness/COMPONENTS.md` — catalog of the coded building blocks
- `harness/ROUTES.md` — the screen map
- `harness/ERRORS.md` — the one way errors reach the user
- `harness/DECISIONS.md` — decisions already made, and why

**Audits**: `/design-audit` (UI against the design manual) and `/code-audit` (code against the rules and the specs).

## Core principles
- **The layer under the hooks is the seam.** Screens get data only through hooks; storage lives in services and the database below them. A backend could replace that layer later without touching a screen.
- **History doesn't change.** A diary entry keeps the values it was logged with, and a goal applies from its date forward.
- **Build from the design system, never beside it.** Every screen is composed from `src/components/`.
- **No guessing.** When the harness is silent, pick the simplest option that fits it and record it in `harness/DECISIONS.md`.

## UI pre-flight
Before writing JSX for a screen or a component:
1. Read `harness/DESIGN_SYSTEM.md`. It's the contract, not background reading.
2. Open the showcase (`src/pages/DesignSystem.tsx`, route `/design-system`), find the page template and composition that match, and mirror them. Don't work from memory.
3. Pick the closest building block from `harness/COMPONENTS.md`. If it fits about 80 %, pass props instead of forking it.
4. Never invent tokens. Colours come from `src/index.css`, numbers go through `src/lib/format.ts`.
5. A new component gets a demo in the showcase and a row in `COMPONENTS.md` in the same commit.

## Code conventions
TypeScript strict, no `any`. Functional components with named exports, no `React.FC`. Reusable logic lives in hooks. Tailwind utility classes only. Relative imports.

## Building the app
The prompt is **"Build the whole app from the roadmap."** Everything you need is in the harness, so don't stop to ask.

- Build the epics in `harness/roadmap.md` in order. The main agent is the orchestrator: it writes no feature code itself and delegates each epic to an implementation subagent.
- **Gate per epic**, run by the orchestrator itself: `npm run lint` and `npm run build` pass, then `/design-audit` and `/code-audit` run as separate subagents on the epic and report zero blocking findings. Blocking findings go back to an implementer, and the gate runs again.
- When the gate is green, flip the epic's features to `Built` in the roadmap (only features whose acceptance criteria are all implemented) and commit the epic. The commit body lists every deviation from the specs.
- **Record what you build as you go**: screens, hooks and services in the living list in `ARCHITECTURE.md`, new components in `COMPONENTS.md`, screens in `ROUTES.md`, and any decision the harness didn't make in `DECISIONS.md`. Add, don't rewrite existing rules.
- When documents disagree: for layout the design manual and the showcase win over a spec's sketch, for data the data model wins, for behaviour the spec's acceptance criteria win.
- The design system already exists. The first epic verifies it, it doesn't rebuild it.
- F072, QA on a real iPhone, is manual and stays `Specified`.

## Dev notes
- `npm run dev` opens the app at `http://localhost:5173`, the showcase at `/design-system`.
- The camera and the service worker need HTTPS. To test on a phone, use a tunnel, not a LAN address.
