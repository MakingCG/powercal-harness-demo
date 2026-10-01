/**
 * Chart colour literals — the ONLY place in src/ where hex values may appear.
 * Recharts and raw SVG attributes take strings, not Tailwind classes. Every
 * value mirrors a token in src/index.css (@theme); keep them in sync.
 */
export const CHART = {
  kcal: '#ff6a00', // --color-theme-500
  kcalSoft: '#ff8929', // --color-theme-400 — bar gradient top stop
  kcalActive: '#ffb86b', // --color-theme-300 — hovered bar
  weight: '#ff6a00', // --color-theme-500
  track: '#94a3b8', // slate-400, used at 8 % opacity for ghost tracks
  good: '#22c55e', // green-500 — intake bar within the ±5 % band
  warn: '#f59e0b', // amber-500 — intake bar above the band
  neutral: '#9ca3af', // gray-400 — logged day without a goal
} as const;
