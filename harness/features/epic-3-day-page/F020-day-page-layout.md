# F020: Day page

**Epic**: 3. Day page · **Status**: Specified · **Depends on**: F004

## Goal

The home screen, opened several times a day. One scrolling page per day brings together the week, the day's totals, the latest weight and the five meals. The date is part of the address, so any day can be reopened and Back works. Moving between days is a swipe or a tap on the arrows.

## Acceptance criteria

1. The page shows, top to bottom: the title (`Today`, `Yesterday` or `Wed, 27 Aug`), the week strip, the daily summary, the weight card and the five meals in the order `Breakfast · Morning snack · Lunch · Afternoon snack · Dinner`.
2. The ‹ › arrows and a horizontal swipe move one day back or forward; switching days never shows the previous day's numbers, even for a moment.
3. The ⋯ menu offers `Copy whole day` and `Log weight`; the gear opens Settings. The page follows midnight while it is open.
4. While data loads, placeholders keep the exact shape of the cards, so nothing jumps.

## Layout & design

- **Template & route**: `/day/:date` uses Template A — headerless `PageContainer`, nav visible with `Today` active.
- **Header**: `PageTitle` (`Today`, `Yesterday` or `Wed, 27 Aug`) with trailing `IconButton`s — ‹ › for the previous and next day, ⋯ and the Settings gear.
- **Body**, top to bottom:
  - `NoticeCard` (new) when one is due — the install hint (F006) or the backup reminder (F063).
  - `WeekStrip` (F022).
  - `DaySummaryCard` (new) — the page's one highlight card (F021).
  - `DayWeightCard` (new) (F029).
  - Five `MealSection` (new) cards in slot order (F023).
- **Menu**: the ⋯ opens a `Drawer` with the `DrawerAction`s `Copy whole day` and `Log weight`.
- **Loading**: `Skeleton`s shaped like each card (summary, meal, rows) — never an `EmptyState` while loading.
