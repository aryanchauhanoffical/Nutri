import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Sparkles,
  Activity,
  ShoppingCart,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/meals', icon: UtensilsCrossed, label: 'Meals' },
  { to: '/recommendations', icon: Sparkles, label: 'AI' },
  { to: '/habits', icon: Activity, label: 'Habits' },
  { to: '/grocery', icon: ShoppingCart, label: 'Grocery' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 z-30 safe-bottom"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around px-1 py-2">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-150 min-w-[52px] min-h-[44px] justify-center ${
                isActive
                  ? 'text-green-primary dark:text-green-400'
                  : 'text-gray-400 dark:text-gray-500'
              }`}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                size={20}
                aria-hidden="true"
                className={isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}
              />
              <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
