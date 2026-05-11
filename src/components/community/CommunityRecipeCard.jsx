import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ChefHat } from "lucide-react";

export default function CommunityRecipeCard({ recipe }) {
  const diets = recipe.dietaryTags || [];
  
  // Format date nicely
  const submitDate = new Date(recipe.submittedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  return (
    <Link to={`/community/${recipe.id}`} className="group block h-full">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/30 h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-muted shrink-0">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badge */}
          <Badge className="absolute top-3 right-3 bg-amber-500 hover:bg-amber-600 shadow-md">
            Community Recipe
          </Badge>

          {/* Prep time badge */}
          {recipe.prepTime && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              <Clock className="h-3 w-3" />
              {recipe.prepTime} min
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

          <div className="mt-auto pt-4 flex items-center justify-between">
            {recipe.servings && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <ChefHat className="h-3 w-3" />
                {recipe.servings} servings
              </div>
            )}
            <span className="text-[10px] text-muted-foreground">
              Submitted on {submitDate}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
