import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { TimePicker } from "~/components/ui/time-picker";
import type { DaySchedule, WeekDay } from "~/features/availability/types";

const ALL_DAYS: WeekDay[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface EditablePeriod {
  from: string;
  to: string;
}

interface EditScheduleDialogProps {
  day: DaySchedule | null;
  onOpenChange: (open: boolean) => void;
  onSave: (params: {
    available: boolean;
    periods: EditablePeriod[];
    copyToDays: WeekDay[];
  }) => void;
  isSaving: boolean;
}

export function EditScheduleDialog({
  day,
  onOpenChange,
  onSave,
  isSaving,
}: EditScheduleDialogProps) {
  const [available, setAvailable] = useState(day?.available ?? true);
  const [periods, setPeriods] = useState<EditablePeriod[]>(
    day && day.periods.length > 0
      ? day.periods.map((p) => ({ from: p.from, to: p.to }))
      : [{ from: "09:00", to: "12:00" }]
  );
  const [copyToDays, setCopyToDays] = useState<WeekDay[]>([]);

  function addPeriod() {
    setPeriods((prev) => [...prev, { from: "09:00", to: "12:00" }]);
  }

  function removePeriod(index: number) {
    setPeriods((prev) => prev.filter((_, i) => i !== index));
  }

  function updatePeriod(index: number, field: "from" | "to", value: string) {
    setPeriods((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  }

  function toggleCopyDay(targetDay: WeekDay) {
    setCopyToDays((prev) =>
      prev.includes(targetDay)
        ? prev.filter((d) => d !== targetDay)
        : [...prev, targetDay]
    );
  }

  function handleSave() {
    onSave({ available, periods, copyToDays });
  }

  const otherDays = ALL_DAYS.filter((d) => d !== day?.day);

  return (
    <Dialog open={Boolean(day)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {day && (
          <>
            <DialogHeader>
              <DialogTitle>Edit Schedule - {fullDayName(day.day)}</DialogTitle>
            </DialogHeader>

            <div className="bg-muted flex items-center justify-between rounded-lg p-3">
              <div>
                <p className="text-foreground text-sm font-medium">
                  Available to Book
                </p>
                <p className="text-muted-foreground text-xs">
                  Accepting patient appointments.
                </p>
              </div>
              <Switch checked={available} onCheckedChange={setAvailable} />
            </div>

            {available && (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-foreground text-sm font-medium">
                    Active Appointment Time
                  </p>
                  <button
                    type="button"
                    onClick={addPeriod}
                    className="text-primary flex items-center gap-1 text-xs font-medium hover:underline"
                  >
                    <Plus className="size-3.5" />
                    Add Period
                  </button>
                </div>

                <div className="space-y-3">
                  {periods.map((period, index) => (
                    <div key={index} className="flex items-end gap-2">
                      <span className="text-muted-foreground w-6 text-xs">
                        #{index + 1}
                      </span>
                      <div className="flex-1 space-y-1">
                        <label className="text-muted-foreground text-xs">
                          From
                        </label>
                        <TimePicker
                          value={period.from}
                          onChange={(v) => updatePeriod(index, "from", v)}
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <label className="text-muted-foreground text-xs">
                          To
                        </label>
                        <TimePicker
                          value={period.to}
                          onChange={(v) => updatePeriod(index, "to", v)}
                        />
                      </div>
                      {periods.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePeriod(index)}
                          className="text-muted-foreground hover:text-destructive p-2"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-muted-foreground mb-2 text-xs">
                Copy schedule to other days
              </p>
              <div className="grid grid-cols-3 gap-2">
                {otherDays.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleCopyDay(d)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      copyToDays.includes(d)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-foreground hover:bg-muted"
                    }`}
                  >
                    {fullDayName(d)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                className="flex-1"
                isLoading={isSaving}
                onClick={handleSave}
              >
                Save Schedule
              </Button>
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function fullDayName(day: WeekDay): string {
  const map: Record<WeekDay, string> = {
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
    Sun: "Sunday",
  };
  return map[day];
}
