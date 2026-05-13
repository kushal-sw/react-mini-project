import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

export function ButtonColorful({
    className,
    label = "Explore Components",
    ...props
}) {
    return (
        <Button
            className={cn(
                "relative h-11 px-6 overflow-hidden border border-white/10",
                "bg-[#1a103c]",
                "hover:scale-[1.02] active:scale-[0.98]",
                "transition-all duration-300 ease-out",
                "group shadow-lg",
                className
            )}
            {...props}>
            {/* Gradient background effect */}
            <div
                className={cn(
                    "absolute inset-0",
                    "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500",
                    "opacity-80 group-hover:opacity-100",
                    "transition-opacity duration-300"
                )} />
            
            {/* Content */}
            <div className="relative flex items-center justify-center gap-2 z-10">
                <span className="text-white font-medium tracking-wide drop-shadow-sm text-md">{label}</span>
                <ArrowUpRight className="w-4 h-4 text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 drop-shadow-sm" />
            </div>
        </Button>
    );
}
