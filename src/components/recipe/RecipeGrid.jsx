import RecipeCard from "./RecipeCard";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchX, AlertTriangle } from "lucide-react";

/**
 * RecipeGrid — renders a responsive grid of RecipeCard components
 * with loading, empty, and error states.
 *
 * @param {{ recipes: Array, isLoading?: boolean, isError?: boolean, error?: any, showRemoveButton?: boolean }} props
 */
export default function RecipeGrid({ recipes = [], isLoading, isError, error, showRemoveButton = false }) {
  // Loading state — 6 skeleton cards
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-lg border bg-card shadow-sm">
            <Skeleton className="aspect-[16/10] w-full rounded-none" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-1.5">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Something went wrong</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            {error?.message || "Please try again later."}
          </p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!recipes || recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <SearchX className="h-8 w-8 text-muted-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">No recipes found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Try a different search term or adjust your filters.
          </p>
        </div>
      </div>
    );
  }

  // Results grid
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} showRemoveButton={showRemoveButton} />
      ))}
    </div>
  );
}
