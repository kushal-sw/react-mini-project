import { useQuery } from "@tanstack/react-query";
import { getRecipeById } from "@/services/spoonacular";

/**
 * TanStack Query hook for fetching a single recipe with full details + nutrition.
 * Uses a 10-minute stale time since recipe data rarely changes.
 *
 * @param {number|string} id - Spoonacular recipe ID
 * @returns {{ data: any, isLoading: boolean, isError: boolean, error: any }}
 */
export function useRecipeDetail(id) {
  return useQuery({
    queryKey: ["recipe", "detail", id],
    queryFn: () => getRecipeById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
