import { useFavouritesStore } from "@/store/favouritesStore";
import RecipeGrid from "@/components/recipe/RecipeGrid";
import { Link } from "react-router-dom";
import { Heart, ArrowRight } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";

export default function Favourites() {
  const favourites = useFavouritesStore((s) => s.favourites);

  if (favourites.length === 0) {
    return (
      <PageWrapper>
      <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500/20 to-pink-400/20 text-rose-500 shadow-sm">
          <Heart className="h-10 w-10" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">No favourites yet</h1>
          <p className="max-w-md text-lg text-muted-foreground">
            Start exploring recipes and save the ones you love!
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 mt-4"
        >
          Explore Recipes
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
    <div className="space-y-8 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-pink-400 text-white shadow-sm">
          <Heart className="h-5 w-5" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">My Favourites</h1>
        <div className="flex h-6 items-center justify-center rounded-full bg-muted px-2.5 text-xs font-semibold text-muted-foreground">
          {favourites.length}
        </div>
      </div>

      <RecipeGrid recipes={favourites} showRemoveButton={true} />
    </div>
    </PageWrapper>
  );
}
