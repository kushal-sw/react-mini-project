import { useParams, Link } from "react-router-dom";
import { useCommunityStore } from "@/store/communityStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, ChefHat, ArrowLeft, ChevronRight, Calendar } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";

export default function CommunityRecipeDetail() {
  const { id } = useParams();
  const recipes = useCommunityStore((state) => state.recipes);
  const recipe = recipes.find(r => r.id === id);

  if (!recipe) {
    return (
      <PageWrapper>
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Recipe not found</h2>
        <p className="text-muted-foreground">The recipe you're looking for doesn't exist or was removed.</p>
        <Button asChild>
          <Link to="/community">Back to Community</Link>
        </Button>
      </div>
      </PageWrapper>
    );
  }

  const submitDate = new Date(recipe.submittedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <PageWrapper>
    <div className="space-y-8 py-4 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/community" className="flex items-center gap-1 hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Community
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium truncate max-w-xs">
          {recipe.title}
        </span>
      </nav>

      <div className="space-y-6">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-500 hover:bg-amber-600">Community Recipe</Badge>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">{recipe.title}</h1>
          <p className="text-lg text-muted-foreground">{recipe.description}</p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {recipe.prepTime} mins
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              {recipe.servings} servings
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              Submitted on {submitDate}
            </div>
          </div>

          {recipe.dietaryTags && recipe.dietaryTags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {recipe.dietaryTags.map(diet => (
                <Badge key={diet} variant="secondary" className="capitalize">
                  {diet}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Hero Image */}
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl shadow-md bg-muted">
          <img 
            src={recipe.imageUrl} 
            alt={recipe.title} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Ingredients Column */}
          <div className="md:col-span-1 space-y-4 bg-muted/20 p-6 rounded-xl border">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-primary" />
              Ingredients
            </h2>
            <ul className="space-y-3">
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-sm leading-relaxed">{ing}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions Column */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold">Instructions</h2>
            <ol className="space-y-6">
              {recipe.instructions.map((step, idx) => (
                <li key={idx} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                    {idx + 1}
                  </span>
                  <p className="text-base leading-relaxed pt-1 text-foreground/90">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
    </PageWrapper>
  );
}
