import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';
import { Plus, Sparkles, ArrowRight, Flame, ShoppingCart } from 'lucide-react';
import { useStore } from '../store/useStore';
import AnimatedNumber from '../components/ui/AnimatedNumber';
import ProgressBar from '../components/ui/ProgressBar';
import { aiTips, weeklyCalories } from '../data/seed';
import { staggerContainer, fadeUp } from '../lib/animations';

const MACRO_COLORS = ['#6366f1', '#3a7d44', '#e8704a'];
const MEAL_TYPE_ORDER = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });
}

export default function Dashboard() {
  const { meals, groceries, habits, getDailyStats, toggleGrocery } = useStore();
  const stats = getDailyStats();
  const [tipIndex] = useState(() => Math.floor(Math.random() * aiTips.length));
  const tip = aiTips[tipIndex];

  const totalCarbs = meals.reduce((s, m) => s + m.carbs, 0);
  const totalProt = meals.reduce((s, m) => s + m.protein, 0);
  const totalFat = meals.reduce((s, m) => s + m.fat, 0);
  const macroData = [
    { name: 'Carbs', value: totalCarbs },
    { name: 'Protein', value: totalProt },
    { name: 'Fat', value: totalFat },
  ];

  const mainHabit = habits[0];
  const today = new Date().getDay();
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const idx = mainHabit?.completedDays.length - 7 + i;
    return idx >= 0 ? (mainHabit?.completedDays[idx] ?? false) : false;
  });
  const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const weekDays = Array.from({ length: 7 }, (_, i) => dayLabels[(today - 6 + i + 7) % 7]);

  const mealsByType = MEAL_TYPE_ORDER.map((type) => ({
    type,
    meals: meals.filter((m) => m.mealType === type),
  })).filter((g) => g.meals.length > 0);

  const calPct = Math.round((stats.calories.current / stats.calories.target) * 100);
  const protPct = Math.round((stats.protein.current / stats.protein.target) * 100);
  const hydPct = Math.round((stats.hydration.current / stats.hydration.target) * 100);

  const barData = weeklyCalories.map((d, i) => ({
    ...d,
    fill: i === 6 ? '#3a7d44' : '#e8f5ea',
  }));

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-0.5">{formatDate()}</p>
          <h1 className="font-serif text-3xl md:text-4xl text-gray-900 dark:text-white">
            {getGreeting()}, Alex 👋
          </h1>
        </div>
        <div className="flex items-center gap-1.5 bg-green-light dark:bg-green-primary/20 text-green-primary dark:text-green-400 px-3 py-1.5 rounded-pill text-xs font-semibold">
          <Flame size={13} aria-hidden="true" />
          14-day streak
        </div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Calories</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">{calPct}%</span>
          </div>
          <div className="flex items-end gap-1">
            <AnimatedNumber value={stats.calories.current} className="text-3xl font-bold text-gray-900 dark:text-white" />
            <span className="text-sm text-gray-400 dark:text-gray-500 mb-1">/ {stats.calories.target} kcal</span>
          </div>
          <ProgressBar value={stats.calories.current} max={stats.calories.target} label="Calories progress" colorShift />
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Protein</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">{protPct}%</span>
          </div>
          <div className="flex items-end gap-1">
            <AnimatedNumber value={stats.protein.current} className="text-3xl font-bold text-indigo-accent" />
            <span className="text-sm text-gray-400 dark:text-gray-500 mb-1">/ {stats.protein.target}g</span>
          </div>
          <div className="progress-bar" role="progressbar" aria-valuenow={stats.protein.current} aria-valuemax={stats.protein.target} aria-label="Protein progress">
            <motion.div
              className="progress-fill"
              style={{ backgroundColor: '#6366f1' }}
              initial={{ width: 0 }}
              animate={{ width: `${protPct}%` }}
              transition={{ duration: 0.7, ease: [0, 0, 0.2, 1], delay: 0.1 }}
            />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Hydration</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">{hydPct}%</span>
          </div>
          <div className="flex items-end gap-1">
            <AnimatedNumber value={stats.hydration.current / 1000} decimals={1} className="text-3xl font-bold text-coral" />
            <span className="text-sm text-gray-400 dark:text-gray-500 mb-1">/ {stats.hydration.target / 1000}L</span>
          </div>
          <div className="progress-bar" role="progressbar" aria-valuenow={stats.hydration.current} aria-valuemax={stats.hydration.target} aria-label="Hydration progress">
            <motion.div
              className="progress-fill bg-coral"
              initial={{ width: 0 }}
              animate={{ width: `${hydPct}%` }}
              transition={{ duration: 0.7, ease: [0, 0, 0.2, 1], delay: 0.1 }}
            />
          </div>
        </div>
      </motion.div>

      {/* AI Banner */}
      <motion.div
        variants={fadeUp}
        className="relative rounded-card overflow-hidden border border-green-primary/30 ai-banner-border"
        style={{ background: 'linear-gradient(135deg, #3a7d44 0%, #2d6235 100%)' }}
        role="region"
        aria-label="AI recommendation"
      >
        <div className="px-5 py-4 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles size={16} className="text-white" aria-hidden="true" />
            </div>
            <div>
              <p className="text-white/70 text-xs font-medium mb-0.5 uppercase tracking-wide">AI Insight</p>
              <p className="text-white font-semibold text-sm md:text-base">{tip.title}</p>
              <p className="text-white/80 text-sm mt-1 leading-relaxed">{tip.body}</p>
            </div>
          </div>
          <Link
            to="/recommendations"
            className="flex-shrink-0 flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors duration-150 whitespace-nowrap"
          >
            {tip.cta}
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </div>
      </motion.div>

      {/* Meals + Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={fadeUp} className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 dark:text-white text-base">Today's Meals</h2>
            <Link to="/meals" className="flex items-center gap-1 text-green-primary dark:text-green-400 text-xs font-semibold hover:underline">
              <Plus size={13} aria-hidden="true" />
              Log a meal
            </Link>
          </div>
          <div className="space-y-4">
            {mealsByType.map(({ type, meals: typeMeals }) => (
              <div key={type}>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2 capitalize">{type}</p>
                <div className="space-y-2">
                  {typeMeals.map((meal) => (
                    <motion.div
                      key={meal.id}
                      whileHover={{ y: -2, scale: 1.01 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl" role="img" aria-label={meal.name}>{meal.emoji}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{meal.name}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">{meal.time} · {meal.portionSize}</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{meal.calories} kcal</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="card space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white text-base">Macro Breakdown</h2>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%" cy="50%"
                  innerRadius={42} outerRadius={62}
                  paddingAngle={3}
                  dataKey="value"
                  isAnimationActive
                  animationBegin={0}
                  animationDuration={900}
                >
                  {macroData.map((_, index) => (
                    <Cell key={index} fill={MACRO_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => [`${v as number}g`, '']}
                  contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 12, fontFamily: 'DM Sans' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2.5">
              {macroData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: MACRO_COLORS[i] }} aria-hidden="true" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">{d.name}</span>
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-100 ml-auto pl-2">{d.value}g</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-2 font-medium">Weekly Calories</p>
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={barData} barSize={14} margin={{ top: 0, right: 0, bottom: 0, left: -24 }}>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9ca3af', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#9ca3af', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(v) => [`${v as number} kcal`, '']}
                  contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 12, fontFamily: 'DM Sans' }}
                />
                <Bar dataKey="calories" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={800}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Streak + Grocery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={fadeUp} className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900 dark:text-white text-base">Habit Streak</h2>
            <Link to="/habits" className="text-xs text-green-primary dark:text-green-400 font-semibold hover:underline">View all</Link>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">14</span>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">day streak 🔥</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Best: 14 days</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {weekDays.map((label, i) => {
              const filled = last7[i];
              const isToday = i === 6;
              return (
                <div key={i} className="flex flex-col items-center gap-1 flex-1">
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.05, duration: 0.3, type: 'spring' }}
                    className={`streak-pill w-full h-7 rounded-lg flex items-center justify-center ${filled
                        ? isToday
                          ? 'bg-green-primary ring-2 ring-green-primary ring-offset-2 ring-offset-white dark:ring-offset-zinc-900'
                          : 'bg-green-primary'
                        : isToday
                          ? 'border-2 border-green-primary bg-green-light dark:bg-green-primary/20'
                          : 'bg-gray-100 dark:bg-zinc-800'
                      }`}
                    aria-label={`${label}: ${filled ? 'completed' : 'not completed'}${isToday ? ' (today)' : ''}`}
                  >
                    {filled && (
                      <svg width="8" height="7" viewBox="0 0 8 7" fill="none" aria-hidden="true">
                        <path d="M1 3.5L3 5.5L7 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </motion.div>
                  <span className={`text-[9px] font-medium ${isToday ? 'text-green-primary dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}>{label}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-gray-900 dark:text-white text-base">Grocery List</h2>
              <span className="flex items-center gap-1 bg-indigo-light dark:bg-indigo-accent/20 text-indigo-accent text-[10px] font-bold px-2 py-0.5 rounded-pill">
                <Sparkles size={9} aria-hidden="true" />
                AI curated
              </span>
            </div>
            <Link to="/grocery" className="text-xs text-green-primary dark:text-green-400 font-semibold hover:underline flex items-center gap-1">
              <ShoppingCart size={11} aria-hidden="true" />
              Full list
            </Link>
          </div>
          <div className="space-y-2.5">
            {groceries.slice(0, 5).map((grocItem) => (
              <label
                key={grocItem.id}
                className="flex items-center gap-3 cursor-pointer group"
                aria-label={`${grocItem.name}, ${grocItem.quantity}${grocItem.checked ? ', checked' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={grocItem.checked}
                  onChange={() => toggleGrocery(grocItem.id)}
                  className="custom-checkbox"
                  aria-checked={grocItem.checked}
                />
                <div className="flex-1 min-w-0">
                  <motion.span
                    animate={{ opacity: grocItem.checked ? 0.4 : 1 }}
                    className={`text-sm font-medium text-gray-800 dark:text-gray-100 ${grocItem.checked ? 'line-through' : ''}`}
                  >
                    {grocItem.name}
                  </motion.span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">{grocItem.quantity}</span>
                </div>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 shrink-0">{grocItem.nutrition}</span>
              </label>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
