import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Check, Sparkles } from 'lucide-react';
import { seedRecommendations } from '../data/seed';
import { useStore } from '../store/useStore';
import type { MealRecommendation } from '../types';
import { staggerContainer, fadeUp } from '../lib/animations';

const GOALS = [
  { value: 'all', label: 'All Goals' },
  { value: 'weight-loss', label: 'Weight Loss' },
  { value: 'muscle-gain', label: 'Muscle Gain' },
  { value: 'balance', label: 'Balance' },
];
const MEAL_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
];
const CUISINES = [
  { value: 'all', label: 'All Cuisines' },
  { value: 'Mediterranean', label: 'Mediterranean' },
  { value: 'Asian', label: 'Asian' },
  { value: 'American', label: 'American' },
  { value: 'Indian', label: 'Indian' },
  { value: 'French', label: 'French' },
];

function MatchBadge({ score }: { score: number }) {
  const color =
    score >= 90 ? 'bg-green-light text-green-primary dark:bg-green-primary/20 dark:text-green-400' :
    score >= 85 ? 'bg-indigo-light text-indigo-accent dark:bg-indigo-accent/20' :
    'bg-amber-50 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400';
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-pill ${color}`}>
      {score}% match
    </span>
  );
}

function RecommendationCard({ rec, onAdd, added }: {
  rec: MealRecommendation;
  onAdd: () => void;
  added: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.18 }}
      className="card flex flex-col gap-3 h-full"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-3xl" role="img" aria-label={rec.name}>{rec.emoji}</span>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">{rec.name}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 capitalize">{rec.cuisine} · {rec.mealType}</p>
          </div>
        </div>
        <MatchBadge score={rec.matchScore} />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {rec.tags.map((tag) => (
          <span key={tag} className="text-[10px] bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-pill font-medium">
            {tag}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-1">
        {[
          { label: 'Cal', value: rec.calories, unit: '' },
          { label: 'Prot', value: rec.protein, unit: 'g' },
          { label: 'Carbs', value: rec.carbs, unit: 'g' },
          { label: 'Fat', value: rec.fat, unit: 'g' },
        ].map(({ label, value, unit }) => (
          <div key={label} className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-2 text-center">
            <p className="text-sm font-bold text-gray-900 dark:text-white">{value}{unit}</p>
            <p className="text-[9px] text-gray-400 dark:text-gray-500 uppercase tracking-wide">{label}</p>
          </div>
        ))}
      </div>

      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-150 cursor-pointer"
          aria-expanded={expanded}
          aria-controls={`rationale-${rec.id}`}
        >
          <Sparkles size={11} aria-hidden="true" />
          Why this?
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={12} aria-hidden="true" />
          </motion.div>
        </button>
        <AnimatePresence>
          {expanded && (
            <motion.p
              id={`rationale-${rec.id}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed overflow-hidden"
            >
              {rec.rationale}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-auto pt-1">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onAdd}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
            added
              ? 'bg-green-light dark:bg-green-primary/20 text-green-primary dark:text-green-400'
              : 'bg-green-primary hover:bg-green-dark text-white'
          }`}
          aria-label={added ? `${rec.name} added` : `Add ${rec.name} to today`}
        >
          {added ? (
            <><Check size={14} aria-hidden="true" />Added to today</>
          ) : (
            <><Plus size={14} aria-hidden="true" />Add to today</>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function Recommendations() {
  const { addMeal } = useStore();
  const [goal, setGoal] = useState('all');
  const [mealType, setMealType] = useState('all');
  const [cuisine, setCuisine] = useState('all');
  const [added, setAdded] = useState<Set<string>>(new Set());

  const filtered = seedRecommendations.filter((r) => {
    if (goal !== 'all' && r.goal !== goal) return false;
    if (mealType !== 'all' && r.mealType !== mealType) return false;
    if (cuisine !== 'all' && r.cuisine !== cuisine) return false;
    return true;
  });

  const handleAdd = (rec: MealRecommendation) => {
    if (added.has(rec.id)) return;
    addMeal({
      id: `rec-${rec.id}-${Date.now()}`,
      name: rec.name,
      emoji: rec.emoji,
      mealType: rec.mealType,
      time: new Date().toTimeString().slice(0, 5),
      calories: rec.calories,
      protein: rec.protein,
      carbs: rec.carbs,
      fat: rec.fat,
      portionSize: '1 serving',
    });
    setAdded((prev) => new Set([...prev, rec.id]));
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp}>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={20} className="text-green-primary dark:text-green-400" aria-hidden="true" />
          <h1 className="font-serif text-3xl text-gray-900 dark:text-white">AI Meal Picks</h1>
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500">Personalised to your goals and today's macro gaps.</p>
      </motion.div>

      <motion.div variants={fadeUp} className="flex flex-wrap gap-3" role="group" aria-label="Filter meals">
        {[
          { id: 'filter-goal', value: goal, setter: setGoal, options: GOALS, label: 'goal' },
          { id: 'filter-type', value: mealType, setter: setMealType, options: MEAL_TYPES, label: 'meal type' },
          { id: 'filter-cuisine', value: cuisine, setter: setCuisine, options: CUISINES, label: 'cuisine' },
        ].map((f) => (
          <div key={f.id}>
            <label htmlFor={f.id} className="sr-only">Filter by {f.label}</label>
            <select
              id={f.id}
              value={f.value}
              onChange={(e) => f.setter(e.target.value)}
              className="text-sm px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-primary/40 cursor-pointer"
            >
              {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="card text-center py-16">
            <p className="text-4xl mb-3">🥗</p>
            <p className="text-gray-500 dark:text-gray-400 font-medium">No meals match your filters</p>
            <button
              onClick={() => { setGoal('all'); setMealType('all'); setCuisine('all'); }}
              className="mt-3 text-sm text-green-primary dark:text-green-400 font-semibold hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {filtered.map((rec) => (
              <RecommendationCard
                key={rec.id}
                rec={rec}
                onAdd={() => handleAdd(rec)}
                added={added.has(rec.id)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
