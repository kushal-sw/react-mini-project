import { useQuery } from "@tanstack/react-query";
import { searchRecipes, searchByIngredients } from "@/services/spoonacular";

/**
 * TanStack Query hook for searching recipes.
 * Supports two modes: "dish" (search by name) and "ingredient" (search by ingredients).
 * Uses a 5-minute stale time to conserve Spoonacular API quota.
 *
 * @param {{ query: string, mode: "dish" | "ingredient", diets: string[] }} params
 * @returns {{ data: any, isLoading: boolean, isError: boolean, error: any }}
 */
export function useRecipeSearch({ query = "", mode = "dish", diets = [] }) {
  return useQuery({
    queryKey: ["recipes", "search", mode, query, diets],
    queryFn: () => {
      if (mode === "ingredient") {
        return searchByIngredients(query);
      }
      return searchRecipes(query, diets);
    },
    enabled: !!query && query.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
