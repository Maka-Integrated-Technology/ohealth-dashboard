import { useMemo } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { useAvailabilityAppointments } from "~/features/availability/hooks";
import type { AvailabilityAppointment } from "~/features/availability/types";
import { getMonthGridDays } from "./_primitives";

const STATUS_CLASSES: Record<AvailabilityAppointment["status"], string> = {
  confirmed: "bg-blue-50 text-blue-700",
  pending: "bg-amber-50 text-amber-700",
  cancelled: "bg-red-50 text-red-700",
  completed: "bg-gray-50 text-gray-600",
};

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatTimeRange(startsAt: string, endsAt: string) {
  const fmt = (d: Date) =>
    d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  return `${fmt(new Date(startsAt))} - ${fmt(new Date(endsAt))}`;
}

interface MonthlyCalendarProps {
  monthStart: Date;
}

export function MonthlyCalendar({ monthStart }: MonthlyCalendarProps) {
  const days = useMemo(() => getMonthGridDays(monthStart), [monthStart]);

  const rangeFrom = days[0];
  const rangeTo = days[days.length - 1];

  const { data: appointments = [], isLoading } = useAvailabilityAppointments({
    from: rangeFrom.toISOString(),
    to: rangeTo.toISOString(),
  });

  const weeks = useMemo(() => {
    const chunks: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      chunks.push(days.slice(i, i + 7));
    }
    return chunks;
  }, [days]);

  if (isLoading) {
    return <Skeleton className="h-[500px] w-full rounded-lg" />;
  }

  return (
    <div className="border-border overflow-hidden rounded-lg border">
      <div className="grid grid-cols-7 border-b border-border">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label) => (
          <div
            key={label}
            className="text-muted-foreground p-2 text-center text-xs font-medium"
          >
            {label}
          </div>
        ))}
      </div>

      {weeks.map((week, weekIndex) => (
        <div
          key={weekIndex}
          className="grid grid-cols-7 border-b border-border last:border-b-0"
        >
          {week.map((day) => {
            const inMonth = day.getMonth() === monthStart.getMonth();
            const dayAppointments = appointments.filter((apt) =>
              isSameDay(new Date(apt.startsAt), day)
            );

            return (
              <div
                key={day.toISOString()}
                className="border-l border-border p-2 first:border-l-0"
                style={{ minHeight: 90 }}
              >
                <p
                  className={
                    inMonth
                      ? "text-foreground text-sm"
                      : "text-muted-foreground/40 text-sm"
                  }
                >
                  {day.getDate()}
                </p>
                <div className="mt-1 space-y-1">
                  {dayAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className={`truncate rounded px-1.5 py-1 text-xs ${STATUS_CLASSES[apt.status]}`}
                    >
                      <p className="truncate font-medium">
                        {apt.patientName}
                      </p>
                      <p className="truncate text-[10px] opacity-80">
                        {formatTimeRange(apt.startsAt, apt.endsAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}