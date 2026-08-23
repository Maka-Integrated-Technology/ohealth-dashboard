import { useState } from "react";
import { CalendarPlus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { useWeeklySchedule } from "~/features/availability/hooks";
import { ScheduleToggle } from "./_sections/schedule-toggle";

type ScheduleMode = "weekly" | "monthly";

function hasAnySchedule(schedule?: { days: { available: boolean }[] }) {
  return Boolean(schedule?.days.some((d) => d.available));
}

export default function AvailabilityPage() {
  const [mode, setMode] = useState<ScheduleMode>("weekly");
  const { data: schedule, isLoading, isError } = useWeeklySchedule();

  const isEmpty = !isLoading && !hasAnySchedule(schedule);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-foreground text-2xl font-bold">Availability</h1>
        <p className="text-muted-foreground text-sm">
          Set your working hours and control your appointment schedule.
        </p>
      </div>

      <ScheduleToggle mode={mode} onModeChange={setMode} />

      <div className="mt-6">
        {isLoading && <Skeleton className="h-80 w-full rounded-lg" />}

        {isError && (
          <div className="border-border bg-card rounded-lg border p-12 text-center">
            <p className="text-muted-foreground text-sm">
              Couldn&apos;t load your availability. Try refreshing the page.
            </p>
          </div>
        )}

        {isEmpty && !isError && (
          <div className="border-border bg-card mx-auto flex max-w-md flex-col items-center rounded-lg border p-12 text-center">
            <CalendarPlus className="text-muted-foreground mb-4 size-10" />
            <p className="text-foreground text-sm font-semibold">
              No available schedule
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              Set your schedule so patients can start booking appointments.
            </p>
            <Button className="mt-4">Create Schedule</Button>
          </div>
        )}

        {!isLoading && !isError && !isEmpty && (
          <p className="text-muted-foreground text-sm">
            Schedule views coming next.
          </p>
        )}
      </div>
    </div>
  );
}