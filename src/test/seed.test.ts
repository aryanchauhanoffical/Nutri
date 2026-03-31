/// <reference types="vitest/globals" />

import { describe, it, expect } from 'vitest';
import {
    seedMeals,
    seedGroceries,
    seedHabits,
    seedRecommendations,
    foodDatabase,
    aiTips,
    weeklyCalories,
} from '../data/seed';

describe('seedMeals', () => {
    it('has 5 meal entries', () => {
        expect(seedMeals).toHaveLength(5);
    });

    it('all meals have required fields', () => {
        for (const meal of seedMeals) {
            expect(meal.id).toBeTruthy();
            expect(meal.name).toBeTruthy();
            expect(meal.emoji).toBeTruthy();
            expect(['breakfast', 'lunch', 'dinner', 'snack']).toContain(meal.mealType);
            expect(meal.calories).toBeGreaterThan(0);
            expect(meal.protein).toBeGreaterThanOrEqual(0);
            expect(meal.carbs).toBeGreaterThanOrEqual(0);
            expect(meal.fat).toBeGreaterThanOrEqual(0);
        }
    });

    it('covers multiple meal types', () => {
        const types = new Set(seedMeals.map((m) => m.mealType));
        expect(types.has('breakfast')).toBe(true);
        expect(types.has('lunch')).toBe(true);
        expect(types.has('snack')).toBe(true);
    });

    it('total calories is within realistic range', () => {
        const total = seedMeals.reduce((s, m) => s + m.calories, 0);
        expect(total).toBeGreaterThan(500);
        expect(total).toBeLessThan(5000);
    });
});

describe('seedGroceries', () => {
    it('has 6 grocery items', () => {
        expect(seedGroceries).toHaveLength(6);
    });

    it('exactly 2 items are checked', () => {
        const checked = seedGroceries.filter((g) => g.checked);
        expect(checked).toHaveLength(2);
    });

    it('all valid categories', () => {
        const validCategories = ['proteins', 'carbs', 'vegetables', 'dairy', 'snacks'];
        for (const item of seedGroceries) {
            expect(validCategories).toContain(item.category);
        }
    });

    it('all items have quantity and nutrition', () => {
        for (const item of seedGroceries) {
            expect(item.quantity).toBeTruthy();
            expect(item.nutrition).toBeTruthy();
        }
    });
});

describe('seedHabits', () => {
    it('has 4 habit entries', () => {
        expect(seedHabits).toHaveLength(4);
    });

    it('first habit has 14-day streak', () => {
        const h1 = seedHabits.find((h) => h.id === 'h1');
        expect(h1?.currentStreak).toBe(14);
        expect(h1?.completedDays.every(Boolean)).toBe(true);
    });

    it('all habits have icons and targets', () => {
        for (const habit of seedHabits) {
            expect(habit.icon).toBeTruthy();
            expect(habit.target).toBeTruthy();
            expect(habit.progress).toBeGreaterThanOrEqual(0);
            expect(habit.progress).toBeLessThanOrEqual(100);
        }
    });
});

describe('seedRecommendations', () => {
    it('has 6 recommendation cards', () => {
        expect(seedRecommendations).toHaveLength(6);
    });

    it('all have matchScore between 0 and 100', () => {
        for (const rec of seedRecommendations) {
            expect(rec.matchScore).toBeGreaterThan(0);
            expect(rec.matchScore).toBeLessThanOrEqual(100);
        }
    });

    it('all have tags array', () => {
        for (const rec of seedRecommendations) {
            expect(Array.isArray(rec.tags)).toBe(true);
            expect(rec.tags.length).toBeGreaterThan(0);
        }
    });

    it('covers all goal types', () => {
        const goals = new Set(seedRecommendations.map((r) => r.goal));
        expect(goals.has('weight-loss')).toBe(true);
        expect(goals.has('muscle-gain')).toBe(true);
        expect(goals.has('balance')).toBe(true);
    });
});

describe('foodDatabase', () => {
    it('has at least 15 food items', () => {
        expect(foodDatabase.length).toBeGreaterThanOrEqual(15);
    });

    it('all items have positive calories', () => {
        for (const food of foodDatabase) {
            expect(food.calories).toBeGreaterThan(0);
        }
    });
});

describe('aiTips', () => {
    it('has exactly 3 tips', () => {
        expect(aiTips).toHaveLength(3);
    });

    it('all tips have title, body, and cta', () => {
        for (const tip of aiTips) {
            expect(tip.title).toBeTruthy();
            expect(tip.body).toBeTruthy();
            expect(tip.cta).toBeTruthy();
        }
    });
});

describe('weeklyCalories', () => {
    it('has 7 days', () => {
        expect(weeklyCalories).toHaveLength(7);
    });

    it('all days have positive calorie values', () => {
        for (const day of weeklyCalories) {
            expect(day.calories).toBeGreaterThan(0);
        }
    });
});
