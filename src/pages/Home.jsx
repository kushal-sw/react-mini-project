import { useState, useCallback } from "react";
import SearchBar from "@/components/search/SearchBar";
import DietaryFilter from "@/components/search/DietaryFilter";
import RecipeGrid from "@/components/recipe/RecipeGrid";
import { useRecipeSearch } from "@/hooks/useRecipeSearch";
import { useFilterStore } from "@/store/filterStore";
import { Sparkles } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("popular");
  const [searchMode, setSearchMode] = useState("dish");
  const activeDiets = useFilterStore((s) => s.activeDiets);

  const { data, isLoading, isError, error } = useRecipeSearch({
    query: searchQuery,
    mode: searchMode,
    diets: activeDiets,
  });

  const handleSearch = useCallback((query, mode) => {
    setSearchQuery(query);
    setSearchMode(mode);
  }, []);

  // Normalise results — complexSearch returns { results: [...] },
  // while findByIngredients returns a flat array
  const recipes =
    searchMode === "ingredient"
      ? data || []
      : data?.results || [];

  const isDefaultSearch = searchQuery === "popular";

  return (
    <PageWrapper>
      <div className="space-y-8">
        {/* Hero / Header */}
        <div className="text-center space-y-3 pt-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Discover <span className="text-primary">Delicious</span> Recipes
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Search by dish name or ingredients you have on hand. Find your next
            favourite meal.
          </p>
        </div>

        {/* Search */}
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

        {/* Dietary Filters */}
        <DietaryFilter />

        {/* Results heading */}
        {!isLoading && recipes.length > 0 && (
          <div className="flex items-center gap-2 pt-2">
            {isDefaultSearch ? (
              <>
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Popular Recipes</h2>
              </>
            ) : (
              <h2 className="text-xl font-semibold">
                Search Results
                <span className="text-muted-foreground font-normal ml-2 text-base">
                  ({recipes.length} recipe{recipes.length !== 1 ? "s" : ""})
                </span>
              </h2>
            )}
          </div>
        )}

        {/* Recipe Grid */}
        <RecipeGrid
          recipes={recipes}
          isLoading={isLoading}
          isError={isError}
          error={error}
        />
      </div>
    </PageWrapper>
  );
}
