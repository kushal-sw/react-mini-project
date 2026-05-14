import { useFilterStore } from "@/store/filterStore";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
            <Button
              key={diet.id}
              variant={active ? "default" : "outline"}
              size="sm"
              onClick={() => toggleDiet(diet.id)}
              style={{
                backgroundColor: active ? "rgba(168,85,247,0.5)" : "rgba(255,255,255,0.08)",
                border: active ? "1px solid rgba(168,85,247,0.7)" : "1px solid rgba(255,255,255,0.2)",
                color: "white",
              }}
              className={cn(
                "rounded-full transition-all duration-200",
                active ? "shadow-lg shadow-purple-500/20 scale-105 ring-1 ring-purple-400/50" : "hover:scale-105 hover:bg-white/15"
              )}
            >
              <span className="mr-1.5">{diet.emoji}</span>
              {diet.label}
            </Button>
          );
        })}
      </div>

      {/* Clear Filters Button */}
      {activeDiets.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mt-1 h-8 gap-1"
        >
          <X className="h-3.5 w-3.5" />
          Clear all filters
        </Button>
      )}
    </div>
  );
}
