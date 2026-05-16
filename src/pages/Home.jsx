import { useState, useCallback } from "react";
import SearchBar from "@/components/recipe/SearchBar";
import DietaryFilter from "@/components/recipe/DietaryFilter";
import RecipeGrid from "@/components/recipe/RecipeGrid";
import { useRecipeSearch } from "@/hooks/useRecipeSearch";
import { useFilterStore } from "@/store/filterStore";
import { Sparkles } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";

import BlurText from "@/components/ui/blur-text";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState("dish");
  const [hasSearched, setHasSearched] = useState(false);
  const activeDiets = useFilterStore((s) => s.activeDiets);

  const { data, isLoading, isError, error } = useRecipeSearch({
    query: searchQuery || undefined,
    mode: searchMode,
    diets: activeDiets,
  });

  const handleSearch = useCallback((query, mode) => {
    setSearchQuery(query);
    setSearchMode(mode);
    setHasSearched(true);
  }, []);

  // Normalise results — complexSearch returns { results: [...] },
  // while findByIngredients returns a flat array
  const recipes =
    searchMode === "ingredient"
      ? data || []
      : data?.results || [];

  return (
    <PageWrapper>
      <div className="space-y-8">
        {/* Hero / Header */}
        <div className="text-center space-y-3 pt-4">
          <BlurText
            text="What are you craving today?"
            delay={300}
            animateBy="words"
            direction="top"
            className="text-4xl font-bold tracking-tight justify-center text-white"
          />
          <p className="text-white/60 text-lg max-w-lg mx-auto mt-2">
            Search 10,000+ recipes. Add to your weekly plan instantly.
          </p>
        </div>

        {/* Search */}
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

        {/* Dietary Filters */}
        <DietaryFilter />

        {/* Results — only show after user searches */}
        {hasSearched && (
          <>
            {!isLoading && recipes.length > 0 && (
              <div className="flex items-center gap-2 pt-2">
                <h2 className="text-xl font-semibold text-white">
                  Search Results
                  <span className="text-white/50 font-normal ml-2 text-base">
                    ({recipes.length} recipe{recipes.length !== 1 ? "s" : ""})
                  </span>
                </h2>
              </div>
            )}

            <RecipeGrid
              recipes={recipes}
              isLoading={isLoading}
              isError={isError}
              error={error}
            />
          </>
        )}
      </div>
    </PageWrapper>
  );
}
