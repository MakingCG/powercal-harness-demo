# Decisions

What we decided and why, so nobody reverses a choice that was made for a reason.

## D001: No backend
**Decision**: The app runs entirely in the browser. No server, no accounts, no sync.
**Why**: One user, one phone. A server adds hosting, auth and privacy surface for no benefit at this stage, and it keeps the build fast.

## D002: The data model is a finished input
**Decision**: The database is built exactly from `DATA-MODEL.md`. The agent doesn't redesign it.
**Why**: The entities decide what every feature can do. Fixing them up front keeps every build consistent.

## D003: Dexie live queries are the state
**Decision**: IndexedDB via Dexie is the source of truth. No state library, no React Query.
**Why**: `useLiveQuery` already gives reactive, cached data. A second store would only drift.

## D004: History is immutable
**Decision**: A diary entry copies the food's grams and nutrients when it's logged.
**Why**: Editing or refreshing a food must never rewrite last month's totals.

## D005: Goals are versioned by date
**Decision**: A goal applies from its start date forward; a day uses the goal that was valid on it.
**Why**: Changing the goal mid-diet must not re-evaluate past days.

## D006: Nutrition is stored per 100 g
**Decision**: Every food stores its nutrients per 100 g or 100 ml. A portion is a named number of grams.
**Why**: One basis makes all maths a single multiplication, and it's how food labels work.

## D007: The design system is fixed
**Decision**: The orange accent, the components and the four page templates are given. Screens are built from them.
**Why**: One accent keeps the UI calm, and a fixed system is what makes repeated builds look the same.

## D008: No third-party UI library
**Decision**: Every component is custom, built with Tailwind.
**Why**: Full control over the look and the API, and nothing for the agent to half-use.

## D009: No toasts
**Decision**: Errors go to a dialog; success is visible in the UI itself.
**Why**: One predictable error surface, nothing that disappears before it's read.

## D010: Export and import are the backup
**Decision**: Durability is a JSON file exported through the share sheet and imported back.
**Why**: Without a server the data dies with the app icon. The export has to be easy and the app reminds the user to use it.

## D011: iOS Safari 16.4+ baseline
**Decision**: No browser API newer than iOS 16.4 without a feature check and a fallback.
**Why**: The app runs as an installed iPhone PWA, and older iPhones stay in use for years.

## D012: Open Food Facts is optional
**Decision**: Packaged foods can come from Open Food Facts, cached locally. Generic foods ship with the app.
**Why**: It's free and open, but coverage is uneven and the service can be slow. The app must work fully without it.

## D013: Barcode scanning with a WebAssembly reader
**Decision**: A self-hosted WebAssembly barcode reader instead of the native `BarcodeDetector`.
**Why**: The native API doesn't work on iOS. Self-hosting keeps the scanner working offline.

<!-- AGENT: add new decisions below with the next ID. One decision, one line of why. -->
