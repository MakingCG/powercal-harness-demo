# Errors

One rule for how the app tells the user something went wrong: always the same way, clearly, and without surprises.

## The rule

A failure is shown in `ErrorDialog`: a centred dialog with a plain sentence and an `OK` button. It doesn't disappear on its own and has no retry button; the user simply tries again. **There are no toasts, snackbars or red error text under fields.**

## How an error travels

- **Database** — Dexie errors propagate. Don't catch them there.
- **Services** throw `new Error('<a sentence for the user>')`: `Couldn't save the food. Try again.` Never a stack trace, an HTTP code or a raw exception message. A service doesn't return `{ error }` for an ordinary failure. It may return a result union when "nothing found" is a designed outcome the screen branches on, such as a barcode lookup that ends `found`, `not-found` or `failed`.
- **Hooks** catch, log the full error with `console.error('useFoods.save failed:', e)`, and expose `{ error, clearError }`.
- **Pages** render one `ErrorDialog` bound to that state:

```tsx
<ErrorDialog open={!!error} message={error ?? ''} onClose={clearError} />
```

## Invalid input is prevented, not scolded

Disable the button, accept both a decimal comma and point, clamp to a sensible range, and show a muted hint under the field (`Enter a weight between 20 and 400 kg`). `Field` deliberately has no error slot.

## Quiet failures

Some failures shouldn't interrupt anyone:

- **Offline, or Open Food Facts is down** — the local library keeps working. A search shows a calm inline caption (`Open Food Facts isn't responding right now`) and a barcode that can't be looked up still offers `Create food`. A background refresh that fails stays silent.
- **Not found** is not an error. A barcode Open Food Facts doesn't know opens the new food form with the code filled in.

## Render crashes

An error boundary sits at the root of the app and around each page. The fallback is a calm glass card with an amber icon, never red, and offers `Try again`, `Export data` and `Restart app`. Exporting matters: with no server, a crash the user can't back up from is real data loss. A crash in one page doesn't break the others, and the nav stays usable. A chunk that fails to load lands in the same boundary and leads with `Restart app`.

The error boundary is the only class component in the app, because React requires it.

## Messages

Write for the user, not the developer: what happened, then what to do.

- `Couldn't save the food. Try again.`
- `Import failed. Your data hasn't changed.`
- `This isn't a PowerCal backup.`
- `Couldn't log the food. Try again.`

The full error goes to `console.error`. The dialog shows only the sentence.
