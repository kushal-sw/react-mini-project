import { useState } from "react";
import { Link } from "react-router-dom";
import { useShoppingStore } from "@/store/shoppingStore";
import { useMealPlanStore } from "@/store/mealPlanStore";
import { getRecipesBulk } from "@/services/spoonacular";
import { consolidateIngredients } from "@/utils/shoppingListHelpers";
import { toast } from "sonner";
import PageWrapper from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Printer, RefreshCw, Plus, ShoppingCart, ArrowRight, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ShoppingList() {
  const plan = useMealPlanStore((state) => state.plan);
  const {
    items,
    customItems,
    checkedIds,
    setItems,
    addCustomItem,
    removeItem,
    toggleCheck,
  } = useShoppingStore();

  const [isLoading, setIsLoading] = useState(false);
  const [customInput, setCustomInput] = useState("");

  const hasMeals = Object.values(plan).some((day) =>
    Object.values(day).some((meal) => meal !== null)
  );

  const hasItems = Object.values(items).some((arr) => arr.length > 0) || customItems.length > 0;

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      // Gather unique recipe IDs from plan
      const ids = new Set();
      Object.values(plan).forEach((day) => {
        Object.values(day).forEach((meal) => {
          if (meal && meal.id) ids.add(meal.id);
        });
      });

      if (ids.size === 0) {
        setIsLoading(false);
        return;
      }

      // Fetch full recipe details in bulk
      const fullRecipes = await getRecipesBulk(Array.from(ids));
      const detailsMap = {};
      fullRecipes.forEach((r) => {
        detailsMap[r.id] = r;
      });

      // Consolidate into grouped shopping list
      const grouped = consolidateIngredients(plan, detailsMap);
      setItems(grouped);
      toast.success("🛒 Shopping list generated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate shopping list. Please try again.");
    }
    setIsLoading(false);
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (customInput.trim()) {
      addCustomItem(customInput.trim());
      setCustomInput("");
    }
  };

  const renderItem = (item) => {
    const isChecked = checkedIds.includes(item.id);
    return (
      <div key={item.id} className="flex items-center gap-3 py-2 group">
        <Checkbox
          id={item.id}
          checked={isChecked}
          onCheckedChange={() => toggleCheck(item.id)}
          className="print:hidden" // Hide checkboxes in print mode if desired, or keep them to check off manually
        />
        <label
          htmlFor={item.id}
          className={cn(
            "flex-1 text-sm transition-all cursor-pointer",
            isChecked && "line-through text-muted-foreground print:no-underline print:text-black"
          )}
        >
          {item.amount && item.amount > 0 && (
            <span className="font-semibold mr-1">{Number(item.amount.toFixed(2))}</span>
          )}
          {item.unit && <span className="text-muted-foreground mr-1">{item.unit}</span>}
          {item.name}
        </label>
        <button
          onClick={() => removeItem(item.id)}
          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all print:hidden"
          aria-label="Remove item"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    );
  };

  if (!hasMeals && !hasItems) {
    return (
      <PageWrapper>
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
          <ShoppingCart className="h-10 w-10" />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Your list is empty</h2>
          <p className="text-muted-foreground max-w-md mx-auto text-lg">
            Start by adding meals to your weekly planner, then generate your custom shopping list.
          </p>
        </div>
        <Button asChild className="mt-4 rounded-full px-8" size="lg">
          <Link to="/planner">
            Go to Meal Planner
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
    <div className="max-w-3xl mx-auto py-6 space-y-8 print:py-0 print:space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shopping List</h1>
          <p className="text-muted-foreground">Generated from your weekly meal plan</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleGenerate}
            disabled={isLoading || !hasMeals}
            className="shadow-sm"
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            {items.Produce ? "Regenerate" : "Generate"}
          </Button>
          <Button onClick={() => window.print()} disabled={!hasItems} className="shadow-sm" aria-label="Print shopping list">
            <Printer className="h-4 w-4 mr-2" />
            Print List
          </Button>
        </div>
      </div>

      <div className="hidden print:block mb-6">
        <h1 className="text-3xl font-bold border-b pb-2">Weekly Shopping List</h1>
      </div>

      {/* Custom Item Form */}
      <form onSubmit={handleAddCustom} className="flex items-center gap-2 print:hidden bg-card p-2 rounded-xl shadow-sm border">
        <Input
          placeholder="Add a custom item (e.g., Paper Towels)..."
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
        />
        <Button type="submit" variant="secondary" size="sm" className="rounded-lg">
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </form>

      {/* List content */}
      {hasItems ? (
        <div className="bg-card border rounded-xl p-8 shadow-sm print:shadow-none print:border-none print:p-0">
          <div className="space-y-8">
            {Object.entries(items).map(([category, list]) => {
              if (!list || list.length === 0) return null;
              return (
                <div key={category} className="print:break-inside-avoid">
                  <h3 className="font-semibold text-lg mb-2 text-primary">{category}</h3>
                  <Separator className="mb-4" />
                  <div className="space-y-1">
                    {list.map(renderItem)}
                  </div>
                </div>
              );
            })}

            {customItems.length > 0 && (
              <div className="print:break-inside-avoid">
                <h3 className="font-semibold text-lg mb-2 text-primary">Custom Items</h3>
                <Separator className="mb-4" />
                <div className="space-y-1">
                  {customItems.map(renderItem)}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
    </PageWrapper>
  );
}
