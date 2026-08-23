import { Pencil, X } from "lucide-react";
import { Switch } from "~/components/ui/switch";
import type { DaySchedule } from "~/features/availability/types";

function formatTime(time: string) {
  const [hourStr, minuteStr] = time.split(":");
  const hour = Number(hourStr);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minuteStr} ${period}`;
}

interface WeeklySchedulePanelProps {
  days: DaySchedule[];
  onToggleDay: (day: DaySchedule["day"], available: boolean) => void;
  onRemovePeriod: (day: DaySchedule["day"], periodId: string) => void;
  onEditDay: (day: DaySchedule["day"]) => void;
}

export function WeeklySchedulePanel({
  days,
  onToggleDay,
  onRemovePeriod,
  onEditDay,
}: WeeklySchedulePanelProps) {
  return (
    <div className="w-full lg:w-80">
      <div
        className="max-h-[600px] divide-y divide-border overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        onWheel={(e) => e.stopPropagation()}
      >
        {days.map((d) => (
          <div key={d.day} className="py-3 first:pt-0">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  checked={d.available}
                  onCheckedChange={(checked) => onToggleDay(d.day, checked)}
                />
                <span className="text-foreground text-sm font-medium">
                  {d.day}
                </span>
              </div>
            </div>

            {d.available ? (
              <div className="ml-11 flex flex-wrap gap-2">
                {d.periods.map((p) => (
                  <span
                    key={p.id}
                    className="border-border bg-muted text-muted-foreground flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs"
                  >
                    {formatTime(p.from)} - {formatTime(p.to)}
                    <button
                      type="button"
                      onClick={() => onRemovePeriod(d.day, p.id)}
                      className="hover:text-destructive"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground/60 ml-11 text-xs">
                Unavailable
              </p>
            )}

            <button
              type="button"
              onClick={() => onEditDay(d.day)}
              className="text-primary mt-2 ml-11 flex items-center gap-1 text-xs font-medium hover:underline"
            >
              <Pencil className="size-3" />
              Edit Schedule
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
