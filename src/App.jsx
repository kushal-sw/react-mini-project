import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";

// Lazy load pages for performance
const Home = lazy(() => import("./pages/Home"));
const RecipeDetail = lazy(() => import("./pages/RecipeDetail"));
const MealPlanner = lazy(() => import("./pages/MealPlanner"));
const Favourites = lazy(() => import("./pages/Favourites"));
const ShoppingList = lazy(() => import("./pages/ShoppingList"));
const Community = lazy(() => import("./pages/Community"));
const CommunityRecipeDetail = lazy(() => import("./pages/CommunityRecipeDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/*"
            element={
              <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/recipe/:id" element={<RecipeDetail />} />
                  <Route path="/planner" element={<MealPlanner />} />
                  <Route path="/favourites" element={<Favourites />} />
                  <Route path="/shopping" element={<ShoppingList />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/community/:id" element={<CommunityRecipeDetail />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
