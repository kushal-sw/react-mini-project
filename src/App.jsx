import { Suspense, lazy, useState } from "react";
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
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Landing = lazy(() => import("./pages/Landing"));

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  return (
    <BrowserRouter>
      <Routes>
        {!isAuthenticated ? (
          <Route path="*" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>}>
              {showLanding ? (
                <Landing 
                  onSignIn={() => {
                    setIsRegistering(false);
                    setShowLanding(false);
                  }}
                  onSignUp={() => {
                    setIsRegistering(true);
                    setShowLanding(false);
                  }}
                />
              ) : isRegistering ? (
                <Register 
                  onRegister={() => setIsAuthenticated(true)} 
                  onLoginClick={() => setIsRegistering(false)} 
                />
              ) : (
                <Login 
                  onLogin={() => setIsAuthenticated(true)} 
                  onRegisterClick={() => setIsRegistering(true)} 
                />
              )}
            </Suspense>
          } />
        ) : (
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
        )}
      </Routes>
    </BrowserRouter>
  );
}
