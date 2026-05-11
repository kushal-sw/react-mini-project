import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useFavouritesStore = create(
  persist(
    (set, get) => ({
      favourites: [],

      addFavourite: (recipe) =>
        set((state) => ({
          favourites: [
            ...state.favourites,
            {
              id: recipe.id,
              title: recipe.title,
              image: recipe.image,
              readyInMinutes: recipe.readyInMinutes,
            },
          ],
        })),

      removeFavourite: (id) =>
        set((state) => ({
          favourites: state.favourites.filter((r) => r.id !== id),
        })),

      isFavourite: (id) => get().favourites.some((r) => r.id === id),
    }),
    {
      name: "recipe-favourites",
    }
  )
);
