import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppShell, ScrollToTop, ThemeProvider } from './components';

// Lazy: the showcase is large and never part of the app's first paint.
const DesignSystem = lazy(() => import('./pages/DesignSystem'));

/**
 * The showcase renders OUTSIDE the app's <Routes>: its page templates mount
 * the real AppShell through `<Routes location=…>`, which only works without a
 * parent route. App routes (F004) go inside the AppShell layout below.
 */
export function App() {
  const { pathname } = useLocation();
  if (pathname === '/design-system') {
    return (
      <Suspense fallback={null}>
        <DesignSystem />
      </Suspense>
    );
  }

  return (
    <ThemeProvider>
      <ScrollToTop />
      <Routes>
        <Route element={<AppShell />}>
          <Route path="*" element={<Navigate to="/design-system" replace />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}
