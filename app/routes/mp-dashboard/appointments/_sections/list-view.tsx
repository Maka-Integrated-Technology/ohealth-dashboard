import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Empty } from "~/components/ui/empty";
import { Skeleton } from "~/components/ui/skeleton";
import type { Appointment } from "~/features/appointments/types";
import { ConsultTypeIcon, formatTimeRange, STATUS_BADGE_CLASSES, STATUS_LABEL } from "./_primitives";
import { Button } from "~/components/ui/button";

interface ListViewProps {
  appointments: Appointment[];
  isLoading: boolean;
  isError: boolean;
  onStart: (appointment: Appointment) => void;
  onReschedule: (appointment: Appointment) => void;
  onCancel: (appointment: Appointment) => void;
  cancellingId?: string
}

export function ListView({
  appointments, isLoading, isError, onStart, onReschedule, onCancel, cancellingId
}: ListViewProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <Empty>
        <p className="text-muted-foreground">
          Couldn&apos;t load appointments. Try refreshing the page.
        </p>
      </Empty>
    )
  }

  if (appointments.length === 0) {
    return (
      <Empty>
        <p className="text-muted-foreground">
          No appointments match your current filters.
        </p>
      </Empty>
    )
  }

  return (
    <div className="space-y-3">
      {appointments.map((appointment) => (
        <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4" key={appointment.id}>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{appointment.patientInitials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">
                {appointment.patientName}
              </p>
              <p className="text-sm text-muted-foreground">
                {appointment.reason}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-sm text-muted-foreground">
              {formatTimeRange(appointment.startsAt, appointment.endsAt)}
            </span>
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE_CLASSES[appointment.status]}`}>
              {STATUS_LABEL[appointment.status]}
            </span>

            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <ConsultTypeIcon type={appointment.consultationType} />
              {appointment.consultationType}
            </span>

            <div className="flex items-center gap-2">
              {appointment.status === "confirmed" && (
                <Button size="sm" onClick={() => onStart(appointment)}>
                  Start
                </Button>
              )}
              {(appointment.status === "confirmed" || appointment.status === "pending" && (
                <>
                  <Button size="sm" variant="outline" onClick={() => onReschedule(appointment)}>
                    Reschedule
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" disabled={cancellingId === appointment.id} onClick={() => onCancel(appointment)}>
                    Cancel
                  </Button>
                </>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}