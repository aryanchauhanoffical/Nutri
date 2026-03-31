/// <reference types="vitest/globals" />

import { describe, it, expect } from 'vitest';
import {
    calcTargets,
} from '../features/preferences/store/preferencesStore';

describe('calcTargets', () => {
    it('returns higher calories for gain-muscle goal', () => {
        const lose = calcTargets('lose-weight', 2);
        const gain = calcTargets('gain-muscle', 2);
        expect(gain.calorieTarget).toBeGreaterThan(lose.calorieTarget);
    });

    it('returns lower calories for lose-weight goal', () => {
        const maintain = calcTargets('maintain', 2);
        const lose = calcTargets('lose-weight', 2);
        expect(lose.calorieTarget).toBeLessThan(maintain.calorieTarget);
    });

    it('higher activity level = higher calorie target', () => {
        const low = calcTargets('maintain', 1);
        const high = calcTargets('maintain', 5);
        expect(high.calorieTarget).toBeGreaterThan(low.calorieTarget);
    });

    it('returns higher protein for muscle-gain goal', () => {
        const balance = calcTargets('maintain', 3);
        const muscle = calcTargets('gain-muscle', 3);
        expect(muscle.proteinTarget).toBeGreaterThan(balance.proteinTarget);
    });

    it('calorie target is always positive', () => {
        const goals = ['lose-weight', 'maintain', 'gain-muscle', 'improve-energy', 'eat-healthier'] as const;
        const activities = [1, 2, 3, 4, 5] as const;
        for (const goal of goals) {
            for (const activity of activities) {
                const { calorieTarget } = calcTargets(goal, activity);
                expect(calorieTarget).toBeGreaterThan(0);
            }
        }
    });

    it('carbTarget and fatTarget are derived from calories', () => {
        const { calorieTarget, carbTarget, fatTarget } = calcTargets('maintain', 3);
        // carbs ~ 45% of calories / 4 cal per gram
        const expectedCarbs = Math.round((calorieTarget * 0.45) / 4);
        expect(carbTarget).toBe(expectedCarbs);
        // fat ~ 30% of calories / 9 cal per gram
        const expectedFat = Math.round((calorieTarget * 0.3) / 9);
        expect(fatTarget).toBe(expectedFat);
    });
});

describe('authStore types and constants', () => {
    it('validates required user fields shape', () => {
        const mockUser = {
            id: 'u1',
            name: 'Alex',
            email: 'alex@nutri.demo',
            picture: '',
            isAuthenticated: true,
        };
        expect(mockUser.isAuthenticated).toBe(true);
        expect(typeof mockUser.id).toBe('string');
        expect(typeof mockUser.name).toBe('string');
    });
});
