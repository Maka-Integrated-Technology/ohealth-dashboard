import { Skeleton } from "~/components/ui/skeleton";
import { Empty } from "~/components/ui/empty";
import type { Appointment } from "~/features/appointments/types";
import {
  CALENDAR_ROW_HEIGHT_PX,
  ConsultTypeIcon,
  formatDayLabel,
  formatHourLabel,
  formatTimeRange,
  getCardPosition,
  getDaysInRange,
  getHourRange,
  isSameDay,
  STATUS_CARD_CLASSES,
  STATUS_DOT_CLASSES,
  STATUS_LABEL,
} from "./_primitives";

interface CalendarViewProps {
  from: Date;
  to: Date;
  appointments: Appointment[];
  isLoading: boolean;
  isError: boolean;
  onSelect: (appointment: Appointment) => void;
}

export function CalendarView({
  from,
  to,
  appointments,
  isLoading,
  isError,
  onSelect,
}: CalendarViewProps) {
  if (isLoading) {
    return <Skeleton className="h-[500px] w-full rounded-lg" />;
  }

  if (isError) {
    return (
      <Empty>
        <p className="text-muted-foreground">
          Couldn&apos;t load appointments. Try refreshing the page.
        </p>
      </Empty>
    );
  }

  const days = getDaysInRange(from, to);
  const { startHour, endHour } = getHourRange(appointments);
  const hours = Array.from(
    { length: endHour - startHour },
    (_, i) => startHour + i
  );

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-border">
        <div
          className="grid min-w-[700px]"
          style={{ gridTemplateColumns: `80px repeat(${days.length}, 1fr)` }}
        >
          {/* Header row */}
          <div className="border-b border-border p-2" />
          {days.map((day) => {
            const { weekday, day: dayNum } = formatDayLabel(day);
            const isToday = isSameDay(day, new Date());
            return (
              <div
                key={day.toISOString()}
                className="border-b border-l border-border p-2 text-center"
              >
                <p
                  className={`text-xs ${isToday ? "text-primary" : "text-muted-foreground"}`}
                >
                  {weekday}
                </p>
                <p
                  className={`text-sm font-semibold ${isToday ? "text-primary" : "text-foreground"}`}
                >
                  {dayNum}
                </p>
              </div>
            );
          })}

          {/* Hour rows */}
          {hours.map((hour) => {
            const { time, meridiem } = formatHourLabel(hour);
            return (
              <div key={hour} className="contents">
                <div
                  className="flex flex-col items-center justify-center border-b border-border p-2 text-xs text-muted-foreground"
                  style={{ height: CALENDAR_ROW_HEIGHT_PX }}
                >
                  <span>{time}</span>
                  <span>{meridiem}</span>
                </div>
                {days.map((day) => (
                  <div
                    key={`${hour}-${day.toISOString()}`}
                    className="relative border-b border-l border-border"
                    style={{ height: CALENDAR_ROW_HEIGHT_PX }}
                  >
                    {hour === startHour &&
                      appointments
                        .filter((apt) =>
                          isSameDay(new Date(apt.startsAt), day)
                        )
                        .map((apt) => {
                          const { top, height } = getCardPosition(
                            apt,
                            startHour
                          );
                          return (
                            <button
                              key={apt.id}
                              onClick={() => onSelect(apt)}
                              className={`absolute inset-x-1 z-10 flex flex-col items-center justify-center gap-1 overflow-hidden rounded-md border p-1.5 text-center text-xs ${STATUS_CARD_CLASSES[apt.status]}`}
                              style={{ top, height }}
                            >
                              <p className="truncate font-medium leading-none">
                                {apt.patientName}
                              </p>
                              <p className="flex items-center justify-center gap-1 truncate leading-none opacity-80">
                                <ConsultTypeIcon
                                  type={apt.consultationType}
                                />
                                {formatTimeRange(apt.startsAt, apt.endsAt)}
                              </p>
                            </button>
                          );
                        })}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 px-4 py-4 text-xs text-muted-foreground">
        {(["confirmed", "cancelled", "pending", "completed"] as const).map(
          (status) => (
            <span key={status} className="flex items-center gap-1.5">
              <span
                className={`size-2 rounded-full ${STATUS_DOT_CLASSES[status]}`}
              />
              {STATUS_LABEL[status]}
            </span>
          )
        )}
      </div>
    </>
  );
}