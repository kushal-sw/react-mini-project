import MealSlot from "./MealSlot";
import { useMealPlanStore } from "@/store/mealPlanStore";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const MEALS = [
  { id: "breakfast", label: "Breakfast", icon: "🌅" },
  { id: "lunch", label: "Lunch", icon: "☀️" },
  { id: "dinner", label: "Dinner", icon: "🌙" },
];

export default function WeeklyCalendar() {
  const { clearAll, clearDay } = useMealPlanStore();

  return (
    <div className="flex flex-col h-full bg-background border rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/20">
        <h2 className="text-xl font-bold">Weekly Plan</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={clearAll}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Week
        </Button>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-x-auto overflow-y-auto">
        <div className="min-w-[800px] h-full grid grid-cols-7 grid-rows-[auto_1fr_1fr_1fr] divide-x divide-y border-b">
          {/* Day Headers */}
          {DAYS.map((day) => (
            <div key={day} className="flex flex-col items-center py-3 bg-muted/30">
              <span className="text-sm font-bold capitalize">{day}</span>
              <button
                onClick={() => clearDay(day)}
                className="text-[10px] text-muted-foreground hover:text-destructive mt-1 transition-colors font-medium px-2 py-0.5 rounded-full hover:bg-destructive/10"
              >
                Clear Day
              </button>
            </div>
          ))}

          {/* Meal Rows */}
          {MEALS.map((meal) => (
            <div key={meal.id} className="contents">
              {DAYS.map((day) => (
                <div key={`${day}-${meal.id}`} className="p-2 relative flex flex-col gap-1 min-h-[140px] bg-background">
                  {/* Label */}
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 px-1">
                    <span className="text-sm leading-none">{meal.icon}</span> 
                    {meal.label}
                  </div>
                  <div className="flex-1 w-full">
                    <MealSlot day={day} slotType={meal.id} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
