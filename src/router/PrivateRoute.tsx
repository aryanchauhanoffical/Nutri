import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/authStore';
import { usePreferencesStore } from '../features/preferences/store/preferencesStore';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const user = useAuthStore((s) => s.user);
  const { preferences } = usePreferencesStore();
  const location = useLocation();

  if (!user?.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // First-time users: redirect to preferences for onboarding
  if (!preferences.onboardingComplete && location.pathname !== '/preferences') {
    return <Navigate to="/preferences" replace />;
  }

  return <>{children}</>;
}
