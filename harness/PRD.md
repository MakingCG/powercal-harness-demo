---
status: specified
last_updated: 2026-09-30
---

# PRD: PowerCal

**Status**: Specified · **Roadmap**: [roadmap.md](roadmap.md) · **Data model**: [DATA-MODEL.md](DATA-MODEL.md)

## What it is

PowerCal is a lite calorie and macro tracker for the iPhone. It does one job: log what you eat, meal by meal, see protein, carbs, fat and kcal against your daily goal, and watch your weight move towards a target.

It is a web app you install on the Home Screen. It works offline, has no accounts and no server. Everything stays on the phone, and a JSON backup file is how you keep it safe or move it to a new phone.

Tech in one line: a React PWA with a local database in the browser, built on the design system in `DESIGN_SYSTEM.md`.

## Who it's for

One person who tracks food every day, typically while cutting — for example on a goal of 200 g protein · 260 g carbs · 90 g fat ≈ 2,650 kcal. They train, eat mostly the same meals (oats and milk for breakfast, quark, chicken and rice, supermarket products) and log on the phone right after eating, or in one go in the evening.

There is a single user and no roles. Whoever holds the phone can do everything.

## The core loop

1. **Log food in a few taps.** Pick a meal, pick a recent food, confirm the amount. A food eaten before is logged in three taps and under 15 seconds.
2. **See the day against the goal.** The day page shows kcal and P · C · F eaten versus the goal, updated the moment an entry is saved.
3. **Watch the weight trend.** Log a weigh-in whenever, see the smoothed trend and whether you are on pace for your target.

Everything else — copying yesterday's breakfast, saved meals, the month calendar, backups — exists to make that loop faster or safer.

## Principles

- **Fast logging.** The picker opens on recent foods. No typing for the common case.
- **All numbers together.** Wherever food appears, kcal and all three macros are shown side by side.
- **History doesn't move.** What you logged stays as you logged it, even if you later edit the food or change your goal.
- **Manual entry is first-class.** Many products won't scan. Creating a food from the label takes about 20 seconds.
- **Calm UI.** No ads, no feeds, no settings sprawl. Three tabs and one add button.
- **Offline, and you own your data.** Nothing leaves the phone unless you export it.

## Scope

### In v1

- Onboarding with profile (sex, height, year of birth, weight, activity level) and a daily goal in kcal + grams of protein, carbs and fat, with an optional target weight.
- Food library: your own foods, about 250 bundled everyday foods, barcode scanning and name search against Open Food Facts, favourites, recents and custom portions.
- Day page: five fixed meals (`Breakfast · Morning snack · Lunch · Afternoon snack · Dinner`), add / edit / move / duplicate / delete entries, quick add, copy a meal or a whole day, saved meals.
- Daily summary with a kcal ring, three macro bars and an on-target status.
- Week strip and month calendar for browsing past days.
- Weight: log, trend chart, target weight, pace and an estimated arrival date.
- Intake history for the last 7 or 30 days.
- Backup: export to a file, restore or merge from a file, a gentle reminder to back up, delete all data.
- Demo data: one tap fills the app with six weeks of realistic history.
- Installable, offline, light / dark / system theme.

### Not in v1

Accounts, sync or any backend · exercise and dynamic goals · water · body measurements · notes and journaling · recipes · sharing · push reminders · Apple Health · editing Open Food Facts · adaptive TDEE · other languages.

## Success

- A recent food is logged in 3 taps plus the amount, in under 15 seconds.
- The day page opens instantly and works fully offline (only Open Food Facts lookups need the network).
- A scanned product either resolves or lands in a prefilled "new food" form within two taps.
- Export → wipe → import brings back every record.

## Screens

- **Today** — the day page: week strip, daily summary, weight card, the five meals, and the add button.
- **Add food** — a sheet over the day: recent, favourites, saved meals, search, scan, new food, quick add.
- **Foods** — your food library, and the detail page of each food with its calculator and portions.
- **New / edit food** — the manual food form.
- **Scan** — the barcode camera.
- **Progress** — weight chart, intake history and the month calendar.
- **Settings** — profile, goals, saved meals, display, data, about.
- **Onboarding** — first run: profile, goal, or restore a backup, or explore with demo data.
