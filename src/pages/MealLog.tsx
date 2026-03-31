import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Trash2, Pencil, X, Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import { foodDatabase } from '../data/seed';
import type { MealEntry } from '../types';
import { staggerContainer, staggerContainerFast, fadeUp } from '../lib/animations';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
const MEAL_TYPE_LABELS: Record<string, string> = {
  breakfast: '🌅 Breakfast',
  lunch: '☀️ Lunch',
  dinner: '🌙 Dinner',
  snack: '🍎 Snack',
};

interface FormState {
  name: string;
  emoji: string;
  mealType: MealEntry['mealType'];
  time: string;
  portionSize: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

const emptyForm: FormState = {
  name: '',
  emoji: '🍽️',
  mealType: 'lunch',
  time: new Date().toTimeString().slice(0, 5),
  portionSize: '1 serving',
  calories: '',
  protein: '',
  carbs: '',
  fat: '',
};

export default function MealLog() {
  const { meals, addMeal, deleteMeal, updateMeal } = useStore();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [foodSearch, setFoodSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = useMemo(() => {
    if (foodSearch.length < 2) return [];
    return foodDatabase
      .filter((f) => f.name.toLowerCase().includes(foodSearch.toLowerCase()))
      .slice(0, 6);
  }, [foodSearch]);

  const grouped = useMemo(() => {
    const filtered = meals.filter((m) =>
      m.name.toLowerCase().includes(search.toLowerCase())
    );
    return MEAL_TYPES.map((type) => ({
      type,
      meals: filtered.filter((m) => m.mealType === type),
    })).filter((g) => g.meals.length > 0);
  }, [meals, search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: MealEntry = {
      id: editId ?? Date.now().toString(),
      name: form.name,
      emoji: form.emoji,
      mealType: form.mealType,
      time: form.time,
      portionSize: form.portionSize,
      calories: Number(form.calories) || 0,
      protein: Number(form.protein) || 0,
      carbs: Number(form.carbs) || 0,
      fat: Number(form.fat) || 0,
    };
    if (editId) {
      updateMeal(editId, entry);
      setEditId(null);
    } else {
      addMeal(entry);
    }
    setForm(emptyForm);
    setShowForm(false);
    setFoodSearch('');
  };

  const startEdit = (meal: MealEntry) => {
    setEditId(meal.id);
    setForm({
      name: meal.name,
      emoji: meal.emoji,
      mealType: meal.mealType,
      time: meal.time,
      portionSize: meal.portionSize,
      calories: meal.calories.toString(),
      protein: meal.protein.toString(),
      carbs: meal.carbs.toString(),
      fat: meal.fat.toString(),
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectFood = (food: typeof foodDatabase[0]) => {
    setForm((f) => ({
      ...f,
      name: food.name,
      emoji: food.emoji,
      calories: food.calories.toString(),
      protein: food.protein.toString(),
      carbs: food.carbs.toString(),
      fat: food.fat.toString(),
      portionSize: food.serving,
    }));
    setFoodSearch(food.name);
    setShowSuggestions(false);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm(emptyForm);
    setFoodSearch('');
  };

  const totalCals = meals.reduce((s, m) => s + m.calories, 0);
  const totalProt = meals.reduce((s, m) => s + m.protein, 0);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-3xl text-gray-900 dark:text-white">Meal Log</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
            {totalCals} kcal · {totalProt}g protein today
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); setFoodSearch(''); }}
          className="btn-primary flex items-center gap-2"
          aria-expanded={showForm}
          aria-controls="meal-form"
        >
          {showForm ? <X size={15} aria-hidden="true" /> : <Plus size={15} aria-hidden="true" />}
          {showForm ? 'Cancel' : 'Log a meal'}
        </motion.button>
      </motion.div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            id="meal-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="card space-y-4" aria-label={editId ? 'Edit meal form' : 'Add meal form'}>
              <h2 className="font-semibold text-gray-900 dark:text-white text-base">
                {editId ? 'Edit meal' : 'Log a new meal'}
              </h2>

              {/* Food search */}
              <div className="relative">
                <label htmlFor="food-search" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                  Search food database
                </label>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                  <input
                    id="food-search"
                    type="text"
                    value={foodSearch}
                    onChange={(e) => { setFoodSearch(e.target.value); setShowSuggestions(true); }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    placeholder="e.g. Chicken breast, Oats…"
                    className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-primary/40"
                    autoComplete="off"
                  />
                </div>
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.ul
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="absolute z-20 mt-1 w-full bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-700 shadow-card-hover overflow-hidden"
                      role="listbox"
                      aria-label="Food suggestions"
                    >
                      {suggestions.map((f) => (
                        <li
                          key={f.id}
                          role="option"
                          aria-selected={false}
                          onMouseDown={() => selectFood(f)}
                          className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer text-sm"
                        >
                          <span className="flex items-center gap-2">
                            <span aria-hidden="true">{f.emoji}</span>
                            <span className="font-medium text-gray-800 dark:text-gray-200">{f.name}</span>
                          </span>
                          <span className="text-gray-400 dark:text-gray-500 text-xs">{f.calories} kcal · {f.serving}</span>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="col-span-2">
                  <label htmlFor="meal-name" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                    Meal name <span className="text-coral" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="meal-name"
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Grilled Chicken"
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-primary/40"
                  />
                </div>
                <div>
                  <label htmlFor="meal-emoji" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Emoji</label>
                  <input
                    id="meal-emoji"
                    type="text"
                    value={form.emoji}
                    onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-primary/40 text-center text-xl"
                    maxLength={2}
                  />
                </div>
                <div>
                  <label htmlFor="meal-time" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Time</label>
                  <input
                    id="meal-time"
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-primary/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label htmlFor="meal-type" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Meal type</label>
                  <select
                    id="meal-type"
                    value={form.mealType}
                    onChange={(e) => setForm((f) => ({ ...f, mealType: e.target.value as MealEntry['mealType'] }))}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-primary/40"
                  >
                    {MEAL_TYPES.map((t) => (
                      <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="meal-portion" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Portion size</label>
                  <input
                    id="meal-portion"
                    type="text"
                    value={form.portionSize}
                    onChange={(e) => setForm((f) => ({ ...f, portionSize: e.target.value }))}
                    placeholder="e.g. 200g"
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-primary/40"
                  />
                </div>
                <div>
                  <label htmlFor="meal-cal" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Calories (kcal)</label>
                  <input
                    id="meal-cal"
                    type="number"
                    min={0}
                    value={form.calories}
                    onChange={(e) => setForm((f) => ({ ...f, calories: e.target.value }))}
                    placeholder="320"
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-primary/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {(['protein', 'carbs', 'fat'] as const).map((macro) => (
                  <div key={macro}>
                    <label htmlFor={`meal-${macro}`} className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 capitalize">{macro} (g)</label>
                    <input
                      id={`meal-${macro}`}
                      type="number"
                      min={0}
                      value={form[macro]}
                      onChange={(e) => setForm((f) => ({ ...f, [macro]: e.target.value }))}
                      placeholder="0"
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-primary/40"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pt-1">
                <button type="button" onClick={resetForm} className="btn-ghost">Cancel</button>
                <motion.button type="submit" whileTap={{ scale: 0.96 }} className="btn-primary flex items-center gap-2">
                  <Check size={14} aria-hidden="true" />
                  {editId ? 'Save changes' : 'Add meal'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      <motion.div variants={fadeUp} className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter meals…"
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-primary/40"
          aria-label="Filter meals"
        />
      </motion.div>

      {/* Timeline */}
      <motion.div variants={staggerContainerFast} className="space-y-6">
        {grouped.length === 0 ? (
          <motion.div variants={fadeUp} className="card text-center py-12">
            <p className="text-4xl mb-3">🍽️</p>
            <p className="text-gray-500 dark:text-gray-400 font-medium">No meals logged yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Tap "Log a meal" to start tracking</p>
          </motion.div>
        ) : (
          grouped.map(({ type, meals: typeMeals }) => {
            const groupCals = typeMeals.reduce((s, m) => s + m.calories, 0);
            const groupProt = typeMeals.reduce((s, m) => s + m.protein, 0);
            return (
              <motion.div key={type} variants={fadeUp}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold text-gray-700 dark:text-gray-300 text-sm">{MEAL_TYPE_LABELS[type]}</h2>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{groupCals} kcal · {groupProt}g protein</span>
                </div>
                <div className="space-y-2">
                  {typeMeals.map((meal) => (
                    <motion.div
                      key={meal.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      whileHover={{ y: -2, scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                      className="card flex items-center gap-4"
                    >
                      <span className="text-2xl flex-shrink-0" role="img" aria-label={meal.name}>{meal.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-gray-900 dark:text-white text-sm">{meal.name}</p>
                          <span className="text-xs text-gray-400 dark:text-gray-500">{meal.time}</span>
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{meal.portionSize}</p>
                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{meal.calories} kcal</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">P: {meal.protein}g</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">C: {meal.carbs}g</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">F: {meal.fat}g</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => startEdit(meal)} className="btn-ghost p-2 rounded-lg" aria-label={`Edit ${meal.name}`}>
                          <Pencil size={13} aria-hidden="true" />
                        </button>
                        <button
                          onClick={() => deleteMeal(meal.id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-coral hover:bg-coral/10 transition-colors duration-150 cursor-pointer"
                          aria-label={`Delete ${meal.name}`}
                        >
                          <Trash2 size={13} aria-hidden="true" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })
        )}
      </motion.div>
    </motion.div>
  );
}
