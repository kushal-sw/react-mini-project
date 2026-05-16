import PageWrapper from "@/components/layout/PageWrapper";
import { useCommunityStore } from "@/store/communityStore";
import { useFilterStore } from "@/store/filterStore";
import RecipeSubmitForm from "@/components/community/RecipeSubmitForm";
import CommunityRecipeCard from "@/components/community/CommunityRecipeCard";
import DietaryFilter from "@/components/recipe/DietaryFilter";
import { Users } from "lucide-react";

export default function Community() {
  const recipes = useCommunityStore((state) => state.recipes);
  const activeDiets = useFilterStore((state) => state.activeDiets);

  // Filter recipes based on active dietary filters (client-side)
  const filteredRecipes = recipes.filter(recipe => {
    if (activeDiets.length === 0) return true;
    return activeDiets.every(diet => (recipe.dietaryTags || []).includes(diet));
  });

  return (
    <PageWrapper>
      <div className="space-y-8 py-4 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community Recipes</h1>
          <p className="text-muted-foreground">Discover recipes shared by users like you.</p>
        </div>
        <RecipeSubmitForm />
      </div>

      <DietaryFilter />

      {filteredRecipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted text-muted-foreground shadow-sm">
            <Users className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold">No community recipes found</h2>
          <p className="text-muted-foreground max-w-md">
            {recipes.length === 0 
              ? "Be the first to submit a recipe to the community!" 
              : "No recipes match your active dietary filters. Try clearing some."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRecipes.map((recipe) => (
            <CommunityRecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
    </PageWrapper>
  );
}
