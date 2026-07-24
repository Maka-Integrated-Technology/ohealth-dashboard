import { Fragment } from "react";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils/helpers";

// TODO(DASH-001.2/DASH-001.5): replace with `useTodaysAppointments()` from
// `features/appointments/hooks.ts`, and add loading/empty/error states.
const TODAY_APPOINTMENTS = [
  {
    id: 2,
    time: "12:00",
    name: "Emeka Bello",
    type: "Video Consultation",
    duration: "1 hour",
    consultationType: "Video",
  },
  {
    id: 3,
    time: "13:00",
    name: "Fatima Khan",
    type: "Video Consultation",
    duration: "2 hours",
    consultationType: "Video",
  },
  {
    id: 4,
    time: "15:00",
    name: "Raj Patel",
    type: "Chat Consultation",
    duration: "1 hour",
    consultationType: "Chat",
  },
];

export function TodaysAppointments() {
  const count = TODAY_APPOINTMENTS.length;

  return (
    // Level 1: outer card — rounded, white, padded. Header lives in this
    // padding, outside the bordered list panel below.
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="mb-4 flex items-center gap-2 text-base font-medium">
        TODAY&apos;S APPOINTMENT
        <span className="text-muted-foreground font-normal">
          • {count} Appointments
        </span>
      </div>

      {/* Level 2: inner list panel — its own border/radius, a 2-col CSS
          grid so the time column and content column share row heights
          automatically (keeps the horizontal + vertical dividers aligned
          regardless of how tall any single row's content is). */}
      <div className="grid grid-cols-[64px_1fr] overflow-hidden rounded-2xl border border-gray-200">
        {TODAY_APPOINTMENTS.map((apt, index) => {
          const [hour, minute] = apt.time.split(":");
          const isLast = index === count - 1;

          return (
            <Fragment key={apt.id}>
              <div
                className={cn(
                  "flex flex-col items-center justify-center border-r border-gray-200 bg-gray-50 p-4 text-lg leading-tight font-medium text-gray-600",
                  !isLast && "border-b border-gray-100"
                )}
              >
                <span>{hour}</span>
                <span>{minute}</span>
              </div>
              <div
                className={cn(
                  "flex items-center justify-between p-4",
                  !isLast && "border-b border-gray-100"
                )}
              >
                <div>
                  <p className="text-foreground text-base font-medium">
                    {apt.name}
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-sm">
                    {apt.type} • {apt.duration}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Badge
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-xs font-medium",
                      apt.consultationType === "Chat"
                        ? "border-indigo-100 bg-indigo-50 text-indigo-600"
                        : "border-blue-100 bg-blue-50 text-blue-600"
                    )}
                  >
                    {apt.consultationType}
                  </Badge>
                  <span className="text-xs font-medium text-orange-500">
                    Pending
                  </span>
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
