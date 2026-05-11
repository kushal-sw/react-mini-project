/**
 * Nutrition helper utilities for extracting and formatting nutrition data
 * from Spoonacular API responses.
 */

/**
 * Extract key macros from the nutrition object returned by Spoonacular.
 * The API returns nutrition.nutrients as an array of objects like:
 * { name: "Calories", amount: 320, unit: "kcal", percentOfDailyNeeds: 16 }
 *
 * @param {Array} nutrients - Array of nutrient objects from the API
 * @returns {Object} - Simplified macro object
 */
export function extractMacros(nutrients = []) {
  const findNutrient = (name) =>
    nutrients.find((n) => n.name.toLowerCase() === name.toLowerCase());

  const calories = findNutrient("Calories");
  const protein = findNutrient("Protein");
  const carbs = findNutrient("Carbohydrates");
  const fat = findNutrient("Fat");
  const fiber = findNutrient("Fiber");

  return {
    calories: calories ? Math.round(calories.amount) : 0,
    protein: protein ? Math.round(protein.amount) : 0,
    carbs: carbs ? Math.round(carbs.amount) : 0,
    fat: fat ? Math.round(fat.amount) : 0,
    fiber: fiber ? Math.round(fiber.amount) : 0,
  };
}

/**
 * Scale macro values based on serving size adjustment.
 *
 * @param {Object} macros - The base macros object
 * @param {number} originalServings - Original number of servings from recipe
 * @param {number} desiredServings - User-selected number of servings
 * @returns {Object} - Scaled macro values
 */
export function scaleMacros(macros, originalServings, desiredServings) {
  const factor = desiredServings / originalServings;
  return {
    calories: Math.round(macros.calories * factor),
    protein: Math.round(macros.protein * factor),
    carbs: Math.round(macros.carbs * factor),
    fat: Math.round(macros.fat * factor),
    fiber: Math.round(macros.fiber * factor),
  };
}
