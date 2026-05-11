import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Beef, Wheat, Droplets, Leaf } from "lucide-react";
import { extractMacros, scaleMacros } from "@/utils/nutritionHelpers";

/**
 * NutritionPanel — displays 5 key macros per serving.
 * Values dynamically scale when the user adjusts serving size.
 *
 * @param {{ nutrition: Object, originalServings: number, currentServings: number }} props
 */
export default function NutritionPanel({
  nutrition,
  originalServings = 1,
  currentServings = 1,
}) {
  if (!nutrition || !nutrition.nutrients) {
    return null;
  }

  const baseMacros = extractMacros(nutrition.nutrients);
  const macros = scaleMacros(baseMacros, originalServings, currentServings);

  const stats = [
    {
      label: "Calories",
      value: macros.calories,
      unit: "kcal",
      icon: Flame,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      label: "Protein",
      value: macros.protein,
      unit: "g",
      icon: Beef,
      color: "text-red-500",
      bg: "bg-red-50",
    },
    {
      label: "Carbs",
      value: macros.carbs,
      unit: "g",
      icon: Wheat,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      label: "Fat",
      value: macros.fat,
      unit: "g",
      icon: Droplets,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Fibre",
      value: macros.fiber,
      unit: "g",
      icon: Leaf,
      color: "text-green-500",
      bg: "bg-green-50",
    },
  ];

  return (
    <Card className="border-2 border-dashed border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Flame className="h-4 w-4 text-primary" />
          Nutrition per serving
        </CardTitle>
        {currentServings !== originalServings && (
          <p className="text-xs text-muted-foreground">
            Scaled for {currentServings} serving{currentServings !== 1 ? "s" : ""}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {stats.map(({ label, value, unit, icon: Icon, color, bg }) => (
            <div
              key={label}
              className={`flex items-center gap-3 rounded-xl ${bg} p-3 transition-all hover:scale-[1.02]`}
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ${color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-lg font-bold leading-none tabular-nums">
                  {value}
                  <span className="text-xs font-normal text-muted-foreground ml-0.5">
                    {unit}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
