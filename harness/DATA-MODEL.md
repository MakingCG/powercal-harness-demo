---
status: specified
last_updated: 2026-09-30
---

# Data model: PowerCal

**Status**: Specified · **PRD**: [PRD.md](PRD.md) · **Roadmap**: [roadmap.md](roadmap.md)

This is the only document that describes PowerCal's data. Specs describe behaviour; the entities live here.

## Ground rules

- **Local-first.** All data lives on the phone in one IndexedDB database, `PowerCalDB`. There is no server and no account.
- **Every record** has an `id` (UUID string) plus `createdAt` and `updatedAt` (ms since epoch).
- **Day keys** are local calendar dates as `YYYY-MM-DD` strings, never derived from UTC.
- **Nutrition is per 100 g (or 100 ml).** A food stores its values per 100; an amount is always grams (or ml) underneath, and a portion is just a named number of grams.
- **History is immutable.** A diary entry is a copy of the food's values at the moment of logging. Nothing that happens to a food later changes what was logged.
- **Rounding at write time.** Entries store grams and macros to 1 decimal and kcal as a whole number; totals are sums of those stored values.

Shared value type used by several entities:

**Nutrients** — `{ kcal, protein, carbs, fat, sugars?, fiber?, salt? }`, all numbers in kcal or grams. Carbs are label carbs (available carbohydrate, i.e. without fibre). Sugars, fibre and salt are stored when known and hidden in the UI unless the user turns them on.

**MealSlot** — one of `breakfast · snack1 · lunch · snack2 · dinner`, shown as `Breakfast · Morning snack · Lunch · Afternoon snack · Dinner`. Fixed five, not configurable.

---

## 1. UserProfile & settings

**Purpose**: Who the user is and how the app is set up — a single record per phone.

### Attributes

| Field | Type | Required | Note |
|---|---|---|---|
| id | string | yes | always `local-user` |
| sex | `male` / `female` | yes | for the energy estimate |
| heightCm | number | yes | 100–250 |
| birthYear | number | yes | 1900 to current year − 10 |
| activityLevel | `sedentary` / `light` / `moderate` / `active` | no | factor 1.2 / 1.375 / 1.55 / 1.725; drives the expected weight pace |
| settings.theme | `light` / `dark` / `system` | yes | |
| settings.showExtraNutrients | boolean | yes | show sugars, fibre, salt |
| settings.energyUnit | `kcal` | yes | only kcal in v1 |
| settings.backupNudgeDismissedUntil | timestamp | no | backup reminder snoozed until |
| lastBackupAt | timestamp | no | set by a successful export |
| genericSeedVersion | number | no | version of the bundled foods applied; never imported |

### Lifecycle

Created once at the end of onboarding, edited in Settings, removed only by `Delete all data`. Current weight is not stored here — it is always the latest weigh-in.

### Relationships

None. It is the single root record of the app.

---

## 2. Goal

**Purpose**: The daily target — kcal and grams of protein, carbs and fat — valid from a given day.

### Attributes

| Field | Type | Required | Note |
|---|---|---|---|
| validFrom | day key | yes | the goal applies from this day on |
| kcal | number | yes | e.g. 2650 |
| proteinG | number | yes | grams |
| carbsG | number | yes | grams |
| fatG | number | yes | grams |
| targetWeightKg | number | no | 20–400; carried over to the next version |

Percentages are derived, never stored: protein and carbs `g × 4 / kcal`, fat `g × 9 / kcal`.

### Lifecycle

Goals are **versioned by `validFrom`**. Saving a goal creates a new version valid from today; saving again on the same day updates today's version. Older versions are never changed.

- **Goal for a day** (day page): the latest version with `validFrom` ≤ that day. A day before every goal borrows the earliest goal and says so (`Goal from 29 Sep 2026`). No goals → no goal.
- **Goal in force** (history views — month calendar, intake chart): the same, but a day before every goal has **no** goal. History never borrows a later goal.
- At most one goal per `validFrom`, including after an import.

### Relationships

None stored. Days are matched to goals by date.

---

## 3. Food & Portion

**Purpose**: Something the user can log — their own food, a bundled everyday food or a product from Open Food Facts — with its values per 100 g and its named portions.

### Attributes

| Field | Type | Required | Note |
|---|---|---|---|
| name | string | yes | English display name |
| brand | string | no | |
| barcode | string | no | unique across foods; kept as text so leading zeros survive |
| source | `custom` / `off` / `generic` | yes | own food · Open Food Facts · bundled |
| sourceRef | string | no | product code, bundled-data reference, or `label` |
| basis | `g` / `ml` | yes | fixed at creation; 1 ml is treated as 1 g |
| per100 | Nutrients | yes | as on the label; if kcal is missing it is calculated from the macros (4·P + 4·C + 9·F + 2·fibre) |
| portions | Portion[] | yes | first one is the default |
| imageUrl | string | no | product thumbnail |
| favoriteAt | timestamp | no | set = favourite |
| lastUsedAt | timestamp | no | drives `Recent` |
| useCount | number | yes | ordering inside Recent / Favourites |
| fetchedAt | timestamp | no | when an Open Food Facts product was last fetched |
| offLastModified | timestamp | no | Open Food Facts' own last change |
| isArchived | boolean | yes | hidden from the library, kept for history |

**Portion** (embedded in the food):

| Field | Type | Required | Note |
|---|---|---|---|
| id | string | yes | the base portion is always `base` |
| label | string | yes | display only, e.g. `1 pc`, `1 serving (30 g)`, `my bowl` |
| grams | number | yes | how many g (or ml) one portion is |
| source | `off-serving` / `off-package` / `user` / `builtin` | yes | where the portion came from |

### Lifecycle

- **Custom** foods are created and edited by the user. Editing a bundled or Open Food Facts food's nutrition saves a new custom copy (without the barcode) and leaves the original alone. Portions can be edited on any food without copying it.
- **Generic** foods are added from the bundle on app start and refreshed when the bundle version changes, keeping the user's favourites, usage, archive flag and own portions.
- **Open Food Facts** foods are saved when scanned or picked from search, and refreshed in the background after 60 days.
- **Delete vs archive**: a food that any diary entry or saved meal points to — and any generic food — is archived, never deleted. An unused custom food is deleted.
- Every food always has the base portion (`100 g` / `100 ml`, id `base`), which can't be removed.

### Relationships

Referenced by DiaryEntry and SavedMeal items by id. Those references may point to an archived food, or to nothing at all after a delete; entries never rely on the food to display.

---

## 4. DiaryEntry

**Purpose**: One logged item in one meal on one day — a self-contained copy of what was eaten.

### Attributes

| Field | Type | Required | Note |
|---|---|---|---|
| date | day key | yes | |
| meal | MealSlot | yes | |
| kind | `food` / `quick` | yes | quick = quick add, no food behind it |
| foodId | string | no | the food it came from (food entries only) |
| groupId | string | no | shared by entries logged together from one saved meal |
| name | string | yes | copied at logging |
| portionId | string | no | empty = logged in plain grams |
| portionLabel | string | no | amount label at logging, e.g. `1 pc (250 g)` |
| unit | `g` / `ml` | yes | copied at logging |
| quantity | number | yes | number of portions, or grams when no portion |
| grams | number | yes | total amount; 0 for quick adds |
| nutrients | Nutrients | yes | totals for this entry, copied at logging |
| order | number | yes | position in the meal; new entries go last |

### Lifecycle

- **Created** by logging a food, a quick add, a saved meal (one entry per item, sharing a `groupId`) or a copy of a meal or day.
- **Edited** by changing the amount, meal or date. A new amount scales the entry's own stored values; it never re-reads the food. Saving without a change writes nothing.
- **Moved or copied** entries go to the end of the target meal.
- **Deleted** one at a time, per saved-meal group, or a whole meal at once.
- History is immutable: renaming, re-weighing or deleting a food or its portions never alters a logged entry.

### Relationships

Belongs to a day and a meal. Optionally points to one Food and shares a `groupId` with its siblings from the same saved meal.

---

## 5. SavedMeal

**Purpose**: A named list of foods the user eats together, logged in one tap.

### Attributes

| Field | Type | Required | Note |
|---|---|---|---|
| name | string | yes | e.g. `Oats & protein breakfast` |
| defaultMeal | MealSlot | no | where it logs when no meal is chosen |
| items | SavedMealItem[] | yes | at least one |
| nutrients | Nutrients | yes | total of the items, recalculated on save |
| useCount | number | yes | ordering |
| lastUsedAt | timestamp | no | ordering |

**SavedMealItem** — `{ foodId, name, portionId?, portionLabel?, unit, quantity, grams, nutrients }`, a copy of a food entry just like DiaryEntry.

### Lifecycle

Created from a logged meal (quick adds are left out). Renamed, re-defaulted, item amounts changed or items removed in Settings; new items are not added in v1. Logging at ×0.5 / ×1 / ×2 scales each item's stored values. Deleting a saved meal never touches entries already logged from it.

### Relationships

Items point to Foods by id, but carry their own values, so a saved meal logs correctly even after its foods change or disappear.

---

## 6. WeightLog

**Purpose**: One weigh-in on one day.

### Attributes

| Field | Type | Required | Note |
|---|---|---|---|
| date | day key | yes | unique — one weigh-in per day |
| weightKg | number | yes | 20–400, one decimal |
| note | string | no | up to 200 characters |

### Lifecycle

Logging on a day that already has a weigh-in replaces it. A weigh-in can be corrected, moved to another date (still one per day) or deleted. The trend uses a 3-point smoothing; the pace is the slope over the last 28 days.

### Relationships

None. Weight views read weigh-ins by date.

---

## Derived, never stored

- Day and meal totals — sums of the entries' stored nutrients.
- On-target band — 95–105 % of the goal kcal, shared by the day pill, the month tints and the intake chart.
- Energy estimate — Mifflin-St Jeor BMR × activity factor = maintenance (TDEE).
- Expected weight pace — (TDEE − goal kcal) × 7 / 7,700 kg per week, or 0.5 kg per week when the activity level is unknown.

## Backup file

One JSON file holds everything:

```json
{
  "app": "powercal",
  "version": 1,
  "dexieVersion": 1,
  "exportedAt": 1756000000000,
  "tables": {
    "userProfile": [], "goals": [], "foods": [],
    "diaryEntries": [], "savedMeals": [], "weightLogs": []
  }
}
```

- `version` is the backup format. A file with a higher version is refused; a higher database version is accepted and flagged.
- Records go out and come back exactly as stored. Damaged records are skipped and counted.
- Untouched generic foods are left out (the bundle brings them back); generic foods with favourites, usage, portions or an archive flag are included.
- **Replace** clears everything, then writes the file. **Merge** writes the file over the local data; the same id → the file wins, local-only records stay.
- Clashes on unique values are resolved in favour of the file: a local food loses a barcode the file assigns to another food; a local weigh-in on a date the file has is dropped; goals with the same `validFrom` keep the file's.
- The whole import is one transaction: it all lands or nothing changes. `genericSeedVersion` is never imported.

## Demo data

Demo data is generated on the phone from the bundled foods — about six weeks ending today — and written through the same path as a Replace import. Afterwards it is ordinary data, with no flag or separate storage.
