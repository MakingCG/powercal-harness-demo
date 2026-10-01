# PowerCal — a master harness

[Slovenčina](README.sk.md)

This repository is **not an app**. It is the *harness* an AI coding agent compiles an app from: a product definition, a roadmap with feature specs, a data model, a skeleton of rules for the code, a coded design system with a live showcase, and two audit commands. Clone it, give Claude Code one prompt, and it builds **PowerCal** — an offline-first calorie and macro tracker PWA for iPhone — from scratch.

It is the companion repo to the article **Recompile, don't refactor** — how to build software with AI by maintaining the system that compiles the app instead of the app itself:

- English: https://peterpapp.sk/en/blog/recompile-dont-refactor
- Slovak: https://peterpapp.sk/blog/2026-09-22-prekompiluj-nerefaktoruj

https://github.com/user-attachments/assets/3ff6019e-fe0a-49e3-869b-b269f0722085
*PowerCal after a single autonomous build from this harness, filled with demo data — about 3.5 hours, audits and fixes included.*

## What's inside

```
CLAUDE.md                     the agent's entry point: an index of the harness, core rules, "Building the app"
harness/
  PRD.md                      what we build and why
  roadmap.md                  6 epics, F001–F072, statuses (all Specified)
  features/                   one short spec per feature
  DATA-MODEL.md               the entities, a finished input
  ARCHITECTURE.md             the parts of the app and how they talk, plus a living list of what's built
  BOUNDARIES.md               what may import what, and what we deliberately don't use
  DESIGN_SYSTEM.md            the binding design manual, including copy and locale
  COMPONENTS.md               catalog of the coded building blocks
  ROUTES.md                   the screen map
  ERRORS.md                   the one way errors reach the user
  DECISIONS.md                decisions already made, and why
.claude/commands/
  design-audit.md             /design-audit — UI vs the design manual
  code-audit.md               /code-audit — code vs the coding harness and the specs
src/
  components/                 the design system (already coded)
  pages/DesignSystem.tsx      live showcase at /design-system
```

## Quick start

Requirements: Node.js 20.19+ (or 22+) and [Claude Code](https://claude.com/claude-code).

```bash
git clone https://github.com/MakingCG/powercal-harness-demo.git
cd powercal-harness-demo
npm install
npm run dev
```

Open http://localhost:5173/design-system — the design system the app will be built from, with page templates and reference compositions.

Then open Claude Code in the repo and type:

```
Build the whole app from the roadmap.
```

## What to expect

- The agent reads `CLAUDE.md`, opens the harness files it needs, and builds **epic by epic** (Foundation → Food Library → Day Page → Weight & Progress → Backup & Settings → Polish).
- The main agent acts as an **orchestrator**: it delegates each epic to a subagent, then runs the gate itself — `npm run lint`, `npm run build`, `/design-audit` and `/code-audit` with **zero blocking findings** — before it moves on.
- After each epic the features flip from `Specified` to `Built` in `harness/roadmap.md` and the epic is committed. You can watch the roadmap fill up.
- As it builds, the agent records what it made: screens, hooks and services in `ARCHITECTURE.md`, new components in `COMPONENTS.md`, routes in `ROUTES.md`, its own decisions in `DECISIONS.md`. The harness starts as a skeleton of rules and ends as a map of the app.
- F072 (iOS device QA) stays `Specified`: it is a manual check on a real iPhone.

<!-- TODO: build duration/usage -->

When it finishes, `npm run dev` gives you the whole app. For the real experience, deploy it anywhere static over HTTPS (e.g. Vercel) and add it to your iPhone's Home Screen.

## The recompile loop

The app is disposable; the harness is what you maintain.

1. Build the app from the harness.
2. Use it. Note what's wrong or missing.
3. Throw the app away (`git reset` / `git checkout` back to the harness commit).
4. Change the harness — a spec, a contract rule, a data-model field, an audit check.
5. Rebuild. The change is in every place it touches, with no technical debt from patching.

A bug that is missing a rule deserves a rule, not a patch.

## No backend, on purpose

PowerCal stores everything in the browser's IndexedDB (via Dexie). There is no server, no account, no Docker, nothing to configure. Durability is a JSON backup you export through the iOS share sheet and import back. It keeps the harness small and the first build fast — and the architecture keeps the storage behind services and hooks, so a backend can replace it later without touching the UI.

## Demo data

After the build, `Settings › Data › Load demo data` (or `Explore with demo data` on the first screen) fills the app with about six weeks of realistic, generated meals, saved meals, favourites and weigh-ins — deterministic and relative to today. Useful for exploring and for recording a screencast. It is regular data: export and "Delete all data" work as usual.

## Contributing

Pull requests that improve the **harness** are welcome — a clearer spec, a missing contract rule, a better audit check, a lesson from your own build. Please don't send app code: the app is rebuilt from the harness. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Credits

- Inspired by the author's fitness app [PowerUp](https://powerup.makingcg.com).
- Food data from [Open Food Facts](https://openfoodfacts.org) (ODbL; "Data © Open Food Facts contributors").
- Generic foods derived from USDA FoodData Central SR Legacy (public domain).

## License

[MIT](LICENSE) © 2026 Peter Papp
