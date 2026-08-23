import { Clock, CalendarDays } from "lucide-react";
import { cn } from "~/lib/utils/helpers";

type ScheduleMode = "weekly" | "monthly";

interface ScheduleToggleProps {
  mode: ScheduleMode;
  onModeChange: (mode: ScheduleMode) => void;
}

export function ScheduleToggle({ mode, onModeChange }: ScheduleToggleProps) {
  return (
    <div className="bg-muted/50 flex w-fit items-center gap-1 rounded-lg p-1">
      <button
        type="button"
        onClick={() => onModeChange("weekly")}
        className={cn(
          "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
          mode === "weekly"
            ? "bg-background text-primary shadow-sm"
            : "text-muted-foreground"
        )}
      >
        <Clock className="size-4" />
        Weekly Schedule
      </button>
      <button
        type="button"
        onClick={() => onModeChange("monthly")}
        className={cn(
          "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
          mode === "monthly"
            ? "bg-background text-primary shadow-sm"
            : "text-muted-foreground"
        )}
      >
        <CalendarDays className="size-4" />
        Monthly Schedule
      </button>
    </div>
  );
}
