import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TravelCard } from "@/components/ui/card-7";
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
  const navigate = useNavigate();

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
    <div className="relative w-full h-[400px]">
      <TravelCard
        imageUrl={recipe.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
        imageAlt={recipe.title}
        title={recipe.title}
        location={`${recipe.readyInMinutes || "?"} mins • ${recipe.servings || "?"} servings`}
        overview={diets.length > 0 ? diets.join(', ') : "A delicious recipe to discover and cook at home."}
        price={recipe.pricePerServing ? (recipe.pricePerServing / 100).toFixed(2) : "0.00"}
        pricePeriod="per serving"
        onBookNow={(e) => {
          e.preventDefault();
          navigate(`/recipe/${recipe.id}`);
        }}
        className="w-full max-w-full h-full border-white/10"
      />

      {/* Favourite button */}
      <button
        onClick={handleFavourite}
        aria-label={favourited ? "Remove from favourites" : "Add to favourites"}
        className={cn(
          "absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 shadow-lg",
          favourited
            ? "bg-red-500 text-white"
            : "bg-black/30 text-white hover:bg-red-500 hover:text-white backdrop-blur-md border border-white/20",
          isAnimating && "scale-125",
          !isAnimating && favourited && "scale-110"
        )}
      >
        <Heart
          className={cn("h-5 w-5 transition-all duration-300", favourited && "fill-current")}
        />
      </button>

      {/* Remove button (shown on Favourites page) */}
      {showRemoveButton && (
        <button
          onClick={handleRemove}
          aria-label="Remove recipe"
          className="absolute top-4 left-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white shadow-lg backdrop-blur-md border border-white/20 transition-all duration-200 hover:bg-destructive hover:text-destructive-foreground hover:scale-110"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
