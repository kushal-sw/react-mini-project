import { useFilterStore } from "@/store/filterStore";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const DIET_OPTIONS = [
  { id: "vegan", label: "Vegan", emoji: "🌱" },
  { id: "vegetarian", label: "Vegetarian", emoji: "🥗" },
  { id: "gluten-free", label: "Gluten-Free", emoji: "🌾" },
  { id: "dairy-free", label: "Dairy-Free", emoji: "🥛" },
  { id: "keto", label: "Keto", emoji: "🥑" },
  { id: "halal", label: "Halal", emoji: "☪️" },
];

export default function DietaryFilter() {
  const { activeDiets, toggleDiet, clearFilters, isActive } = useFilterStore();

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {/* Diet Toggle Buttons */}
      <div className="flex flex-wrap justify-center gap-2">
        {DIET_OPTIONS.map((diet) => {
          const active = isActive(diet.id);
          return (
            <button
              key={diet.id}
              onClick={() => toggleDiet(diet.id)}
              className={cn(
                "inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-200",
                active
                  ? "border-transparent bg-primary text-primary-foreground shadow-md scale-105"
                  : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105"
              )}
            >
              <span className="mr-1.5">{diet.emoji}</span>
              {diet.label}
            </button>
          );
        })}
      </div>

      {/* Clear Filters Button */}
      {activeDiets.length > 0 && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mt-1"
        >
          <X className="h-3.5 w-3.5" />
          Clear all filters
        </button>
      )}
    </div>
  );
}
