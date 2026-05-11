# 🍳 Recipe Discovery App — Product Requirements Document

**Version:** 1.0  
**Type:** College Project  
**Stack:** React · Tailwind CSS · shadcn/ui · Spoonacular API  
**Timeline:** Flexible  
**Author:** Cohort LP

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Tech Stack](#2-tech-stack)
3. [App Structure & Pages](#3-app-structure--pages)
4. [Phase 1 — Foundation & Setup](#4-phase-1--foundation--setup)
5. [Phase 2 — Core Search & Recipe Detail](#5-phase-2--core-search--recipe-detail)
6. [Phase 3 — Personalisation](#6-phase-3--personalisation)
7. [Phase 4 — Meal Planning & Shopping](#7-phase-4--meal-planning--shopping)
8. [Phase 5 — Community](#8-phase-5--community)
9. [Phase 6 — Polish & Finalisation](#9-phase-6--polish--finalisation)
10. [API Reference](#10-api-reference)
11. [Out of Scope](#11-out-of-scope)

---

## 1. Product Overview

### What is it?

A desktop web application built in React that acts as a personal cooking assistant. Users can discover recipes based on ingredients or dish names, plan their weekly meals, track nutrition, generate shopping lists, save favourites, filter by dietary needs, and share their own recipes with the community.

### Problem it solves

| Pain Point                           | How the App Solves It                       |
| ------------------------------------ | ------------------------------------------- |
| "What do I cook with what I have?"   | Ingredient-based recipe search              |
| Scattered meal planning across apps  | Built-in weekly meal planner                |
| Unknown nutritional content of meals | Per-recipe macro display                    |
| Repetitive shopping trips            | Auto-generated shopping list from meal plan |
| No place to save favourite recipes   | Personal favourites collection              |
| Hard to find diet-specific recipes   | Multi-tag dietary filters                   |
| No platform to share home recipes    | Community recipe submission feed            |

### Target User

Home cooks, college students, health-conscious individuals, and food enthusiasts who want a **single unified platform** for their cooking life.

---

## 2. Tech Stack

| Layer            | Technology                                        | Why                                              |
| ---------------- | ------------------------------------------------- | ------------------------------------------------ |
| Framework        | React 18 + Vite                                   | Fast dev server, modern React                    |
| Styling          | Tailwind CSS v3                                   | Utility-first, rapid UI                          |
| UI Components    | shadcn/ui                                         | Accessible, unstyled-by-default, Tailwind-native |
| Additional UI    | Lucide React (icons), Recharts (nutrition charts) | Lightweight, well-maintained                     |
| Routing          | React Router v6                                   | Industry standard, nested routes                 |
| State Management | Zustand                                           | Minimal boilerplate, localStorage middleware     |
| Server State     | TanStack Query v5                                 | Caching, background refetch, loading states      |
| Recipe API       | Spoonacular API (Free tier — 150 req/day)         | Rich data: recipes, nutrition, ingredients       |
| Drag & Drop      | @dnd-kit/core                                     | Modern, accessible drag-and-drop                 |
| Persistence      | localStorage (via Zustand persist middleware)     | Favourites, meal plan, filters                   |

### Spoonacular Free Tier

- **150 points/day** (each API call costs 1–2 points)
- Sign up at: https://spoonacular.com/food-api
- Key endpoints used: `/recipes/complexSearch`, `/recipes/{id}/information`, `/recipes/findByIngredients`, `/recipes/{id}/nutritionWidget.json`

---

## 3. App Structure & Pages

```
src/
├── components/
│   ├── ui/                  # shadcn/ui components (Button, Card, Badge, etc.)
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   └── Layout.jsx
│   ├── recipe/
│   │   ├── RecipeCard.jsx
│   │   ├── RecipeGrid.jsx
│   │   └── NutritionPanel.jsx
│   ├── search/
│   │   ├── SearchBar.jsx
│   │   └── DietaryFilter.jsx
│   ├── planner/
│   │   ├── WeeklyCalendar.jsx
│   │   └── MealSlot.jsx
│   └── community/
│       └── RecipeSubmitForm.jsx
├── pages/
│   ├── Home.jsx             # Search + featured recipes
│   ├── RecipeDetail.jsx     # Full recipe + nutrition
│   ├── MealPlanner.jsx      # Weekly drag-and-drop planner
│   ├── Favourites.jsx       # Saved recipes
│   ├── ShoppingList.jsx     # Auto-generated list
│   └── Community.jsx        # User-submitted recipes
├── store/
│   ├── favouritesStore.js
│   ├── mealPlanStore.js
│   ├── shoppingStore.js
│   └── filterStore.js
├── hooks/
│   ├── useRecipeSearch.js
│   ├── useRecipeDetail.js
│   └── useIngredientSearch.js
├── services/
│   └── spoonacular.js       # All API calls in one file
└── utils/
    ├── nutritionHelpers.js
    └── shoppingListHelpers.js
```

### Routes

| Path          | Page         | Description                   |
| ------------- | ------------ | ----------------------------- |
| `/`           | Home         | Search bar + recipe grid      |
| `/recipe/:id` | RecipeDetail | Full instructions + nutrition |
| `/planner`    | MealPlanner  | Weekly calendar               |
| `/favourites` | Favourites   | Saved recipes                 |
| `/shopping`   | ShoppingList | Generated shopping list       |
| `/community`  | Community    | User-submitted recipes        |

---

## 4. Phase 1 — Foundation & Setup

> **Goal:** Get the project running with routing, layout, and shadcn/ui configured. No features yet — just solid bones.

### Tasks

- [ ] Scaffold project with Vite: `npm create vite@latest recipe-app -- --template react`
- [ ] Install and configure Tailwind CSS
- [ ] Install and init shadcn/ui: `npx shadcn-ui@latest init`
- [ ] Install dependencies:
  ```bash
  npm install react-router-dom @tanstack/react-query zustand lucide-react @dnd-kit/core @dnd-kit/sortable recharts
  ```
- [ ] Set up React Router with all 6 routes (empty page components)
- [ ] Build `Navbar.jsx` with links to all pages using shadcn `NavigationMenu`
- [ ] Build `Layout.jsx` wrapper (Navbar + `<Outlet />`)
- [ ] Create `.env` file with `VITE_SPOONACULAR_KEY=your_key_here`
- [ ] Create `services/spoonacular.js` with base URL and API key config
- [ ] Wrap app in `QueryClientProvider` (TanStack Query)

### Deliverable

A running app at `localhost:5173` with a navbar that navigates between 6 empty pages.

### shadcn/ui Components to Install

```bash
npx shadcn-ui@latest add button card badge input skeleton navigation-menu
```

---

## 5. Phase 2 — Core Search & Recipe Detail

> **Goal:** Build the two most important features — searching recipes and viewing a full recipe. This is the heart of the app.

### Feature 1 — Search by Dish or Ingredient

**Description:** The home page has a search bar. Users can search by dish name (e.g. "pasta") or by ingredients (e.g. "chicken, garlic, lemon"). Results are shown in a responsive card grid.

**API Calls:**

- Search by dish: `GET /recipes/complexSearch?query={term}&number=12`
- Search by ingredient: `GET /recipes/findByIngredients?ingredients={list}&number=12`

**Components:**

- `SearchBar.jsx` — shadcn `Input` + `Button`, with a toggle for "By Dish" vs "By Ingredient"
- `RecipeCard.jsx` — shadcn `Card` with image, title, prep time, diet badges
- `RecipeGrid.jsx` — CSS grid of `RecipeCard` components
- `useRecipeSearch.js` — TanStack Query hook wrapping the API calls

**Acceptance Criteria:**

- [ ] Search input debounced (300ms) to avoid excess API calls
- [ ] Results appear within 1s
- [ ] Loading state: shadcn `Skeleton` cards shown while fetching
- [ ] Empty state: friendly message + illustration when no results
- [ ] Each card links to `/recipe/:id`

---

### Feature 3 — Detailed Recipe Instructions

**Description:** Clicking a recipe opens a full-page detail view with ingredients, step-by-step instructions, cook time, difficulty, and serving size adjuster.

**API Call:** `GET /recipes/{id}/information?includeNutrition=true`

**Components:**

- `RecipeDetail.jsx` — full page layout
- Serving size adjuster: shadcn `Input` (number) that scales ingredient quantities
- Instructions rendered as numbered steps

**Acceptance Criteria:**

- [ ] Ingredients scale dynamically when serving size changes
- [ ] Instructions shown in numbered list
- [ ] Heart/bookmark button to save to favourites (wired to Zustand)
- [ ] Breadcrumb back to search results

---

### Feature 5 — Nutritional Value Display

**Description:** Within the Recipe Detail page, a panel shows macros per serving: calories, protein, carbs, fat, fibre.

**API Call:** Included in `/recipes/{id}/information?includeNutrition=true` response

**Components:**

- `NutritionPanel.jsx` — shadcn `Card` with a `Recharts` RadialBarChart or simple stat blocks
- Values re-calculate when serving size changes

**Acceptance Criteria:**

- [ ] Shows: Calories, Protein, Carbohydrates, Fat, Fibre
- [ ] Values update with serving size adjuster
- [ ] Visually distinct section on the page (use shadcn `Separator`)

### shadcn/ui Components to Install

```bash
npx shadcn-ui@latest add separator breadcrumb tabs
```

---

## 6. Phase 3 — Personalisation

> **Goal:** Let users make the app their own — saving favourites and filtering by dietary needs.

### Feature 4 — Personal Favourites Collection

**Description:** Users can bookmark any recipe. Favourites are stored in Zustand + localStorage and displayed on a dedicated page.

**State:** `favouritesStore.js`

```js
// Shape
{
  favourites: [],          // array of { id, title, image, readyInMinutes }
  addFavourite: (recipe) => {},
  removeFavourite: (id) => {},
  isFavourite: (id) => boolean
}
```

**Components:**

- Heart icon button on `RecipeCard` and `RecipeDetail` (Lucide `Heart` icon)
- `Favourites.jsx` — grid of saved recipe cards with remove option
- Empty state when no favourites saved

**Acceptance Criteria:**

- [ ] Heart icon fills/unfills on toggle
- [ ] Favourites persist after page refresh
- [ ] Favourites page shows all saved recipes
- [ ] Removing from favourites updates instantly

---

### Feature 8 — Filter by Dietary Needs

**Description:** A filter bar (on Home and Community pages) lets users filter recipes by dietary tags. Filters are global and persist during the session.

**Dietary Options:** Vegan · Vegetarian · Gluten-Free · Dairy-Free · Keto · Halal

**State:** `filterStore.js`

```js
// Shape
{
  activeDiets: [],             // e.g. ["vegan", "gluten-free"]
  toggleDiet: (diet) => {},
  clearFilters: () => {}
}
```

**API Integration:** Pass active diets to Spoonacular: `&diet=vegan,vegetarian`

**Components:**

- `DietaryFilter.jsx` — row of shadcn `Badge` or `Toggle` buttons, multi-select
- Filter bar sits below search bar on Home page

**Acceptance Criteria:**

- [ ] Multi-select filters work simultaneously
- [ ] Filters apply to search results immediately
- [ ] Active filters visually highlighted
- [ ] "Clear all filters" button

### shadcn/ui Components to Install

```bash
npx shadcn-ui@latest add toggle
```

---

## 7. Phase 4 — Meal Planning & Shopping

> **Goal:** The two most complex features. Build the weekly planner first, then derive the shopping list from it.

### Feature 2 — Weekly Meal Planner

**Description:** A 7-day calendar (Mon–Sun) with 3 meal slots per day (Breakfast, Lunch, Dinner). Users drag recipe cards into slots from a recipe search sidebar.

**State:** `mealPlanStore.js`

```js
// Shape
{
  plan: {
    monday: { breakfast: null, lunch: null, dinner: null },
    tuesday: { ... },
    // ...sunday
  },
  addMeal: (day, slot, recipe) => {},
  removeMeal: (day, slot) => {},
  clearDay: (day) => {},
  clearAll: () => {}
}
```

**Components:**

- `MealPlanner.jsx` — main page, two-column layout: sidebar (search) + calendar
- `WeeklyCalendar.jsx` — 7-column grid
- `MealSlot.jsx` — droppable slot using `@dnd-kit`
- Recipe search sidebar reuses `SearchBar` + `RecipeCard` (draggable)

**Acceptance Criteria:**

- [ ] Drag recipe from sidebar into any day/meal slot
- [ ] Slot shows recipe name + image when filled
- [ ] Click X to remove a recipe from a slot
- [ ] "Clear Week" button resets all slots
- [ ] Meal plan persists in localStorage

---

### Feature 6 — Shopping List Generator

**Description:** Automatically generates a consolidated shopping list from all recipes in the current meal plan. Ingredients are grouped by category and duplicates are merged with combined quantities.

**State:** `shoppingStore.js` (derives from `mealPlanStore`)

**Logic (in `shoppingListHelpers.js`):**

1. Collect all ingredients from all planned recipes
2. Merge duplicates (same ingredient name → sum quantities)
3. Group by category: Produce, Protein, Dairy, Pantry, Other

**Components:**

- `ShoppingList.jsx` — grouped list with checkboxes (shadcn `Checkbox`)
- "Generate from Meal Plan" button (recalculates list)
- "Add Custom Item" input
- "Print" button (uses `window.print()`)
- Checked items visually struck through

**Acceptance Criteria:**

- [ ] List auto-generates from current meal plan
- [ ] Items grouped by category
- [ ] Duplicate ingredients merged with correct quantity
- [ ] Manual add/remove items works
- [ ] Check-off items persists during session
- [ ] Print-friendly layout

### shadcn/ui Components to Install

```bash
npx shadcn-ui@latest add checkbox scroll-area
```

---

## 8. Phase 5 — Community

> **Goal:** Add user-submitted recipes so the app feels alive beyond the API data.

### Feature 7 — User-Submitted Recipes

**Description:** A community feed where users can submit their own recipes using a structured form. Submitted recipes are stored locally (no backend) and displayed in a masonry-style grid.

**State:** Zustand slice inside `communityStore.js` with localStorage persistence

**Submission Form Fields:**
| Field | Input Type | Required |
|---|---|---|
| Recipe Title | Text | ✅ |
| Description | Textarea | ✅ |
| Ingredients | Textarea (one per line) | ✅ |
| Instructions | Textarea (numbered steps) | ✅ |
| Prep Time | Number (minutes) | ✅ |
| Servings | Number | ✅ |
| Dietary Tags | Multi-select checkboxes | ❌ |
| Image URL | Text (URL) | ❌ |

**Components:**

- `Community.jsx` — feed page + "Submit Recipe" button opens a shadcn `Dialog`
- `RecipeSubmitForm.jsx` — form inside the dialog, validated with HTML5 + JS
- Community recipe cards visually tagged as "Community Recipe"
- Dietary filters from Phase 3 also apply here

**Acceptance Criteria:**

- [ ] Form validates required fields before submit
- [ ] Submitted recipes appear instantly in feed
- [ ] Community recipes visually distinct from API recipes (badge/tag)
- [ ] Community recipes persist after refresh
- [ ] Dietary filters apply to community feed too

### shadcn/ui Components to Install

```bash
npx shadcn-ui@latest add dialog textarea label
```

---

## 9. Phase 6 — Polish & Finalisation

> **Goal:** Make it feel complete, professional, and ready for submission.

### Tasks

#### UX & Design

- [ ] Consistent colour palette — define in `tailwind.config.js` as custom colours
- [ ] Dark mode toggle using shadcn `ThemeProvider` + Tailwind `dark:` classes
- [ ] Smooth page transitions (CSS fade-in on route change)
- [ ] Toasts for user actions: "Added to favourites", "Recipe submitted", "Meal saved" — use shadcn `Sonner` or `Toast`
- [ ] 404 page for unknown routes
- [ ] Loading spinners / skeleton screens on all async data

#### Responsiveness

- [ ] Desktop-first (1280px primary target)
- [ ] Works at 1024px (laptop screens) without breaking

#### Accessibility

- [ ] All interactive elements keyboard-navigable
- [ ] `aria-label` on icon-only buttons (heart, close, etc.)
- [ ] Focus rings visible

#### Performance

- [ ] Lazy-load page components with `React.lazy` + `Suspense`
- [ ] Images use `loading="lazy"`
- [ ] API responses cached by TanStack Query (5 min stale time)

#### Final Checks

- [ ] `.env.example` file committed (never commit real API key)
- [ ] `README.md` with setup instructions and feature list
- [ ] All 8 features working end-to-end
- [ ] No console errors in production build (`npm run build`)

### shadcn/ui Components to Install

```bash
npx shadcn-ui@latest add sonner theme-provider
```

---

## 10. API Reference

### Base URL

```
https://api.spoonacular.com
```

### Key Endpoints

| Feature                   | Method | Endpoint                             | Key Params                |
| ------------------------- | ------ | ------------------------------------ | ------------------------- |
| Search by dish            | GET    | `/recipes/complexSearch`             | `query`, `diet`, `number` |
| Search by ingredient      | GET    | `/recipes/findByIngredients`         | `ingredients`, `number`   |
| Recipe detail + nutrition | GET    | `/recipes/{id}/information`          | `includeNutrition=true`   |
| Nutrition breakdown       | GET    | `/recipes/{id}/nutritionWidget.json` | —                         |

### Example Call (in `services/spoonacular.js`)

```js
const BASE = "https://api.spoonacular.com";
const KEY = import.meta.env.VITE_SPOONACULAR_KEY;

export const searchRecipes = async (query, diets = []) => {
  const dietParam = diets.length ? `&diet=${diets.join(",")}` : "";
  const res = await fetch(
    `${BASE}/recipes/complexSearch?query=${query}&number=12&apiKey=${KEY}${dietParam}`,
  );
  return res.json();
};

export const getRecipeById = async (id) => {
  const res = await fetch(
    `${BASE}/recipes/${id}/information?includeNutrition=true&apiKey=${KEY}`,
  );
  return res.json();
};

export const searchByIngredients = async (ingredients) => {
  const res = await fetch(
    `${BASE}/recipes/findByIngredients?ingredients=${ingredients}&number=12&apiKey=${KEY}`,
  );
  return res.json();
};
```

### Rate Limit Strategy

- TanStack Query: set `staleTime: 1000 * 60 * 5` (5 min cache) to avoid re-fetching
- Don't fetch on every keystroke — use a debounced search (trigger on Enter or button click)
- Daily budget is 150 points — each search = ~1 point

---

## 11. Out of Scope

These are intentionally excluded from v1.0 to keep the project focused:

- ❌ User authentication / login system
- ❌ Backend / database (all data is local)
- ❌ Real-time community (no live updates)
- ❌ Mobile / native app
- ❌ Payment or premium features
- ❌ Recipe ratings or comments system
- ❌ Email or push notifications

---

## Phase Summary

| Phase   | Focus                              | Features   | Complexity |
| ------- | ---------------------------------- | ---------- | ---------- |
| Phase 1 | Project setup + routing            | —          | Low        |
| Phase 2 | Search + Recipe detail + Nutrition | F1, F3, F5 | Medium     |
| Phase 3 | Favourites + Dietary filters       | F4, F8     | Low–Medium |
| Phase 4 | Meal planner + Shopping list       | F2, F6     | High       |
| Phase 5 | Community submissions              | F7         | Medium     |
| Phase 6 | Polish, dark mode, performance     | All        | Low        |

> **Recommended build order:** Follow phases 1→6 in order. Phase 4 is the hardest — don't skip Phase 1–3 before attempting it.

---

_Recipe Discovery App PRD · Cohort LP · v1.0_
