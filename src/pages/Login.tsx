import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import { AlertCircle } from 'lucide-react';
import { useAuthStore } from '../features/auth/store/authStore';
import { usePreferencesStore } from '../features/preferences/store/preferencesStore';

/* ── Animated SVG food illustration ─────────────────────────── */
function FoodIllustration() {
  const float = (delay: number) => ({
    animate: { y: [0, -10, 0] },
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const, delay },
  });

  return (
    <div className="relative w-72 h-72 mx-auto" aria-hidden="true">
      {/* Background blob */}
      <div className="absolute inset-0 rounded-full bg-green-primary/10 blur-3xl scale-125" />

      {/* Bowl */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        {...float(0)}
      >
        <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
          <ellipse cx="60" cy="70" rx="52" ry="22" fill="#e8f5ea" />
          <path d="M8 55 Q60 95 112 55" stroke="#3a7d44" strokeWidth="3" fill="#faf8f4" strokeLinecap="round" />
          <ellipse cx="60" cy="55" rx="52" ry="18" fill="#faf8f4" stroke="#3a7d44" strokeWidth="2" />
          {/* Salad contents */}
          <circle cx="45" cy="50" r="8" fill="#3a7d44" opacity="0.7" />
          <circle cx="60" cy="48" r="7" fill="#e8704a" opacity="0.8" />
          <circle cx="75" cy="51" r="9" fill="#3a7d44" opacity="0.6" />
          <circle cx="55" cy="55" r="5" fill="#faf8f4" />
          <circle cx="68" cy="53" r="4" fill="#faf8f4" />
        </svg>
      </motion.div>

      {/* Floating leaf top-left */}
      <motion.div className="absolute top-6 left-8" {...float(0.5)}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path d="M18 4 C26 4 32 10 32 18 C32 26 26 32 18 32 C10 32 4 26 4 18 C4 10 10 4 18 4Z"
            fill="#3a7d44" opacity="0.25" />
          <path d="M18 6 C18 6 28 14 18 30" stroke="#3a7d44" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </motion.div>

      {/* Floating apple top-right */}
      <motion.div className="absolute top-4 right-6" {...float(1)}>
        <svg width="32" height="36" viewBox="0 0 32 36" fill="none">
          <path d="M16 8 C22 8 28 14 28 22 C28 30 22 34 16 34 C10 34 4 30 4 22 C4 14 10 8 16 8Z"
            fill="#e8704a" opacity="0.8" />
          <path d="M16 8 C16 4 20 2 20 2" stroke="#3a7d44" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="11" cy="18" rx="3" ry="5" fill="white" opacity="0.3" />
        </svg>
      </motion.div>

      {/* Floating leaf bottom-right */}
      <motion.div className="absolute bottom-8 right-10" {...float(1.5)}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M4 24 C4 24 16 2 24 4 C22 12 8 20 4 24Z" fill="#3a7d44" opacity="0.5" />
          <path d="M4 24 L24 4" stroke="#3a7d44" strokeWidth="1" opacity="0.4" />
        </svg>
      </motion.div>

      {/* Floating grain bottom-left */}
      <motion.div className="absolute bottom-10 left-6" {...float(0.8)}>
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
          <ellipse cx="13" cy="13" rx="8" ry="11" fill="#e8704a" opacity="0.3" />
          <ellipse cx="13" cy="13" rx="4" ry="7" fill="#e8704a" opacity="0.5" />
        </svg>
      </motion.div>
    </div>
  );
}

/* ── Google icon SVG ─────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
      <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 6.294C4.672 4.169 6.656 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  );
}

/* ── Main Login component ────────────────────────────────────── */
export default function Login() {
  const { user, setUser } = useAuthStore();
  const { updatePreferences } = usePreferencesStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Already authenticated → redirect to dashboard
  if (user?.isAuthenticated) return <Navigate to="/dashboard" replace />;

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch user info');
        const info = await res.json() as {
          sub: string;
          name: string;
          email: string;
          picture: string;
        };
        setUser({ id: info.sub, name: info.name, email: info.email, picture: info.picture, isAuthenticated: true });
        updatePreferences({ displayName: info.name });
      } catch {
        setError('Sign-in failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError('Sign-in failed. Please try again.');
      setLoading(false);
    },
  });

  return (
    <div className="min-h-dvh flex bg-cream dark:bg-zinc-950">
      {/* ── Left panel (brand story) ── */}
      <div className="hidden lg:flex flex-col justify-center items-center w-[60%] px-16 relative overflow-hidden bg-cream dark:bg-zinc-900">
        {/* Soft green blob */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{ background: '#3a7d44', filter: 'blur(80px)', opacity: 0.08 }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-md text-center">
          <FoodIllustration />

          <h1 className="font-serif text-5xl text-gray-900 dark:text-white mt-8 leading-tight">
            Eat smarter.<br />Live better.
          </h1>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
            Track your nutrition, build healthy habits, and get AI-powered meal recommendations tailored just for you.
          </p>

          <div className="flex items-center justify-center gap-8 mt-10">
            {[['10K+', 'Active users'], ['500+', 'Meal recipes'], ['95%', 'Goal success']].map(([val, label]) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-bold text-green-primary dark:text-green-400">{val}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel (login form) ── */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
        className="flex-1 flex items-center justify-center px-6 py-12"
      >
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-green-primary flex items-center justify-center">
              <span className="text-white text-lg font-bold font-serif">N</span>
            </div>
            <div>
              <p className="font-serif text-2xl text-gray-900 dark:text-white leading-none">Nutri</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Personal nutrition intelligence</p>
            </div>
          </div>

          <h2 className="font-serif text-3xl text-gray-900 dark:text-white mb-2">Welcome back</h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">Sign in to continue your health journey</p>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-coral/10 border border-coral/20 text-coral text-sm"
              role="alert"
            >
              <AlertCircle size={14} aria-hidden="true" />
              {error}
            </motion.div>
          )}

          {/* Google sign-in button */}
          <button
            onClick={() => { setError(''); googleLogin(); }}
            disabled={loading}
            className="w-full h-12 flex items-center justify-center gap-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:shadow-card-hover transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Continue with Google"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="10" strokeLinecap="round" />
                </svg>
                Signing in…
              </span>
            ) : (
              <>
                <GoogleIcon />
                Continue with Google
              </>
            )}
          </button>

          {/* Demo / Guest login */}
          <button
            onClick={() => {
              setUser({
                id: 'demo-user-001',
                name: 'Alex',
                email: 'alex@nutri.demo',
                picture: '',
                isAuthenticated: true,
              });
              updatePreferences({ displayName: 'Alex', onboardingComplete: true });
            }}
            className="w-full h-12 flex items-center justify-center gap-2 bg-green-primary hover:bg-green-primary/90 text-white rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer mt-3"
            aria-label="Continue as Guest"
          >
            🥗 Continue as Guest (Demo)
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-700" />
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">or</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-700" />
          </div>

          {/* Email + Password (coming soon) */}
          <div className="space-y-3">
            <div className="relative group">
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Email address"
                disabled
                className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 text-sm text-gray-400 cursor-not-allowed"
                aria-describedby="email-soon"
              />
              <span id="email-soon" className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-gray-400 bg-gray-100 dark:bg-zinc-700 px-2 py-0.5 rounded-pill">
                Soon
              </span>
            </div>
            <div className="relative group">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                disabled
                className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 text-sm text-gray-400 cursor-not-allowed"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-gray-400 bg-gray-100 dark:bg-zinc-700 px-2 py-0.5 rounded-pill" aria-hidden="true">
                Soon
              </span>
            </div>
          </div>

          {/* Sign up link */}
          <p className="mt-4 text-sm text-center text-gray-400 dark:text-gray-500">
            Don't have an account?{' '}
            <span
              className="text-green-primary dark:text-green-400 font-medium cursor-not-allowed opacity-50"
              title="Coming soon"
              aria-label="Sign up — Coming soon"
            >
              Sign up
            </span>
          </p>

          {/* Footer */}
          <p className="mt-10 text-[11px] text-center text-gray-400 dark:text-gray-600 leading-relaxed">
            By signing in you agree to our{' '}
            <span className="underline cursor-pointer hover:text-gray-600 dark:hover:text-gray-400">Terms</span>
            {' '}&amp;{' '}
            <span className="underline cursor-pointer hover:text-gray-600 dark:hover:text-gray-400">Privacy Policy</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
