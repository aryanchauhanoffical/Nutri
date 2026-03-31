import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MealEntry, GroceryItem, HabitEntry } from '../types';
import { seedMeals, seedGroceries, seedHabits } from '../data/seed';

interface AppState {
  darkMode: boolean;
  toggleDarkMode: () => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  meals: MealEntry[];
  addMeal: (meal: MealEntry) => void;
  updateMeal: (id: string, meal: Partial<MealEntry>) => void;
  deleteMeal: (id: string) => void;
  groceries: GroceryItem[];
  toggleGrocery: (id: string) => void;
  setGroceries: (items: GroceryItem[]) => void;
  habits: HabitEntry[];
  toggleHabitDay: (habitId: string, dayIndex: number) => void;
  getDailyStats: () => {
    calories: { current: number; target: number };
    protein: { current: number; target: number };
    hydration: { current: number; target: number };
  };
}

const TARGETS = { calories: 2000, protein: 150, hydration: 2500 };

function calcStreak(days: boolean[]): number {
  let streak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i]) streak++;
    else break;
  }
  return streak;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      darkMode: false,
      toggleDarkMode: () => {
        const next = !get().darkMode;
        set({ darkMode: next });
        document.documentElement.classList.toggle('dark', next);
      },

      sidebarCollapsed: false,
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),

      meals: seedMeals,
      addMeal: (meal) => set((s) => ({ meals: [...s.meals, meal] })),
      updateMeal: (id, updates) =>
        set((s) => ({ meals: s.meals.map((m) => (m.id === id ? { ...m, ...updates } : m)) })),
      deleteMeal: (id) =>
        set((s) => ({ meals: s.meals.filter((m) => m.id !== id) })),

      groceries: seedGroceries,
      toggleGrocery: (id) =>
        set((s) => ({
          groceries: s.groceries.map((g) => (g.id === id ? { ...g, checked: !g.checked } : g)),
        })),
      setGroceries: (items) => set({ groceries: items }),

      habits: seedHabits,
      toggleHabitDay: (habitId, dayIndex) =>
        set((s) => ({
          habits: s.habits.map((h) => {
            if (h.id !== habitId) return h;
            const days = [...h.completedDays];
            days[dayIndex] = !days[dayIndex];
            return { ...h, completedDays: days, currentStreak: calcStreak(days) };
          }),
        })),

      getDailyStats: () => {
        const { meals } = get();
        return {
          calories: { current: meals.reduce((s, m) => s + m.calories, 0), target: TARGETS.calories },
          protein: { current: meals.reduce((s, m) => s + m.protein, 0), target: TARGETS.protein },
          hydration: { current: 1500, target: TARGETS.hydration },
        };
      },
    }),
    {
      name: 'nutri-app-storage',
      partialize: (state) => ({
        darkMode: state.darkMode,
        meals: state.meals,
        groceries: state.groceries,
        habits: state.habits,
      }),
    }
  )
);

// Apply saved dark mode on init
try {
  const stored = localStorage.getItem('nutri-app-storage');
  if (stored) {
    const parsed = JSON.parse(stored);
    if (parsed?.state?.darkMode) {
      document.documentElement.classList.add('dark');
    }
  }
} catch {
  // ignore
}
