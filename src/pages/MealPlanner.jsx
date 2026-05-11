import { toast } from "sonner";
import PageWrapper from "@/components/layout/PageWrapper";
import { useState } from "react";
import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";
import { useMealPlanStore } from "@/store/mealPlanStore";
import { useRecipeSearch } from "@/hooks/useRecipeSearch";
import SearchBar from "@/components/search/SearchBar";
import DraggableRecipeCard from "@/components/planner/DraggableRecipeCard";
import WeeklyCalendar from "@/components/planner/WeeklyCalendar";

export default function MealPlanner() {
  const [searchQuery, setSearchQuery] = useState("popular");
  const [searchMode, setSearchMode] = useState("dish");
  const [activeDragRecipe, setActiveDragRecipe] = useState(null);

  const { addMeal } = useMealPlanStore();

  const { data, isLoading } = useRecipeSearch({
    query: searchQuery,
    mode: searchMode,
    diets: [],
  });

  const recipes =
    searchMode === "ingredient" ? data || [] : data?.results || [];

  const handleDragStart = (event) => {
    const { active } = event;
    const recipe = recipes.find((r) => r.id === active.id);
    setActiveDragRecipe(recipe);
  };

  const handleDragEnd = (event) => {
    const { over } = event;
    if (over && activeDragRecipe) {
      const [day, slot] = over.id.split("-");
      addMeal(day, slot, activeDragRecipe);
      toast("🗓️ Added to meal plan");
    }
    setActiveDragRecipe(null);
  };

  return (
    <PageWrapper>
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)] min-h-[600px]">
          {/* Left: Search Sidebar (30%) */}
          <div className="w-full lg:w-[30%] bg-muted/20 rounded-xl p-5 flex flex-col border overflow-hidden shadow-sm">
            <div className="mb-5 space-y-4">
              <h2 className="text-xl font-bold tracking-tight">Find Recipes</h2>
              <SearchBar
                onSearch={(q, m) => {
                  setSearchQuery(q);
                  setSearchMode(m);
                }}
                isLoading={isLoading}
              />
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar pb-4">
              {isLoading ? (
                <p className="text-sm text-muted-foreground text-center py-8">Loading recipes...</p>
              ) : recipes.length > 0 ? (
                recipes.map((recipe) => (
                  <DraggableRecipeCard key={recipe.id} recipe={recipe} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No recipes found.</p>
              )}
            </div>
          </div>

          {/* Right: Weekly Calendar (70%) */}
          <div className="w-full lg:w-[70%] flex flex-col h-full overflow-hidden">
            <WeeklyCalendar />
          </div>
        </div>

        {/* Drag Overlay for smooth visuals */}
        <DragOverlay dropAnimation={null}>
          {activeDragRecipe ? (
            <DraggableRecipeCard recipe={activeDragRecipe} isOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>
    </PageWrapper>
  );
}
