# F011: Bundled everyday foods

**Epic**: 2. Food library · **Status**: Specified · **Depends on**: F003

## Goal

About 250 everyday staples — chicken breast, rice, quark, eggs, rolled oats, cottage cheese — ship inside the app, so the library is useful on the very first day and fully offline. Raw ingredients are what people weigh most, and product databases rarely have them. The values come from a public-domain nutrition database, with short English names and sensible default portions.

## Acceptance criteria

1. On a fresh install, before onboarding is finished, searching `rice` or `egg` already finds bundled foods, with no network.
2. Names state whether a food is raw or cooked when it matters (`Rice, white, raw` vs `Rice, white, cooked`), and foods eaten by the piece open on their natural portion (`Egg, whole, raw` → `1 pc (50 g)`).
3. A user's favourites, portions and usage on a bundled food survive app updates. Editing its nutrition saves a personal copy; deleting it archives it.
4. Bundled values pass the app's own kcal check without a warning.

## Layout & design

- No screen of its own — bundled foods show up through existing blocks: the `Generic` `Chip` filter on `/foods`, `FoodRow` (new) in the picker and search, and on the detail page (F015) a `Tag` `Generic food` with the line `Source: USDA SR Legacy`.
- **About**: the `About` `SectionCard` in Settings (F062) credits the source.
