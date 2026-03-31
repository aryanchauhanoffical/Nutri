export interface MealEntry {
  id: string;
  name: string;
  emoji: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portionSize: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  category: 'proteins' | 'carbs' | 'vegetables' | 'dairy' | 'snacks';
  quantity: string;
  checked: boolean;
  nutrition: string;
}

export interface HabitEntry {
  id: string;
  name: string;
  icon: string;
  target: string;
  currentStreak: number;
  bestStreak: number;
  completedDays: boolean[];
  progress: number;
  unit?: string;
}

export interface MealRecommendation {
  id: string;
  name: string;
  emoji: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  matchScore: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  cuisine: string;
  goal: 'weight-loss' | 'muscle-gain' | 'balance';
  rationale: string;
  tags: string[];
}

export interface DailyStats {
  calories: { current: number; target: number };
  protein: { current: number; target: number };
  hydration: { current: number; target: number };
}

export interface FoodItem {
  id: string;
  name: string;
  emoji: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
}
