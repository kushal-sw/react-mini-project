import { useDraggable } from "@dnd-kit/core";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DraggableRecipeCard({ recipe, isOverlay = false }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: isOverlay ? `${recipe.id}-overlay` : recipe.id,
    data: recipe,
    disabled: isOverlay,
  });

  return (
    <div
      ref={isOverlay ? undefined : setNodeRef}
      {...(isOverlay ? {} : listeners)}
      {...(isOverlay ? {} : attributes)}
      className={cn(
        "flex items-center gap-3 rounded-lg border bg-card p-2 shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors",
        isOverlay && "shadow-lg border-primary/50 scale-105 rotate-2",
        isDragging && !isOverlay && "opacity-50 border-dashed"
      )}
    >
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col min-w-0">
        <h4 className="text-sm font-medium leading-tight line-clamp-2">
          {recipe.title}
        </h4>
        {recipe.readyInMinutes && (
          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {recipe.readyInMinutes} min
          </div>
        )}
      </div>
    </div>
  );
}
