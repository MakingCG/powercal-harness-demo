---
status: specified
last_updated: 2026-09-30
---

# Roadmap: PowerCal

**Status**: Specified · **PRD**: [PRD.md](PRD.md) · **Data model**: [DATA-MODEL.md](DATA-MODEL.md)

## Overview

PowerCal is built in six epics, in this order: **Foundation → Food library → Day page → Weight & progress → Backup & settings → Polish**. Each epic ends with something you can use: first an app that knows your goal, then a food library, then a working diary, then the weight story, then safety for your data, then the finishing touches.

The order is binding. No feature depends on a feature from a later epic, so each epic can be finished on its own. When a later feature extends an earlier screen, the extension is written into the later feature's spec.

PowerCal has one user and no roles, so the tables have no role column. Every feature has its own spec in `features/`.

Status legend: `Planned` → `Specified` → `Built`.

---

## 1. Foundation

The empty app, installable on the phone, with its look, its navigation and a place to keep data. By the end of this epic the user can install PowerCal, set up their profile and daily goal, and move between the three tabs.

| ID | Feature | What it does | Depends on | Status |
|----|---------|--------------|------------|--------|
| F001 | [App skeleton](features/epic-1-foundation/F001-project-scaffold.md) | The app builds, opens as PowerCal with its own name and icon, and enforces the code rules from day one. | — | Specified |
| F002 | [Design system](features/epic-1-foundation/F002-design-system-primitives.md) | The shared look — cards, sheets, buttons, inputs, charts — that every screen is assembled from. | F001 | Specified |
| F003 | [Local data store](features/epic-1-foundation/F003-data-model-dexie-schema.md) | Everything the user enters is kept on the phone, following the data model, with history that never changes behind their back. | F001 | Specified |
| F004 | [App shell & navigation](features/epic-1-foundation/F004-app-shell-navigation.md) | Three tabs (Today · Foods · Progress) and an add button that always logs into the day on screen. | F002 | Specified |
| F005 | [Profile & goals](features/epic-1-foundation/F005-profile-goals.md) | A two-step first-run setup for the profile and daily goal; goal changes only apply from today onwards. | F003, F004 | Specified |
| F006 | [Install & offline](features/epic-1-foundation/F006-pwa-install-storage.md) | Nudges the user to install the app first, keeps its storage, works offline and updates without losing a typed entry. | F004 | Specified |

---

## 2. Food library

Where foods come from. The user can create a food from its label, pick from about 250 bundled everyday foods, scan a barcode or search Open Food Facts by name. Each food has a detail page with a live calculator, and logging a food into a meal already works from here.

| ID | Feature | What it does | Depends on | Status |
|----|---------|--------------|------------|--------|
| F010 | [Custom food](features/epic-2-food-library/F010-custom-food.md) | Create or edit a food by hand in about 20 seconds, straight off the label. | F003 | Specified |
| F011 | [Bundled everyday foods](features/epic-2-food-library/F011-generic-foods-bundle.md) | About 250 staples like chicken, rice, eggs and oats are in the library from the first day, offline. | F003 | Specified |
| F014 | [Food picker & library](features/epic-2-food-library/F014-food-picker.md) | The add-food sheet with Recent · Favourites · Saved · Search, and the Foods tab with the whole library. | F010, F011, F015 | Specified |
| F015 | [Food detail & amount sheet](features/epic-2-food-library/F015-food-detail-calculator.md) | Pick an amount, see kcal and P · C · F for exactly that amount, then log it into a meal. | F010 | Specified |
| F016 | [Custom portions](features/epic-2-food-library/F016-custom-portions.md) | Name the portions you actually eat (`1 pc`, `my bowl`) and choose which one a food opens on. | F010 | Specified |
| F012 | [Barcode scanner](features/epic-2-food-library/F012-barcode-scanner-off-lookup.md) | Scan a product to find it; if it isn't known, land in a prefilled new-food form. | F010, F014, F015 | Specified |
| F013 | [Search Open Food Facts](features/epic-2-food-library/F013-off-text-search.md) | Find a branded product by name when it isn't in the library yet. | F010, F014 | Specified |

---

## 3. Day page

The screen the user opens five times a day. It shows the week, the day's totals against the goal, the latest weight and the five meals. Here logging becomes a three-tap habit, and fixing, copying and reusing meals takes one or two taps.

| ID | Feature | What it does | Depends on | Status |
|----|---------|--------------|------------|--------|
| F020 | [Day page](features/epic-3-day-page/F020-day-page-layout.md) | One scrolling page per day, with the date in the address and swipes or arrows to move between days. | F004 | Specified |
| F021 | [Daily summary](features/epic-3-day-page/F021-daily-summary-card.md) | A kcal ring and three macro bars that say how the day is going against that day's goal. | F020, F005 | Specified |
| F022 | [Week strip](features/epic-3-day-page/F022-week-calendar-strip.md) | Monday-to-Sunday row that shows which days are logged and jumps to any of them. | F020 | Specified |
| F023 | [Meal sections](features/epic-3-day-page/F023-meal-sections.md) | One card per meal with its subtotal, its entries and a `+` to add food to it. | F020 | Specified |
| F024 | [Add entry flow](features/epic-3-day-page/F024-add-entry-flow.md) | From the day page to a logged food in three taps, with the new day total shown before saving. | F014, F015, F021, F023 | Specified |
| F025 | [Edit or delete an entry](features/epic-3-day-page/F025-edit-delete-entry.md) | Tap an entry to change its amount, move it, duplicate it or delete it. | F024 | Specified |
| F026 | [Quick add](features/epic-3-day-page/F026-quick-add.md) | Log a name and kcal for a restaurant meal or an estimate, without creating a food. | F024 | Specified |
| F027 | [Copy meal or day](features/epic-3-day-page/F027-copy-meal-copy-day.md) | "Same breakfast as yesterday" in two taps, or copy a whole day. | F023 | Specified |
| F028 | [Saved meals](features/epic-3-day-page/F028-saved-meals.md) | Save a meal you repeat and log it again in one tap. | F024 | Specified |
| F029 | [Weight card](features/epic-3-day-page/F029-weight-card.md) | The latest weight and its weekly change on the day page, with a one-tap weigh-in. | F020 | Specified |

---

## 4. Weight & progress

The Progress tab. The user sees whether the weight is really going down, whether they are holding their calorie goal over weeks, and can browse any past month. With a target weight set, the app tells them if they are on pace and roughly when they will get there.

| ID | Feature | What it does | Depends on | Status |
|----|---------|--------------|------------|--------|
| F040 | [Log & correct weight](features/epic-4-weight-progress/F040-log-weight.md) | Log a weigh-in from Progress and fix, move or delete an old one. | F029 | Specified |
| F041 | [Weight chart](features/epic-4-weight-progress/F041-weight-chart.md) | A smoothed weight trend for 4 weeks, 12 weeks or all time, with lowest, highest and average. | F040 | Specified |
| F042 | [Month calendar](features/epic-4-weight-progress/F042-month-calendar.md) | A month grid that shows logged days, tinted by how they went against the goal. | F022 | Specified |
| F043 | [Intake history](features/epic-4-weight-progress/F043-intake-history-chart.md) | Daily kcal against the goal for the last 7 or 30 days, plus average macros. | F021 | Specified |
| F044 | [Target weight & pace](features/epic-4-weight-progress/F044-goal-weight-pace.md) | Says whether you're on track for your target weight and roughly when you'll reach it. | F041, F029, F005 | Specified |

---

## 5. Backup & settings

With no server, a backup file is the only safety net. This epic lets the user export everything to a file, restore it on any phone, and reminds them when the last backup is getting old. It also finishes the Settings page and adds demo data, so anyone can see the app full without weeks of logging.

| ID | Feature | What it does | Depends on | Status |
|----|---------|--------------|------------|--------|
| F060 | [Export backup](features/epic-5-backup-settings/F060-json-export.md) | One tap saves all data to a file through the iPhone share sheet. | F003, F011 | Specified |
| F061 | [Import backup](features/epic-5-backup-settings/F061-json-import.md) | Restore or merge a backup file, after a preview of what's inside. | F060 | Specified |
| F062 | [Settings](features/epic-5-backup-settings/F062-settings-screen.md) | One page with profile, goals, saved meals, display, data and about. | F005, F006, F028, F060, F061 | Specified |
| F063 | [Backup reminder](features/epic-5-backup-settings/F063-backup-nudge.md) | A quiet banner on the day page when the last backup is more than two weeks old. | F060 | Specified |
| F064 | [Demo data](features/epic-5-backup-settings/F064-demo-data.md) | One tap fills the app with six weeks of realistic meals and weigh-ins. | F011, F024, F026, F028, F061, F062 | Specified |

---

## 6. Polish

The first-run experience, every empty screen, a safe way out when something breaks, and a final pass on a real iPhone.

| ID | Feature | What it does | Depends on | Status |
|----|---------|--------------|------------|--------|
| F070 | [Empty states & onboarding](features/epic-6-polish/F070-empty-states-onboarding.md) | A guided first run (set up, restore a backup or explore demo data) and a helpful message on every empty screen. | F005, F006, F061, F064 | Specified |
| F071 | [Crash screen](features/epic-6-polish/F071-error-boundary.md) | If the app breaks, the user can still export their data and restart. | F002, F060 | Specified |
| F072 | [iPhone device check](features/epic-6-polish/F072-ios-device-qa.md) | A hands-on pass on a real iPhone of everything a desktop browser can't prove. | all | Specified |

---

## Out of scope (v1)

Accounts and sync, exercise, water, body measurements, notes, recipes, sharing, push reminders, Apple Health, adaptive TDEE, other languages. See the PRD.
