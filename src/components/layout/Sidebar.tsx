import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Sparkles,
  Activity,
  ShoppingCart,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Settings,
  LogOut,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useAuthStore } from '../../features/auth/store/authStore';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/meals', icon: UtensilsCrossed, label: 'Meal Log' },
  { to: '/recommendations', icon: Sparkles, label: 'AI Meals' },
  { to: '/habits', icon: Activity, label: 'Habits' },
  { to: '/grocery', icon: ShoppingCart, label: 'Grocery List' },
];

export default function Sidebar() {
  const { darkMode, toggleDarkMode, sidebarCollapsed, setSidebarCollapsed } = useStore();
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 68 : 220 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="hidden md:flex flex-col fixed top-0 left-0 h-full bg-white dark:bg-zinc-900 border-r border-gray-100 dark:border-zinc-800 z-30 overflow-hidden"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-gray-100 dark:border-zinc-800 min-h-[64px]">
        <div className="w-8 h-8 rounded-xl bg-green-primary flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-bold font-serif">N</span>
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="font-serif text-xl text-gray-900 dark:text-white whitespace-nowrap"
            >
              Nutri
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" role="navigation">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              className={`nav-item ${isActive ? 'active' : ''} ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
              aria-label={sidebarCollapsed ? label : undefined}
              title={sidebarCollapsed ? label : undefined}
            >
              <Icon size={18} className="flex-shrink-0" aria-hidden="true" />
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-4 border-t border-gray-100 dark:border-zinc-800 space-y-1">
        {/* Dark mode */}
        <button
          onClick={toggleDarkMode}
          className={`nav-item w-full ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
          aria-label="Toggle dark mode"
          title="Toggle dark mode"
        >
          {darkMode ? (
            <Sun size={18} className="flex-shrink-0" aria-hidden="true" />
          ) : (
            <Moon size={18} className="flex-shrink-0" aria-hidden="true" />
          )}
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="whitespace-nowrap"
              >
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Preferences */}
        <NavLink
          to="/preferences"
          className={`nav-item ${location.pathname === '/preferences' ? 'active' : ''} ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
          aria-label={sidebarCollapsed ? 'Preferences' : undefined}
          title={sidebarCollapsed ? 'Preferences' : undefined}
        >
          <Settings size={18} className="flex-shrink-0" aria-hidden="true" />
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="whitespace-nowrap"
              >
                Preferences
              </motion.span>
            )}
          </AnimatePresence>
        </NavLink>

        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={`nav-item w-full ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronRight size={18} className="flex-shrink-0" aria-hidden="true" />
          ) : (
            <>
              <ChevronLeft size={18} className="flex-shrink-0" aria-hidden="true" />
              <span className="whitespace-nowrap">Collapse</span>
            </>
          )}
        </button>

        {/* User avatar + logout */}
        {user && (
          <div
            className={`mt-2 pt-2 border-t border-gray-100 dark:border-zinc-800 ${
              sidebarCollapsed ? 'flex justify-center' : 'flex items-center gap-2.5'
            }`}
          >
            {user.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover flex-shrink-0 cursor-pointer"
                loading="lazy"
                onClick={() => navigate('/preferences')}
                title="Open preferences"
              />
            ) : (
              <div
                className="w-7 h-7 rounded-full bg-green-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0 cursor-pointer"
                onClick={() => navigate('/preferences')}
                title="Open preferences"
                role="button"
                tabIndex={0}
                aria-label="Open preferences"
              >
                {user.name[0]?.toUpperCase()}
              </div>
            )}
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 min-w-0 flex items-center justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 truncate">{user.name}</p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-coral hover:bg-coral-light dark:hover:bg-coral/10 transition-colors duration-150 flex-shrink-0 cursor-pointer"
                    aria-label="Sign out"
                    title="Sign out"
                  >
                    <LogOut size={14} aria-hidden="true" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
