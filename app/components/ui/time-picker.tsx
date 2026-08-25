import { useState } from "react";
import { Clock } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils/helpers";

const HOURS = Array.from({ length: 12 }, (_, i) =>
  (i + 1).toString().padStart(2, "0")
);
const MINUTES = Array.from({ length: 60 }, (_, i) =>
  i.toString().padStart(2, "0")
);
const PERIODS = ["AM", "PM"] as const;

function to24Hour(hour12: string, minute: string, period: "AM" | "PM") {
  let h = Number(hour12) % 12;
  if (period === "PM") h += 12;
  return `${h.toString().padStart(2, "0")}:${minute}`;
}

function from24Hour(time: string) {
  const [hourStr, minute] = time.split(":");
  const hour = Number(hourStr);
  const period: "AM" | "PM" = hour >= 12 ? "PM" : "AM";
  const hour12 = (hour % 12 === 0 ? 12 : hour % 12).toString().padStart(2, "0");
  return { hour12, minute, period };
}

function formatDisplay(time: string) {
  const { hour12, minute, period } = from24Hour(time);
  return `${hour12}:${minute} ${period}`;
}

interface TimePickerProps {
  value: string; // 24h "HH:mm"
  onChange: (value: string) => void;
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const { hour12, minute, period } = from24Hour(value);

  function handleSelect(field: "hour" | "minute" | "period", val: string) {
    const current = from24Hour(value);
    const next = {
      hour12: field === "hour" ? val : current.hour12,
      minute: field === "minute" ? val : current.minute,
      period: field === "period" ? (val as "AM" | "PM") : current.period,
    };
    onChange(to24Hour(next.hour12, next.minute, next.period));
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="border-input bg-input-background flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm"
        >
          <Clock className="text-muted-foreground size-4 shrink-0" />
          {formatDisplay(value)}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-auto p-0"
        onWheel={(e) => e.stopPropagation()}>
        <div className="divide-border flex divide-x">
          <TimeColumn
            items={HOURS}
            selected={hour12}
            onSelect={(v) => handleSelect("hour", v)}
          />
          <TimeColumn
            items={MINUTES}
            selected={minute}
            onSelect={(v) => handleSelect("minute", v)}
          />
          <TimeColumn
            items={[...PERIODS]}
            selected={period}
            onSelect={(v) => handleSelect("period", v)}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

function TimeColumn({
  items,
  selected,
  onSelect,
}: {
  items: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="max-h-52 w-16 overflow-y-auto py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onSelect(item)}
          className={cn(
            "w-full px-3 py-1.5 text-center text-sm transition-colors",
            item === selected
              ? "bg-primary text-primary-foreground font-medium"
              : "text-foreground hover:bg-muted"
          )}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
