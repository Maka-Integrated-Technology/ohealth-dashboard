import { useMemo } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { useAvailabilityAppointments } from "~/features/availability/hooks";
import type { AvailabilityAppointment } from "~/features/availability/types";

const ROW_HEIGHT_PX = 64;
const START_HOUR = 9;
const END_HOUR = 17;

const STATUS_CARD_CLASSES: Record<AvailabilityAppointment["status"], string> =
  {
    confirmed: "bg-blue-50 border-blue-200 text-blue-900",
    pending: "bg-amber-50 border-amber-200 text-amber-900",
    cancelled: "bg-red-50 border-red-200 text-red-900",
    completed: "bg-gray-50 border-gray-200 text-gray-600",
  };

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getWeekDays(from: Date): Date[] {
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(from);
    d.setDate(from.getDate() + i);
    days.push(d);
  }
  return days;
}

function getCardPosition(apt: AvailabilityAppointment) {
  const start = new Date(apt.startsAt);
  const end = new Date(apt.endsAt);
  const startMinutes =
    (start.getHours() - START_HOUR) * 60 + start.getMinutes();
  const durationMinutes = (end.getTime() - start.getTime()) / 60000;
  const top = (startMinutes / 60) * ROW_HEIGHT_PX + 4;
  const height = (durationMinutes / 60) * ROW_HEIGHT_PX - 8;
  return { top, height: Math.max(height, 48) };
}

interface WeeklyCalendarProps {
  weekStart: Date;
}

export function WeeklyCalendar({ weekStart }: WeeklyCalendarProps) {
  const weekEnd = useMemo(() => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + 6);
    d.setHours(23, 59, 59, 999);
    return d;
  }, [weekStart]);

  const { data: appointments = [], isLoading } = useAvailabilityAppointments({
    from: weekStart.toISOString(),
    to: weekEnd.toISOString(),
  });

  const days = useMemo(() => getWeekDays(weekStart), [weekStart]);
  const hours = Array.from(
    { length: END_HOUR - START_HOUR },
    (_, i) => START_HOUR + i
  );

  if (isLoading) {
    return <Skeleton className="h-[500px] w-full rounded-lg" />;
  }

  return (
    <div className="border-border overflow-x-auto rounded-lg border">
      <div
        className="grid min-w-[600px]"
        style={{ gridTemplateColumns: `70px repeat(7, 1fr)` }}
      >
        <div className="border-border border-b p-2" />
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className="border-border border-b border-l p-2 text-center"
          >
            <p className="text-muted-foreground text-xs">
              {day.toLocaleDateString("en-US", { weekday: "short" })}
            </p>
            <p className="text-foreground text-sm font-semibold">
              {day.getDate()}
            </p>
          </div>
        ))}

        {hours.map((hour) => (
          <div key={hour} className="contents">
            <div
              className="border-border text-muted-foreground border-b p-2 text-right text-xs"
              style={{ height: ROW_HEIGHT_PX }}
            >
              {hour.toString().padStart(2, "0")}:00
            </div>
            {days.map((day) => (
              <div
                key={`${hour}-${day.toISOString()}`}
                className="border-border relative border-b border-l"
                style={{ height: ROW_HEIGHT_PX }}
              >
                {hour === START_HOUR &&
                  appointments
                    .filter((apt) => isSameDay(new Date(apt.startsAt), day))
                    .map((apt) => {
                      const { top, height } = getCardPosition(apt);
                      return (
                        <div
                          key={apt.id}
                          className={`absolute inset-x-1 z-10 flex flex-col items-center justify-center gap-0.5 overflow-hidden rounded-md border p-1 text-center text-xs ${STATUS_CARD_CLASSES[apt.status]}`}
                          style={{ top, height }}
                        >
                          <p className="truncate font-medium leading-none">
                            {apt.patientName}
                          </p>
                          <p className="truncate text-[10px] leading-none opacity-80">
                            {new Date(apt.startsAt).toLocaleTimeString(
                              "en-US",
                              { hour: "2-digit", minute: "2-digit", hour12: false }
                            )}
                            {" - "}
                            {new Date(apt.endsAt).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            })}
                          </p>
                        </div>
                      );
                    })}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}