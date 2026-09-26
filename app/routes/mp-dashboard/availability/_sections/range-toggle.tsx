import { cn } from "~/lib/utils/helpers";

type ScheduleMode = "weekly" | "monthly";

interface RangeToggleProps {
  mode: ScheduleMode;
  onModeChange: (mode: ScheduleMode) => void;
}

export function RangeToggle({ mode, onModeChange }: RangeToggleProps) {
  return (
    <div className="bg-muted/50 flex w-fit items-center gap-1 rounded-lg p-1">
      <button
        type="button"
        onClick={() => onModeChange("weekly")}
        className={cn(
          "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
          mode === "weekly"
            ? "bg-background text-primary shadow-sm"
            : "text-muted-foreground"
        )}
      >
        Week
      </button>
      <button
        type="button"
        onClick={() => onModeChange("monthly")}
        className={cn(
          "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
          mode === "monthly"
            ? "bg-background text-primary shadow-sm"
            : "text-muted-foreground"
        )}
      >
        Month
      </button>
    </div>
  );
}
