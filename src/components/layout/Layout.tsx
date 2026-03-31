import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { useStore } from '../../store/useStore';
import { pageTransition } from '../../lib/animations';

export default function Layout() {
  const { sidebarCollapsed } = useStore();
  const location = useLocation();

  return (
    <div className="flex min-h-dvh bg-cream dark:bg-zinc-950">
      <Sidebar />

      <div
        className="flex-1 min-h-dvh transition-all duration-[250ms] ease-in-out"
        style={{ marginLeft: `var(--sidebar-w, 0px)` }}
      >
        <style>{`
          @media (min-width: 768px) {
            :root { --sidebar-w: ${sidebarCollapsed ? '68px' : '220px'}; }
          }
          @media (max-width: 767px) {
            :root { --sidebar-w: 0px; }
          }
        `}</style>

        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="px-4 md:px-8 py-6 md:py-8 pb-24 md:pb-8 max-w-[1060px] w-full mx-auto"
            id="main-content"
            tabIndex={-1}
            aria-label="Main content"
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>

      <BottomNav />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: '"DM Sans", system-ui, sans-serif',
            fontSize: '13px',
            borderRadius: '12px',
            padding: '10px 14px',
          },
          success: { style: { background: '#e8f5ea', color: '#2d6235', border: '1px solid #3a7d44' } },
          error: { style: { background: '#fdf0ea', color: '#c05a3a', border: '1px solid #e8704a' } },
        }}
      />
    </div>
  );
}
