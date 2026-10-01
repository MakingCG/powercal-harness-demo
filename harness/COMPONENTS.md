# Components

The catalog of UI building blocks. Assemble screens from these instead of inventing something new each time. Each one has a live demo on the showcase (`src/pages/DesignSystem.tsx`, route `/design-system`); read its props in the source. How to choose between them is in [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) §3.

Anything placed on the highlight card takes `tone="onHighlight"`.

## Shell and overlays — `src/components/`

| Component | What it's for |
|---|---|
| `AppShell` | The one chrome around every screen: canvas, nav, page transitions, viewport and keyboard tracking |
| `BottomNav` | The floating pill with three tabs and the add button on the right |
| `Header` | Title bar of a non-home page, with an optional back and one right action |
| `Drawer` · `DrawerHeader` · `DrawerAction` | The bottom sheet for pickers, editors, action lists and small forms |
| `Dialog` | Centred dialog shell, used through the two wrappers below |
| `ConfirmDialog` | A yes/no question, with a destructive variant |
| `ErrorDialog` | The one place errors are shown |
| `ThemeProvider` | Applies the light, dark or system theme |
| `ScrollToTop` | Resets the page scroll on navigation |

## Primitives — `src/components/ui/`

| Component | What it's for |
|---|---|
| `PageContainer` | The page column every screen renders into |
| `PageTitle` | Big title of a headerless home page |
| `SectionHeader` | Title above a group of cards, with an optional link |
| `Button` | The one button: primary, secondary, soft, danger, ghost, link |
| `IconButton` | Icon-only action with a required label |
| `Card` · `CardHeader` | Glass surface or the one highlight card; its small title row |
| `SectionCard` · `FieldRow` | Titled group of rows for settings and forms |
| `Field` | Label and hint around any input |
| `TextField` | Text or date input |
| `SearchField` | Search input with a clear button |
| `NumericInput` | Number input that accepts a decimal comma or point |
| `Stepper` | Minus and plus around a value |
| `SegmentedToggle` | Two to four exclusive options |
| `Switch` | On / off, inside a `FieldRow` |
| `Chip` · `ChipGroup` | Filters and wrapping single choice, such as the meal picker |
| `DateChips` | Quick day picker: Today, Yesterday, a few days back, other date |
| `Tag` | Static label: amount, source, count |
| `StatusPill` | Status in four tones, none of them red |
| `StepIndicator` | Progress dots of a short multi-step flow |
| `MiniStat` | Small stat in a two- or three-column grid |
| `ProgressBar` | Thin linear progress, not for macros |
| `ListItem` | The tappable list row |
| `EmptyState` | Calm "nothing here yet" block inside a card, with up to two actions |
| `Skeleton` · `SkeletonList` | Loading placeholder shaped like the real content |

## Nutrition — `src/components/nutrition/`

| Component | What it's for |
|---|---|
| `KcalRing` | Calories eaten against the goal, with what's left or over |
| `MacroBar` | One macro against its goal: letter, grams, bar |
| `MacroInline` | The small `P 19 · C 1 · F 25` row under a food or entry |
| `NutritionPreview` | Live kcal and macros of the amount being edited, right above the save button |

## Charts — `src/components/charts/`

| Component | What it's for |
|---|---|
| `WeightTrendChart` | Smoothed weight over time, with an optional target line |
| `IntakeTrendChart` | Daily calories against the goal, coloured by the intake band |
| `ChartTooltip` | The one tooltip shell for charts |

## Diary — `src/components/diary/`

| Component | What it's for |
|---|---|
| `DayCell` | One day in the week strip or the month grid |
| `WeekStrip` | Monday-first week row for moving between days |
| `MonthCalendar` | Month grid showing logged days and how each went against the goal |

## Helpers — `src/lib/`

`format.ts` (every number), `date.ts` (every date and label), `macros.ts` (P · C · F order and names), `intake.ts` (the ±5 % band), `chartColors.ts` (chart colours), `routes.ts` (paths and nav visibility), `cn.ts` (joins class names, doesn't merge them).

---

## Domain components

Added by the agent as features land: one row per component, in the same commit as its `Showpiece`.

| Component | Folder | What it's for |
|---|---|---|
| — | | |
