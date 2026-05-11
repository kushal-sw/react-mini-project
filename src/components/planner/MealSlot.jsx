import { useDroppable } from "@dnd-kit/core";
import { useMealPlanStore } from "@/store/mealPlanStore";
import { X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MealSlot({ day, slotType }) {
  const { plan, removeMeal } = useMealPlanStore();
  const id = `${day}-${slotType}`;
  const meal = plan[day][slotType];

  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "relative flex items-center justify-center rounded-lg border-2 transition-all min-h-[5rem] overflow-hidden p-2 h-full w-full",
        isOver
          ? "border-primary bg-primary/10"
          : meal
          ? "border-border bg-card shadow-sm"
          : "border-dashed border-muted bg-muted/20"
      )}
    >
      {meal ? (
        <div className="w-full h-full flex flex-col justify-center relative group">
          <button
            onClick={() => removeMeal(day, slotType)}
            className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-background/90 text-muted-foreground flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground hover:scale-110 opacity-0 group-hover:opacity-100 transition-all shadow-sm z-10"
            aria-label="Remove meal"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          
          <div className="flex flex-col gap-1.5 h-full justify-center">
             <div className="h-10 w-full rounded-md overflow-hidden shrink-0 bg-muted">
               <img src={meal.image} alt={meal.title} className="h-full w-full object-cover" />
             </div>
             <div className="flex flex-col py-0.5 min-w-0">
               <span className="text-xs font-semibold leading-tight line-clamp-2" title={meal.title}>
                 {meal.title}
               </span>
               {meal.readyInMinutes && (
                 <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 mt-0.5">
                   <Clock className="h-2.5 w-2.5" />
                   {meal.readyInMinutes}m
                 </span>
               )}
             </div>
          </div>
        </div>
      ) : (
        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
          {isOver ? "Drop here!" : "+ Drop here"}
        </span>
      )}
    </div>
  );
}
