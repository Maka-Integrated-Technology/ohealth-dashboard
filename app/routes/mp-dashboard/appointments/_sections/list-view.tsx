import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { Empty } from "~/components/ui/empty";
import type { Appointment } from "~/features/appointments/types";
import {
  ConsultTypeIcon,
  formatTimeRange,
  STATUS_BADGE_CLASSES,
  STATUS_DOT_CLASSES,
  STATUS_LABEL,
} from "./_primitives";

interface ListViewProps {
  appointments: Appointment[];
  isLoading: boolean;
  isError: boolean;
  onSelect: (appointment: Appointment) => void;
  onStart: (appointment: Appointment) => void;
  onReschedule: (appointment: Appointment) => void;
  onCancel: (appointment: Appointment) => void;
  cancellingId?: string;
}

export function ListView({
  appointments,
  isLoading,
  isError,
  onSelect,
  onReschedule,
  onCancel,
  cancellingId,
}: ListViewProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    );
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

  if (appointments.length === 0) {
    return (
      <Empty>
        <p className="text-muted-foreground">
          No appointments match your current filters.
        </p>
      </Empty>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            onClick={() => onSelect(appointment)}
            className="border-border bg-card hover:bg-muted/50 flex cursor-pointer items-center justify-between gap-4 rounded-lg border p-4 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-blue-100 font-bold text-blue-700">
                  {appointment.patientInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <p className="text-foreground font-medium">
                  {appointment.patientName}
                </p>
                <p className="text-muted-foreground text-sm">
                  {appointment.reason}
                </p>
                <div className="text-muted-foreground flex items-center gap-3 text-sm">
                  <span className="font-mono">
                    {formatTimeRange(appointment.startsAt, appointment.endsAt)}
                  </span>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE_CLASSES[appointment.status]}`}
                  >
                    {STATUS_LABEL[appointment.status]}
                  </span>
                  <span className="flex items-center gap-1">
                    <ConsultTypeIcon type={appointment.consultationType} />
                    {appointment.consultationType}
                  </span>
                </div>
              </div>
            </div>

            <div
              className="flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              {appointment.status === "confirmed" && (
                <Button
                  size="sm"
                  className="rounded-full"
                  onClick={() => onSelect(appointment)}
                >
                  Start
                </Button>
              )}
              {(appointment.status === "confirmed" ||
                appointment.status === "pending") && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => onReschedule(appointment)}
                  >
                    Reschedule
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive rounded-full"
                    isLoading={cancellingId === appointment.id}
                    onClick={() => onCancel(appointment)}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="text-muted-foreground mt-4 flex items-center gap-4 px-4 py-4 text-xs">
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
