# Boundaries

What may depend on what, and what doesn't belong in this project at all. Read this before writing code outside `src/components/`.

## Dependency flow

```
types/        pure types, no imports from the project
  ↓
data/         static data (the generic food table), imports types/
  ↓
db/           Dexie schema and raw operations, imports types/ and lib/
  ↓
services/     business logic, imports db/, data/, types/, lib/
  ↓
hooks/        React hooks, import services/, db/ (live queries), types/, lib/
  ↓
components/   reusable UI, import hooks/, types/, lib/, other components
  ↓
pages/        screens, import components/, hooks/, types/, lib/
```

`lib/` holds pure, React-free helpers (formatting, dates, small maths) that any layer may use. It imports only `types/` and other `lib/` files. Arithmetic a component needs goes in `lib/`, because components can't reach services.

## Import rules

- **Components and pages never import `db/` or `services/`.** All data flows through hooks.
- **Services never import React, hooks or UI.** They're plain functions that could run on a server.
- **Hooks never import components or pages.**
- **The Open Food Facts client doesn't import `db/`.** It's a pure HTTP boundary; saving results locally is another service's job.

These rules are enforced by ESLint (`eslint.config.js`) as errors. In flat config a later `no-restricted-imports` block replaces an earlier one instead of merging, so every layer block is built through the `restrict()` helper that repeats the global bans. Keep it that way when you add a layer.

## What we deliberately don't use

- **No backend, no API layer, no accounts.** The browser is the whole app.
- **No state library** (Redux, Zustand, Jotai, Recoil) and no React Query. Dexie live queries plus local `useState` are the entire state story.
- **No third-party UI kit** (Radix, Headless UI, MUI, Chakra, shadcn, Ark). Every building block is in `src/components/`.
- **No CSS modules, CSS-in-JS or `tailwind.config.js`.** Tailwind v4 utilities and the tokens in `src/index.css` only.
- **No toasts, snackbars or popovers.** See [ERRORS.md](ERRORS.md) and [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).
- **No i18n library.** Strings are inline, in English.
- **No icon set other than Lucide, no font other than Lexend.**
- **No path aliases.** Imports are relative.
- **No telemetry or analytics.**

A new dependency needs a reason and an entry in [DECISIONS.md](DECISIONS.md).

## Component and hook rules

- Functional components with named exports, plain function declarations with typed props, no `React.FC`.
- Components get data through props or a hook, never through inline database queries.
- A hook returns data and its actions together, plus loading and error state: `{ items, add, remove, isLoading, error, clearError }`.
- Shared logic between hooks belongs in a service or in `lib/`, not in another hook.

## File naming

Components and pages `PascalCase.tsx` · hooks `useCamelCase.ts` · services, lib and types `camelCase.ts` · one `index.ts` barrel per component folder.
