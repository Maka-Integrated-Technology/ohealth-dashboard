import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { formatWeekRangeLabel, getWeekRange } from "./_primitives";

interface DateRangePickerProps {
  from: Date;
  to: Date;
  onChange: (range: { from: Date; to: Date }) => void;
}

export function DateRangePicker({ from, to, onChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);

  function handleSelect(date: Date | undefined) {
    if (!date) return;
    const { start, end } = getWeekRange(date);
    onChange({ from: start, to: end });
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="gap-2 border-0 px-2 font-normal text-foreground"
        >
          <CalendarIcon className="size-4 text-muted-foreground" />
          {formatWeekRangeLabel(from, to)}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar mode="single" selected={from} onSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  );
}