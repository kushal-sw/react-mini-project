/**
 * Spoonacular API Service
 *
 * All API calls to Spoonacular are centralised here.
 * TanStack Query should use a staleTime of 5 minutes (1000 * 60 * 5 = 300_000 ms)
 * to avoid unnecessary re-fetches and conserve the 150 points/day free-tier budget.
 */

const BASE = "https://api.spoonacular.com";
const KEY = import.meta.env.VITE_SPOONACULAR_KEY;

/**
 * Search recipes by dish name with optional dietary filters.
 * GET /recipes/complexSearch
 *
 * @param {string} query - The search term (e.g. "pasta", "chicken curry")
 * @param {string[]} diets - Array of diet filters (e.g. ["vegan", "gluten-free"])
 * @returns {Promise<{ results: Array, offset: number, number: number, totalResults: number }>}
 */
export const searchRecipes = async (query, diets = []) => {
  const dietParam = diets.length ? `&diet=${diets.join(",")}` : "";
  const res = await fetch(
    `${BASE}/recipes/complexSearch?query=${encodeURIComponent(query)}&number=12&addRecipeInformation=true&apiKey=${KEY}${dietParam}`
  );
  if (!res.ok) {
    throw new Error(`Spoonacular API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
};

/**
 * Search recipes by a list of ingredients the user already has.
 * GET /recipes/findByIngredients
 *
 * @param {string} ingredients - Comma-separated ingredient list (e.g. "chicken,garlic,lemon")
 * @returns {Promise<Array<{ id: number, title: string, image: string, usedIngredientCount: number, missedIngredientCount: number }>>}
 */
export const searchByIngredients = async (ingredients) => {
  const res = await fetch(
    `${BASE}/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredients)}&number=12&apiKey=${KEY}`
  );
  if (!res.ok) {
    throw new Error(`Spoonacular API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
};

/**
 * Fetch full recipe details including nutrition data.
 * GET /recipes/{id}/information?includeNutrition=true
 *
 * @param {number|string} id - The Spoonacular recipe ID
 * @returns {Promise<Object>} - Full recipe object with nutrition, instructions, ingredients, etc.
 */
export const getRecipeById = async (id) => {
  const res = await fetch(
    `${BASE}/recipes/${id}/information?includeNutrition=true&apiKey=${KEY}`
  );
  if (!res.ok) {
    throw new Error(`Spoonacular API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
};

/**
 * Fetch bulk recipe details including nutrition data.
 * GET /recipes/informationBulk
 *
 * @param {Array<number|string>} ids - Array of Spoonacular recipe IDs
 * @returns {Promise<Array<Object>>} - Array of full recipe objects
 */
export const getRecipesBulk = async (ids) => {
  if (!ids || ids.length === 0) return [];
  const res = await fetch(
    `${BASE}/recipes/informationBulk?ids=${ids.join(",")}&includeNutrition=true&apiKey=${KEY}`
  );
  if (!res.ok) {
    throw new Error(`Spoonacular API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
};
