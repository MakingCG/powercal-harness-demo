# F021: Daily summary

**Epic**: 3. Day page · **Status**: Specified · **Depends on**: F020, F005

## Goal

The card that answers "how am I doing today?". A kcal ring shows how much is left, three bars show protein, carbs and fat against their goals, and a status pill gives the verdict. It updates the moment an entry is added, changed or removed, and always measures the day against the goal that was valid on that day.

## Acceptance criteria

1. The ring shows kcal eaten against the goal, with `kcal left` in the centre — or `kcal over` in amber once the goal is passed. Next to it sit `Eaten` and `Goal`.
2. Three bars read `P 142 / 200`, `C … / …`, `F … / …` in grams; above goal the bar is striped and the number turns amber. At 320 px every value and goal stays readable.
3. The pill reads `Not logged`, `Under goal`, `On target` (within 5 % of the goal) or `Over goal`.
4. A past day is judged against the goal valid on that date. With no goal at all, the card shows what was eaten and a `Set your goals` link.

## Layout & design

- **Where**: `DaySummaryCard` (new) — the day page's one highlight `Card`, mirroring the showcase composition.
- **Body**, top to bottom:
  - `CardHeader` `Daily summary` with the intake `StatusPill` (`Not logged · Under goal · On target · Over goal`).
  - `KcalRing` (`onHighlight`) beside two `MiniStat`s, `Eaten` and `Goal`.
  - Three compact `MacroBar`s (`onHighlight`) side by side, in `P · C · F` order.
- **No goal**: the card keeps `Eaten` and offers a link `Button` `Set your goals`.
- **Copy**: over goal is amber, never red; macros are told apart only by their letter.
