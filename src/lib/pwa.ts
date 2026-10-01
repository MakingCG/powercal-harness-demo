/** Installed-app detection: display-mode or iOS `navigator.standalone`. Never user-agent sniffing. */
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const nav = navigator as Navigator & { standalone?: boolean };
  return nav.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
}
