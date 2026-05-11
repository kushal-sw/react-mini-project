import { useQuery } from "@tanstack/react-query";
import { searchByIngredients } from "@/services/spoonacular";

/**
 * TanStack Query hook for searching recipes by ingredients.
 * Uses a 5-minute stale time to conserve API quota.
 *
 * @param {string} ingredients - Comma-separated ingredient list
 * @returns TanStack Query result object
 */
export function useIngredientSearch(ingredients) {
  return useQuery({
    queryKey: ["recipes", "byIngredients", ingredients],
    queryFn: () => searchByIngredients(ingredients),
    enabled: !!ingredients && ingredients.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
