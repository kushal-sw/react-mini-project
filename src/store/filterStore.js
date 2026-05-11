import { create } from "zustand";

export const useFilterStore = create((set, get) => ({
  activeDiets: [],

  toggleDiet: (diet) =>
    set((state) => ({
      activeDiets: state.activeDiets.includes(diet)
        ? state.activeDiets.filter((d) => d !== diet)
        : [...state.activeDiets, diet],
    })),

  clearFilters: () => set({ activeDiets: [] }),

  isActive: (diet) => get().activeDiets.includes(diet),
}));
