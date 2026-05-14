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
        <Button
          type="button"
          variant={mode === "dish" ? "default" : "ghost"}
          size="sm"
          onClick={() => setMode("dish")}
          className="gap-2 transition-all duration-200"
        >
          <UtensilsCrossed className="h-4 w-4" />
          Search by Dish
        </Button>
        <Button
          type="button"
          variant={mode === "ingredient" ? "default" : "ghost"}
          size="sm"
          onClick={() => setMode("ingredient")}
          className="gap-2 transition-all duration-200"
        >
          <Carrot className="h-4 w-4" />
          Search by Ingredient
        </Button>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
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
            className="pl-12 h-14 text-base rounded-2xl border border-white/20 bg-white/10 text-white placeholder:text-white/40 focus-visible:border-purple-400/60 focus-visible:ring-purple-400/20 backdrop-blur-sm"
          />
        </div>
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
