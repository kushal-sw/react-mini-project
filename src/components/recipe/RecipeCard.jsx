import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Clock, ChefHat, X } from "lucide-react";
import { useFavouritesStore } from "@/store/favouritesStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/**
 * RecipeCard — displays a recipe as a card with image, title, prep time,
 * diet badges, and a favourite heart toggle.
 *
 * @param {{ recipe: Object, showRemoveButton?: boolean }} props
 */
export default function RecipeCard({ recipe, showRemoveButton = false }) {
  const { isFavourite, addFavourite, removeFavourite } = useFavouritesStore();
  const favourited = isFavourite(recipe.id);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFavourite = (e) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();

    // Trigger subtle animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    if (favourited) {
      removeFavourite(recipe.id);
      toast("💔 Removed from favourites");
    } else {
      addFavourite(recipe);
      toast("❤️ Added to favourites");
    }
  };

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    removeFavourite(recipe.id);
  };

  // Diet tags — from complexSearch with addRecipeInformation=true
  const diets = recipe.diets || [];

  return (
    <Link to={`/recipe/${recipe.id}`} className="group block h-full">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/30 h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-muted shrink-0">
          <img
            src={recipe.image}
            alt={recipe.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Favourite button */}
          <button
            onClick={handleFavourite}
            aria-label={favourited ? "Remove from favourites" : "Add to favourites"}
            className={cn(
              "absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 shadow-md",
              favourited
                ? "bg-red-500 text-white"
                : "bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500 backdrop-blur-sm",
              isAnimating && "scale-125",
              !isAnimating && favourited && "scale-110"
            )}
          >
            <Heart
              className={cn("h-4 w-4 transition-all duration-300", favourited && "fill-current")}
            />
          </button>

          {/* Remove button (shown on Favourites page) */}
          {showRemoveButton && (
            <button
              onClick={handleRemove}
              aria-label="Remove recipe"
              className="absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-destructive hover:text-destructive-foreground hover:scale-110"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Prep time badge */}
          {recipe.readyInMinutes && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              <Clock className="h-3 w-3" />
              {recipe.readyInMinutes} min
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4 flex flex-col flex-1">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {recipe.title}
          </h3>

          {/* Diet badges */}
          {diets.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {diets.slice(0, 3).map((diet) => (
                <Badge
                  key={diet}
                  variant="secondary"
                  className="text-[10px] px-2 py-0.5 capitalize"
                >
                  {diet}
                </Badge>
              ))}
              {diets.length > 3 && (
                <Badge variant="outline" className="text-[10px] px-2 py-0.5">
                  +{diets.length - 3}
                </Badge>
              )}
            </div>
          )}

          <div className="mt-auto pt-2">
            {/* Servings info — shown if available */}
            {recipe.servings && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <ChefHat className="h-3 w-3" />
                {recipe.servings} servings
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
