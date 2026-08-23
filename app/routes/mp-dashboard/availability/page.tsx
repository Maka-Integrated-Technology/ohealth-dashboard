import { useMemo, useState } from "react";
import { CalendarPlus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import {
  useWeeklySchedule,
  useUpdateDaySchedule,
} from "~/features/availability/hooks";
import type { DaySchedule, WeekDay } from "~/features/availability/types";
import { ScheduleToggle } from "./_sections/schedule-toggle";
import { WeeklyCalendar } from "./_sections/weekly-calendar";
import { WeeklySchedulePanel } from "./_sections/weekly-schedule-panel";
import { EditScheduleDialog } from "./_sections/edit-schedule-dialog";
import { MonthlyCalendar } from "./_sections/monthly-calendar";
import {
  getWeekStart,
  formatWeekLabel,
  getMonthStart,
} from "./_sections/_primitives";

type ScheduleMode = "weekly" | "monthly";

function hasAnySchedule(schedule?: { days: DaySchedule[] }) {
  return Boolean(schedule?.days.some((d) => d.available));
}

export default function AvailabilityPage() {
  const [mode, setMode] = useState<ScheduleMode>("weekly");
  const [weekAnchor, setWeekAnchor] = useState(() => new Date());
  const [monthAnchor, setMonthAnchor] = useState(() => new Date());
  const [editingDay, setEditingDay] = useState<DaySchedule | null>(null);

  const { data: schedule, isLoading, isError } = useWeeklySchedule();
  const { mutateAsync: updateDaySchedule, isPending: isSaving } =
    useUpdateDaySchedule();

  const weekStart = useMemo(() => getWeekStart(weekAnchor), [weekAnchor]);
  const monthStart = useMemo(() => getMonthStart(monthAnchor), [monthAnchor]);

  const isEmpty = !isLoading && !hasAnySchedule(schedule);

  function handlePrevWeek() {
    const d = new Date(weekAnchor);
    d.setDate(d.getDate() - 7);
    setWeekAnchor(d);
  }

  function handleNextWeek() {
    const d = new Date(weekAnchor);
    d.setDate(d.getDate() + 7);
    setWeekAnchor(d);
  }

  function handlePrevMonth() {
    const d = new Date(monthAnchor);
    d.setMonth(d.getMonth() - 1);
    setMonthAnchor(d);
  }

  function handleNextMonth() {
    const d = new Date(monthAnchor);
    d.setMonth(d.getMonth() + 1);
    setMonthAnchor(d);
  }

  async function handleToggleDay(day: WeekDay, available: boolean) {
    const current = schedule?.days.find((d) => d.day === day);
    await updateDaySchedule({
      day,
      available,
      periods: current?.periods.map((p) => ({ from: p.from, to: p.to })) ?? [],
    });
  }

  async function handleRemovePeriod(day: WeekDay, periodId: string) {
    const current = schedule?.days.find((d) => d.day === day);
    if (!current) return;
    const remainingPeriods = current.periods
      .filter((p) => p.id !== periodId)
      .map((p) => ({ from: p.from, to: p.to }));
    await updateDaySchedule({
      day,
      available: current.available,
      periods: remainingPeriods,
    });
  }

  function handleEditDay(day: WeekDay) {
    const target = schedule?.days.find((d) => d.day === day);
    if (target) setEditingDay(target);
  }

  async function handleSaveSchedule(params: {
    available: boolean;
    periods: { from: string; to: string }[];
    copyToDays: WeekDay[];
  }) {
    if (!editingDay) return;
    await updateDaySchedule({
      day: editingDay.day,
      available: params.available,
      periods: params.periods,
      copyToDays: params.copyToDays,
    });
    setEditingDay(null);
  }

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

        {!isLoading && !isError && !isEmpty && schedule && (
          <>
            {mode === "weekly" && (
              <>
                <div className="mb-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handlePrevWeek}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <span className="text-foreground text-sm font-medium">
                    {formatWeekLabel(weekStart)}
                  </span>
                  <button
                    type="button"
                    onClick={handleNextWeek}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>

                <div className="flex flex-col gap-6 lg:flex-row">
                  <div className="flex-1">
                    <WeeklyCalendar weekStart={weekStart} />
                  </div>
                  <WeeklySchedulePanel
                    days={schedule.days}
                    onToggleDay={handleToggleDay}
                    onRemovePeriod={handleRemovePeriod}
                    onEditDay={handleEditDay}
                  />
                </div>
              </>
            )}

            {mode === "monthly" && (
              <>
                <div className="mb-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <span className="text-foreground text-sm font-medium">
                    {monthStart.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>

                <MonthlyCalendar monthStart={monthStart} />
              </>
            )}
          </>
        )}
      </div>

      <EditScheduleDialog
        key={editingDay?.day ?? "none"}
        day={editingDay}
        onOpenChange={(open) => !open && setEditingDay(null)}
        onSave={handleSaveSchedule}
        isSaving={isSaving}
      />
    </div>
  );
}
