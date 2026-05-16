import { useState, useMemo, useCallback } from "react";
import { useMealPlanStore } from "@/store/mealPlanStore";
import { useNavigate } from "react-router-dom";
import PageWrapper from "@/components/layout/PageWrapper";
import BlurText from "@/components/ui/blur-text";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  CalendarDays,
  DollarSign,
  Flame,
  Search,
  X,
  Loader2,
  Trash2,
} from "lucide-react";
import { searchRecipes } from "@/services/spoonacular";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_MAP = {
  Mon: "monday",
  Tue: "tuesday",
  Wed: "wednesday",
  Thu: "thursday",
  Fri: "friday",
  Sat: "saturday",
  Sun: "sunday",
};
const SLOTS = ["Breakfast", "Lunch", "Dinner"];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/* ─── glass token ─── */
const glass = {
  background: "rgba(255,255,255,0.08)",
  backdropFilter: "blur(10px)",
};

/* ─── Search Modal ─── */
function AddMealModal({ day, slot, onClose, onAdd }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await searchRecipes(query);
      setResults(data?.results || []);
    } catch (e) {
      console.error("Search error:", e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const fullDay = DAY_MAP[day];
  const slotLower = slot.toLowerCase();

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed z-50 flex items-center justify-center p-4"
      style={{
        top: "80px",
        left: 0,
        right: 0,
        bottom: 0,
        background: "transparent",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md flex flex-col"
        style={{
          background: "#1a1a1a",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 24,
          boxShadow:
            "0 24px 48px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
          maxHeight: "calc(100vh - 160px)",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 pb-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
        >
          <div>
            <h3
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#fff",
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              Add meal
            </h3>
            <p
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.6)",
                marginTop: 4,
              }}
            >
              {day} · {slot}
            </p>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer transition-colors hover:bg-white/10"
            style={{
              width: 36,
              height: 36,
              padding: 0,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X className="w-5 h-5" style={{ color: "rgba(255,255,255,0.7)" }} />
          </button>
        </div>

        {/* Search bar */}
        <div style={{ padding: "20px 24px" }}>
          <div
            className="flex items-center gap-3 transition-colors hover:bg-white/10 focus-within:bg-white/10"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 20,
              padding: "10px 10px 10px 16px",
            }}
          >
            <Search
              className="w-5 h-5 flex-shrink-0"
              style={{ color: "rgba(255,255,255,0.5)" }}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search recipes..."
              autoFocus
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#fff",
                fontSize: 15,
              }}
              className="placeholder-white/40"
            />
            <button
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              className="cursor-pointer transition-all hover:scale-105 active:scale-95"
              style={{
                padding: "8px 16px",
                borderRadius: 14,
                fontSize: 13,
                fontWeight: 600,
                color: "#fff",
                background: "rgba(168,85,247,0.8)",
                backdropFilter: "blur(4px)",
                border: "1px solid rgba(255,255,255,0.2)",
                opacity: loading || !query.trim() ? 0.5 : 1,
              }}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Search"
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        <div
          className="flex-1 overflow-y-auto custom-scrollbar"
          style={{ padding: "0 20px 20px" }}
        >
          <div className="space-y-2">
            {loading && (
              <div
                className="flex items-center justify-center"
                style={{ padding: "48px 0" }}
              >
                <Loader2
                  className="w-6 h-6 animate-spin"
                  style={{ color: "#a855f7" }}
                />
              </div>
            )}

            {!loading && searched && results.length === 0 && (
              <p
                style={{
                  textAlign: "center",
                  color: "rgba(255,255,255,0.3)",
                  fontSize: 13,
                  padding: "32px 0",
                }}
              >
                No recipes found. Try a different search.
              </p>
            )}

            {!loading && !searched && (
              <p
                style={{
                  textAlign: "center",
                  color: "rgba(255,255,255,0.4)",
                  fontSize: 14,
                  padding: "40px 0",
                }}
              >
                Search for a recipe to add to {day}'s {slot.toLowerCase()}
              </p>
            )}

            {!loading &&
              results.map((recipe) => (
                <motion.button
                  key={recipe.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onAdd(fullDay, slotLower, {
                      id: recipe.id,
                      title: recipe.title,
                      image: recipe.image,
                      readyInMinutes: recipe.readyInMinutes,
                      servings: recipe.servings,
                    });
                    onClose();
                  }}
                  className="w-full cursor-pointer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: 12,
                    borderRadius: 14,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    textAlign: "left",
                    transition: "background 0.2s",
                  }}
                >
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 10,
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#fff",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        margin: 0,
                      }}
                    >
                      {recipe.title}
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: "rgba(255,255,255,0.4)",
                        marginTop: 2,
                      }}
                    >
                      {recipe.readyInMinutes && `${recipe.readyInMinutes} min`}
                      {recipe.servings && ` · ${recipe.servings} servings`}
                    </p>
                  </div>
                  <Plus
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  />
                </motion.button>
              ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Page ─── */
export default function MealPlanner() {
  const navigate = useNavigate();
  const { plan, addMeal, removeMeal } = useMealPlanStore();
  const [modalTarget, setModalTarget] = useState(null); // { day, slot }

  // Count total planned meals
  const totalMeals = useMemo(() => {
    let count = 0;
    if (plan) {
      Object.values(plan).forEach((daySlots) => {
        Object.values(daySlots).forEach((meal) => {
          if (meal) count++;
        });
      });
    }
    return count;
  }, [plan]);

  const getMeal = (day, slot) => {
    const fullDay = DAY_MAP[day];
    return plan?.[fullDay]?.[slot.toLowerCase()] || null;
  };

  const handleCellClick = (day, slot) => {
    const meal = getMeal(day, slot);
    if (meal) {
      // Navigate to recipe detail if meal exists
      navigate(`/recipe/${meal.id}`);
    } else {
      // Open search modal to add a meal
      setModalTarget({ day, slot });
    }
  };

  const handleRemove = (e, day, slot) => {
    e.stopPropagation();
    const fullDay = DAY_MAP[day];
    removeMeal(fullDay, slot.toLowerCase());
  };

  return (
    <PageWrapper>
      <div
        className="space-y-8"
        style={{ paddingTop: "80px", paddingBottom: "80px" }}
      >
        {/* Greeting */}
        <div className="pt-4 space-y-1">
          <BlurText
            text={`${getGreeting()} 👋`}
            delay={200}
            animateBy="words"
            direction="top"
            className="text-4xl md:text-5xl font-bold tracking-tight justify-start text-white"
          />
          <p className="text-white/60 text-lg font-medium">
            Here's your week at a glance
          </p>
        </div>

        {/* Weekly Grid */}
        <div className="w-full overflow-x-auto pb-2">
          <div className="grid grid-cols-[auto_repeat(7,1fr)] gap-2 min-w-[720px]">
            {/* Header Row */}
            <div className="p-3" /> {/* Empty corner cell */}
            {DAYS.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-semibold text-white/80 py-3 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.08)",
                }}
              >
                {day}
              </div>
            ))}
            {/* Meal Rows */}
            {SLOTS.map((slot) => (
              <>
                {/* Row Label */}
                <div
                  key={`label-${slot}`}
                  className="flex items-center text-sm font-semibold text-white/70 pr-3"
                >
                  {slot}
                </div>

                {/* Day Cells */}
                {DAYS.map((day) => {
                  const meal = getMeal(day, slot);
                  return (
                    <button
                      key={`${day}-${slot}`}
                      onClick={() => handleCellClick(day, slot)}
                      className="group rounded-2xl p-3 min-h-[90px] flex flex-col items-center justify-center gap-1 transition-all duration-200 hover:scale-[1.03] hover:shadow-lg cursor-pointer relative"
                      style={{
                        background: meal
                          ? "rgba(168,85,247,0.25)"
                          : "rgba(255,255,255,0.08)",
                        backdropFilter: "blur(10px)",
                        border: meal
                          ? "1px solid rgba(255,255,255,0.1)"
                          : "1px dashed rgba(255,255,255,0.2)",
                      }}
                    >
                      {meal ? (
                        <>
                          {/* Remove button */}
                          <div
                            onClick={(e) => handleRemove(e, day, slot)}
                            className="absolute top-1.5 right-1.5 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3 text-red-400" />
                          </div>
                          {meal.image && (
                            <img
                              src={meal.image}
                              alt={meal.title}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          )}
                          <span className="text-xs text-white/90 font-medium text-center leading-tight line-clamp-2">
                            {meal.title}
                          </span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-5 w-5 text-white/30 group-hover:text-white/60 transition-colors" />
                          <span className="text-xs text-white/30 group-hover:text-white/60 font-medium transition-colors">
                            Add
                          </span>
                        </>
                      )}
                    </button>
                  );
                })}
              </>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            className="rounded-2xl p-5 border border-white/10 flex items-center gap-4"
            style={glass}
          >
            <div className="h-11 w-11 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <CalendarDays className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalMeals}</p>
              <p className="text-sm text-white/50 font-medium">Meals planned</p>
            </div>
          </div>

          <div
            className="rounded-2xl p-5 border border-white/10 flex items-center gap-4"
            style={glass}
          >
            <div className="h-11 w-11 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                ${totalMeals > 0 ? (totalMeals * 4.5).toFixed(0) : "—"}
              </p>
              <p className="text-sm text-white/50 font-medium">Est. budget</p>
            </div>
          </div>

          <div
            className="rounded-2xl p-5 border border-white/10 flex items-center gap-4"
            style={glass}
          >
            <div className="h-11 w-11 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Flame className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {totalMeals > 0 ? Math.round(totalMeals * 520) : "—"}
              </p>
              <p className="text-sm text-white/50 font-medium">
                Calories today
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Meal Modal */}
      <AnimatePresence>
        {modalTarget && (
          <AddMealModal
            day={modalTarget.day}
            slot={modalTarget.slot}
            onClose={() => setModalTarget(null)}
            onAdd={(day, slot, recipe) => {
              addMeal(day, slot, recipe);
            }}
          />
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
