import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Sparkles, RefreshCw, Share2, Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { GroceryItem } from '../types';
import { staggerContainer, fadeUp } from '../lib/animations';

const CATEGORY_META: Record<GroceryItem['category'], { label: string; emoji: string; color: string }> = {
  proteins: { label: 'Proteins', emoji: '🥩', color: 'text-rose-500 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400' },
  carbs: { label: 'Carbs', emoji: '🌾', color: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400' },
  vegetables: { label: 'Vegetables', emoji: '🥦', color: 'text-green-primary bg-green-light dark:bg-green-primary/20 dark:text-green-400' },
  dairy: { label: 'Dairy', emoji: '🥛', color: 'text-sky-600 bg-sky-50 dark:bg-sky-500/10 dark:text-sky-400' },
  snacks: { label: 'Snacks', emoji: '🥜', color: 'text-indigo-accent bg-indigo-light dark:bg-indigo-accent/20' },
};

const CATEGORIES: GroceryItem['category'][] = ['proteins', 'carbs', 'vegetables', 'dairy', 'snacks'];

function generateNewList(): GroceryItem[] {
  const pools: GroceryItem[] = [
    { id: 'n1', name: 'Salmon Fillet', category: 'proteins', quantity: '400g', checked: false, nutrition: '208 kcal / 100g' },
    { id: 'n2', name: 'Tofu Block', category: 'proteins', quantity: '300g', checked: false, nutrition: '76 kcal / 100g' },
    { id: 'n3', name: 'Whole Wheat Pasta', category: 'carbs', quantity: '500g', checked: false, nutrition: '131 kcal / 100g' },
    { id: 'n4', name: 'Oats', category: 'carbs', quantity: '1 kg', checked: false, nutrition: '389 kcal / 100g' },
    { id: 'n5', name: 'Kale', category: 'vegetables', quantity: '200g', checked: false, nutrition: '49 kcal / 100g' },
    { id: 'n6', name: 'Broccoli', category: 'vegetables', quantity: '2 heads', checked: false, nutrition: '34 kcal / 100g' },
    { id: 'n7', name: 'Low-fat Milk', category: 'dairy', quantity: '1L', checked: false, nutrition: '42 kcal / 100g' },
    { id: 'n8', name: 'Protein Bar', category: 'snacks', quantity: '4 bars', checked: false, nutrition: '200 kcal / bar' },
  ];
  return pools.sort(() => Math.random() - 0.5).slice(0, 6);
}

export default function Grocery() {
  const { groceries, toggleGrocery, setGroceries } = useStore();
  const [regenerating, setRegenerating] = useState(false);
  const [shared, setShared] = useState(false);

  const handleRegenerate = () => {
    setRegenerating(true);
    setTimeout(() => {
      setGroceries(generateNewList());
      setRegenerating(false);
    }, 1200);
  };

  const handleShare = () => {
    const text = groceries
      .map((g) => `${g.checked ? '✅' : '⬜'} ${g.name} — ${g.quantity}`)
      .join('\n');
    if (navigator.share) {
      void navigator.share({ title: 'My Nutri Grocery List', text });
    } else if (navigator.clipboard) {
      void navigator.clipboard.writeText(text);
    }
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const checkedCount = groceries.filter((g) => g.checked).length;

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShoppingCart size={20} className="text-green-primary dark:text-green-400" aria-hidden="true" />
            <h1 className="font-serif text-3xl text-gray-900 dark:text-white">Grocery List</h1>
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            {checkedCount} of {groceries.length} items checked
            <span className="mx-2">·</span>
            <span className="inline-flex items-center gap-1 text-indigo-accent text-[11px] font-semibold">
              <Sparkles size={10} aria-hidden="true" />
              AI curated
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="btn-ghost flex items-center gap-2"
            aria-label="Share grocery list"
          >
            {shared ? (
              <><Check size={14} className="text-green-primary dark:text-green-400" aria-hidden="true" /><span className="text-green-primary dark:text-green-400">Copied!</span></>
            ) : (
              <><Share2 size={14} aria-hidden="true" />Share</>
            )}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleRegenerate}
            disabled={regenerating}
            className="btn-primary flex items-center gap-2 disabled:opacity-70"
            aria-label="Regenerate AI grocery list"
          >
            <motion.div
              animate={regenerating ? { rotate: 360 } : { rotate: 0 }}
              transition={regenerating ? { duration: 0.8, repeat: Infinity, ease: 'linear' } : {}}
            >
              <RefreshCw size={14} aria-hidden="true" />
            </motion.div>
            {regenerating ? 'Generating…' : 'Regenerate'}
          </motion.button>
        </div>
      </motion.div>

      {/* Progress bar */}
      <motion.div variants={fadeUp} className="card">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Shopping progress</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {groceries.length > 0 ? Math.round((checkedCount / groceries.length) * 100) : 0}%
          </p>
        </div>
        <div className="progress-bar" role="progressbar" aria-valuenow={checkedCount} aria-valuemax={groceries.length} aria-label="Shopping progress">
          <motion.div
            className="progress-fill bg-green-primary"
            animate={{ width: `${groceries.length > 0 ? (checkedCount / groceries.length) * 100 : 0}%` }}
            transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
          />
        </div>
        {checkedCount === groceries.length && groceries.length > 0 && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-green-primary dark:text-green-400 font-semibold mt-2 text-center"
          >
            All done! 🎉
          </motion.p>
        )}
      </motion.div>

      {/* Categories */}
      <AnimatePresence mode="wait">
        <motion.div
          key={groceries.map((g) => g.id).join(',')}
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="space-y-5"
        >
          {CATEGORIES.map((cat) => {
            const catItems = groceries.filter((g) => g.category === cat);
            if (catItems.length === 0) return null;
            const meta = CATEGORY_META[cat];
            return (
              <motion.div key={cat} variants={fadeUp} className="card">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-pill text-xs font-semibold ${meta.color}`}>
                    <span aria-hidden="true">{meta.emoji}</span>
                    {meta.label}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {catItems.filter((i) => i.checked).length}/{catItems.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {catItems.map((groceryItem) => (
                    <motion.label
                      key={groceryItem.id}
                      layout
                      className="flex items-center gap-3 cursor-pointer group"
                      aria-label={`${groceryItem.name}, ${groceryItem.quantity}${groceryItem.checked ? ', checked' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={groceryItem.checked}
                        onChange={() => toggleGrocery(groceryItem.id)}
                        className="custom-checkbox"
                        aria-checked={groceryItem.checked}
                      />
                      <div className="flex-1 min-w-0">
                        <motion.div
                          animate={{ opacity: groceryItem.checked ? 0.4 : 1 }}
                          transition={{ duration: 0.2 }}
                          className={`flex items-center gap-2 flex-wrap ${groceryItem.checked ? 'line-through' : ''}`}
                        >
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{groceryItem.name}</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">{groceryItem.quantity}</span>
                        </motion.div>
                      </div>
                      <span className="flex-shrink-0 text-[10px] bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-gray-500 px-2 py-0.5 rounded-pill">
                        {groceryItem.nutrition}
                      </span>
                    </motion.label>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
