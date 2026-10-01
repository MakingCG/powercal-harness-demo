# Design system

The binding manual for building PowerCal's UI. It doesn't describe the look: that lives in the code and on the showcase. It says how the system is used, which rules are fixed, and what's forbidden, so every screen looks as if the same designer drew it.

| Looking for… | Go to… |
|---|---|
| Colour and font tokens, safe-area utilities | `src/index.css` |
| Chart colours | `src/lib/chartColors.ts`, the only file where hex is allowed |
| The live showcase: every component, the page templates, reference compositions | `src/pages/DesignSystem.tsx` (route `/design-system`) |
| The catalog of building blocks | [COMPONENTS.md](COMPONENTS.md) |
| The screen map | [ROUTES.md](ROUTES.md) |

The look in one line: Lexend, one orange accent, glass cards on a white canvas, a floating pill nav with the add button on the right. It's already coded. Build screens from it, never beside it.

---

## 1. Agent contract

For every screen, in this order:

1. **Pick a page template.** Four exist (§2.3). Open `PageTemplatesSection` in the showcase and mirror the one that fits.
2. **Pick building blocks by purpose.** Name what you need first, then find it in the intent table (§3). If something fits about 80 %, use it and pass props. Don't fork it.
3. **Derive only when nothing fits,** following §4.
4. **Never invent tokens.** Colours from `src/index.css` plus stock Tailwind gray, green, amber and red. If a value seems missing, you're probably doing something the system rejects: re-read §6.
5. **Show what you build.** A new component gets a `Showpiece` in the showcase and a row in `COMPONENTS.md` in the same commit.
6. **Stick to the copy rules** (§5).

---

## 2. App shell and templates

### 2.1 One shell
The chrome around every screen lives in one component, `AppShell`. It owns the canvas, the bottom nav, page transitions, viewport height and keyboard tracking.

- Pages render only their content. They never render the nav, paint a background, or hide the nav with CSS.
- Nav visibility and the active tab come from the route (`src/lib/routes.ts`), decided by `AppShell`.
- The body never scrolls; each page scrolls inside the shell's page container.
- The showcase mounts the real `AppShell`. Never build a second shell or a "demo shell".

### 2.2 Bottom nav and add button
Three tabs on the left, **Today · Foods · Progress**, and the orange add button on the right of a floating glass pill.

- Never centred, never full width, never a fourth tab. The add button exists once, in the nav. Pages never add their own floating button.
- The add button opens the add-food flow for the day currently on screen, not always today.
- The nav is hidden on focused routes (the scanner, onboarding, the add sheet, the food form). The list is in [ROUTES.md](ROUTES.md).
- Settings opens from a gear on the day page, not from a tab.

### 2.3 Page templates
Every screen matches one of the four templates in the showcase:

| Template | Shape | Used by |
|---|---|---|
| **A · Headerless home** | `PageTitle` → `WeekStrip` → one highlight card → glass cards | day page, progress |
| **B · Header + list** | `Header` → `SearchField` → filter chips → section header + list card | foods, settings |
| **C · Header + back** | `Header` with back → cards of fields → `NutritionPreview` → full-width primary button last | food detail, food form, onboarding |
| **D · Full-bleed** | the camera fills the screen, controls float on glass, no header, no nav | scanner |

- The page column is always `PageContainer`. Never re-type it, widen it, or replace its bottom padding with a fixed value.
- A page has either a `Header` or a `PageTitle`, never both. A `Header` has no second row.
- Pickers, amount editors, action lists and small forms are sheets (§2.5), not pages.
- If a screen doesn't fit any template, stop and raise it. A fifth template is the owner's call.

### 2.4 Canvas and surfaces
- The canvas is white (dark in dark mode), set by the shell. Pages never paint it.
- Every content surface is a glass `Card`. A screen has **at most one** highlight card (the orange gradient): the day summary on the day page, the weight card on progress.
- Everything that sits on the highlight card takes `tone="onHighlight"`: tracks turn white, controls and inner blocks get a soft white fill. Grey tracks belong on glass cards only.
- Warnings (install hint, backup reminder, the crash screen) are a glass card with an amber icon. There's no tinted card and no red card.

### 2.5 Sheets do the work, dialogs ask questions
- **`Drawer`** (bottom sheet) holds every picker, amount editor, action list and small form. Header, content, then a full-width primary button last, which sticks to the bottom edge as the sheet's footer. Sheets may stack; Escape closes the topmost one.
- **Editor sheet order**: the amount or fields → the meal chips (and date) → `NutritionPreview` → the primary button (`Log · Lunch`, or `Save` when editing).
- An action row that can't apply right now is disabled, not hidden.
- **`Dialog`** asks one focused question: `ConfirmDialog` for yes/no, `ErrorDialog` for failures.
- Nothing else overlays the app: no toasts, snackbars, popovers, side panels or full-screen modals. The one exception is the app-update prompt.

### 2.6 Energy and macros
- **Orange is the only accent**: the calorie ring, all three macro bars, primary buttons, the add button, selection.
- Macros have no colours of their own. Protein, carbs and fat are told apart by their letter and a fixed order, **P → C → F**. `MacroBar`, `MacroInline` and `NutritionPreview` already do this.
- Wherever an amount of food is shown, show kcal **and** P · C · F together. That's why the app exists.
- Over goal is amber (the number) with a striped overflow, never red. Red means delete.
- Intake status uses one ±5 % band around the day's goal: `Not logged` · `Under goal` · `On target` · `Over goal` (`src/lib/intake.ts`). The month calendar and the intake chart reuse the same band.

### 2.7 Mobile and iOS
- Mobile only. The column centres on wider screens; there's no desktop layout.
- Every screen fits **320 px** without horizontal scroll and looks right at 375 and 390 px.
- **44 px** minimum touch target on everything interactive. Small controls pad their hit area invisibly. The one exception is the month grid, whose cells fill their column.
- Safe areas only through the utilities in `index.css`, never raw `env()`.
- Inputs are at least 16 px so Safari doesn't zoom on focus, and every input has an accessible name.
- Labels in a segmented toggle stay on one line. Five options never go in a toggle; use wrapping chips instead.
- Never hide a `<video>` with `display: none` on iOS; use opacity.

---

## 3. Component selection

Map the intent to a building block before writing JSX.

| Intent | Use |
|---|---|
| The page column | `PageContainer` |
| Home page title | `PageTitle` with trailing icon buttons |
| Title bar of any other page | `Header` |
| Title above a group of cards / inside a card | `SectionHeader` / `CardHeader` |
| Any content surface | `Card` (glass) |
| The one emphasised card | `Card tone="highlight"` |
| Settings or form group | `SectionCard` + `FieldRow` |
| Primary action | `Button` (primary, full width in sheets and forms) |
| Secondary action | `Button variant="secondary"` or an outline `IconButton` |
| Action on the highlight card | `Button variant="soft"` |
| Destructive action | `Button variant="danger"` → `ConfirmDialog variant="destructive"` |
| Icon-only action | `IconButton` (label required) |
| Text or date input | `TextField` |
| Number input | `NumericInput`, never `type="number"` |
| Plus / minus | `Stepper` |
| Search | `SearchField` |
| 2–4 exclusive options | `SegmentedToggle` |
| Filters, meal choice | `Chip` in a `ChipGroup` |
| Pick a day in a sheet | `DateChips` |
| On / off | `Switch` in a `FieldRow` |
| Status | `StatusPill` |
| Static label | `Tag` |
| Small stat | `MiniStat` |
| Tappable row | `ListItem` |
| Calories vs goal | `KcalRing` |
| Macro vs goal | `MacroBar` |
| Macros under a food or entry | `MacroInline` |
| Live nutrition of an amount being edited | `NutritionPreview`, right above the save button |
| Intake or weight over time | `IntakeTrendChart` / `WeightTrendChart` |
| Week / month navigation | `WeekStrip` / `MonthCalendar` |
| Picker, editor, action list, small form | `Drawer` |
| Yes / no | `ConfirmDialog` |
| Failure | `ErrorDialog` |
| Loading | `Skeleton`, shaped like the real content |
| Nothing to show | `EmptyState` inside its card |

**Compositions.** `CompositionSection` in the showcase holds reference compositions for the recurring blocks: day summary, meal section, food calculator, amount sheet, weight card, settings group. Build the real ones by mirroring them: same blocks, same order. Where a composition and a spec's layout sketch differ, the composition wins.

---

## 4. Derivation recipes

When nothing in §3 fits. Every new component:

- lives in `src/components/<folder>/`, is a named export, and has a one-line doc comment saying what it's for;
- uses only token classes and stock gray / green / amber / red, each colour with its `dark:` pair;
- inherits its API from its closest sibling;
- gets a `Showpiece` and a `COMPONENTS.md` row in the same commit.

By shape:

- **Button** — copy `Button`'s API. Its six variants are the full set; context is a `tone` prop, not a new variant. Never recolour through `className` (`cn` joins classes, it doesn't merge them).
- **Form field** — wrap it in `Field` (label above, hint below, no error slot) and reuse the field shell from `TextField`. Numbers extend `NumericInput`.
- **Choice** — `SegmentedToggle`, `Chip` or `Switch`, keeping `{ value, onChange, options }`.
- **Pill or tag** — `StatusPill` with its four tones, or `Tag`. No new tone, especially no red.
- **Nutrition readout** — built from `src/lib/macros.ts`: letter, fixed order, orange fill.
- **Chart** — Recharts in a glass card with a `CardHeader`, colours from `chartColors.ts`, `ChartTooltip`, an `EmptyState` when there's too little data, loaded lazily in a fixed-height slot.
- **Surface** — there is no new one. `Card` and `SectionCard` are the full set.
- **Overlay** — there is no new one. Sheet or dialog.
- **Domain composite** (a meal section, a food row) — goes in a domain folder when two or more screens use it; a single-use composition stays in its page.

---

## 5. Copy and locale

The UI is English. Write every string yourself, consistently with these rules and with the strings already in the showcase and the app.

- **Voice**: second person, short and direct. A button is a verb (+ object). An error says what happened, then what to do: `Couldn't save the food. Try again.`
- **Sentence case** everywhere: buttons, titles, tabs, pills. Proper nouns keep their capitals (PowerCal, Open Food Facts, iPhone, Home Screen).
- **British spelling**: favourites, fibre, colour.
- No exclamation marks, no "please", no emoji. The ellipsis is one character, `…`.
- **Numbers** are en-GB and always go through `src/lib/format.ts`: `1,842 kcal`, `19.4 g`, `90.4 kg`, `30%`. A number inside an editable input is never grouped. Deltas use the true minus, `−0.6 kg`. Numbers render with `tabular-nums`.
- **Units** are metric only, with a space: `150 g`, `250 ml`, `2,650 kcal`, `82.0 kg`. Weight always shows one decimal.
- **Dates** go through `src/lib/date.ts`: `29 Sep` · `Tue, 29 Sep` · `Tuesday, 29 September` · `29 Sep 2026`. `Today` and `Yesterday` where they fit. Never `Intl` month names (en-GB returns `Sept`).
- **The week starts on Monday.**
- **Meals**: `Breakfast · Morning snack · Lunch · Afternoon snack · Dinner`, always capitalised, even mid-sentence (`Log to Lunch`).
- **Macros**: `P · C · F`, always in that order (Protein, Carbs, Fat).

**Core terms.** One word per concept:

| Term | Means | Not |
|---|---|---|
| **log** | put food or a weigh-in into the diary | add, track, record |
| **entry** | one row in the diary | item, record |
| **food** | a record in the library | product |
| **portion** | a named amount of a food (`1 slice (32 g)`) | serving (except the one from Open Food Facts) |
| **saved meal** | a reusable group of foods | recipe, template |
| **weigh-in** | one weight measurement | |
| **goal** | the daily calorie and macro targets | budget, plan |
| **target** | the goal weight | |

---

## 6. Icons

Lucide only. Default stroke 2. Sizes by context: 16 in the nav, list rows and meal headers, 18 in sheet titles, 20 in action rows, 14 in card titles and small buttons, 32 with stroke 1.5 in empty states. Structural icons are grey, title icons orange, destructive icons red, warnings amber. Colour an icon with a `text-*` class, never `style`. Chevrons are icons, never text glyphs.

---

## 7. Anti-patterns

Each of these has been produced by a build agent at least once.

- **No raw hex** outside `chartColors.ts`: not in classes, not in `style`, not in SVG attributes.
- **No second accent, no new hue.** No blue info, no teal success, no per-macro colours.
- **No red** for over goal or for warnings. Red means destroy.
- **No flat orange-tinted cards** in place of the highlight card, and never two highlight cards on one screen.
- **No `<input type="number">`**, and no rejecting a decimal comma.
- **No toasts, snackbars, auto-dismissing banners or inline red error text.**
- **No third overlay type.** Sheet or dialog.
- **No centred add button, no fourth tab, no page-level floating button.**
- **No page that re-types the column**, paints the canvas or renders its own nav.
- **No inline `style`** for colour, radius, shadow or layout. Only for data-driven geometry (a bar's width, a ring's size).
- **No colour overrides through `className`** on a building block. Use a variant or tone prop.
- **No invented variants or tones.** A new `Button` variant, pill tone or card tone is a question for the owner.
- **No count-up numbers or confetti** when food is logged.
- **No new font, no third-party UI library, no icon set other than Lucide.**
- **No Title Case buttons, American spelling or `Intl` month names** in the UI.

---

## 8. When this document is wrong

If these rules block a reasonable solution, that's a signal to raise it, not permission to break them. Say so in your report before adding a token, variant, template, overlay or building block. The system is narrow on purpose; every exception makes it weaker for the next screen.

After every epic that touches UI, `/design-audit` checks the screens against this manual. The epic isn't done until it reports zero blocking findings.
