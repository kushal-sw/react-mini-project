import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCommunityStore = create(
  persist(
    (set) => ({
      recipes: [],
      addRecipe: (recipe) =>
        set((state) => ({
          recipes: [recipe, ...state.recipes],
        })),
      removeRecipe: (id) =>
        set((state) => ({
          recipes: state.recipes.filter((r) => r.id !== id),
        })),
    }),
    {
      name: "recipe-community",
    }
  )
);
