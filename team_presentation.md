# ForkCast — Team Presentation Guide

> **Project**: ForkCast — A React-based meal planning & recipe discovery app  
> **Tech Stack**: React 18 + Vite, TanStack Query, Zustand, Firebase Auth, Supabase, Framer Motion, TailwindCSS

---

## 📂 Project Structure Overview

```
src/
├── App.jsx                  # Root component — routing & auth state
├── main.jsx                 # Entry point — providers setup
├── firebase.js              # Firebase config & auth export
├── pages/                   # 12 page-level components
├── components/
│   ├── recipe/              # SearchBar, RecipeCard, RecipeGrid, DietaryFilter, NutritionPanel
│   ├── community/           # CommunityRecipeCard, RecipeSubmitForm
│   ├── layout/              # Layout, NavHeader, PageWrapper
│   ├── planner/             # DraggableRecipeCard, MealSlot, WeeklyCalendar
│   ├── blocks/              # nav-header (animated navbar)
│   └── ui/                  # 28 reusable UI primitives
├── hooks/                   # 3 custom hooks (useRecipeSearch, useRecipeDetail, useIngredientSearch)
├── store/                   # 5 Zustand stores
├── services/                # Spoonacular API service
├── utils/                   # Helper functions
└── lib/                     # Supabase client, createProfile, utils
```

---

# 🟢 PART 1 — Foundation, Auth & Landing

**Presenter covers**: Project setup, routing, authentication, and the entry pages.

## Files Covered

| File | Purpose |
|------|---------|
| `src/main.jsx` | App entry point, provider setup |
| `src/App.jsx` | Root routing & auth state management |
| `src/firebase.js` | Firebase configuration |
| `src/lib/supabase.js` | Supabase client |
| `src/lib/createProfile.js` | Profile creation helper |
| `src/pages/Landing.jsx` | Public landing page |
| `src/pages/Login.jsx` | Login page with Google Auth |
| `src/pages/Register.jsx` | Registration with email + Google |
| `src/components/layout/Layout.jsx` | Main authenticated layout wrapper |
| `src/components/layout/PageWrapper.jsx` | Animation wrapper for pages |
| `src/components/blocks/nav-header.jsx` | Animated navigation bar |
| `src/pages/NotFound.jsx` | 404 page |

---

### React Concepts Used in Part 1

### 1. `useState` — Local Component State

| File | Line | Variable | Purpose |
|------|------|----------|---------|
| `App.jsx` | L20 | `isAuthenticated` | Tracks if user is logged in |
| `App.jsx` | L21 | `isRegistering` | Toggles between Login/Register views |
| `App.jsx` | L22 | `showLanding` | Shows landing page vs auth forms |
| `Register.jsx` | L25 | `fullName` | Stores full name input |
| `Register.jsx` | L26 | `email` | Stores email input |
| `Register.jsx` | L27 | `password` | Stores password input |
| `Register.jsx` | L28 | `showPassword` | Toggles password visibility |
| `Register.jsx` | L29 | `error` | Stores error messages |
| `Register.jsx` | L30 | `loading` | Loading state during registration |
| `nav-header.jsx` | L8-12 | `position` | Tracks animated cursor position `{left, width, opacity}` |

### 2. Props — Parent-to-Child Data Flow

| File | Line | Props | Purpose |
|------|------|-------|---------|
| `App.jsx` | L31-39 | `Landing → onSignIn, onSignUp` | Callback props to switch from landing to auth |
| `App.jsx` | L43-44 | `Register → onRegister, onLoginClick` | Callbacks for registration flow |
| `App.jsx` | L48-49 | `Login → onLogin, onRegisterClick` | Callbacks for login flow |
| `Login.jsx` | L12 | `{ onLogin, onRegisterClick }` | Destructured callback props |
| `Register.jsx` | L24 | `{ onRegister, onLoginClick }` | Destructured callback props |
| `Landing.jsx` | L5 | `{ onSignIn, onSignUp }` | Callback props for CTA buttons |
| `PageWrapper.jsx` | L1 | `{ children }` | React `children` prop pattern |
| `nav-header.jsx` | L29-32 | `Tab → { children, setPosition, onClick }` | Tab receives position setter and click handler |
| `nav-header.jsx` | L55-56 | `Cursor → { position }` | Receives animated position object |

### 3. `useRef` — DOM References

| File | Line | Purpose |
|------|------|---------|
| `nav-header.jsx` | L34 | `useRef(null)` on each `Tab` to read `getBoundingClientRect()` for the sliding cursor animation |

### 4. `useNavigate` — Programmatic Navigation (React Router)

| File | Line | Purpose |
|------|------|---------|
| `Layout.jsx` | L11 | Navigate to `/account` from floating menu |
| `nav-header.jsx` | L13 | Navigate to routes on tab click |

### 5. `Suspense` & `lazy` — Code Splitting

| File | Lines | Purpose |
|------|-------|---------|
| `App.jsx` | L1 | `import { Suspense, lazy }` |
| `App.jsx` | L6-17 | 11 lazy-loaded page components |
| `App.jsx` | L29, L59 | `<Suspense fallback={spinner}>` wraps routes |

### 6. React Router — `HashRouter`, `Routes`, `Route`, `Outlet`

| File | Lines | Purpose |
|------|-------|---------|
| `App.jsx` | L25-78 | `HashRouter` + nested `Routes` with conditional auth routing |
| `App.jsx` | L55 | `<Route element={<Layout />}>` — layout route pattern |
| `Layout.jsx` | L55 | `<Outlet />` renders child routes inside the layout |

### 7. Context Providers (in `main.jsx`)

| Provider | Line | Purpose |
|----------|------|---------|
| `StrictMode` | L18 | React strict mode for dev warnings |
| `QueryClientProvider` | L19 | TanStack Query — server state caching |
| `ThemeProvider` | L20 | Dark/light theme management |

### 8. Async/Await — Firebase Auth

| File | Lines | Purpose |
|------|-------|---------|
| `Login.jsx` | L13-24 | `handleGoogleLogin` — `signInWithPopup` + profile creation |
| `Register.jsx` | L33-53 | Google signup with new-user check |
| `Register.jsx` | L56-89 | Email registration with `createUserWithEmailAndPassword` |
| `Layout.jsx` | L13-21 | `handleLogout` — `signOut(auth)` |

---

# 🔵 PART 2 — Recipe Search, Detail & Favourites

**Presenter covers**: API integration, custom hooks, recipe display, and favourites.

## Files Covered

| File | Purpose |
|------|---------|
| `src/services/spoonacular.js` | API service layer (4 functions) |
| `src/hooks/useRecipeSearch.js` | Custom hook — recipe search |
| `src/hooks/useRecipeDetail.js` | Custom hook — recipe detail |
| `src/hooks/useIngredientSearch.js` | Custom hook — ingredient search |
| `src/store/favouritesStore.js` | Zustand store — favourites |
| `src/store/filterStore.js` | Zustand store — dietary filters |
| `src/utils/nutritionHelpers.js` | Nutrition math helpers |
| `src/pages/Home.jsx` | Home page with search |
| `src/pages/RecipeDetail.jsx` | Full recipe detail view |
| `src/pages/Favourites.jsx` | Saved recipes page |
| `src/components/recipe/SearchBar.jsx` | Search input with mode toggle |
| `src/components/recipe/RecipeCard.jsx` | Recipe card component |
| `src/components/recipe/RecipeGrid.jsx` | Grid of recipe cards |
| `src/components/recipe/DietaryFilter.jsx` | Diet filter toggle buttons |
| `src/components/recipe/NutritionPanel.jsx` | Nutrition display panel |

---

### React Concepts Used in Part 2

### 1. `useState` — Local Component State

| File | Line | Variable | Purpose |
|------|------|----------|---------|
| `Home.jsx` | L13 | `searchQuery` | Current search text |
| `Home.jsx` | L14 | `searchMode` | `"dish"` or `"ingredient"` mode |
| `Home.jsx` | L15 | `hasSearched` | Tracks if user has searched (hides empty state) |
| `RecipeDetail.jsx` | L28 | `servings` | User-adjusted serving count |
| `SearchBar.jsx` | L12 | `query` | Local search input value |
| `SearchBar.jsx` | L13 | `mode` | Search mode toggle |
| `RecipeCard.jsx` | L18 | `isAnimating` | Heart button animation state |

### 2. `useCallback` — Memoized Callbacks

| File | Line | Purpose |
|------|------|---------|
| `Home.jsx` | L24-28 | `handleSearch` — memoized with `[]` deps to prevent child re-renders |

### 3. Custom Hooks — Encapsulated Logic

| Hook | File | React Concept | Purpose |
|------|------|---------------|---------|
| `useRecipeSearch` | `hooks/useRecipeSearch.js` | Wraps `useQuery` (TanStack) | Searches recipes with mode + diet filters |
| `useRecipeDetail` | `hooks/useRecipeDetail.js` | Wraps `useQuery` | Fetches single recipe with nutrition |
| `useIngredientSearch` | `hooks/useIngredientSearch.js` | Wraps `useQuery` | Search by ingredients |

**Usage in pages:**
- `Home.jsx` L18-22: `useRecipeSearch({ query, mode, diets })`
- `RecipeDetail.jsx` L25: `useRecipeDetail(id)`

### 4. Props — Component Communication

| File | Line | Props | Purpose |
|------|------|-------|---------|
| `Home.jsx` | L55 | `SearchBar → onSearch, isLoading` | Parent passes search handler |
| `Home.jsx` | L74-78 | `RecipeGrid → recipes, isLoading, isError, error` | Data + state props |
| `RecipeCard.jsx` | L15 | `{ recipe, showRemoveButton }` | Recipe data + display flag |
| `RecipeGrid.jsx` | L11 | `{ recipes, isLoading, isError, error, showRemoveButton }` | Full state props |
| `NutritionPanel.jsx` | L11-14 | `{ nutrition, originalServings, currentServings }` | Scaled nutrition data |
| `Favourites.jsx` | L48 | `RecipeGrid → showRemoveButton={true}` | Enables remove button on cards |

### 5. `useParams` — URL Parameters (React Router)

| File | Line | Purpose |
|------|------|---------|
| `RecipeDetail.jsx` | L24 | `const { id } = useParams()` — gets recipe ID from `/recipe/:id` |

### 6. Zustand Stores — Global State Management

**Favourites Store** (`store/favouritesStore.js`):
- Uses `create()` + `persist()` middleware for localStorage persistence
- Methods: `addFavourite`, `removeFavourite`, `isFavourite`
- Used in: `RecipeDetail.jsx` L26, `RecipeCard.jsx` L16, `Favourites.jsx` L8

**Filter Store** (`store/filterStore.js`):
- Methods: `toggleDiet`, `clearFilters`, `isActive`
- Used in: `Home.jsx` L16, `DietaryFilter.jsx` L15, `Community.jsx` L11

### 7. Conditional Rendering

| File | Lines | Pattern |
|------|-------|---------|
| `RecipeDetail.jsx` | L57-81 | Loading skeleton state |
| `RecipeDetail.jsx` | L84-102 | Error state display |
| `RecipeGrid.jsx` | L13-65 | Loading → Error → Empty → Results (4-way conditional) |
| `Home.jsx` | L61-81 | Show results only after `hasSearched` is true |
| `RecipeDetail.jsx` | L180-188 | Diet tags rendered only if array is non-empty |

### 8. List Rendering with `.map()` and `key`

| File | Lines | Purpose |
|------|-------|---------|
| `RecipeGrid.jsx` | L70-72 | Maps recipes array to `RecipeCard` components |
| `RecipeDetail.jsx` | L207-216 | Maps instruction steps |
| `RecipeDetail.jsx` | L275-303 | Maps ingredients with scaled amounts |
| `RecipeDetail.jsx` | L182-186 | Maps diet badges |
| `DietaryFilter.jsx` | L21-43 | Maps diet options to toggle buttons |

### 9. Derived / Computed State

| File | Lines | Purpose |
|------|-------|---------|
| `RecipeDetail.jsx` | L31-33 | `currentServings`, `scaleFactor` derived from state + API data |
| `Home.jsx` | L32-35 | `recipes` normalized from different API response shapes |

### 10. Event Handling

| File | Lines | Pattern |
|------|-------|---------|
| `SearchBar.jsx` | L15-19 | `handleSubmit` with `e.preventDefault()` |
| `RecipeCard.jsx` | L21-36 | `handleFavourite` with `e.stopPropagation()` to prevent Link navigation |
| `RecipeDetail.jsx` | L249-252 | Controlled input with validation (`parseInt`, range check) |

---

# 🟣 PART 3 — Meal Planner, Shopping List & Account

**Presenter covers**: Meal planning, shopping list generation, and user account.

## Files Covered

| File | Purpose |
|------|---------|
| `src/pages/MealPlanner.jsx` | Weekly meal planner with search modal |
| `src/pages/ShoppingList.jsx` | Auto-generated shopping list |
| `src/pages/Account.jsx` | User profile & settings |
| `src/store/mealPlanStore.js` | Zustand store — meal plan |
| `src/store/shoppingStore.js` | Zustand store — shopping list |
| `src/utils/shoppingListHelpers.js` | Shopping list consolidation |

---

### React Concepts Used in Part 3

### 1. `useState` — Local Component State

| File | Line | Variable | Purpose |
|------|------|----------|---------|
| **MealPlanner.jsx** | L330 | `modalTarget` | Which `{day, slot}` the add-meal modal is for |
| **AddMealModal** (in MealPlanner.jsx) | L46 | `query` | Search input in modal |
| **AddMealModal** | L47 | `results` | Search results array |
| **AddMealModal** | L48 | `loading` | Loading state for search |
| **AddMealModal** | L49 | `searched` | Tracks if user searched |
| **ShoppingList.jsx** | L28 | `isLoading` | Loading state for list generation |
| **ShoppingList.jsx** | L29 | `customInput` | Custom item input field |
| **Account.jsx** | L171-176 | 6 states | `username`, `bio`, `avatarUrl`, `uploading`, `editingField`, `tempValue` |
| **Account.jsx** | L179-181 | 3 states | `diet`, `vibe`, `budget` (preference pills) |
| **Account.jsx** | L289-292 | 4 states | Password change states |

### 2. `useEffect` — Side Effects

| File | Line | Deps | Purpose |
|------|------|------|---------|
| `Account.jsx` | L186-213 | `[]` | Loads avatar from Supabase on mount |
| `Account.jsx` | L231-233 | `[]` | Fetches username/bio from Supabase on mount |

> **Key Point**: Empty dependency array `[]` means "run once on mount" — used for initial data fetching.

### 3. `useMemo` — Memoized Computation

| File | Line | Purpose |
|------|------|---------|
| `MealPlanner.jsx` | L333-343 | `totalMeals` — counts non-null meals across the entire plan object. Recalculates only when `plan` changes. |

### 4. `useCallback` — Memoized Functions

| File | Line | Purpose |
|------|------|---------|
| `MealPlanner.jsx` | (implicit) | Various handler functions for meal cell interactions |

### 5. Props — Nested Component Communication

| File | Props | Purpose |
|------|-------|---------|
| `MealPlanner.jsx` L520-526 | `AddMealModal → day, slot, onClose, onAdd` | Modal receives context + callbacks |
| `Account.jsx` L55 | `PillGroup → label, options, selected, onSelect` | Reusable pill selector with props |
| `Account.jsx` L88 | `StatCard → icon, value, label, delay, color` | Stat display with icon prop pattern |
| `Account.jsx` L107-113 | `ActionButton → icon, label, onClick, variant, delay` | Polymorphic button component |

### 6. Zustand Stores — Global State

**Meal Plan Store** (`store/mealPlanStore.js`):
- Persisted with `persist()` middleware
- Structure: 7 days × 3 slots = 21 meal slots
- Methods: `addMeal`, `removeMeal`, `clearDay`, `clearAll`
- Used in: `MealPlanner.jsx` L329, `ShoppingList.jsx` L17

**Shopping Store** (`store/shoppingStore.js`):
- Methods: `setItems`, `addCustomItem`, `removeItem`, `toggleCheck`, `clearAll`
- Used in: `ShoppingList.jsx` L18-26

### 7. Framer Motion — Animations

| File | Lines | Animation |
|------|-------|-----------|
| `MealPlanner.jsx` L70-73 | `<motion.div>` fade in/out for modal overlay |
| `MealPlanner.jsx` L84-88 | Scale + slide animation for modal entrance |
| `MealPlanner.jsx` L250-253 | `whileHover` + `whileTap` on search result cards |
| `MealPlanner.jsx` L518 | `<AnimatePresence>` for modal mount/unmount |
| `Account.jsx` L41-44 | `GlassCard` — fade + slide up on mount |
| `Account.jsx` L65-67 | `PillGroup` buttons — `whileTap={{ scale: 0.95 }}` |
| `Account.jsx` L90-93 | `StatCard` — staggered scale animation with `delay` |
| `Account.jsx` L116-121 | `ActionButton` — slide in from left |
| `Account.jsx` L488-491 | Streak badge — spring animation |
| `Account.jsx` L581-586 | Password form — animated height expand/collapse |

### 8. `useNavigate` & `useParams` — Routing

| File | Line | Purpose |
|------|------|---------|
| `MealPlanner.jsx` | L328 | `useNavigate` — navigates to `/recipe/:id` on meal click |

### 9. Form Handling & Validation

| File | Lines | Pattern |
|------|-------|---------|
| `ShoppingList.jsx` | L71-77 | `handleAddCustom` — form submit with `e.preventDefault()` |
| `Account.jsx` | L294-323 | `handleChangePassword` — Firebase re-authentication + password update |

### 10. Async/Await — API Calls & Supabase

| File | Lines | Purpose |
|------|-------|---------|
| `MealPlanner.jsx` L51-63 | `handleSearch` in modal — calls `searchRecipes()` API |
| `ShoppingList.jsx` L37-69 | `handleGenerate` — fetches bulk recipes, consolidates ingredients |
| `Account.jsx` L187-213 | Fetches avatar from Supabase `profiles` table |
| `Account.jsx` L236-262 | `uploadAvatar` — uploads to Supabase Storage, updates profile |

### 11. Conditional Rendering Patterns

| File | Pattern | Purpose |
|------|---------|---------|
| `MealPlanner.jsx` L432-459 | Ternary: meal exists → show image+title, else → show "Add" button |
| `ShoppingList.jsx` L113-135 | Early return: no meals & no items → empty state |
| `Account.jsx` L413-449 | `editingField === "username"` → inline edit form vs display |
| `Account.jsx` L578-644 | `showChangePassword` toggle with `AnimatePresence` |

### 12. `children` Prop Pattern (Composition)

| File | Component | Purpose |
|------|-----------|---------|
| `Account.jsx` L39 | `GlassCard` | Wraps `{children}` in a styled `motion.div` |
| `PageWrapper.jsx` L1 | `PageWrapper` | Wraps `{children}` with fade-in animation |

---

# 🟡 PART 4 — Community

**Presenter covers**: Community recipes listing, viewing community recipes, and recipe submission.

## Files Covered

| File | Purpose |
|------|---------|
| `src/pages/Community.jsx` | Community recipes listing |
| `src/pages/CommunityRecipeDetail.jsx` | Community recipe detail |
| `src/store/communityStore.js` | Zustand store — community recipes |
| `src/components/community/RecipeSubmitForm.jsx` | Recipe submission form |
| `src/components/community/CommunityRecipeCard.jsx` | Community card component |

---

### React Concepts Used in Part 4

### 1. `useState` — Local Component State

| File | Line | Variable | Purpose |
|------|------|----------|---------|
| **RecipeSubmitForm.jsx** | L15 | `open` | Dialog open/close state |
| **RecipeSubmitForm.jsx** | L16-25 | `formData` | Object state with 8 fields (complex state pattern) |
| **RecipeSubmitForm.jsx** | L26 | `errors` | Validation errors object |

### 2. Props — Nested Component Communication

| File | Props | Purpose |
|------|-------|---------|
| `Community.jsx` L47 | `CommunityRecipeCard → recipe` | Passes recipe data object |
| `RecipeSubmitForm.jsx` (internal) | Uses `useCommunityStore` directly | Store access instead of props |

### 3. Zustand Stores — Global State

**Community Store** (`store/communityStore.js`):
- Persisted with `persist()`
- Methods: `addRecipe`, `removeRecipe`
- Used in: `Community.jsx` L10, `CommunityRecipeDetail.jsx` L10, `RecipeSubmitForm.jsx` L14, `CommunityRecipeCard.jsx` L8

### 4. `useParams` — Routing

| File | Line | Purpose |
|------|------|---------|
| `CommunityRecipeDetail.jsx` | L9 | `useParams` — extracts `id` from `/community/:id` |

### 5. Form Handling & Validation

| File | Lines | Pattern |
|------|-------|---------|
| `RecipeSubmitForm.jsx` | L28-38 | `validate()` function checks all required fields, sets `errors` state |
| `RecipeSubmitForm.jsx` | L40-74 | `handleSubmit` — validates → creates recipe object → adds to store → resets form |
| `RecipeSubmitForm.jsx` | L76-84 | `handleDietToggle` — functional `setState` with `prev` to toggle diet tags |

### 6. Conditional Rendering Patterns

| File | Pattern | Purpose |
|------|---------|---------|
| `Community.jsx` L32-50 | Empty state vs recipe grid |

---

## 📊 React Concepts Summary Table

| React Concept | Part 1 | Part 2 | Part 3 | Part 4 |
|--------------|--------|--------|--------|--------|
| `useState` | ✅ App, Register, NavHeader | ✅ Home, RecipeDetail, SearchBar, RecipeCard | ✅ MealPlanner, ShoppingList, Account | ✅ RecipeSubmitForm |
| `useEffect` | — | — | ✅ Account (2 effects for data fetching) | — |
| `useCallback` | — | ✅ Home | ✅ MealPlanner | — |
| `useMemo` | — | — | ✅ MealPlanner (totalMeals) | — |
| `useRef` | ✅ NavHeader | — | — | — |
| Props | ✅ Landing, Login, Register, Tab, Cursor | ✅ SearchBar, RecipeGrid, RecipeCard, NutritionPanel | ✅ AddMealModal, PillGroup, StatCard, ActionButton | ✅ CommunityRecipeCard |
| `children` prop | ✅ PageWrapper | — | ✅ GlassCard | — |
| Conditional Rendering | ✅ App (auth ternary) | ✅ RecipeGrid, RecipeDetail | ✅ MealPlanner, Account, ShoppingList | ✅ Community |
| List Rendering (`.map`) | — | ✅ RecipeGrid, RecipeDetail | ✅ MealPlanner grid, ShoppingList | ✅ Community |
| Custom Hooks | — | ✅ useRecipeSearch, useRecipeDetail, useIngredientSearch | — | — |
| Zustand (Global State) | — | ✅ favouritesStore, filterStore | ✅ mealPlanStore, shoppingStore | ✅ communityStore |
| React Router | ✅ HashRouter, Routes, Route, Outlet | ✅ useParams, Link | ✅ useNavigate | ✅ useParams |
| Suspense + lazy | ✅ App.jsx | — | — | — |
| Framer Motion | ✅ NavHeader cursor | — | ✅ MealPlanner modal, Account animations | — |
| Context (Providers) | ✅ QueryClient, ThemeProvider | — | — | — |
| Async/Await | ✅ Firebase Auth | ✅ API service calls | ✅ Supabase, API calls | — |
| Form Handling | — | ✅ SearchBar | ✅ Account, ShoppingList | ✅ RecipeSubmitForm |

---

## 🎤 Presentation Tips

1. **Part 1 presenter** should demo the landing → login → register flow and explain how `useState` manages auth state across the whole app.
2. **Part 2 presenter** should demo searching recipes, viewing details, adjusting servings, and favouriting — highlight how custom hooks abstract API logic.
3. **Part 3 presenter** should demo adding meals to the planner, generating shopping lists, and editing the account — highlight `useEffect`, `useMemo`, and Zustand stores.
4. **Part 4 presenter** should demo submitting community recipes and viewing community listings — highlight form validation and condition rendering.

> Each presenter should open the actual files and show the specific lines referenced in their section during the presentation.
