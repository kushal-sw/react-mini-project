import { create } from "zustand";
import { persist } from "zustand/middleware";

const emptyDay = { breakfast: null, lunch: null, dinner: null };

const emptyPlan = {
  monday: { ...emptyDay },
  tuesday: { ...emptyDay },
  wednesday: { ...emptyDay },
  thursday: { ...emptyDay },
  friday: { ...emptyDay },
  saturday: { ...emptyDay },
  sunday: { ...emptyDay },
};

export const useMealPlanStore = create(
  persist(
    (set) => ({
      plan: emptyPlan,
      addMeal: (day, slot, recipe) =>
        set((state) => ({
          plan: {
            ...state.plan,
            [day]: {
              ...state.plan[day],
              [slot]: recipe,
            },
          },
        })),
      removeMeal: (day, slot) =>
        set((state) => ({
          plan: {
            ...state.plan,
            [day]: {
              ...state.plan[day],
              [slot]: null,
            },
          },
        })),
      clearDay: (day) =>
        set((state) => ({
          plan: {
            ...state.plan,
            [day]: { breakfast: null, lunch: null, dinner: null },
          },
        })),
      clearAll: () => set({ plan: emptyPlan }),
    }),
    {
      name: "recipe-meal-plan",
    }
  )
);
