import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useRecipeDetail } from "@/hooks/useRecipeDetail";
import { useFavouritesStore } from "@/store/favouritesStore";
import NutritionPanel from "@/components/recipe/NutritionPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import PageWrapper from "@/components/layout/PageWrapper";
import { toast } from "sonner";
import {
  Heart,
  Clock,
  Users,
  ChefHat,
  ArrowLeft,
  Gauge,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function RecipeDetail() {
  const { id } = useParams();
  const { data: recipe, isLoading, isError, error } = useRecipeDetail(id);
  const { isFavourite, addFavourite, removeFavourite } = useFavouritesStore();

  const [servings, setServings] = useState(null); // null = use recipe default

  // Wait until recipe loads to set default servings
  const currentServings = servings ?? recipe?.servings ?? 1;
  const originalServings = recipe?.servings ?? 1;
  const scaleFactor = currentServings / originalServings;

  const favourited = recipe ? isFavourite(recipe.id) : false;

  const handleFavourite = () => {
    if (!recipe) return;
    if (favourited) {
      removeFavourite(recipe.id);
      toast("💔 Removed from favourites");
    } else {
      addFavourite(recipe);
      toast("❤️ Added to favourites");
    }
  };

  // Difficulty heuristic from spoonacularScore (0-100)
  const getDifficulty = (score) => {
    if (!score) return { label: "Medium", color: "text-amber-600 bg-amber-50" };
    if (score >= 80) return { label: "Easy", color: "text-green-600 bg-green-50" };
    if (score >= 50) return { label: "Medium", color: "text-amber-600 bg-amber-50" };
    return { label: "Hard", color: "text-red-600 bg-red-50" };
  };

  // Loading state
  if (isLoading) {
    return (
      <PageWrapper>
      <div className="space-y-6">
        <Skeleton className="h-5 w-40" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="aspect-[16/10] w-full rounded-xl" />
            <Skeleton className="h-8 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
      </PageWrapper>
    );
  }

  // Error state
  if (isError) {
    return (
      <PageWrapper>
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
          <ChefHat className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold">Failed to load recipe</h2>
        <p className="text-muted-foreground">{error?.message || "Something went wrong."}</p>
        <Button asChild variant="outline">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>
      </PageWrapper>
    );
  }

  if (!recipe) return null;

  const difficulty = getDifficulty(recipe.spoonacularScore);

  // Parse instructions from analyzedInstructions
  const steps =
    recipe.analyzedInstructions?.[0]?.steps || [];

  return (
    <PageWrapper>
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link
          to="/"
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium truncate max-w-xs">
          {recipe.title}
        </span>
      </nav>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column — Image + Info (3/5 width) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Image */}
          <div className="relative overflow-hidden rounded-2xl shadow-lg">
            <img
              src={recipe.image}
              alt={recipe.title}
              loading="lazy"
              className="w-full aspect-[16/10] object-cover"
            />
            {/* Favourite button */}
            <button
              onClick={handleFavourite}
              aria-label={favourited ? "Remove from favourites" : "Add to favourites"}
              className={cn(
                "absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-all duration-200",
                favourited
                  ? "bg-red-500 text-white scale-110"
                  : "bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500 backdrop-blur-sm"
              )}
            >
              <Heart className={cn("h-5 w-5", favourited && "fill-current")} />
            </button>
          </div>

          {/* Title + Meta */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">{recipe.title}</h1>

            {/* Meta badges */}
            <div className="flex flex-wrap items-center gap-3">
              {recipe.readyInMinutes && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {recipe.readyInMinutes} min
                </div>
              )}
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                {originalServings} servings
              </div>
              <div className={cn("flex items-center gap-1.5 text-sm font-medium px-2.5 py-0.5 rounded-full", difficulty.color)}>
                <Gauge className="h-3.5 w-3.5" />
                {difficulty.label}
              </div>
            </div>

            {/* Diet tags */}
            {recipe.diets && recipe.diets.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {recipe.diets.map((diet) => (
                  <Badge key={diet} variant="secondary" className="capitalize">
                    {diet}
                  </Badge>
                ))}
              </div>
            )}

            {/* Summary */}
            {recipe.summary && (
              <div
                className="text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none [&_a]:text-primary [&_a]:no-underline [&_b]:text-foreground"
                dangerouslySetInnerHTML={{ __html: recipe.summary }}
              />
            )}
          </div>

          {/* Instructions */}
          {steps.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-primary" />
                Instructions
              </h2>
              <ol className="space-y-4">
                {steps.map((step) => (
                  <li key={step.number} className="flex gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      {step.number}
                    </span>
                    <p className="text-sm leading-relaxed pt-0.5">
                      {step.step}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Right Column — Ingredients + Nutrition (2/5 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Serving size adjuster */}
          <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-4">
            <label
              htmlFor="servings-input"
              className="text-sm font-semibold text-foreground flex items-center gap-2"
            >
              <Users className="h-4 w-4 text-primary" />
              Adjust Servings
            </label>
            <div className="flex items-center gap-3 mt-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => setServings(Math.max(1, currentServings - 1))}
                disabled={currentServings <= 1}
              >
                −
              </Button>
              <Input
                id="servings-input"
                type="number"
                min={1}
                max={20}
                value={currentServings}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (val >= 1 && val <= 20) setServings(val);
                }}
                className="w-16 text-center font-semibold"
              />
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => setServings(Math.min(20, currentServings + 1))}
                disabled={currentServings >= 20}
              >
                +
              </Button>
              <span className="text-sm text-muted-foreground">
                serving{currentServings !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Ingredients */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Ingredients</h2>
            {recipe.extendedIngredients && recipe.extendedIngredients.length > 0 ? (
              <ul className="space-y-2">
                {recipe.extendedIngredients.map((ing, idx) => {
                  const scaledAmount = ing.amount
                    ? (ing.amount * scaleFactor).toFixed(
                        ing.amount * scaleFactor < 1 ? 2 : 1
                      )
                    : "";
                  // Remove trailing .0
                  const displayAmount = scaledAmount.replace(/\.0$/, "");

                  return (
                    <li
                      key={`${ing.id}-${idx}`}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                      <span className="text-sm">
                        {displayAmount && (
                          <span className="font-semibold tabular-nums">
                            {displayAmount}
                          </span>
                        )}{" "}
                        {ing.unit && (
                          <span className="text-muted-foreground">{ing.unit}</span>
                        )}{" "}
                        {ing.name}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No ingredients listed.
              </p>
            )}
          </div>

          {/* Nutrition Panel */}
          {recipe.nutrition && (
            <NutritionPanel
              nutrition={recipe.nutrition}
              originalServings={originalServings}
              currentServings={currentServings}
            />
          )}
        </div>
      </div>
    </div>
    </PageWrapper>
  );
}
