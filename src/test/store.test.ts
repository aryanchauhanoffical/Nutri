/// <reference types="vitest/globals" />

import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../store/useStore';
import { seedMeals, seedGroceries } from '../data/seed';

// Reset store state before each test
beforeEach(() => {
    useStore.setState({
        darkMode: false,
        sidebarCollapsed: false,
        meals: [...seedMeals],
        groceries: [...seedGroceries],
    });
});

describe('useStore — meal operations', () => {
    it('initializes with seed meals', () => {
        const { meals } = useStore.getState();
        expect(meals).toHaveLength(seedMeals.length);
        expect(meals[0].name).toBe('Greek Yogurt & Berries');
    });

    it('adds a new meal', () => {
        const { addMeal, meals } = useStore.getState();
        const before = meals.length;
        addMeal({
            id: 'test-1',
            name: 'Test Meal',
            emoji: '🥑',
            mealType: 'lunch',
            time: '12:00',
            calories: 400,
            protein: 30,
            carbs: 40,
            fat: 12,
            portionSize: '1 portion',
        });
        expect(useStore.getState().meals).toHaveLength(before + 1);
        expect(useStore.getState().meals.find((m) => m.id === 'test-1')).toBeTruthy();
    });

    it('updates an existing meal', () => {
        const { updateMeal } = useStore.getState();
        updateMeal('1', { name: 'Updated Yogurt', calories: 250 });
        const updated = useStore.getState().meals.find((m) => m.id === '1');
        expect(updated?.name).toBe('Updated Yogurt');
        expect(updated?.calories).toBe(250);
    });

    it('deletes a meal by id', () => {
        const { deleteMeal } = useStore.getState();
        deleteMeal('1');
        const meals = useStore.getState().meals;
        expect(meals.find((m) => m.id === '1')).toBeUndefined();
        expect(meals).toHaveLength(seedMeals.length - 1);
    });
});

describe('useStore — grocery operations', () => {
    it('initializes with seed groceries', () => {
        const { groceries } = useStore.getState();
        expect(groceries).toHaveLength(seedGroceries.length);
    });

    it('toggles grocery checked state', () => {
        const initialState = useStore.getState().groceries.find((g) => g.id === 'g1')?.checked;
        useStore.getState().toggleGrocery('g1');
        const toggled = useStore.getState().groceries.find((g) => g.id === 'g1')?.checked;
        expect(toggled).toBe(!initialState);
    });

    it('sets groceries to a new list', () => {
        useStore.getState().setGroceries([
            { id: 'new-1', name: 'Bananas', category: 'carbs', quantity: '1 bunch', checked: false, nutrition: '89 kcal' },
        ]);
        expect(useStore.getState().groceries).toHaveLength(1);
        expect(useStore.getState().groceries[0].name).toBe('Bananas');
    });
});

describe('useStore — getDailyStats', () => {
    it('calculates calorie total from meals', () => {
        const stats = useStore.getState().getDailyStats();
        const expected = seedMeals.reduce((s, m) => s + m.calories, 0);
        expect(stats.calories.current).toBe(expected);
        expect(stats.calories.target).toBe(2000);
    });

    it('calculates protein total from meals', () => {
        const stats = useStore.getState().getDailyStats();
        const expected = seedMeals.reduce((s, m) => s + m.protein, 0);
        expect(stats.protein.current).toBe(expected);
        expect(stats.protein.target).toBe(150);
    });

    it('returns fixed hydration value', () => {
        const stats = useStore.getState().getDailyStats();
        expect(stats.hydration.current).toBe(1500);
        expect(stats.hydration.target).toBe(2500);
    });
});

describe('useStore — dark mode', () => {
    it('initializes with dark mode off', () => {
        expect(useStore.getState().darkMode).toBe(false);
    });

    it('toggles dark mode', () => {
        useStore.getState().toggleDarkMode();
        expect(useStore.getState().darkMode).toBe(true);
        useStore.getState().toggleDarkMode();
        expect(useStore.getState().darkMode).toBe(false);
    });
});
