import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PrimaryGoal =
  | 'lose-weight'
  | 'maintain'
  | 'gain-muscle'
  | 'improve-energy'
  | 'eat-healthier';

export type ActivityLevel = 1 | 2 | 3 | 4 | 5;

export type DietType =
  | 'omnivore'
  | 'vegetarian'
  | 'vegan'
  | 'keto'
  | 'paleo'
  | 'gluten-free'
  | 'dairy-free'
  | 'halal'
  | 'kosher';

export type Allergy = 'nuts' | 'shellfish' | 'eggs' | 'soy' | 'wheat' | 'fish' | 'dairy';

export type CuisinePreference =
  | 'indian'
  | 'mediterranean'
  | 'asian'
  | 'american'
  | 'mexican'
  | 'italian'
  | 'middle-eastern';

export interface MealReminder {
  enabled: boolean;
  time: string;
}

export interface UserPreferences {
  displayName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
  primaryGoal: PrimaryGoal;
  activityLevel: ActivityLevel;
  calorieTarget: number;
  proteinTarget: number;
  carbTarget: number;
  fatTarget: number;
  dietTypes: DietType[];
  allergies: Allergy[];
  cuisines: CuisinePreference[];
  reminders: {
    breakfast: MealReminder;
    lunch: MealReminder;
    dinner: MealReminder;
    snack: MealReminder;
  };
  units: 'metric' | 'imperial';
  weeklyReport: boolean;
  onboardingComplete: boolean;
}

const defaultPreferences: UserPreferences = {
  displayName: '',
  dateOfBirth: '',
  gender: 'prefer-not-to-say',
  primaryGoal: 'eat-healthier',
  activityLevel: 2,
  calorieTarget: 2000,
  proteinTarget: 150,
  carbTarget: 250,
  fatTarget: 65,
  dietTypes: ['omnivore'],
  allergies: [],
  cuisines: [],
  reminders: {
    breakfast: { enabled: false, time: '08:00' },
    lunch: { enabled: false, time: '12:30' },
    dinner: { enabled: false, time: '19:00' },
    snack: { enabled: false, time: '15:30' },
  },
  units: 'metric',
  weeklyReport: false,
  onboardingComplete: false,
};

interface PreferencesState {
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  savePreferences: (prefs: UserPreferences) => Promise<void>;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      preferences: defaultPreferences,
      updatePreferences: (prefs) =>
        set((s) => ({ preferences: { ...s.preferences, ...prefs } })),
      savePreferences: async (prefs) => {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        set({ preferences: prefs });
      },
    }),
    { name: 'nutri-preferences-storage' }
  )
);

/** Auto-calculate macro targets based on goal + activity */
export function calcTargets(
  goal: PrimaryGoal,
  activity: ActivityLevel
): Pick<UserPreferences, 'calorieTarget' | 'proteinTarget' | 'carbTarget' | 'fatTarget'> {
  const activityMultiplier = [1.2, 1.375, 1.55, 1.725, 1.9][activity - 1];
  const baseCal = 1800;
  const calories = Math.round(baseCal * activityMultiplier);

  const adjusted =
    goal === 'lose-weight'
      ? calories - 300
      : goal === 'gain-muscle'
      ? calories + 250
      : calories;

  return {
    calorieTarget: adjusted,
    proteinTarget: goal === 'gain-muscle' ? 180 : 150,
    carbTarget: Math.round((adjusted * 0.45) / 4),
    fatTarget: Math.round((adjusted * 0.3) / 9),
  };
}
