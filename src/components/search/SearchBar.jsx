import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UtensilsCrossed, Carrot } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * SearchBar with dual mode: "Search by Dish" and "Search by Ingredient".
 * On submit, calls onSearch(query, mode) passed from the parent.
 */
export default function SearchBar({ onSearch, isLoading = false }) {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("dish"); // "dish" | "ingredient"

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), mode);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Mode Toggle */}
      <div className="flex items-center justify-center gap-1 mb-4 p-1 rounded-lg bg-muted/60 w-fit mx-auto">
        <button
          type="button"
          onClick={() => setMode("dish")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
            mode === "dish"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <UtensilsCrossed className="h-4 w-4" />
          Search by Dish
        </button>
        <button
          type="button"
          onClick={() => setMode("ingredient")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
            mode === "ingredient"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Carrot className="h-4 w-4" />
          Search by Ingredient
        </button>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search-input"
            type="text"
            placeholder={
              mode === "dish"
                ? 'Search recipes... e.g. "pasta", "chicken curry"'
                : 'Enter ingredients... e.g. "chicken, garlic, lemon"'
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-12 text-base rounded-xl border-2 border-muted focus-visible:border-primary/50"
          />
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={!query.trim() || isLoading}
          className="h-12 px-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-shadow"
        >
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Search
            </>
          )}
        </Button>
      </form>

      {/* Helper text */}
      <p className="text-center text-xs text-muted-foreground mt-2">
        {mode === "dish"
          ? "Search by recipe name or cuisine type"
          : "Separate multiple ingredients with commas"}
      </p>
    </div>
  );
}
