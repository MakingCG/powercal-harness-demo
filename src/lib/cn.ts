/**
 * Join class names, filtering out falsy values. It does NOT merge conflicting
 * Tailwind classes (no tailwind-merge): never override a primitive's classes
 * via `className` (e.g. a background on a Button variant) — which one wins
 * depends on CSS order. Add or use a prop / tone / variant instead.
 */
export function cn(...inputs: (string | false | null | undefined)[]): string {
  return inputs.filter(Boolean).join(' ')
}
