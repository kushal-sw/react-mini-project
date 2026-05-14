import { useMemo } from "react";
import { useMealPlanStore } from "@/store/mealPlanStore";
import { useNavigate } from "react-router-dom";
import PageWrapper from "@/components/layout/PageWrapper";
import BlurText from "@/components/ui/blur-text";
import { Plus, CalendarDays, DollarSign, Flame } from "lucide-react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOTS = ["Breakfast", "Lunch", "Dinner"];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function MealPlanner() {
  const navigate = useNavigate();
  const { plan } = useMealPlanStore();

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
    return plan?.[day.toLowerCase()]?.[slot.toLowerCase()] || null;
  };

  return (
    <PageWrapper>
      <div className="space-y-8">
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
                      onClick={() => navigate("/planner")}
                      className="group rounded-2xl p-3 min-h-[90px] flex flex-col items-center justify-center gap-1 transition-all duration-200 hover:scale-[1.03] hover:shadow-lg cursor-pointer border border-white/10"
                      style={{
                        background: meal
                          ? "rgba(168,85,247,0.25)"
                          : "rgba(255,255,255,0.08)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      {meal ? (
                        <>
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
            style={{
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(10px)",
            }}
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
            style={{
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(10px)",
            }}
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
            style={{
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="h-11 w-11 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Flame className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {totalMeals > 0 ? Math.round(totalMeals * 520) : "—"}
              </p>
              <p className="text-sm text-white/50 font-medium">Calories today</p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
