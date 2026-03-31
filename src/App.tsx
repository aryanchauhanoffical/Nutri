import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import PrivateRoute from './router/PrivateRoute';

/* ── Lazy-loaded pages ───────────────────────────────────────── */
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MealLog = lazy(() => import('./pages/MealLog'));
const Recommendations = lazy(() => import('./pages/Recommendations'));
const Habits = lazy(() => import('./pages/Habits'));
const Grocery = lazy(() => import('./pages/Grocery'));
const Preferences = lazy(() => import('./pages/Preferences'));

/* ── Simple loading fallback ─────────────────────────────────── */
function PageLoader() {
  return (
    <div
      className="flex items-center justify-center min-h-dvh bg-cream dark:bg-zinc-950"
      aria-label="Loading page"
    >
      <svg
        className="animate-spin text-green-primary"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="16"
          cy="16"
          r="12"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray="56"
          strokeDashoffset="20"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Private — wrapped in Layout */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="meals" element={<MealLog />} />
            <Route path="recommendations" element={<Recommendations />} />
            <Route path="habits" element={<Habits />} />
            <Route path="grocery" element={<Grocery />} />
            <Route path="preferences" element={<Preferences />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
