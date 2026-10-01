# Routes

The screen map. React Router, one route per screen. Every route opens directly from a URL. Templates are described in [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) §2.3.

| Path | Screen | Template | Nav |
|---|---|---|---|
| `/` | redirects to today's day page | — | — |
| `/day/:date` | Day page: summary, meals, weight | A · headerless home | visible (Today) |
| `/day/:date/add` | Add food: a sheet over the day page | sheet | hidden |
| `/foods` | Food library: search, filters, favourites | B · header + list | visible (Foods) |
| `/foods/:id` | Food detail with the amount calculator | C · header + back | visible (Foods) |
| `/foods/new` | New food form | C · header + back | hidden |
| `/foods/:id/edit` | Edit food form | C · header + back | hidden |
| `/scan` | Barcode scanner | D · full-bleed | hidden |
| `/progress` | Weight, intake chart, month calendar | A · headerless home | visible (Progress) |
| `/settings` | Profile, goals, data, appearance | B · header + list | visible, no active tab |
| `/onboarding` | First-run setup | C · header + back | hidden |
| `/design-system` | The live showcase | — | — |

## Rules

- Until a profile and a goal exist, every app route except `/onboarding` sends the user to onboarding. The showcase sits outside this gate.
- Settings opens from the gear on the day page, not from a tab.
- An invalid date or an unknown food id falls back to today or the parent list. There's no 404 page; unknown paths go to today.
- Path builders and nav visibility live in `src/lib/routes.ts`. Add new paths there.

<!-- AGENT: add a row for every new route as it lands. -->
