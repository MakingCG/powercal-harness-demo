# Architecture

What the app is made of and how the parts talk to each other. The second half is a living list of what's been built, kept up to date by the agent.

## Overview

A single-page React app that runs entirely in the browser. There is no server, no account and no sync. The only network traffic is reading product data from Open Food Facts, and the app never waits on it.

```
pages/        screens, one per route
   ↓
components/   the design system and domain blocks, presentation only
   ↓
hooks/        read data, call services, hold loading and error state
   ── the seam ──────────────────────────────────────────────
services/     the business logic: nutrition maths, writes, backup, lookups
   ↓
db/           the local database (IndexedDB via Dexie)

types/ · data/ · lib/   shared types, static data, pure helpers
```

Import rules for these layers are in [BOUNDARIES.md](BOUNDARIES.md).

## How the parts talk

- **Screens only talk to hooks.** A page or component never touches the database or a service. It gets data and actions from a hook.
- **Reads are live.** Hooks read with `useLiveQuery`, so any write anywhere updates every screen that shows the data. There is no cache layer and no global store.
- **Writes go through services.** A service validates, calculates and writes. A write that touches several rows runs in one transaction.
- **The seam under the hooks.** Everything below the hooks is storage and logic that a backend would take over one day. When that happens, services call an API instead of Dexie and the screens don't change. Keep that line clean.
- **Totals are derived, never stored.** Day totals, averages and trends are calculated from the stored rows when they're read.

## Where data lives

- **IndexedDB via Dexie** is the single source of truth. The entities and their fields are in [DATA-MODEL.md](DATA-MODEL.md). Build the tables exactly from it: same entities, same names.
- **localStorage** holds only small UI conveniences (the theme mirror for a flicker-free start). Never app data.
- **Dates** are local `YYYY-MM-DD` day keys, timestamps are milliseconds. All date maths goes through `src/lib/date.ts`.
- **Backup** is a JSON export of every table through the iOS share sheet, and an import that validates before it writes anything. The data is lost with the app icon, so export matters.

## External services

**Open Food Facts** is the only external service: an optional source of packaged-food data. The app must stay fully usable without it.

- Two endpoints on `world.openfoodfacts.org`: product by barcode (API v2) and text search (`cgi/search.pl`).
- Always send `fields=` with only the fields you need. The full product is large.
- Identify the app with its own user agent, `PowerCal/<version> (https://github.com/MakingCG/powercal-harness-demo)`, from one constant. Browsers don't allow setting `User-Agent`, so send it as `X-User-Agent`.
- Respect the rate limits (roughly 15 product and 10 search requests a minute per IP). Cache results in the local database and throttle on the client.
- It can be slow or flaky, and search sometimes answers with an HTML error page. Check the response before parsing it, time out, and fall back to what's cached. A failure is never blocking: the user can always create the food by hand.
- Its data is ODbL licensed. Credit it in the app and link back to the product.

**Generic foods** (rice, eggs, chicken breast) aren't in Open Food Facts, so the app bundles its own table of common foods as static data.

**Barcode scanning** happens in the browser, with the camera and a WebAssembly barcode reader that works on iOS (the native `BarcodeDetector` doesn't). The reader is self-hosted so it works offline, loads only when the scanner opens, and the camera starts only from a tap.

## PWA and offline

- Installed from the Home Screen, it runs standalone and works fully offline. The service worker precaches the app shell and caches food images.
- A new version shows an update prompt; it never reloads on its own in the middle of a form.
- The app asks for persistent storage on the first interaction. Storage in the installed app is separate from the Safari tab, so onboarding tells the user to install first.
- Heavy parts (charts, the scanner, the generic food table, the showcase) load lazily, so the first screen stays light.

## Browser baseline

**iOS Safari 16.4+.** Don't use a browser API newer than that without a feature check and a fallback. The build transpiles syntax, not APIs, so check anything you're unsure about. The layout must work from 320 px wide.

---

# What's built

The living list of the app. Filled in by the agent as features land: one row per screen, hook and service, added in the same commit that builds it.

## Screens

| Screen | File | Route | What it does |
|---|---|---|---|
| Design system showcase | `src/pages/DesignSystem.tsx` | `/design-system` | Live demo of every component and page template |

## Hooks

| Hook | File | What it returns |
|---|---|---|
| `useTheme` | `src/hooks/useTheme.ts` | Applies light, dark or system theme |
| `useGoBack` | `src/hooks/useGoBack.ts` | Back navigation with a fallback to the parent route |
| `useSwipe` | `src/hooks/useSwipe.ts` | Horizontal swipe gesture |

## Services

| Service | File | Responsibility |
|---|---|---|
| — | | |

## Database tables

| Table | Entity | Notes |
|---|---|---|
| — | | |
