# F063: Backup reminder

**Epic**: 5. Backup & settings · **Status**: Specified · **Depends on**: F060

## Goal

Nobody remembers to back up, so the app has to ask — once, politely, on the screen the user opens every day. When the last backup is more than two weeks old, a quiet banner offers to do it in one tap. It never takes over the screen, and when dismissed it stays quiet for a week.

## Acceptance criteria

1. When the last backup is older than 14 days (or there has never been one and the diary holds at least 20 entries), the day page shows `Last backup 21 days ago` (or `No backup yet`) with `Your data lives only on this phone.`, `Back up` and a close button.
2. `Back up` opens the share sheet straight from the tap. After a successful backup the banner disappears; cancelling leaves it in place.
3. Closing it hides the banner for 7 days.
4. It never appears on a fresh install, never flashes in while the page loads, and never pushes the summary off a small screen.

## Layout & design

- **Where**: a `NoticeCard` (new) at the very top of the day page, above the `PageTitle`; it scrolls away with the page.
- **Body**: amber icon, `Last backup 21 days ago` (or `No backup yet`) over `Your data lives only on this phone.`, a small primary `Button` `Back up` and a close `IconButton`.
- **Loading**: it renders only once the day's data is in, so it never flashes in or pushes the summary down.
