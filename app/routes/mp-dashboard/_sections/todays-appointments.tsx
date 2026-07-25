import { Fragment, useState } from "react";
import { format } from "date-fns";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils/helpers";
import { useTodayAppointments } from "~/features/appointments/hooks";
import type { TodayAppointment } from "~/features/appointments/types";
import { TodayAppointmentDialog } from "./dialogs";

function TodayAppointmentsSkeleton() {
  return (
    <div className="border-border bg-card rounded-2xl border p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <Skeleton className="mb-4 h-5 w-56" />
      <div className="border-border grid grid-cols-[64px_1fr] overflow-hidden rounded-2xl border">
        {Array.from({ length: 5 }).map((_, i) => (
          <Fragment key={i}>
            <div
              className={cn(
                "border-border bg-muted flex flex-col items-center justify-center border-r p-4",
                i < 4 && "border-border border-b"
              )}
            >
              <Skeleton className="h-5 w-8" />
              <Skeleton className="mt-1 h-4 w-6" />
            </div>
            <div
              className={cn(
                "flex items-center justify-between p-4",
                i < 4 && "border-border border-b"
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

export function TodaysAppointments() {
  const { data: appointments, isLoading, isError } = useTodayAppointments();
  const [selected, setSelected] = useState<TodayAppointment | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (isLoading) return <TodayAppointmentsSkeleton />;

  if (isError) {
    return (
      <div className="border-border bg-card rounded-2xl border p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <p className="text-muted-foreground text-sm">
          Failed to load today&apos;s appointments.
        </p>
      </div>
    );
  }

  const items = appointments ?? [];
  const count = items.length;

  function handleRowClick(apt: TodayAppointment) {
    setSelected(apt);
    setDialogOpen(true);
  }

  return (
    <>
      <div className="border-border bg-card rounded-2xl border p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <div className="mb-4 flex items-center gap-2 text-base font-medium">
          TODAY&apos;S APPOINTMENT
          <span className="text-muted-foreground font-normal">
            • {count} Appointments
          </span>
        </div>

        {count === 0 ? (
          <p className="text-muted-foreground text-sm">
            No appointments scheduled for today.
          </p>
        ) : (
          <div className="border-border grid grid-cols-[64px_1fr] overflow-hidden rounded-2xl border">
            {items.map((apt, index) => {
              const isLast = index === count - 1;
              const isCompleted = apt.status === "completed";
              const hour = format(new Date(apt.startsAt), "HH");
              const minute = format(new Date(apt.startsAt), "mm");

              return (
                <Fragment key={apt.id}>
                  <div
                    className={cn(
                      "border-border bg-muted flex flex-col items-center justify-center border-r p-4 text-lg leading-tight font-medium",
                      isCompleted ? "text-muted-foreground" : "text-foreground",
                      !isLast && "border-border border-b"
                    )}
                  >
                    <span>{hour}</span>
                    <span>{minute}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRowClick(apt)}
                    className={cn(
                      "hover:bg-muted flex w-full items-center justify-between p-4 text-left transition-colors",
                      !isLast && "border-border border-b"
                    )}
                  >
                    <div>
                      <p
                        className={cn(
                          "text-base font-medium",
                          isCompleted
                            ? "text-muted-foreground"
                            : "text-foreground"
                        )}
                      >
                        {apt.patientName}
                      </p>
                      <p className="text-muted-foreground mt-0.5 text-sm">
                        {apt.consultationType} Consultation
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {isCompleted ? (
                        <span className="text-muted-foreground text-xs font-medium">
                          Completed
                        </span>
                      ) : (
                        <>
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
                        </>
                      )}
                    </div>
                  </button>
                </Fragment>
              );
            })}
          </div>
        )}
      </div>

      <TodayAppointmentDialog
        appointment={selected}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
