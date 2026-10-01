/**
 * Design System — live showcase
 * =============================
 *
 * This page (route `/design-system`) is the canonical visual reference for
 * every primitive in `src/components/`. The rules for using and extending the
 * system live in `harness/DESIGN_SYSTEM.md` (agent operating manual).
 * Component APIs are cataloged in `harness/COMPONENTS.md`. Tokens are defined
 * in `src/index.css` under `@theme`; chart literals in `src/lib/chartColors.ts`.
 *
 * If you are an agent generating UI:
 *   1. Open `harness/DESIGN_SYSTEM.md` first — it is the contract.
 *   2. Pick the page template (`PageTemplatesSection`) whose shape matches the
 *      screen, then walk this page top-to-bottom and pick the closest
 *      primitive for each piece. Do not fork components that fit within ~80%.
 *   3. Only derive new components when no primitive fits, and only via the
 *      recipes in §4 of the manual.
 *   4. Anything you add to `src/components/` must also appear here as a
 *      `Showpiece` and get a row in `harness/COMPONENTS.md`.
 *
 * The page templates mount the REAL `AppShell` (via `<Routes location>`)
 * inside a phone frame — the chrome you see there is production code.
 *
 * The demo data in this file (foods, amounts, weights) is placeholder data —
 * it is NOT part of the design system. Real screens use data from hooks.
 */

import {
  Apple,
  CalendarDays,
  Check,
  ChevronRight,
  Coffee,
  Copy,
  Database,
  Cookie,
  Download,
  Droplets,
  Flame,
  Flashlight,
  Keyboard,
  Monitor,
  Moon,
  MoreHorizontal,
  Palette,
  Pencil,
  Plus,
  Save,
  Scale,
  ScanBarcode,
  SearchX,
  Settings,
  Soup,
  Star,
  Sun,
  Target,
  Trash2,
  TrendingDown,
  Utensils,
  X,
  Calendar,
  ArrowRightLeft,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Route, Routes } from 'react-router-dom';

import { AppShell } from '../components/AppShell';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Drawer, DrawerAction, DrawerActions, DrawerHeader } from '../components/Drawer';
import { ErrorDialog } from '../components/ErrorDialog';
import { Header } from '../components/Header';
import { IntakeTrendChart, WeightTrendChart, ChartTooltip } from '../components/charts';
import type { IntakePoint, WeightPoint } from '../components/charts';
import { MonthCalendar, WeekStrip } from '../components/diary';
import { KcalRing, MacroBar, MacroInline, NutritionPreview } from '../components/nutrition';
import {
  Button,
  Card,
  CardHeader,
  Chip,
  ChipGroup,
  DateChips,
  EmptyState,
  Field,
  FieldRow,
  IconButton,
  ListItem,
  MiniStat,
  NumericInput,
  PageContainer,
  PageTitle,
  ProgressBar,
  SearchField,
  SectionCard,
  SectionHeader,
  SegmentedToggle,
  Skeleton,
  SkeletonList,
  StatusPill,
  StepIndicator,
  Stepper,
  Switch,
  Tag,
  TextField,
} from '../components/ui';
import type { StatusTone } from '../components/ui';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../lib/cn';
import { addDays, longDayLabel, mediumDayLabel, todayKey } from '../lib/date';
import { formatBytes, formatCount, formatDecimal, formatKcal, formatKg, formatPercent, formatPlain, formatSignedDecimal, formatWeight } from '../lib/format';
import type { DayTint } from '../lib/intake';
import type { MacroTotals } from '../types/nutrition';
import type { Theme } from '../types/theme';

/* -------------------------------------------------------------------------- */
/* page shell                                                                 */
/* -------------------------------------------------------------------------- */

const SECTIONS = [
  { id: 'foundations', label: 'Foundations' },
  { id: 'buttons', label: 'Buttons' },
  { id: 'inputs', label: 'Inputs' },
  { id: 'choices', label: 'Toggles & choices' },
  { id: 'pills', label: 'Pills & tags' },
  { id: 'surfaces', label: 'Surfaces' },
  { id: 'headings', label: 'Headings' },
  { id: 'lists', label: 'Lists' },
  { id: 'nutrition', label: 'Nutrition' },
  { id: 'charts', label: 'Charts' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'overlays', label: 'Sheets & dialogs' },
  { id: 'states', label: 'Data states' },
  { id: 'shell', label: 'App shell' },
  { id: 'templates', label: 'Page templates' },
  { id: 'composition', label: 'Composition' },
];

const TOPBAR_H = 64; // px — fixed topbar height (used by side-nav + main offsets)
const SIDENAV_W = 220; // px — fixed side-nav width

export default function DesignSystem() {
  const [theme, setTheme] = useState<Theme>('system');
  useTheme(theme);

  return (
    <div className="ds-showcase min-h-screen bg-white dark:bg-dark-bg text-gray-900 dark:text-gray-100">
      <ShowcaseTopbar theme={theme} onThemeChange={setTheme} />
      <SideNav />
      <main className="min-w-0" style={{ paddingTop: TOPBAR_H }}>
        <div className="space-y-20 px-6 py-10 pb-32 lg:pl-[244px] xl:px-12 xl:pl-[268px]">
          <FoundationsSection />
          <ButtonsSection />
          <InputsSection />
          <ChoicesSection />
          <PillsSection />
          <SurfacesSection />
          <HeadingsSection />
          <ListsSection />
          <NutritionSection />
          <ChartsSection />
          <CalendarSection />
          <OverlaysSection />
          <DataStatesSection />
          <ShellSection />
          <PageTemplatesSection />
          <CompositionSection />
        </div>
      </main>
    </div>
  );
}

function ShowcaseTopbar({ theme, onThemeChange }: { theme: Theme; onThemeChange: (t: Theme) => void }) {
  return (
    <header
      className="fixed top-0 right-0 left-0 z-40 border-b border-gray-200/50 dark:border-dark-border/50 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-xl"
      style={{ height: TOPBAR_H }}
    >
      <div className="flex h-full items-center justify-between gap-3 px-4 sm:px-6 xl:px-12">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-theme-500 text-white inline-flex items-center justify-center shadow-lg shadow-theme-500/30">
            <Flame size={16} />
          </span>
          <span className="hidden min-[400px]:inline text-lg font-bold">PowerCal</span>
          <span className="hidden sm:inline text-[11px] tracking-[0.12em] text-gray-400 dark:text-gray-500 uppercase">
            · Design System
          </span>
        </div>
        <div className="flex items-center gap-4">
          <SegmentedToggle
            aria-label="Theme"
            value={theme}
            onChange={onThemeChange}
            options={[
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
              { value: 'system', label: 'System' },
            ]}
          />
        </div>
      </div>
    </header>
  );
}

function SideNav() {
  return (
    <aside
      className="fixed bottom-0 left-0 z-30 hidden overflow-y-auto border-r border-gray-200/50 dark:border-dark-border/50 lg:block"
      style={{ top: TOPBAR_H, width: SIDENAV_W }}
    >
      <nav className="px-4 py-8">
        <div className="mb-3 pl-3 text-[11px] font-semibold tracking-[0.08em] text-gray-400 dark:text-gray-500 uppercase">
          On this page
        </div>
        <ul className="flex flex-col gap-px">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="block rounded-lg px-3 py-1.5 text-[13px] text-gray-600 dark:text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-dark-card hover:text-gray-900 dark:hover:text-gray-100"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/* primitives used inside the showcase                                        */
/* -------------------------------------------------------------------------- */

function ShowcaseSection({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-5">
      <div className="flex items-baseline justify-between gap-4 border-b border-gray-200/70 dark:border-dark-border pb-4">
        <div>
          <h2 className="text-[22px] font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
          {description && <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">{description}</p>}
        </div>
        <a href={`#${id}`} className="font-mono text-xs text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
          #{id}
        </a>
      </div>
      <div>{children}</div>
    </section>
  );
}

function Showpiece({
  label,
  description,
  span = 1,
  variant = 'card',
  children,
}: {
  label: string;
  description?: string;
  span?: 1 | 2 | 3;
  /** card = app canvas (white / dark-bg) · naked = no frame */
  variant?: 'card' | 'naked';
  children: ReactNode;
}) {
  const spanClass = { 1: '', 2: 'md:col-span-2', 3: 'md:col-span-2 xl:col-span-3' }[span];
  return (
    <div className={cn('flex flex-col gap-2 min-w-0', spanClass)}>
      <div
        className={cn(
          variant === 'card' &&
            'rounded-2xl border border-gray-200/70 dark:border-dark-border bg-white dark:bg-dark-bg p-3 sm:p-5 overflow-hidden',
        )}
      >
        {children}
      </div>
      <div>
        <div className="text-xs font-semibold text-gray-900 dark:text-gray-100">{label}</div>
        {description && (
          <div className="mt-0.5 text-[11.5px] leading-snug text-gray-500 dark:text-gray-400">{description}</div>
        )}
      </div>
    </div>
  );
}

function Mosaic({ cols = 3, children }: { cols?: 2 | 3; children: ReactNode }) {
  return (
    <div className={cn('grid grid-cols-1 gap-6', cols === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 xl:grid-cols-3')}>
      {children}
    </div>
  );
}

/** Mobile column inside a showpiece — the app is `max-w-md`, preview it at that width. */
function Phone({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-sm', className)}>{children}</div>;
}

function Code({ children }: { children: ReactNode }) {
  return (
    <code className="font-mono text-[11px] text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-dark-card px-1.5 py-0.5 rounded">
      {children}
    </code>
  );
}

/* -------------------------------------------------------------------------- */
/* demo data (placeholder — not part of the system)                           */
/* -------------------------------------------------------------------------- */

const TODAY = todayKey();

interface DemoEntry {
  name: string;
  amount: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

/** Meal slot keys (unchanged in data) → labels. Meal names are always capitalised. */
const MEAL_LABELS = {
  breakfast: 'Breakfast',
  snack1: 'Morning snack',
  lunch: 'Lunch',
  snack2: 'Afternoon snack',
  dinner: 'Dinner',
} as const;
type MealSlot = keyof typeof MEAL_LABELS;
const MEAL_SLOTS = Object.keys(MEAL_LABELS) as MealSlot[];

const MEALS: { name: string; icon: typeof Coffee; entries: DemoEntry[] }[] = [
  {
    name: MEAL_LABELS.breakfast,
    icon: Coffee,
    entries: [
      { name: 'Oats, rolled', amount: '60 g', kcal: 225, protein: 8, carbs: 36, fat: 4 },
      { name: 'Quark, low-fat', amount: '250 g', kcal: 212, protein: 29, carbs: 9, fat: 6 },
      { name: 'Banana, raw', amount: '1 pc', kcal: 105, protein: 1, carbs: 27, fat: 0 },
    ],
  },
  {
    name: MEAL_LABELS.lunch,
    icon: Soup,
    entries: [
      { name: 'Chicken breast, roasted', amount: '180 g', kcal: 297, protein: 56, carbs: 0, fat: 6 },
      { name: 'Rice, basmati, cooked', amount: '200 g', kcal: 260, protein: 5, carbs: 57, fat: 1 },
    ],
  },
  { name: MEAL_LABELS.snack2, icon: Cookie, entries: [] },
];

const DAY_TOTALS: MacroTotals = { kcal: 1099, protein: 99, carbs: 129, fat: 17 };
const GOAL: MacroTotals = { kcal: 2400, protein: 160, carbs: 260, fat: 75 };

const TRACKED = new Set([addDays(TODAY, -1), addDays(TODAY, -2), addDays(TODAY, -3), addDays(TODAY, -5), TODAY]);

const WEIGHTS: WeightPoint[] = [84.6, 84.2, 84.4, 83.9, 83.7, 83.9, 83.4, 83.1, 83.3, 82.9].map((w, i, all) => ({
  date: addDays(TODAY, (i - all.length + 1) * 3),
  weightKg: w,
  trendKg: all.slice(Math.max(0, i - 2), i + 1).reduce((a, b) => a + b, 0) / Math.min(i + 1, 3),
}));

/** 30 days: `null` = not logged, one 0 kcal quick-add day, a goal change (2,600 → 2,400) 10 days ago and 3 days before the first goal. */
const INTAKE: IntakePoint[] = [
  2510, 2690, null, 2440, 2580, 2700, 2320, 2610, null, 2550, 2480, 2890, 2600, 2380, 2450,
  2210, 2480, 2350, null, 2600, 2280, 1990, 2420, 2310, 0, 2550, 2150, 2380, null, 1099,
].map((kcal, i, all) => ({
  date: addDays(TODAY, i - all.length + 1),
  logged: kcal != null,
  kcal: kcal ?? 0,
  protein: Math.round(((kcal ?? 0) * 0.3) / 4),
  carbs: Math.round(((kcal ?? 0) * 0.42) / 4),
  fat: Math.round(((kcal ?? 0) * 0.28) / 9),
  goalKcal: i < 3 ? null : i < all.length - 10 ? 2600 : 2400,
}));

/** Month-grid tints for the showcase: logged days of the current month. */
const DEMO_TINTS: ReadonlyMap<string, DayTint> = new Map(
  ([[-1, 'onTarget'], [-2, 'under'], [-3, 'onTarget'], [-5, 'over'], [-6, 'onTarget'], [-8, 'under'], [-9, 'noGoal'], [0, 'under']] as const)
    .map(([d, t]) => [addDays(TODAY, d), t as DayTint] as const)
    .filter(([date]) => date.slice(0, 7) === TODAY.slice(0, 7)),
);
const DEMO_WEIGHT_DATES: ReadonlySet<string> = new Set([addDays(TODAY, 0), addDays(TODAY, -3), addDays(TODAY, -6)]);

const FOODS: { name: string; brand?: string; kcal: number; fav: boolean; source: string }[] = [
  { name: 'Quark, low-fat', brand: 'Store brand', kcal: 85, fav: true, source: 'Custom' },
  { name: 'Chicken breast, raw', kcal: 110, fav: true, source: 'Generic' },
  { name: 'Skyr, plain', brand: 'Store brand', kcal: 63, fav: false, source: 'OFF' },
  { name: 'Rice, basmati, raw', kcal: 351, fav: false, source: 'Generic' },
  { name: 'Protein bar', brand: 'Store brand', kcal: 356, fav: false, source: 'OFF' },
];

function intakeStatus(kcal: number, goal: number): { label: string; tone: StatusTone } {
  if (kcal === 0) return { label: 'Not logged', tone: 'neutral' };
  const r = kcal / goal;
  if (r < 0.95) return { label: 'Under goal', tone: 'accent' };
  if (r <= 1.05) return { label: 'On target', tone: 'good' };
  return { label: 'Over goal', tone: 'warn' };
}

/* -------------------------------------------------------------------------- */
/* sections                                                                   */
/* -------------------------------------------------------------------------- */

function FoundationsSection() {
  return (
    <ShowcaseSection
      id="foundations"
      title="Foundations"
      description="Tokens live in src/index.css (@theme). Orange is the one accent — kcal, macros, primary actions, selection. Stock Tailwind gray / green / amber / red for semantics — red only for destroy."
    >
      <div className="space-y-6">
        <Mosaic cols={2}>
          <Showpiece label="Theme ramp — orange" description="bg-theme-50 … bg-theme-950 · primary = theme-500 (#ff6a00)">
            <Swatches
              items={[
                ['50', 'bg-theme-50'],
                ['100', 'bg-theme-100'],
                ['200', 'bg-theme-200'],
                ['300', 'bg-theme-300'],
                ['400', 'bg-theme-400'],
                ['500', 'bg-theme-500'],
                ['600', 'bg-theme-600'],
                ['700', 'bg-theme-700'],
                ['800', 'bg-theme-800'],
                ['900', 'bg-theme-900'],
                ['950', 'bg-theme-950'],
              ]}
            />
          </Showpiece>
          <Showpiece label="Dark surfaces" description="dark-bg (canvas) / dark-card (glass, sheets) / dark-border (hairlines, tracks). Macros have no colours of their own — they use the theme orange.">
            <Swatches
              items={[
                ['dark-bg', 'bg-dark-bg'],
                ['dark-card', 'bg-dark-card'],
                ['dark-border', 'bg-dark-border'],
              ]}
              wide
            />
          </Showpiece>
          <Showpiece label="Semantic (stock Tailwind)" description="green = in goal / success · amber = over goal / warning · red = destructive ONLY · gray = neutral, tracks, secondary text">
            <Swatches
              items={[
                ['green-500', 'bg-green-500'],
                ['amber-500', 'bg-amber-500'],
                ['red-500', 'bg-red-500'],
                ['gray-100', 'bg-gray-100'],
                ['gray-400', 'bg-gray-400'],
                ['gray-900', 'bg-gray-900'],
              ]}
              wide
            />
          </Showpiece>
          <Showpiece label="Numbers" description="en-GB: decimal point, comma thousands, always tabular-nums. kcal → integer; macro grams shown whole (stored 1 dp); raw amounts up to 1 dp; kg ALWAYS 1 decimal (formatKg / formatWeight); signed deltas with a true minus. Editable inputs use formatPlain (no grouping). lib/format.ts">
            <div className="space-y-2 text-sm tabular-nums">
              <div className="flex justify-between gap-2"><Code>formatKcal(2650)</Code><span className="font-semibold">{formatKcal(2650)} kcal</span></div>
              <div className="flex justify-between gap-2"><Code>formatDecimal(19.44, 0)</Code><span className="font-semibold">{formatDecimal(19.44, 0)} g</span></div>
              <div className="flex justify-between gap-2"><Code>formatDecimal(152.5)</Code><span className="font-semibold">{formatDecimal(152.5)} g</span></div>
              <div className="flex justify-between gap-2"><Code>formatKg(85)</Code><span className="font-semibold">{formatKg(85)}</span></div>
              <div className="flex justify-between gap-2"><Code>formatWeight(82.94)</Code><span className="font-semibold">{formatWeight(82.94)}</span></div>
              <div className="flex justify-between gap-2"><Code>formatSignedDecimal(-0.64)</Code><span className="font-semibold">{formatSignedDecimal(-0.64)} kg</span></div>
              <div className="flex justify-between gap-2"><Code>formatCount(1842)</Code><span className="font-semibold">{formatCount(1842)}</span></div>
              <div className="flex justify-between gap-2"><Code>formatBytes(4_200_000)</Code><span className="font-semibold">{formatBytes(4_200_000)}</span></div>
              <div className="flex justify-between gap-2"><Code>formatPercent(30)</Code><span className="font-semibold">{formatPercent(30)}</span></div>
              <div className="flex justify-between gap-2"><Code>formatPlain(1234.5)</Code><span className="font-semibold">{formatPlain(1234.5)}</span></div>
            </div>
          </Showpiece>
        </Mosaic>

        <Showpiece label="Typography — Lexend" description="The complete type scale. Nothing outside these roles." span={3}>
          <div className="divide-y divide-gray-100 dark:divide-dark-border/40">
            {(
              [
                ['Page title', 'text-3xl font-bold', 'Today'],
                ['Header title', 'text-xl font-semibold', 'Add food'],
                ['Big number', 'text-3xl font-bold tabular-nums', '1,842'],
                ['Card number', 'text-2xl font-bold tabular-nums', '82.9 → 78.0'],
                ['Sheet title', 'text-base font-bold', 'Log to Lunch'],
                ['Section title', 'text-sm font-bold', 'Breakfast'],
                ['Row title / field label', 'text-sm font-semibold', 'Quark, low-fat'],
                ['Body', 'text-sm', 'Nothing yet — add your first food'],
                ['Card title', 'text-xs font-semibold', 'Daily summary'],
                ['Caption / unit', 'text-xs text-gray-400', 'g / 100 g'],
                ['Micro / chip', 'text-[11px] font-semibold tabular-nums', 'P 19 · C 1 · F 25'],
                ['Nav label', 'text-[9px] font-medium', 'Foods'],
              ] as const
            ).map(([role, cls, sample]) => (
              <div key={role} className="grid grid-cols-[140px_1fr] md:grid-cols-[180px_260px_1fr] items-baseline gap-4 py-2.5">
                <span className="text-xs text-gray-500 dark:text-gray-400">{role}</span>
                <span className="hidden md:block font-mono text-[11px] text-gray-400 dark:text-gray-500">{cls}</span>
                <span className={cn(cls, 'text-gray-900 dark:text-gray-100 truncate')}>{sample}</span>
              </div>
            ))}
          </div>
        </Showpiece>

        <Mosaic>
          <Showpiece label="Radii" description="card/dialog 2xl · button-pill full · input/segment track xl · chip/segment lg · drawer t-3xl">
            <div className="grid grid-cols-3 gap-3 text-center text-[11px] text-gray-500 dark:text-gray-400">
              {(
                [
                  ['rounded-2xl', 'card'],
                  ['rounded-xl', 'input'],
                  ['rounded-lg', 'chip'],
                  ['rounded-full', 'pill · FAB'],
                  ['rounded-t-3xl', 'drawer'],
                  ['rounded-md', 'tag'],
                ] as const
              ).map(([cls, what]) => (
                <div key={cls}>
                  <div className={cn('h-12 bg-theme-500/15 border border-theme-500/30', cls)} />
                  <div className="mt-1.5">{what}</div>
                </div>
              ))}
            </div>
          </Showpiece>
          <Showpiece label="Shadows" description="Coloured shadow on anything primary. Nav & FAB xl, dialogs 2xl. Nothing else casts a shadow.">
            <div className="grid grid-cols-2 gap-4 text-center text-[11px] text-gray-500 dark:text-gray-400">
              <div><div className="h-11 rounded-full bg-theme-500 shadow-lg shadow-theme-500/30" /><div className="mt-2">shadow-lg shadow-theme-500/30</div></div>
              <div><div className="h-11 rounded-full bg-white dark:bg-dark-card shadow-xl border border-gray-200/50 dark:border-dark-border/50" /><div className="mt-2">shadow-xl (nav)</div></div>
              <div><div className="h-11 rounded-xl bg-red-500 shadow-lg shadow-red-500/30" /><div className="mt-2">shadow-red-500/30</div></div>
              <div><div className="h-11 rounded-lg bg-white dark:bg-dark-card shadow-sm" /><div className="mt-2">shadow-sm (segment)</div></div>
            </div>
          </Showpiece>
          <Showpiece label="Motion" description="Framer for overlays + page crossfade; CSS for list entrance (StrictMode-safe). No count-up numbers, no confetti.">
            <ul className="space-y-2 text-xs">
              {(
                [
                  ['Page', 'crossfade 0.15 s, popLayout'],
                  ['Drawer', 'spring damping 28 · stiffness 300'],
                  ['Dialog', 'spring scale 0.92 → 1, bounce 0.15'],
                  ['List', 'animate-fade-up, 40 ms stagger'],
                  ['Press', 'active:scale-[0.98] / 95, 200 ms'],
                  ['Bars / ring', 'width / dashoffset 300 ms ease-out'],
                ] as const
              ).map(([k, v]) => (
                <li key={k} className="flex justify-between gap-3">
                  <span className="font-semibold">{k}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-right">{v}</span>
                </li>
              ))}
            </ul>
          </Showpiece>
        </Mosaic>

        <Showpiece label="Layout & safe areas" description="@utility helpers only — never env() or inline style in a component." span={3}>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 text-xs">
            {(
              [
                ['Page column', 'max-w-md mx-auto px-page pb-nav space-y-5'],
                ['Headerless top', 'pt-safe-page (notch + 1.5 rem)'],
                ['Under Header', 'h-header-offset spacer (Header renders it)'],
                ['Sheet bottom', 'pb-safe (home indicator, ≥ 1.5 rem)'],
                ['Nav bottom', 'pb-safe-nav'],
                ['Touch target', '44 px minimum — always'],
                ['Section rhythm', 'space-y-5 page · space-y-2 card list'],
                ['Card padding', 'p-4 · sheet px-5 · dialog p-6'],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="rounded-xl bg-gray-50 dark:bg-dark-card px-3 py-2.5">
                <div className="font-semibold">{k}</div>
                <div className="font-mono text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{v}</div>
              </div>
            ))}
          </div>
        </Showpiece>
      </div>
    </ShowcaseSection>
  );
}

function Swatches({ items, wide = false }: { items: (readonly [string, string])[]; wide?: boolean }) {
  return (
    <div className={cn('grid gap-2', wide ? 'grid-cols-3' : 'grid-cols-6')}>
      {items.map(([name, cls]) => (
        <div key={name}>
          <div className={cn('h-10 rounded-lg border border-black/5 dark:border-white/5', cls)} />
          <div className="mt-1 text-[10px] text-gray-500 dark:text-gray-400 truncate">{name}</div>
        </div>
      ))}
    </div>
  );
}

function ButtonsSection() {
  return (
    <ShowcaseSection
      id="buttons"
      title="Buttons"
      description="One Button with six variants, one IconButton. Pills (rounded-full) everywhere except ghost. One primary per screen area."
    >
      <Mosaic>
        <Showpiece label="Button · primary" description="Sheet / form CTA — full width, h-11, coloured shadow. Disabled drops the shadow.">
          <Phone className="space-y-3">
            <Button fullWidth icon={Check}>Log to Lunch</Button>
            <Button fullWidth disabled>Save</Button>
            <Button fullWidth loading>Saving…</Button>
          </Phone>
        </Showpiece>
        <Showpiece label="Button · secondary / danger / ghost" description="Secondary next to a primary; danger outline for destructive entry points (the confirm is a ConfirmDialog).">
          <Phone className="space-y-3">
            <Button fullWidth variant="secondary" icon={Copy}>Copy from yesterday</Button>
            <Button fullWidth variant="danger" icon={Trash2}>Delete all data</Button>
            <Button fullWidth variant="ghost" size="sm" trailingIcon={ChevronRight}>Show all (12)</Button>
          </Phone>
        </Showpiece>
        <Showpiece label="Button · soft on highlight, sm, link" description="soft = the white button that sits ON an orange-gradient card. sm = h-9 visual inside cards, hit area padded to 44 px. link = SectionHeader action.">
          <Card tone="highlight" className="space-y-3">
            <Button fullWidth variant="soft" icon={Scale}>Log weight</Button>
            <div className="flex items-center justify-between">
              <Button size="sm" icon={Plus}>Add</Button>
              <Button variant="link" trailingIcon={ChevronRight}>See all</Button>
            </div>
          </Card>
        </Showpiece>
        <Showpiece label="IconButton" description="ghost (header, 36 px) · ghost sm (card kebab, 28 px) · soft (stepper, 36 px; lg = 44 px next to a field) · soft onHighlight (on the orange card) · outline (next to a CTA). Label is mandatory; hit area padded to 44 px.">
          <div className="flex flex-wrap items-center gap-5">
            <IconButton icon={Settings} label="Settings" />
            <IconButton icon={MoreHorizontal} label="More options" size="sm" />
            <IconButton icon={Plus} label="Increase" variant="soft" iconSize={14} />
            <IconButton icon={Plus} label="Increase" variant="soft" size="lg" iconSize={16} />
            <span className="rounded-xl bg-theme-500/10 p-1.5">
              <IconButton icon={Plus} label="Increase" variant="soft" size="lg" tone="onHighlight" iconSize={16} />
            </span>
            <IconButton icon={X} label="Discard" variant="outline" iconSize={16} />
          </div>
        </Showpiece>
        <Showpiece label="Primary + outline pair" description="The canonical in-card action row (continue / dismiss).">
          <div className="flex gap-2">
            <Button fullWidth size="md" icon={Copy}>Copy breakfast</Button>
            <IconButton icon={X} label="Close" variant="outline" className="w-11 h-11" iconSize={16} />
          </div>
        </Showpiece>
        <Showpiece label="FAB" description="Exists once — in BottomNav, on the RIGHT of the pill. Never on a page, never centered.">
          <div className="flex items-center justify-center py-2">
            <span className="flex items-center justify-center w-12 h-12 rounded-full bg-theme-500 text-white shadow-xl shadow-theme-500/30">
              <Plus size={22} strokeWidth={2.25} />
            </span>
          </div>
        </Showpiece>
      </Mosaic>
    </ShowcaseSection>
  );
}

function InputsSection() {
  const [name, setName] = useState('Quark, low-fat');
  const [grams, setGrams] = useState<number | null>(150);
  const [kcal, setKcal] = useState<number | null>(85);
  const [protein, setProtein] = useState<number | null>(11.5);
  const [query, setQuery] = useState('skyr');
  const [dailyKcal, setDailyKcal] = useState<number | null>(2650);
  const [birthYear, setBirthYear] = useState<number | null>(1991);
  const [portion, setPortion] = useState(1.5);
  const [date, setDate] = useState(TODAY);

  return (
    <ShowcaseSection
      id="inputs"
      title="Inputs"
      description="One filled shape (h-11, rounded-xl, gray-100). Numbers are comma-tolerant text inputs — never type=number. No inline error rows: invalid input is prevented, failures go to ErrorDialog."
    >
      <Mosaic>
        <Showpiece label="TextField" description="Label above, optional hint below, optional unit suffix. Also type=date (native picker, filled).">
          <Phone className="space-y-4">
            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <TextField label="Brand" optional placeholder="e.g. Store brand" hint="Helps you find it in your library." />
            <TextField label="Date" type="date" value={date} max={TODAY} onChange={(e) => setDate(e.target.value)} />
          </Phone>
        </Showpiece>
        <Showpiece label="NumericInput · filled" description="Accepts 1.5 and 1,5 (a comma is always a decimal). Blurred: en-GB display with grouping (2,650); focused: plain (2650), so the grouping comma is never re-read as a decimal. grouping={false} for years and codes. Selects on focus (one frame after — wait a frame in automation); clamps on blur. No placeholder unless the caller passes one (never a misleading 0).">
          <Phone className="space-y-4">
            <NumericInput variant="filled" label="Amount" value={grams} onChange={setGrams} unit="g" decimals={0} min={0} max={5000} />
            <NumericInput variant="filled" label="Calories (kcal)" value={dailyKcal} onChange={setDailyKcal} unit="kcal" decimals={0} min={0} max={10000} />
            <NumericInput variant="filled" label="Year of birth" value={birthYear} onChange={setBirthYear} decimals={0} grouping={false} inputMode="numeric" />
          </Phone>
        </Showpiece>
        <Showpiece label="NumericInput · inline in FieldRow" description="Right-aligned, transparent, unit badge — the settings / food-form pattern.">
          <SectionCard title="Per 100 g" icon={Utensils}>
            <FieldRow label="Calories">
              <NumericInput label="Calories (kcal)" value={kcal} onChange={setKcal} unit="kcal" decimals={0} />
            </FieldRow>
            <FieldRow label="Protein">
              <NumericInput label="Protein (g)" value={protein} onChange={setProtein} unit="g" />
            </FieldRow>
          </SectionCard>
        </Showpiece>
        <Showpiece label="SearchField" description="Leading magnifier, clear button when non-empty. Filters instantly; network search debounces in the hook.">
          <Phone>
            <SearchField value={query} onChange={setQuery} placeholder="Search foods" />
          </Phone>
        </Showpiece>
        <Showpiece label="Stepper" description="− value + with long-press repeat. Step 10 g / ml for raw amounts, 0.5 for portions, 0.1 kg for weight. showValue={false} = bare 44 px − + pair next to a NumericInput that already shows the value.">
          <div className="flex flex-col items-center gap-4">
            <Stepper value={portion} onChange={setPortion} step={0.5} min={0.5} unit="portions" />
            <Stepper value={grams ?? 0} onChange={setGrams} step={10} decimals={1} unit="g" />
            <Stepper value={grams ?? 0} onChange={setGrams} step={10} decimals={1} showValue={false} />
          </div>
        </Showpiece>
      </Mosaic>
    </ShowcaseSection>
  );
}

function ChoicesSection() {
  const [theme, setTheme] = useState<Theme>('system');
  const [basis, setBasis] = useState<'g' | 'ml'>('g');
  const [period, setPeriod] = useState<'7' | '30'>('7');
  const [fibre, setFibre] = useState(true);
  const [nudge, setNudge] = useState(false);
  const [filter, setFilter] = useState('all');
  const [meal, setMeal] = useState<MealSlot>('lunch');
  const [copyFrom, setCopyFrom] = useState(addDays(TODAY, -1));

  return (
    <ShowcaseSection
      id="choices"
      title="Toggles & choices"
      description="SegmentedToggle for 2–4 exclusive options, Chip for filters and wrap-around single choice, Switch for on/off settings."
    >
      <Mosaic>
        <Showpiece label="SegmentedToggle · md" description="Settings and forms. Icons optional (drop them when the labels would not fit 320 px — the Settings theme toggle is text-only). fullWidth inside sheets. Labels never wrap; each segment's hit area is padded to 44 px tall.">
          <Phone className="space-y-4">
            <SegmentedToggle
              aria-label="Theme"
              value={theme}
              onChange={setTheme}
              options={[
                { value: 'light', label: 'Light', icon: Sun },
                { value: 'dark', label: 'Dark', icon: Moon },
                { value: 'system', label: 'System', icon: Monitor },
              ]}
            />
            <SegmentedToggle
              fullWidth
              value={basis}
              onChange={setBasis}
              options={[
                { value: 'g', label: 'Per 100 g' },
                { value: 'ml', label: 'Per 100 ml' },
              ]}
            />
          </Phone>
        </Showpiece>
        <Showpiece label="SegmentedToggle · sm" description="Chart period switch, top-right of a chart card. Hit area padded to 44 px tall.">
          <div className="flex justify-end">
            <SegmentedToggle
              size="sm"
              value={period}
              onChange={setPeriod}
              options={[
                { value: '7', label: '7 d' },
                { value: '30', label: '30 d' },
              ]}
            />
          </div>
        </Showpiece>
        <Showpiece label="Switch in FieldRow" description="The FieldRow carries the visible label; Switch never stands alone.">
          <SectionCard title="Preferences" icon={Palette}>
            <FieldRow label="Track fibre" hint="Shows fibre on the daily summary.">
              <Switch checked={fibre} onChange={setFibre} label="Track fibre" />
            </FieldRow>
            <FieldRow label="Backup reminders">
              <Switch checked={nudge} onChange={setNudge} label="Backup reminders" />
            </FieldRow>
          </SectionCard>
        </Showpiece>
        <Showpiece label="Chip · filters" description="Library filters. Active = solid orange with coloured shadow.">
          <ChipGroup>
            {[
              ['all', 'All'],
              ['fav', 'Favourites'],
              ['custom', 'Custom'],
              ['off', 'OFF'],
              ['generic', 'Generic'],
            ].map(([v, l]) => (
              <Chip key={v} active={filter === v} onClick={() => setFilter(v)} icon={v === 'fav' ? Star : undefined}>
                {l}
              </Chip>
            ))}
          </ChipGroup>
        </Showpiece>
        <Showpiece label="Chip · single choice in Field as=&quot;div&quot;" description="Meal slot in the amount sheet — five fixed slots, wraps (the English names are too long for a SegmentedToggle). A labelled chip row uses Field as=&quot;div&quot; (role=group): a <label> would forward taps on its text to the first chip.">
          <Field as="div" label="Meal">
            <ChipGroup>
              {MEAL_SLOTS.map((slot) => (
                <Chip key={slot} active={meal === slot} onClick={() => setMeal(slot)}>
                  {MEAL_LABELS[slot]}
                </Chip>
              ))}
            </ChipGroup>
          </Field>
        </Showpiece>
        <Showpiece label="DateChips" description="Quick relative days (labelled against today: Yesterday · 2 days ago) + Other date, which reveals a filled native date input. For any sheet that picks a day (copy source, log date).">
          <Field as="div" label="Copy from">
            <DateChips dates={[addDays(TODAY, -1), addDays(TODAY, -2)]} today={TODAY} value={copyFrom} onChange={setCopyFrom} />
          </Field>
        </Showpiece>
      </Mosaic>
    </ShowcaseSection>
  );
}

function PillsSection() {
  return (
    <ShowcaseSection
      id="pills"
      title="Pills & tags"
      description="StatusPill = state (four tones, no red). Tag = static label (amount, source, count)."
    >
      <Mosaic>
        <Showpiece label="StatusPill · tones" description="neutral · good · accent · warn">
          <div className="flex flex-wrap gap-2">
            <StatusPill tone="neutral" label="Neutral" />
            <StatusPill tone="good" label="Good" />
            <StatusPill tone="accent" label="Accent" />
            <StatusPill tone="warn" label="Warn" />
          </div>
        </Showpiece>
        <Showpiece label="Intake status (±5% of the day's goal)" description="The only status the day summary shows. Over goal is amber — never red.">
          <div className="space-y-2">
            {[0, 1650, 2410, 2780].map((k) => {
              const s = intakeStatus(k, 2400);
              return (
                <div key={k} className="flex items-center justify-between text-xs tabular-nums">
                  <span className="text-gray-500 dark:text-gray-400">{k === 0 ? 'not logged' : `${formatKcal(k)} / ${formatKcal(2400)} kcal`}</span>
                  <StatusPill tone={s.tone} label={s.label} />
                </div>
              );
            })}
          </div>
        </Showpiece>
        <Showpiece label="Weight pace" description="PacePill mapping (F044): icon + label.">
          <div className="flex flex-wrap gap-2">
            <StatusPill tone="good" icon={TrendingDown} label="On track" />
            <StatusPill tone="accent" icon={Sparkles} label="Ahead" />
            <StatusPill tone="warn" icon={AlertTriangle} label="Behind" />
            <StatusPill tone="neutral" icon={Target} label="Not enough data" />
          </div>
        </Showpiece>
        <Showpiece label="Tag" description="neutral on glass · onHighlight on the orange card.">
          <div className="flex flex-wrap items-center gap-2">
            <Tag>150 g</Tag>
            <Tag>1 pc</Tag>
            <Tag>OFF</Tag>
            <span className="rounded-xl bg-theme-500/10 p-2">
              <Tag tone="onHighlight">Week 3 · day 2</Tag>
            </span>
          </div>
        </Showpiece>
      </Mosaic>
    </ShowcaseSection>
  );
}

function SurfacesSection() {
  return (
    <ShowcaseSection
      id="surfaces"
      title="Surfaces"
      description="Two surfaces exist: the glass Card and the highlight Card (orange gradient). SectionCard is a glass Card with a title above and hairline rows. Nothing else is a container."
    >
      <Mosaic>
        <Showpiece label="Card · glass" description="Every content surface. p-4, rounded-2xl, white/60 + blur.">
          <Card>
            <CardHeader icon={Droplets} title="Fibre" trailing={<Tag>18 / 30 g</Tag>} />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Glass card with a CardHeader.</p>
          </Card>
        </Showpiece>
        <Showpiece label="Card · highlight + MiniStat + ProgressBar" description="THE one emphasised card of a screen (day summary, weight goal). Gradient, never a flat tint. MiniStat compact = the 3-column text-only variant that fits 320 px (label above value, icon optional and not rendered).">
          <Card tone="highlight">
            <CardHeader icon={Scale} title="Target weight" trailing={<IconButton icon={MoreHorizontal} label="More options" size="sm" />} />
            <div className="grid grid-cols-2 gap-2 mt-3">
              <MiniStat icon={Calendar} label="42 days left" value="by 8 Nov" />
              <MiniStat icon={TrendingDown} tone="good" label="Change · 7 d" value="−0.8 kg" />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs mb-1">
              <span className="text-gray-500 dark:text-gray-400">Progress</span>
              <span className="font-medium text-theme-600 dark:text-theme-400 tabular-nums">38%</span>
            </div>
            <ProgressBar value={0.38} tone="onHighlight" label="Progress to target weight" />
            <div className="grid grid-cols-3 gap-2 mt-3">
              <MiniStat compact label="Lowest" value={formatKg(82.9)} />
              <MiniStat compact label="Highest" value={formatKg(85.4)} />
              <MiniStat compact label="Average" value={formatKg(84)} />
            </div>
          </Card>
        </Showpiece>
        <Showpiece label="SectionCard + FieldRow" description="Settings / form group. Rows ≥ 44 px, divide-y hairlines, hints tabular-nums. onClick rows get a chevron and open a sheet or route.">
          <SectionCard title="Goals" description="Valid from 1 Sep 2026." icon={Target}>
            <FieldRow label="Calories (kcal)" onClick={() => {}}>
              <span className="text-sm font-medium tabular-nums">{formatKcal(2400)} kcal</span>
            </FieldRow>
            <FieldRow label="Macros" onClick={() => {}}>
              <MacroInline protein={160} carbs={260} fat={75} />
            </FieldRow>
          </SectionCard>
        </Showpiece>
        <Showpiece label="FieldRow · loading / disabled" description="A running action row (Export backup) swaps its chevron for a spinner and is disabled; sibling action rows are disabled until it finishes.">
          <SectionCard title="Data" icon={Database}>
            <FieldRow label="Export backup" hint="Last backup: today · 43 kB" loading onClick={() => {}} />
            <FieldRow label="Import backup" disabled onClick={() => {}} />
            <FieldRow label="Storage" hint="Used: 4.2 MB of ~2 GB">
              <Tag>Persistent</Tag>
            </FieldRow>
          </SectionCard>
        </Showpiece>
      </Mosaic>
    </ShowcaseSection>
  );
}

function HeadingsSection() {
  return (
    <ShowcaseSection
      id="headings"
      title="Headings"
      description="PageTitle heads a headerless page; Header (see App shell) heads every other page. SectionHeader titles a group of cards. CardHeader titles the inside of a card."
    >
      <Mosaic>
        <Showpiece label="PageTitle" description="text-3xl bold + one muted line. Optional trailing IconButton (settings gear).">
          <Phone>
            <PageTitle title="Today" subtitle={longDayLabel(TODAY)} trailing={<IconButton icon={Settings} label="Settings" />} />
          </Phone>
        </Showpiece>
        <Showpiece label="SectionHeader" description="text-sm semibold + optional link action.">
          <Phone>
            <SectionHeader title="Recent" action={{ label: 'See all', onClick: () => {} }} />
            <SectionHeader title="Saved meals" />
          </Phone>
        </Showpiece>
        <Showpiece label="StepIndicator" description="Progress dots of a short multi-step flow (onboarding, 2 steps): current = 24 px orange pill. Announces Step 1 of 2; the step's SectionCard carries its name. Step 1 has no back control; step 2 goes back through the Header chevron and a ghost Back button under the form.">
          <Phone className="space-y-3">
            <StepIndicator step={1} total={2} />
            <StepIndicator step={2} total={2} />
          </Phone>
        </Showpiece>
      </Mosaic>
    </ShowcaseSection>
  );
}

function FoodThumb({ tone = 'default' }: { tone?: 'default' | 'onHighlight' }) {
  return (
    <span
      className={cn(
        'w-10 h-10 rounded-xl inline-flex items-center justify-center text-gray-400 dark:text-gray-500',
        tone === 'onHighlight' ? 'bg-white/60 dark:bg-dark-card/40' : 'bg-gray-100 dark:bg-dark-border/50',
      )}
    >
      <Apple size={18} />
    </span>
  );
}

function FoodRows({ onTap }: { onTap?: () => void }) {
  return (
    <Card padded={false} className="divide-y divide-gray-100 dark:divide-dark-border/30 overflow-hidden">
      {FOODS.map((f) => (
        <ListItem
          key={f.name}
          leading={<FoodThumb />}
          title={f.name}
          subtitle={[f.brand, f.source].filter(Boolean).join(' · ')}
          onClick={onTap ?? (() => {})}
          trailing={
            <>
              <span className="text-xs tabular-nums text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-gray-100">{f.kcal}</span> kcal
              </span>
              <Star size={16} className={f.fav ? 'text-theme-500 fill-theme-500' : 'text-gray-300 dark:text-gray-600'} />
            </>
          }
        />
      ))}
    </Card>
  );
}

function ListsSection() {
  return (
    <ShowcaseSection
      id="lists"
      title="Lists"
      description="ListItem is the one tappable row. `row` inside a Card with hairlines for dense lists (foods, entries); `card` as separate glass cards for short, rich lists (history). Entrance: animate-fade-up with 40 ms stagger."
    >
      <Mosaic cols={2}>
        <Showpiece label="ListItem · row (food library)" description="Thumbnail · name · brand + source · kcal / 100 g · favourite star.">
          <Phone>
            <FoodRows />
          </Phone>
        </Showpiece>
        <Showpiece label="ListItem · card (history)" description="Separate glass cards, space-y-2, trailing StatusPill.">
          <Phone className="space-y-2">
            {INTAKE.slice(-4)
              .reverse()
              .map((p, i) => {
                const s = intakeStatus(p.kcal, p.goalKcal ?? GOAL.kcal);
                return (
                  <ListItem
                    key={p.date}
                    variant="card"
                    index={i}
                    title={i === 0 ? 'Today' : i === 1 ? 'Yesterday' : mediumDayLabel(p.date)}
                    subtitle={p.kcal ? `${formatKcal(p.kcal)} kcal` : 'Not logged'}
                    trailing={<StatusPill tone={s.tone} label={s.label} />}
                    onClick={() => {}}
                  />
                );
              })}
          </Phone>
        </Showpiece>
      </Mosaic>
    </ShowcaseSection>
  );
}

function NutritionSection() {
  return (
    <ShowcaseSection
      id="nutrition"
      title="Nutrition"
      description="PowerCal's own primitives. One accent: the ring and all three macro bars are theme orange; P · C · F are told apart by letter and fixed order. Show kcal AND macros together, always."
    >
      <Mosaic>
        <Showpiece label="KcalRing" description="Under goal → remaining. Over goal → amber number, ring stays full. No count-up.">
          <div className="flex items-center justify-around gap-2">
            <KcalRing consumed={1099} goal={2400} size={112} />
            <KcalRing consumed={2620} goal={2400} size={112} />
          </div>
        </Showpiece>
        <Showpiece label="MacroBar" description="Label + grams / goal + div bar. Over goal: bar stays full, the overflow share is striped.">
          <div className="space-y-3">
            <MacroBar macro="protein" grams={99} goalGrams={160} />
            <MacroBar macro="carbs" grams={129} goalGrams={260} />
            <MacroBar macro="fat" grams={88} goalGrams={75} />
          </div>
        </Showpiece>
        <Showpiece label="MacroBar · compact, average, MacroInline" description="compact = letter only for 3-column rows (the letter never truncates; the numbers do first at 320 px). On a highlight Card pass tone=&quot;onHighlight&quot; (white track) — see Day summary. average = a period average (Avg 191 g / 200 g). MacroInline = the micro row under every entry. Grams are shown whole; totals are summed from the stored 1-dp values, then rounded — never summed from the rounded rows.">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <MacroBar compact macro="protein" grams={99} goalGrams={160} />
              <MacroBar compact macro="carbs" grams={129} goalGrams={260} />
              <MacroBar compact macro="fat" grams={17} goalGrams={75} />
            </div>
            <MacroBar macro="protein" average grams={191} goalGrams={200} />
            <MacroInline protein={29} carbs={9} fat={6} />
          </div>
        </Showpiece>
        <Showpiece label="NutritionPreview" description="Live readout above the save button of every amount editor. Optional footer = one muted line under a hairline (the day total after logging)." span={2}>
          <Phone>
            <NutritionPreview
              caption="150 g · Quark, low-fat"
              totals={{ kcal: 128, protein: 17.3, carbs: 5.4, fat: 3.6 }}
              footer={`New day total: ${formatKcal(1099 + 128)} / ${formatKcal(2400)} kcal`}
            />
          </Phone>
        </Showpiece>
      </Mosaic>
    </ShowcaseSection>
  );
}

function ChartsSection() {
  const [period, setPeriod] = useState<'7' | '30'>('7');
  const points = period === '7' ? INTAKE.slice(-7) : INTAKE;
  const logged = points.filter((p) => p.logged);
  const avg = logged.reduce((a, p) => a + p.kcal, 0) / Math.max(1, logged.length);
  return (
    <ShowcaseSection
      id="charts"
      title="Charts"
      description="Recharts inside a glass Card. Colours from lib/chartColors.ts only; no animation, no accessibility focus rings on tap; fewer than 2 points → the chart returns null and the parent shows an EmptyState."
    >
      <Mosaic>
        <Showpiece label="IntakeTrendChart" description="Fixed h-36. Bars tinted by the ±5 % band (accent under · green on target · amber over · grey without a goal in force) on per-day ghost goal tracks (a goal change steps; no track before the first goal), dashed average line, unlogged = track only, 0 kcal = hairline. Weekday letters ≤ 10 days; beyond, every 5th date ending today (every 10th below 340 px). Second tap on a bar = onOpenDay.">
          <Card>
            <CardHeader
              icon={Flame}
              title="Energy intake"
              trailing={
                <SegmentedToggle
                  size="sm"
                  value={period}
                  onChange={setPeriod}
                  options={[
                    { value: '7', label: '7 d' },
                    { value: '30', label: '30 d' },
                  ]}
                />
              }
            />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 mb-3 tabular-nums">Avg {formatKcal(avg)} kcal · goal {formatKcal(2400)}</p>
            <IntakeTrendChart points={points} avgKcal={avg} />
          </Card>
        </Showpiece>
        <Showpiece label="WeightTrendChart" description="3-point smoothed area on a real time-scale X (gaps stretch), a dot per weigh-in ON the curve (raw weight only in the tooltip), auto-padded Y, optional dashed target line (targetKg). Sizes: default h-36 · fill (h-full of an h-44 slot, /progress) · compact h-16 area only (day-page weight card).">
          <Card>
            <CardHeader icon={Scale} title="Weight" trailing={<StatusPill tone="good" icon={TrendingDown} label="On track" />} />
            <WeightTrendChart points={WEIGHTS} targetKg={82} className="mt-3" />
          </Card>
          <Card className="mt-3">
            <CardHeader icon={Scale} title="Weight · compact" />
            <WeightTrendChart compact points={WEIGHTS} className="mt-2" />
          </Card>
        </Showpiece>
        <Showpiece label="ChartTooltip" description="The one tooltip shell — glass, title + rows.">
          <div className="flex justify-center py-4">
            <ChartTooltip
              title={mediumDayLabel(addDays(TODAY, -6))}
              rows={[
                { label: 'Eaten', value: `${formatKcal(2310)} kcal` },
                { label: '', value: 'P 173 · C 243 · F 72' },
                { label: 'Goal', value: `${formatKcal(2400)} kcal` },
              ]}
            />
          </div>
        </Showpiece>
      </Mosaic>
    </ShowcaseSection>
  );
}

function CalendarSection() {
  const [selected, setSelected] = useState(TODAY);
  const [month, setMonth] = useState(TODAY.slice(0, 7));
  return (
    <ShowcaseSection
      id="calendar"
      title="Calendar"
      description="Monday-first (M T W T F S S). Week strip: 44 px cells. Month grid: cells fill the column (DayCell fluid) — about 35 px at 320 px, the one documented exception to the 44 px rule (hit areas touch, no gaps). Selected = solid orange, today = orange ring, orange dot = the day has entries (week strip), grey dot = weigh-in (month grid), future = muted."
    >
      <Mosaic cols={2}>
        <Showpiece label="WeekStrip" description="Top of the day page. Month label opens the MonthCalendar sheet; chevrons and a swipe browse weeks (controlled displayDate) without changing the selection; Back to today chip when away.">
          <Phone>
            <WeekStrip selectedDate={selected} trackedDates={TRACKED} onSelectDate={setSelected} onOpenMonth={() => {}} />
          </Phone>
        </Showpiece>
        <Showpiece label="MonthCalendar" description="Adherence tints (DayCell tint, the ±5 % band): under = light accent, on target = green, over = stronger amber + ring (distinct from under), no goal in force = grey. Grey dot = weigh-in; adjacent-month and future cells dimmed + disabled; footer summary + legend. In a Drawer from the day page; a glass Card on /progress (selectedDate null).">
          <Phone>
            <MonthCalendar
              month={month}
              selectedDate={selected}
              tints={DEMO_TINTS}
              weightDates={DEMO_WEIGHT_DATES}
              summary={{ loggedDays: DEMO_TINTS.size, daysInMonth: 30, avgKcal: 2410 }}
              onSelectDate={setSelected}
              onChangeMonth={setMonth}
            />
          </Phone>
        </Showpiece>
        <Showpiece label="MonthCalendar · loading" description="While a month loads the cells pulse in place — never an empty grid, no layout shift.">
          <Phone>
            <MonthCalendar month={month} selectedDate={null} loading onSelectDate={setSelected} onChangeMonth={setMonth} />
          </Phone>
        </Showpiece>
      </Mosaic>
    </ShowcaseSection>
  );
}

function OverlaysSection() {
  const [actions, setActions] = useState(false);
  const [amount, setAmount] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [destroy, setDestroy] = useState(false);
  const [error, setError] = useState(false);
  const [choice, setChoice] = useState(false);
  const [level, setLevel] = useState(2);
  return (
    <ShowcaseSection
      id="overlays"
      title="Sheets & dialogs"
      description="Two overlays exist and that is final: the bottom-sheet Drawer (every picker, editor, action list) and the centered Dialog (one focused question). No toasts, no popovers, no side panels."
    >
      <Mosaic>
        <Showpiece label="Drawer · action sheet" description="DrawerHeader + DrawerActions. Tap an entry → this. A row that cannot apply is disabled (dimmed, not hidden). Danger row last. Escape closes only the topmost overlay.">
          <Button fullWidth variant="secondary" onClick={() => setActions(true)}>Open entry actions</Button>
          <Drawer open={actions} onClose={() => setActions(false)}>
            <DrawerHeader title="Quark, low-fat" description="250 g · 212 kcal · Breakfast" />
            <DrawerActions>
              <DrawerAction icon={Pencil} label="Edit amount" onClick={() => setActions(false)} />
              <DrawerAction icon={ArrowRightLeft} label="Move to…" onClick={() => setActions(false)} />
              <DrawerAction icon={Copy} label="Duplicate" onClick={() => setActions(false)} />
              <DrawerAction icon={Save} label="Save as meal" disabled onClick={() => setActions(false)} />
              <DrawerAction icon={Trash2} label="Delete" tone="danger" onClick={() => setActions(false)} />
            </DrawerActions>
          </Drawer>
        </Showpiece>
        <Showpiece label="Drawer · amount sheet" description="The canonical editor sheet: header → portion toggle → amount + Stepper (10 g / 0.5 portion) → meal chips (+ date) → NutritionPreview → sticky CTA `Log · <Meal>` in a sheet-footer row (Save when editing).">
          <Button fullWidth variant="secondary" onClick={() => setAmount(true)}>Open amount sheet</Button>
          <Drawer open={amount} onClose={() => setAmount(false)}>
            <AmountSheetBody onSave={() => setAmount(false)} />
          </Drawer>
        </Showpiece>
        <Showpiece label="ConfirmDialog" description="default = orange confirm · destructive = red confirm. Cancel left, confirm right.">
          <div className="space-y-3">
            <Button fullWidth variant="secondary" onClick={() => setConfirm(true)}>Confirm</Button>
            <Button fullWidth variant="danger" onClick={() => setDestroy(true)}>Destructive confirm</Button>
          </div>
          <ConfirmDialog
            open={confirm}
            onOpenChange={setConfirm}
            title="Copy yesterday's Breakfast?"
            description="Adds 3 entries (542 kcal) to today's Breakfast."
            confirmLabel="Copy"
            onConfirm={() => {}}
          />
          <ConfirmDialog
            open={destroy}
            onOpenChange={setDestroy}
            title="Delete entry?"
            description="Quark, low-fat, 250 g. This can't be undone."
            confirmLabel="Delete"
            variant="destructive"
            onConfirm={() => {}}
          />
        </Showpiece>
        <Showpiece label="ErrorDialog" description="The single error surface. Message = the sentence the service threw.">
          <Button fullWidth variant="secondary" onClick={() => setError(true)}>Error</Button>
          <ErrorDialog
            open={error}
            onClose={() => setError(false)}
            message="Couldn't load the backup file. Check that it's a .json file from PowerCal."
          />
        </Showpiece>
        <Showpiece label="DrawerAction · description (single choice)" description="A single-choice list with one muted line per option (the activity level picker). active = the current choice (aria-pressed).">
          <Button fullWidth variant="secondary" onClick={() => setChoice(true)}>Open single-choice sheet</Button>
          <Drawer open={choice} onClose={() => setChoice(false)}>
            <DrawerHeader title="Activity level" />
            <DrawerActions>
              {ACTIVITY_DEMO.map((a, i) => (
                <DrawerAction
                  key={a.label}
                  label={a.label}
                  description={a.description}
                  active={level === i}
                  trailing={level === i ? <Check size={16} className="text-theme-500" /> : undefined}
                  onClick={() => {
                    setLevel(i);
                    setChoice(false);
                  }}
                />
              ))}
            </DrawerActions>
          </Drawer>
        </Showpiece>
      </Mosaic>
    </ShowcaseSection>
  );
}

const ACTIVITY_DEMO = [
  { label: 'Sedentary', description: 'Desk job, little or no exercise' },
  { label: 'Light', description: 'Exercise 1–3 days a week' },
  { label: 'Moderate', description: 'Exercise 3–5 days a week' },
  { label: 'Very active', description: 'Hard exercise 6–7 days a week' },
];

type DemoPortion = 'g' | 'pc' | 'pack';
const PORTION_GRAMS: Record<DemoPortion, number> = { g: 1, pc: 125, pack: 250 };
const PORTION_OPTIONS: { value: DemoPortion; label: string }[] = [
  { value: 'g', label: 'grams' },
  { value: 'pc', label: '1 pc · 125 g' },
  { value: 'pack', label: 'pack · 250 g' },
];
/** Quark, low-fat — per 100 g. */
const QUARK = { kcal: 85, protein: 11.5, carbs: 3.6, fat: 2.4 };

function quarkTotals(grams: number): MacroTotals {
  const f = grams / 100;
  return { kcal: QUARK.kcal * f, protein: QUARK.protein * f, carbs: QUARK.carbs * f, fat: QUARK.fat * f };
}

/**
 * The sticky CTA row of a Drawer: `sheet-footer` (index.css) sticks it to the
 * sheet's bottom edge and cancels the Drawer's pb-safe, the solid background
 * + a 24 px fade stop rows from showing through or under it.
 */
const SHEET_FOOTER =
  'sheet-footer z-10 -mx-5 px-5 pt-3 bg-white dark:bg-dark-card before:absolute before:inset-x-0 before:-top-6 before:h-6 before:bg-gradient-to-t before:from-white dark:before:from-dark-card before:to-transparent before:pointer-events-none';

function AmountSheetBody({ onSave }: { onSave: () => void }) {
  const [portion, setPortion] = useState<DemoPortion>('g');
  const [qty, setQty] = useState<number | null>(150);
  const [meal, setMeal] = useState<MealSlot>('breakfast');
  const grams = (qty ?? 0) * PORTION_GRAMS[portion];
  return (
    <div className="space-y-5">
      <DrawerHeader icon={Utensils} title="Quark, low-fat" description="Store brand · 85 kcal / 100 g" />
      <SegmentedToggle
        fullWidth
        value={portion}
        onChange={(v) => {
          setPortion(v);
          setQty(v === 'g' ? 150 : 1);
        }}
        options={PORTION_OPTIONS}
      />
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <NumericInput variant="filled" label="Amount" value={qty} onChange={setQty} unit={portion === 'g' ? 'g' : '×'} decimals={1} />
        </div>
        <Stepper value={qty ?? 0} onChange={setQty} step={portion === 'g' ? 10 : 0.5} decimals={1} showValue={false} />
      </div>
      <Field as="div" label="Meal">
        <ChipGroup>
          {MEAL_SLOTS.map((slot) => (
            <Chip key={slot} active={meal === slot} onClick={() => setMeal(slot)}>{MEAL_LABELS[slot]}</Chip>
          ))}
        </ChipGroup>
      </Field>
      <NutritionPreview caption={`${formatDecimal(grams)} g`} totals={quarkTotals(grams)} />
      <div className={SHEET_FOOTER}>
        <Button fullWidth icon={Check} disabled={!qty} onClick={onSave}>
          Log · {MEAL_LABELS[meal]}
        </Button>
      </div>
    </div>
  );
}

function DataStatesSection() {
  return (
    <ShowcaseSection
      id="states"
      title="Data states"
      description="Loading = shape-matched Skeleton (cold start only; IndexedDB answers in < 100 ms). Empty = EmptyState with one way forward. Error = ErrorDialog (above)."
    >
      <Mosaic>
        <Showpiece label="Skeleton · day page" description="Summary h-40 · meal h-24 · rows h-11.">
          <Phone className="space-y-3">
            <Skeleton className="h-40 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
            <SkeletonList rows={2} />
          </Phone>
        </Showpiece>
        <Showpiece label="EmptyState · with action" description="Empty day, empty library.">
          <Card padded={false}>
            <EmptyState icon={Utensils} title="Nothing yet — add your first food" action={{ label: 'Add', icon: Plus, onClick: () => {} }} />
          </Card>
        </Showpiece>
        <Showpiece label="EmptyState · two actions" description="Primary pill (md, 44 px) + optional ghost secondaryAction — never more than two. Always inside its host glass Card; hosts show skeletons while loading, never an EmptyState.">
          <Card padded={false}>
            <EmptyState
              icon={Scale}
              title="Log your first weigh-in"
              action={{ label: 'Log weight', icon: Plus, onClick: () => {} }}
              secondaryAction={{ label: 'Restore from backup', icon: Download, onClick: () => {} }}
            />
          </Card>
        </Showpiece>
        <Showpiece label="EmptyState · plain" description="Search without results, chart with < 2 points.">
          <Card padded={false}>
            <EmptyState icon={SearchX} title="No results" description="Try another name or scan the barcode." />
          </Card>
        </Showpiece>
      </Mosaic>
    </ShowcaseSection>
  );
}

/* -------------------------------------------------------------------------- */
/* phone frame — mounts the REAL AppShell at a given route                    */
/* -------------------------------------------------------------------------- */

function PhoneFrame({ path, children }: { path: string; children: ReactNode }) {
  return (
    <div
      // transform makes this the containing block for the shell's `fixed`
      // Header / BottomNav; the custom properties emulate an iPhone's safe areas.
      className={cn(
        'relative w-[375px] h-[760px] shrink-0 rounded-[48px] border-[10px] border-gray-900 dark:border-gray-700 overflow-hidden shadow-2xl',
        '[transform:translateZ(0)] [--app-height:100%] [--safe-area-top:47px] [--safe-area-bottom:34px] [--header-offset:115px]',
      )}
      // Static preview: links and buttons inside must not navigate the showcase away.
      onClickCapture={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <Routes location={path}>
        <Route element={<AppShell />}>
          <Route path="*" element={children} />
        </Route>
      </Routes>
      <div className="pointer-events-none absolute top-0 inset-x-0 z-[60] h-[47px] flex items-center justify-between px-7 text-[13px] font-semibold text-gray-900 dark:text-gray-100">
        <span>9:41</span>
        <span className="absolute left-1/2 top-2.5 -translate-x-1/2 w-[110px] h-[30px] rounded-full bg-black" />
        <span className="w-6 h-3 rounded-sm border border-current opacity-80" />
      </div>
      <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 z-[60] w-32 h-1 rounded-full bg-gray-900 dark:bg-gray-100" />
    </div>
  );
}

function FrameCaption({ title, route, children }: { title: string; route: string; children: ReactNode }) {
  return (
    <div className="max-w-[375px] mt-3">
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-semibold">{title}</span>
        <Code>{route}</Code>
      </div>
      <p className="text-[11.5px] text-gray-500 dark:text-gray-400 mt-1 leading-snug">{children}</p>
    </div>
  );
}

function ShellSection() {
  return (
    <ShowcaseSection
      id="shell"
      title="App shell"
      description="One AppShell (components/AppShell.tsx): viewport-tall frame, the page is an absolutely positioned scroll container that crossfades on route change, BottomNav floats on top. Pages render only their content."
    >
      <div className="flex flex-col xl:flex-row gap-10 items-start overflow-x-auto pb-6 -mx-6 px-6">
        <div>
          <PhoneFrame path="/foods">
            <>
              <Header title="Foods" rightAction={{ icon: ScanBarcode, onClick: () => {}, 'aria-label': 'Scan' }} />
              <PageContainer variant="withHeader">
                {Array.from({ length: 6 }, (_, i) => (
                  <Skeleton key={i} className="h-24 rounded-2xl" />
                ))}
              </PageContainer>
            </>
          </PhoneFrame>
          <FrameCaption title="Anatomy" route="AppShell">
            Header (glass, fixed, renders its own spacer) · page column · gradient fade · 280 px nav pill with the FAB on the right.
          </FrameCaption>
        </div>
        <div className="grid gap-4 max-w-xl text-sm">
          {(
            [
              ['AppShell', 'The only chrome. Decides nav visibility and the active tab from the route. Never duplicated, never forked per page.'],
              ['BottomNav', 'Today · Foods · Progress + FAB (adds food to the VIEWED day). Hidden on /scan, /onboarding, /day/:date/add, /foods/new, /foods/:id/edit.'],
              ['Header', 'Glass bar for non-home pages: back chevron left, centered title, one optional IconButton right. Fixed height — no second row.'],
              ['Gradient fade', 'Content dissolves into the nav (h-24 from-white / from-dark-bg). Never clip content with a hard edge.'],
              ['No top bar on home pages', 'Day and Progress are headerless: PageTitle + pt-safe-page.'],
              ['Body never scrolls', 'Only the page container scrolls (iOS rubber-band + keyboard stability).'],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="rounded-xl border border-gray-200/70 dark:border-dark-border p-3">
              <div className="font-semibold">{k}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </ShowcaseSection>
  );
}

function PageTemplatesSection() {
  return (
    <ShowcaseSection
      id="templates"
      title="Page templates"
      description="Every route-level page matches one of these four. Each frame mounts the real AppShell at the route shown. A fifth shape is an owner-approval moment, not an in-flight decision."
    >
      <div className="flex gap-10 overflow-x-auto pb-6 -mx-6 px-6">
        <div>
          <PhoneFrame path={`/day/${TODAY}`}>
            <DayTemplate />
          </PhoneFrame>
          <FrameCaption title="A · Headerless home" route="/day/:date · /progress">
            PageContainer headerless → PageTitle → WeekStrip → the ONE highlight card → glass cards. Nav visible.
          </FrameCaption>
        </div>
        <div>
          <PhoneFrame path="/foods">
            <FoodsTemplate />
          </PhoneFrame>
          <FrameCaption title="B · Header + list" route="/foods · /settings">
            Header (no back on tab roots) → PageContainer withHeader → SearchField → ChipGroup → Card of ListItem rows. Nav visible.
          </FrameCaption>
        </div>
        <div>
          <PhoneFrame path="/foods/new">
            <FormTemplate />
          </PhoneFrame>
          <FrameCaption title="C · Header + back" route="/foods/new · /foods/:id · /onboarding">
            Header with back (onboarding step 1 has none) → SectionCards → preview → full-width primary CTA at the end. Nav hidden on focused routes (/foods/new, /foods/:id/edit, /onboarding); visible on /foods/:id, a normal route.
          </FrameCaption>
        </div>
        <div>
          <PhoneFrame path="/scan">
            <ScanTemplate />
          </PhoneFrame>
          <FrameCaption title="D · Full-bleed" route="/scan">
            No container, no Header, no nav. Camera fills the viewport; controls float on glass over pt-safe / pb-safe.
          </FrameCaption>
        </div>
      </div>
    </ShowcaseSection>
  );
}

function DayTemplate() {
  return (
    <PageContainer>
      <PageTitle title="Today" subtitle={longDayLabel(TODAY)} trailing={<IconButton icon={Settings} label="Settings" />} />
      <WeekStrip selectedDate={TODAY} trackedDates={TRACKED} onSelectDate={() => {}} onOpenMonth={() => {}} />
      <DaySummaryCard />
      {MEALS.map((m) => (
        <MealSection key={m.name} {...m} />
      ))}
    </PageContainer>
  );
}

function FoodsTemplate() {
  const [q, setQ] = useState('');
  return (
    <>
      <Header title="Foods" rightAction={{ icon: ScanBarcode, onClick: () => {}, 'aria-label': 'Scan' }} />
      <PageContainer variant="withHeader">
        <SearchField value={q} onChange={setQ} placeholder="Search foods" />
        <ChipGroup>
          <Chip active onClick={() => {}}>All</Chip>
          <Chip onClick={() => {}} icon={Star}>Favourites</Chip>
          <Chip onClick={() => {}}>Custom</Chip>
          <Chip onClick={() => {}}>OFF</Chip>
        </ChipGroup>
        <div>
          <SectionHeader title="Recent" action={{ label: 'See all', onClick: () => {} }} />
          <FoodRows />
        </div>
      </PageContainer>
    </>
  );
}

function FormTemplate() {
  const [basis, setBasis] = useState<'g' | 'ml'>('g');
  return (
    <>
      <Header title="New food" showBack onBack={() => {}} />
      <PageContainer variant="withHeader">
        <Card className="space-y-4">
          <TextField label="Name" defaultValue="Skyr, plain" />
          <TextField label="Brand" optional placeholder="e.g. Store brand" />
          <SegmentedToggle
            fullWidth
            value={basis}
            onChange={setBasis}
            options={[
              { value: 'g', label: 'Per 100 g' },
              { value: 'ml', label: 'Per 100 ml' },
            ]}
          />
        </Card>
        <SectionCard title="Nutrition facts" description="Per 100 g, from the label." icon={Utensils}>
          <FieldRow label="Calories">
            <NumericInput label="Calories (kcal)" value={63} onChange={() => {}} unit="kcal" decimals={0} />
          </FieldRow>
          <FieldRow label="Protein">
            <NumericInput label="Protein (g)" value={11} onChange={() => {}} unit="g" />
          </FieldRow>
          <FieldRow label="Carbs">
            <NumericInput label="Carbs (g)" value={4} onChange={() => {}} unit="g" />
          </FieldRow>
          <FieldRow label="Fat">
            <NumericInput label="Fat (g)" value={0.2} onChange={() => {}} unit="g" />
          </FieldRow>
        </SectionCard>
        <NutritionPreview caption="Check against macros" totals={{ kcal: 62, protein: 11, carbs: 4, fat: 0.2 }} />
        <Button fullWidth icon={Save}>Save food</Button>
      </PageContainer>
    </>
  );
}

function ScanTemplate() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-gray-800 via-gray-900 to-black text-white">
      <div className="absolute top-0 inset-x-0 pt-safe px-page">
        <div className="flex items-center justify-between py-3">
          <IconButton icon={X} label="Close" tone="onCamera" />
          <span className="text-sm font-semibold">Scan</span>
          <IconButton icon={Flashlight} label="Torch" tone="onCamera" />
        </div>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <div className="w-64 h-40 rounded-3xl border-2 border-white/80" />
        <p className="text-sm text-white/70">Point the camera at a barcode</p>
      </div>
      <div className="absolute bottom-0 inset-x-0 pb-safe px-page">
        <Button fullWidth variant="secondary" tone="onCamera" icon={Keyboard}>
          Enter code manually
        </Button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* composition — reference patterns built only from primitives               */
/* -------------------------------------------------------------------------- */

function DaySummaryCard() {
  const status = intakeStatus(DAY_TOTALS.kcal, GOAL.kcal);
  return (
    <Card tone="highlight">
      <CardHeader icon={Flame} title="Daily summary" trailing={<StatusPill tone={status.tone} label={status.label} />} />
      <div className="flex items-center gap-4 mt-3">
        <KcalRing consumed={DAY_TOTALS.kcal} goal={GOAL.kcal} size={120} tone="onHighlight" />
        <div className="flex-1 min-w-0 grid grid-cols-1 gap-2">
          <MiniStat icon={Utensils} label="Eaten" value={`${formatKcal(DAY_TOTALS.kcal)} kcal`} />
          <MiniStat icon={Target} label="Goal" value={`${formatKcal(GOAL.kcal)} kcal`} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-4">
        <MacroBar compact tone="onHighlight" macro="protein" grams={DAY_TOTALS.protein} goalGrams={GOAL.protein} />
        <MacroBar compact tone="onHighlight" macro="carbs" grams={DAY_TOTALS.carbs} goalGrams={GOAL.carbs} />
        <MacroBar compact tone="onHighlight" macro="fat" grams={DAY_TOTALS.fat} goalGrams={GOAL.fat} />
      </div>
    </Card>
  );
}

function MealSection({ name, icon: Icon, entries }: (typeof MEALS)[number]) {
  const subtotal = useMemo(
    () =>
      entries.reduce(
        (t, e) => ({ kcal: t.kcal + e.kcal, protein: t.protein + e.protein, carbs: t.carbs + e.carbs, fat: t.fat + e.fat }),
        { kcal: 0, protein: 0, carbs: 0, fat: 0 },
      ),
    [entries],
  );
  return (
    <Card padded={false} className="overflow-hidden">
      <div className="flex items-center justify-between gap-2 pl-4 pr-2 pt-3 pb-2">
        <div className="flex items-center gap-2 min-w-0">
          <Icon size={16} className="text-theme-500 shrink-0" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">{name}</h3>
          {entries.length > 0 && (
            <span className="text-xs tabular-nums text-gray-500 dark:text-gray-400">{formatKcal(subtotal.kcal)} kcal</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <IconButton icon={Plus} label={`Add to ${name}`} size="sm" />
          <IconButton icon={MoreHorizontal} label={`${name} options`} size="sm" />
        </div>
      </div>
      {entries.length > 0 ? (
        <div className="divide-y divide-gray-100 dark:divide-dark-border/30 border-t border-gray-100 dark:border-dark-border/30">
          {entries.map((e) => (
            <ListItem
              key={e.name}
              title={e.name}
              subtitle={<MacroInline protein={e.protein} carbs={e.carbs} fat={e.fat} />}
              onClick={() => {}}
              trailing={
                <>
                  <Tag>{e.amount}</Tag>
                  <span className="text-sm font-semibold tabular-nums w-10 text-right">{e.kcal}</span>
                </>
              }
            />
          ))}
        </div>
      ) : (
        <div className="px-4 pb-3">
          <Button variant="link" icon={Plus}>Add food</Button>
        </div>
      )}
    </Card>
  );
}

function WeightCard() {
  const [range, setRange] = useState<'4' | '12' | 'all'>('4');
  const points = range === '4' ? WEIGHTS.slice(-5) : WEIGHTS;
  return (
    <Card tone="highlight">
      <CardHeader
        icon={Scale}
        title="Weight"
        trailing={
          <SegmentedToggle
            size="sm"
            tone="onHighlight"
            aria-label="Period"
            value={range}
            onChange={setRange}
            options={[
              { value: '4', label: '4 wk' },
              { value: '12', label: '12 wk' },
              { value: 'all', label: 'All' },
            ]}
          />
        }
      />
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mt-1">
        <span className="text-2xl font-bold tabular-nums">{formatWeight(82.9)}</span>
        <span className="text-sm text-gray-400 dark:text-gray-500">→</span>
        <span className="text-2xl font-bold tabular-nums text-theme-600 dark:text-theme-400">{formatWeight(78)}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">kg</span>
        <StatusPill tone="good" icon={TrendingDown} label="On track" className="ml-auto self-center" />
      </div>
      <div className="grid grid-cols-2 gap-2 mt-3">
        <MiniStat icon={CalendarDays} label="42 days left" value="by 8 Nov" />
        <MiniStat icon={TrendingDown} tone="good" label="Change · 7 d" value="−0.8 kg" />
      </div>
      <div className="h-44 mt-3">
        <WeightTrendChart fill points={points} targetKg={78} />
      </div>
      <Button fullWidth variant="soft" icon={Plus} className="mt-3">Log weight</Button>
    </Card>
  );
}

/** The day page's weight card (F029): GLASS, not highlight — the day summary is that page's one highlight. */
function DayWeightCardComposition() {
  return (
    <Card role="button" tabIndex={0} aria-label="Log weight" onClick={() => {}} className="cursor-pointer active:scale-[0.99] transition-transform">
      <CardHeader icon={Scale} title="Weight" trailing={<StatusPill tone="good" icon={TrendingDown} label="On track" />} />
      <div className="flex items-baseline gap-2 mt-2">
        <span className="text-2xl font-bold tabular-nums">{formatWeight(82.9)}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">kg · today</span>
      </div>
      <p className="mt-1 text-xs tabular-nums text-gray-500 dark:text-gray-400">
        <span className="font-semibold text-green-600 dark:text-green-400">▼ {formatSignedDecimal(-0.6)} kg / 7 days</span> · {formatKg(4.9)} to go
      </p>
      <WeightTrendChart compact points={WEIGHTS} className="mt-2" />
    </Card>
  );
}

/** The live calculator on a highlight card (F015) — every control passes tone="onHighlight". */
function FoodCalculatorCard() {
  const [portion, setPortion] = useState<DemoPortion>('pc');
  const [qty, setQty] = useState<number | null>(1);
  const grams = (qty ?? 0) * PORTION_GRAMS[portion];
  const totals = quarkTotals(grams);
  return (
    <Card tone="highlight" className="space-y-4">
      <div className="flex items-center gap-3">
        <FoodThumb tone="onHighlight" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">Quark, low-fat</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Store brand · 85 kcal / 100 g</p>
        </div>
      </div>
      <SegmentedToggle
        fullWidth
        tone="onHighlight"
        aria-label="Portion"
        value={portion}
        onChange={(v) => {
          setPortion(v);
          setQty(v === 'g' ? 150 : 1);
        }}
        options={PORTION_OPTIONS}
      />
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <NumericInput
            variant="filled"
            tone="onHighlight"
            label="Amount"
            value={qty}
            onChange={setQty}
            unit={portion === 'g' ? 'g' : '×'}
            decimals={1}
            min={0}
          />
        </div>
        <Stepper
          value={qty ?? 0}
          onChange={setQty}
          step={portion === 'g' ? 10 : 0.5}
          decimals={1}
          showValue={false}
          tone="onHighlight"
        />
      </div>
      <NutritionPreview tone="onHighlight" caption={`${formatDecimal(grams)} g`} totals={totals} />
      <Button fullWidth icon={Check} disabled={!qty}>
        Log to…
      </Button>
    </Card>
  );
}

function SettingsComposition() {
  const [backup, setBackup] = useState(true);
  return (
    <div className="space-y-8">
      <SectionCard title="Backup" description="Your data lives only on this phone. Export it regularly." icon={Download}>
        <FieldRow label="Last backup" hint="9 days ago">
          <Tag>19 Sep</Tag>
        </FieldRow>
        <FieldRow label="Backup reminders">
          <Switch checked={backup} onChange={setBackup} label="Backup reminders" />
        </FieldRow>
        <div className="p-4">
          <Button fullWidth icon={Download}>Export backup</Button>
        </div>
      </SectionCard>
    </div>
  );
}

function CompositionSection() {
  return (
    <ShowcaseSection
      id="composition"
      title="Composition"
      description="Reference patterns assembled only from primitives. Build the real components (F015, F021, F023, F029, F041, F062) by mirroring these — same primitives, same order. On a highlight card every control passes tone=&quot;onHighlight&quot;."
    >
      <Mosaic>
        <Showpiece label="Day summary (F021)" description="Highlight Card → CardHeader + intake StatusPill → KcalRing + two MiniStats → three compact MacroBars.">
          <Phone>
            <DaySummaryCard />
          </Phone>
        </Showpiece>
        <Showpiece label="Meal section (F023)" description="Glass Card, no padding → header row (icon · name · kcal subtotal, then + then ⋯ at the right edge) → ListItem rows: name + MacroInline, trailing amount Tag + kcal.">
          <Phone className="space-y-3">
            <MealSection {...MEALS[0]} />
            <MealSection {...MEALS[2]} />
          </Phone>
        </Showpiece>
        <Showpiece label="Food calculator (F015)" description="Amount calculator on a highlight card, all controls tone=&quot;onHighlight&quot;: thumbnail + name → portion SegmentedToggle (soft orange track; one-line labels) → filled NumericInput + Stepper showValue={false} (10 g / 0.5 portion) → NutritionPreview → primary CTA Log to… (opens the amount sheet, where meal chips + date live).">
          <Phone>
            <FoodCalculatorCard />
          </Phone>
        </Showpiece>
        <Showpiece label="Weight card (F041, /progress)" description="The /progress highlight card: CardHeader + period SegmentedToggle sm onHighlight → current → target + pace pill → MiniStats → WeightTrendChart (fill, h-44 slot) → soft CTA.">
          <Phone>
            <WeightCard />
          </Phone>
        </Showpiece>
        <Showpiece label="Day weight card (F029)" description="Glass Card on the day page (the day summary is the page's one highlight); the whole card opens Log weight: value + relative age → delta / 7 days + to go → compact chart (h-16).">
          <Phone>
            <DayWeightCardComposition />
          </Phone>
        </Showpiece>
        <Showpiece label="Settings group (F062)" description="SectionCard → FieldRows (value Tag, Switch) → full-width CTA in a p-4 footer row.">
          <Phone>
            <SettingsComposition />
          </Phone>
        </Showpiece>
      </Mosaic>
    </ShowcaseSection>
  );
}
