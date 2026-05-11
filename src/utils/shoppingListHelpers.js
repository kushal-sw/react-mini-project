const CATEGORY_MAP = {
  Produce: ["produce", "vegetable", "fruit"],
  Protein: ["meat", "seafood", "poultry", "protein"],
  Dairy: ["dairy", "cheese", "milk", "egg"],
  Pantry: ["pantry", "spices", "condiment", "baking", "cereal", "pasta"],
  Other: [], // fallback
};

export function consolidateIngredients(mealPlan, recipeDetailsMap) {
  const merged = {};

  // Loop through all 21 slots in the meal plan
  for (const day in mealPlan) {
    for (const slot in mealPlan[day]) {
      const recipe = mealPlan[day][slot];
      if (recipe && recipeDetailsMap[recipe.id]) {
        const fullRecipe = recipeDetailsMap[recipe.id];
        if (fullRecipe.extendedIngredients) {
          // Collect and merge duplicates
          fullRecipe.extendedIngredients.forEach((ing) => {
            const key = `${ing.name}-${ing.unit || ""}`.toLowerCase();
            if (!merged[key]) {
              merged[key] = {
                id: ing.id || key,
                name: ing.name,
                amount: ing.amount || 0,
                unit: ing.unit || "",
                aisle: ing.aisle || "Other",
              };
            } else {
              merged[key].amount += ing.amount || 0;
            }
          });
        }
      }
    }
  }

  // Group by category
  const grouped = {
    Produce: [],
    Protein: [],
    Dairy: [],
    Pantry: [],
    Other: [],
  };

  Object.values(merged).forEach((ing) => {
    let matched = false;
    for (const [cat, keywords] of Object.entries(CATEGORY_MAP)) {
      if (
        cat !== "Other" &&
        keywords.some((kw) => ing.aisle?.toLowerCase().includes(kw))
      ) {
        grouped[cat].push(ing);
        matched = true;
        break;
      }
    }
    if (!matched) grouped.Other.push(ing);
  });

  return grouped;
}
