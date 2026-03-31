import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Award, Flame, Target } from 'lucide-react';
import { staggerContainer, fadeUp } from '../lib/animations';

const DAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

function ProgressRing({
  progress,
  size = 56,
  stroke = 4,
  color = '#3a7d44',
}: {
  progress: number;
  size?: number;
  stroke?: number;
  color?: string;
}) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;

  return (
    <svg width={size} height={size} aria-hidden="true" role="img">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="#f3f4f6" strokeWidth={stroke} fill="none" />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: [0, 0, 0.2, 1], delay: 0.2 }}
        style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
      />
    </svg>
  );
}

const MILESTONE_BADGES = [
  { days: 7, label: '7-day streak', emoji: '🥉' },
  { days: 14, label: '14-day streak', emoji: '🥈' },
  { days: 30, label: '30-day streak', emoji: '🥇' },
];

const RING_COLORS = ['#3a7d44', '#6366f1', '#e8704a', '#3a7d44'];

function MonthCalendar({ completedDays }: { completedDays: boolean[] }) {
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const adjustedFirst = (firstDay + 6) % 7;

  const days: (boolean | null)[] = [
    ...Array<null>(adjustedFirst).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const dayOfMonth = i + 1;
      const daysAgo = today.getDate() - dayOfMonth;
      if (daysAgo < 0) return null;
      if (daysAgo >= completedDays.length) return false;
      return completedDays[completedDays.length - 1 - daysAgo];
    }),
  ];

  return (
    <div className="mt-4">
      <div className="grid grid-cols-7 gap-1 mb-1.5">
        {DAY_LABELS.map((d) => (
          <div key={d} className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 text-center uppercase">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((val, i) => (
          <div
            key={i}
            className={`h-6 rounded-md flex items-center justify-center text-[10px] font-medium ${
              val === null
                ? 'bg-transparent'
                : val
                ? 'bg-green-primary text-white'
                : 'bg-gray-100 dark:bg-zinc-800 text-gray-300 dark:text-zinc-600'
            }`}
            aria-label={val === null ? undefined : `Day ${i - adjustedFirst + 1}: ${val ? 'completed' : 'missed'}`}
          >
            {val !== null ? i - adjustedFirst + 1 : ''}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Habits() {
  const { habits, toggleHabitDay } = useStore();

  const maxStreak = Math.max(...habits.map((h) => h.currentStreak));

  const getLast7 = (completedDays: boolean[]) =>
    Array.from({ length: 7 }, (_, i) => {
      const dayIndex = completedDays.length - 7 + i;
      return dayIndex >= 0 ? completedDays[dayIndex] : false;
    });

  const getDayIndex = (relativeIndex: number, totalLength: number) =>
    totalLength - 7 + relativeIndex;

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp}>
        <h1 className="font-serif text-3xl text-gray-900 dark:text-white">Habit Tracker</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Build lasting habits, one day at a time.</p>
      </motion.div>

      {/* Badges */}
      <motion.div variants={fadeUp} className="card">
        <div className="flex items-center gap-2 mb-4">
          <Award size={16} className="text-green-primary dark:text-green-400" aria-hidden="true" />
          <h2 className="font-semibold text-gray-900 dark:text-white text-base">Milestone Badges</h2>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          {MILESTONE_BADGES.map((badge) => {
            const earned = maxStreak >= badge.days;
            return (
              <motion.div
                key={badge.days}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, type: 'spring' }}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border ${
                  earned
                    ? 'border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10'
                    : 'border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50 opacity-40'
                }`}
                aria-label={`${badge.label}: ${earned ? 'earned' : 'not yet earned'}`}
              >
                <span className="text-3xl">{badge.emoji}</span>
                <div className="text-center">
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-100">{badge.days} Days</p>
                  {earned && <p className="text-[9px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">EARNED ✓</p>}
                </div>
              </motion.div>
            );
          })}
          <div className="flex items-center gap-1.5 text-green-primary dark:text-green-400 ml-2">
            <Flame size={18} aria-hidden="true" />
            <div>
              <p className="text-2xl font-bold">{maxStreak}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">day streak</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Habit cards */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {habits.map((habit, hi) => {
          const last7 = getLast7(habit.completedDays);
          const today = new Date().getDay();
          const weekDayLabels = Array.from({ length: 7 }, (_, i) => {
            const d = (today - 6 + i + 7) % 7;
            return ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][d];
          });

          return (
            <motion.div key={habit.id} variants={fadeUp} className="card space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <ProgressRing progress={habit.progress} size={52} stroke={4} color={RING_COLORS[hi % RING_COLORS.length]} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg" role="img" aria-label="">{habit.icon}</span>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{habit.name}</p>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{habit.target}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <Flame size={12} className="text-coral" aria-hidden="true" />
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{habit.currentStreak}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">streak</p>
                  <div className="flex items-center gap-1 mt-1 justify-end">
                    <Target size={10} className="text-gray-400" aria-hidden="true" />
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">Best: {habit.bestStreak}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-2 font-medium">Last 7 days</p>
                <div className="flex items-center gap-1.5">
                  {last7.map((filled, i) => {
                    const isToday = i === 6;
                    const dayIndex = getDayIndex(i, habit.completedDays.length);
                    return (
                      <div key={i} className="flex flex-col items-center gap-1 flex-1">
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => toggleHabitDay(habit.id, dayIndex)}
                          className={`streak-pill w-full h-7 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer ${
                            filled
                              ? isToday
                                ? 'bg-green-primary ring-2 ring-green-primary ring-offset-2 ring-offset-white dark:ring-offset-zinc-900'
                                : 'bg-green-primary'
                              : isToday
                              ? 'border-2 border-green-primary bg-green-light dark:bg-green-primary/20'
                              : 'bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700'
                          }`}
                          aria-label={`${weekDayLabels[i]}: ${filled ? 'mark incomplete' : 'mark complete'}`}
                          aria-pressed={filled}
                        >
                          {filled && (
                            <svg width="8" height="7" viewBox="0 0 8 7" fill="none" aria-hidden="true">
                              <path d="M1 3.5L3 5.5L7 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </motion.button>
                        <span className={`text-[9px] font-medium ${isToday ? 'text-green-primary dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}>
                          {weekDayLabels[i]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <MonthCalendar completedDays={habit.completedDays} />
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
