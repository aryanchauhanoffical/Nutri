import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Target, Salad, Bell, Save, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  usePreferencesStore,
  calcTargets,
  type UserPreferences,
  type PrimaryGoal,
  type ActivityLevel,
  type DietType,
  type Allergy,
  type CuisinePreference,
} from '../features/preferences/store/preferencesStore';
import { useAuthStore } from '../features/auth/store/authStore';
import { useStore } from '../store/useStore';
import { staggerContainer, fadeUp } from '../lib/animations';

/* ── Pill toggle helpers ──────────────────────────────────────── */
function PillToggle<T extends string>({
  value,
  active,
  onToggle,
}: {
  value: T;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 cursor-pointer ${
        active
          ? 'bg-green-primary border-green-primary text-white'
          : 'border-gray-200 dark:border-zinc-700 bg-cream dark:bg-zinc-800 text-gray-500 dark:text-gray-400 hover:border-green-primary/50'
      }`}
      aria-pressed={active}
    >
      {value.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
    </button>
  );
}

function SectionTitle({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <Icon size={16} className="text-green-primary dark:text-green-400" aria-hidden="true" />
      <h2 className="font-serif text-xl text-gray-900 dark:text-white">{title}</h2>
    </div>
  );
}

/* ── Section 1: Personal Info ────────────────────────────────── */
function PersonalInfoSection({
  prefs,
  email,
  picture,
  onChange,
}: {
  prefs: UserPreferences;
  email: string;
  picture: string;
  onChange: (p: Partial<UserPreferences>) => void;
}) {
  return (
    <motion.div variants={fadeUp} className="card space-y-5">
      <SectionTitle icon={User} title="Personal Info" />

      {/* Avatar */}
      <div className="flex items-center gap-4">
        {picture ? (
          <img
            src={picture}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-zinc-700 shadow-card"
            loading="lazy"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-green-primary flex items-center justify-center text-white text-xl font-bold">
            {prefs.displayName?.[0]?.toUpperCase() ?? '?'}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{prefs.displayName || 'Your Name'}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">{email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="displayName" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
            Display Name
          </label>
          <input
            id="displayName"
            type="text"
            value={prefs.displayName}
            onChange={(e) => onChange({ displayName: e.target.value })}
            className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-primary/30"
          />
        </div>
        <div>
          <label htmlFor="email-ro" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
            Email (from Google)
          </label>
          <input
            id="email-ro"
            type="email"
            value={email}
            readOnly
            className="w-full h-10 px-3 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50 text-sm text-gray-400 cursor-not-allowed"
          />
        </div>
        <div>
          <label htmlFor="dob" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
            Date of Birth
          </label>
          <input
            id="dob"
            type="date"
            value={prefs.dateOfBirth}
            onChange={(e) => onChange({ dateOfBirth: e.target.value })}
            className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-primary/30"
          />
        </div>
        <div>
          <label htmlFor="gender" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
            Gender
          </label>
          <select
            id="gender"
            value={prefs.gender}
            onChange={(e) => onChange({ gender: e.target.value as UserPreferences['gender'] })}
            className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-primary/30 cursor-pointer"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Section 2: Health Goals ─────────────────────────────────── */
const GOALS: { value: PrimaryGoal; label: string }[] = [
  { value: 'lose-weight', label: 'Lose Weight' },
  { value: 'maintain', label: 'Maintain Weight' },
  { value: 'gain-muscle', label: 'Gain Muscle' },
  { value: 'improve-energy', label: 'Improve Energy' },
  { value: 'eat-healthier', label: 'Eat Healthier' },
];

const ACTIVITY_LABELS = ['Sedentary', 'Lightly active', 'Moderately active', 'Very active', 'Athlete'];

function HealthGoalsSection({
  prefs,
  onChange,
}: {
  prefs: UserPreferences;
  onChange: (p: Partial<UserPreferences>) => void;
}) {
  const handleGoalChange = (goal: PrimaryGoal) => {
    const targets = calcTargets(goal, prefs.activityLevel);
    onChange({ primaryGoal: goal, ...targets });
  };

  const handleActivityChange = (level: ActivityLevel) => {
    const targets = calcTargets(prefs.primaryGoal, level);
    onChange({ activityLevel: level, ...targets });
  };

  return (
    <motion.div variants={fadeUp} className="card space-y-5">
      <SectionTitle icon={Target} title="Health Goals" />

      <div>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3">Primary Goal</p>
        <div className="flex flex-wrap gap-2">
          {GOALS.map((g) => (
            <button
              key={g.value}
              type="button"
              onClick={() => handleGoalChange(g.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150 cursor-pointer ${
                prefs.primaryGoal === g.value
                  ? 'bg-green-primary border-green-primary text-white'
                  : 'border-gray-200 dark:border-zinc-700 bg-cream dark:bg-zinc-800 text-gray-500 dark:text-gray-400 hover:border-green-primary/50'
              }`}
              aria-pressed={prefs.primaryGoal === g.value}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Activity Level</p>
          <p className="text-xs font-semibold text-green-primary dark:text-green-400">
            {ACTIVITY_LABELS[prefs.activityLevel - 1]}
          </p>
        </div>
        <input
          type="range"
          min={1}
          max={5}
          value={prefs.activityLevel}
          onChange={(e) => handleActivityChange(Number(e.target.value) as ActivityLevel)}
          className="w-full accent-green-primary cursor-pointer"
          aria-label="Activity level"
          aria-valuetext={ACTIVITY_LABELS[prefs.activityLevel - 1]}
        />
        <div className="flex justify-between mt-1">
          {ACTIVITY_LABELS.map((l) => (
            <span key={l} className="text-[9px] text-gray-400 dark:text-gray-600 text-center" style={{ width: '20%' }}>
              {l.split(' ')[0]}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {([
          { key: 'calorieTarget', label: 'Calories', unit: 'kcal' },
          { key: 'proteinTarget', label: 'Protein', unit: 'g' },
          { key: 'carbTarget', label: 'Carbs', unit: 'g' },
          { key: 'fatTarget', label: 'Fat', unit: 'g' },
        ] as const).map(({ key, label, unit }) => (
          <div key={key}>
            <label htmlFor={key} className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
              {label} ({unit})
            </label>
            <input
              id={key}
              type="number"
              value={prefs[key]}
              onChange={(e) => onChange({ [key]: Number(e.target.value) })}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-primary/30"
              min={0}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Section 3: Dietary Preferences ─────────────────────────── */
const DIET_OPTIONS: DietType[] = ['omnivore', 'vegetarian', 'vegan', 'keto', 'paleo', 'gluten-free', 'dairy-free', 'halal', 'kosher'];
const ALLERGY_OPTIONS: Allergy[] = ['nuts', 'shellfish', 'eggs', 'soy', 'wheat', 'fish', 'dairy'];
const CUISINE_OPTIONS: CuisinePreference[] = ['indian', 'mediterranean', 'asian', 'american', 'mexican', 'italian', 'middle-eastern'];

function toggle<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

function DietarySection({
  prefs,
  onChange,
}: {
  prefs: UserPreferences;
  onChange: (p: Partial<UserPreferences>) => void;
}) {
  return (
    <motion.div variants={fadeUp} className="card space-y-5">
      <SectionTitle icon={Salad} title="Dietary Preferences" />

      <div>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3">Diet Type</p>
        <div className="flex flex-wrap gap-2">
          {DIET_OPTIONS.map((d) => (
            <PillToggle
              key={d}
              value={d}
              active={prefs.dietTypes.includes(d)}
              onToggle={() => onChange({ dietTypes: toggle(prefs.dietTypes, d) })}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3">Food Allergies</p>
        <div className="flex flex-wrap gap-2">
          {ALLERGY_OPTIONS.map((a) => (
            <PillToggle
              key={a}
              value={a}
              active={prefs.allergies.includes(a)}
              onToggle={() => onChange({ allergies: toggle(prefs.allergies, a) })}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3">Cuisine Preferences</p>
        <div className="flex flex-wrap gap-2">
          {CUISINE_OPTIONS.map((c) => (
            <PillToggle
              key={c}
              value={c}
              active={prefs.cuisines.includes(c)}
              onToggle={() => onChange({ cuisines: toggle(prefs.cuisines, c) })}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Section 4: App Preferences ─────────────────────────────── */
const MEAL_REMINDER_KEYS = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

function AppPrefsSection({
  prefs,
  onChange,
}: {
  prefs: UserPreferences;
  onChange: (p: Partial<UserPreferences>) => void;
}) {
  const { darkMode, toggleDarkMode } = useStore();

  const updateReminder = (
    meal: (typeof MEAL_REMINDER_KEYS)[number],
    key: 'enabled' | 'time',
    value: boolean | string
  ) => {
    onChange({
      reminders: {
        ...prefs.reminders,
        [meal]: { ...prefs.reminders[meal], [key]: value },
      },
    });
  };

  return (
    <motion.div variants={fadeUp} className="card space-y-5">
      <SectionTitle icon={Bell} title="App Preferences" />

      {/* Meal reminders */}
      <div>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3">Meal Reminders</p>
        <div className="space-y-3">
          {MEAL_REMINDER_KEYS.map((meal) => {
            const reminder = prefs.reminders[meal];
            return (
              <div key={meal} className="flex items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={reminder.enabled}
                  onClick={() => updateReminder(meal, 'enabled', !reminder.enabled)}
                  className={`relative w-10 h-5 rounded-full transition-colors duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-green-primary flex-shrink-0 ${
                    reminder.enabled ? 'bg-green-primary' : 'bg-gray-200 dark:bg-zinc-700'
                  }`}
                  aria-label={`${meal} reminder`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${
                      reminder.enabled ? 'left-5' : 'left-0.5'
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-700 dark:text-gray-300 capitalize w-20">{meal}</span>
                {reminder.enabled && (
                  <input
                    type="time"
                    value={reminder.time}
                    onChange={(e) => updateReminder(meal, 'time', e.target.value)}
                    className="h-8 px-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-primary/30"
                    aria-label={`${meal} reminder time`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Units + Dark mode + Weekly report */}
      <div className="space-y-4 pt-2 border-t border-gray-100 dark:border-zinc-800">
        {/* Units toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">Units</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Metric or Imperial</p>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-800 rounded-xl p-1">
            {(['metric', 'imperial'] as const).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => onChange({ units: u })}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                  prefs.units === u
                    ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
                aria-pressed={prefs.units === u}
              >
                {u === 'metric' ? 'Metric' : 'Imperial'}
              </button>
            ))}
          </div>
        </div>

        {/* Dark mode */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">Dark Mode</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Synced with app theme</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={darkMode}
            onClick={toggleDarkMode}
            className={`relative w-10 h-5 rounded-full transition-colors duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-green-primary ${
              darkMode ? 'bg-green-primary' : 'bg-gray-200 dark:bg-zinc-700'
            }`}
            aria-label="Toggle dark mode"
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${
                darkMode ? 'left-5' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        {/* Weekly report */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">Weekly Report Email</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Get your nutrition summary every Monday</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={prefs.weeklyReport}
            onClick={() => onChange({ weeklyReport: !prefs.weeklyReport })}
            className={`relative w-10 h-5 rounded-full transition-colors duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-green-primary ${
              prefs.weeklyReport ? 'bg-green-primary' : 'bg-gray-200 dark:bg-zinc-700'
            }`}
            aria-label="Toggle weekly report email"
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${
                prefs.weeklyReport ? 'left-5' : 'left-0.5'
              }`}
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main Preferences page ───────────────────────────────────── */
export default function Preferences() {
  const { preferences, savePreferences } = usePreferencesStore();
  const user = useAuthStore((s) => s.user);
  const [local, setLocal] = useState<UserPreferences>(preferences);
  const [saving, setSaving] = useState(false);

  const handleChange = (patch: Partial<UserPreferences>) => {
    setLocal((prev) => ({ ...prev, ...patch }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await savePreferences({ ...local, onboardingComplete: true });
      toast.success('Preferences saved!');
    } catch {
      toast.error('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-6 pb-24 md:pb-8">
      <motion.div variants={fadeUp}>
        <h1 className="font-serif text-3xl text-gray-900 dark:text-white">Preferences</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
          Personalise Nutri to match your health journey.
        </p>
      </motion.div>

      <PersonalInfoSection
        prefs={local}
        email={user?.email ?? ''}
        picture={user?.picture ?? ''}
        onChange={handleChange}
      />

      <HealthGoalsSection prefs={local} onChange={handleChange} />

      <DietarySection prefs={local} onChange={handleChange} />

      <AppPrefsSection prefs={local} onChange={handleChange} />

      {/* Save bar — sticky on mobile */}
      <motion.div
        variants={fadeUp}
        className="fixed bottom-0 left-0 right-0 md:static md:bottom-auto bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 md:border-0 md:bg-transparent md:dark:bg-transparent px-4 py-3 md:p-0 z-20"
      >
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saving}
          className="btn-primary w-full md:w-auto flex items-center justify-center gap-2 px-8 disabled:opacity-70 disabled:cursor-not-allowed"
          aria-label="Save preferences"
        >
          {saving ? (
            <>
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="10" strokeLinecap="round" />
              </svg>
              Saving…
            </>
          ) : (
            <>
              {preferences.onboardingComplete ? <Save size={14} aria-hidden="true" /> : <Check size={14} aria-hidden="true" />}
              {preferences.onboardingComplete ? 'Save Preferences' : 'Complete Setup'}
            </>
          )}
        </button>
      </motion.div>
    </motion.div>
  );
}
