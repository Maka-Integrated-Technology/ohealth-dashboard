import { Fragment } from "react";
import { format } from "date-fns";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils/helpers";
import { useUpcomingAppointments } from "~/features/appointments/hooks";

function UpcomingAppointmentsSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <Skeleton className="mb-4 h-5 w-64" />
      <div className="grid grid-cols-[80px_1fr] overflow-hidden rounded-2xl border border-gray-200">
        {Array.from({ length: 3 }).map((_, i) => (
          <Fragment key={i}>
            <div
              className={cn(
                "flex flex-col items-center justify-center border-r border-gray-200 bg-gray-50 p-3",
                i < 2 && "border-b border-gray-100"
              )}
            >
              <Skeleton className="h-4 w-12" />
              <Skeleton className="mt-1 h-3 w-14" />
            </div>
            <div
              className={cn(
                "flex items-center justify-between p-4",
                i < 2 && "border-b border-gray-100"
              )}
            >
              <div>
                <Skeleton className="mb-1 h-4 w-32" />
                <Skeleton className="h-3 w-44" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export function UpcomingAppointments() {
  const { data, isLoading, isError } = useUpcomingAppointments();

  if (isLoading) return <UpcomingAppointmentsSkeleton />;

  if (isError) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <p className="text-muted-foreground text-sm">
          Failed to load upcoming appointments.
        </p>
      </div>
    );
  }

  const items = data ?? [];
  const count = items.length;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="mb-4 flex items-center gap-2 text-base font-medium">
        UPCOMING APPOINTMENTS
        <span className="text-muted-foreground font-normal">
          • {count} Appointments
        </span>
      </div>

      {count === 0 ? (
        <p className="text-muted-foreground text-sm">
          No upcoming appointments scheduled.
        </p>
      ) : (
        <div className="grid grid-cols-[80px_1fr] overflow-hidden rounded-2xl border border-gray-200">
          {items.map((apt, index) => {
            const isLast = index === count - 1;
            return (
              <Fragment key={apt.id}>
                <div
                  className={cn(
                    "flex flex-col items-center justify-center border-r border-gray-200 bg-gray-50 p-3 text-sm leading-tight font-medium text-gray-600",
                    !isLast && "border-b border-gray-100"
                  )}
                >
                  <span>{format(new Date(apt.startsAt), "d MMM")}</span>
                  <span className="text-muted-foreground text-xs">
                    {format(new Date(apt.startsAt), "h:mm a")}
                  </span>
                </div>
                <div
                  className={cn(
                    "flex items-center justify-between p-4",
                    !isLast && "border-b border-gray-100"
                  )}
                >
                  <div>
                    <p className="text-foreground text-base font-medium">
                      {apt.patientName}
                    </p>
                    <p className="text-muted-foreground mt-0.5 text-sm">
                      {apt.consultationType} Consultation
                    </p>
                  </div>
                  <Badge
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-xs font-medium",
                      apt.consultationType === "Chat"
                        ? "border-indigo-100 bg-indigo-50 text-indigo-600"
                        : apt.consultationType === "In-Person"
                          ? "border-emerald-100 bg-emerald-50 text-emerald-600"
                          : "border-blue-100 bg-blue-50 text-blue-600"
                    )}
                  >
                    {apt.consultationType}
                  </Badge>
                </div>
              </Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}
