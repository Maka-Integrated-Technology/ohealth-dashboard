import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { ChevronRight, Check } from "lucide-react";
import type { Appointment } from "~/features/appointments/types";
import { STATUS_BADGE_CLASSES, STATUS_LABEL } from "./_primitives";

interface AppointmentDetailDialogProps {
  appointment: Appointment | null;
  onOpenChange: (open: boolean) => void;
  onStart: (appointment: Appointment) => void;
  onCancel: (appointment: Appointment) => void;
  onAccept: (appointment: Appointment) => void;
  isCancelling: boolean;
  isAccepting: boolean;
}

function formatDuration(startsAt: string, endsAt: string) {
  const minutes =
    (new Date(endsAt).getTime() - new Date(startsAt).getTime()) / 60000;
  return `${minutes} min`;
}

function formatFullDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
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

export function AppointmentDetailDialog({
  appointment,
  onOpenChange,
  onStart,
  onCancel,
  onAccept,
  isCancelling,
  isAccepting,
}: AppointmentDetailDialogProps) {
  return (
    <Dialog open={!!appointment} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {appointment && (
          <>
            <DialogHeader>
              <DialogTitle className="font-bold">
                Appointment Detail
              </DialogTitle>
            </DialogHeader>

            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                {appointment.patientInitials}
              </div>
              <div>
                <p className="font-bold text-foreground">
                  {appointment.patientName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {appointment.reason}
                </p>
                <span
                  className={`mt-1 inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE_CLASSES[appointment.status]}`}
                >
                  {STATUS_LABEL[appointment.status]}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-muted p-3">
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="font-bold text-foreground">
                  {formatTimeRange(appointment.startsAt, appointment.endsAt)}
                </p>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="font-bold text-foreground">
                  {appointment.consultationType}
                </p>
              </div>

              {appointment.status === "pending" ? (
                <>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p className="font-bold text-foreground">
                      {STATUS_LABEL[appointment.status]}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="font-bold text-foreground">
                      {formatDuration(
                        appointment.startsAt,
                        appointment.endsAt
                      )}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="font-bold text-foreground">
                      {formatFullDate(appointment.startsAt)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="font-bold text-foreground">
                      {formatDuration(
                        appointment.startsAt,
                        appointment.endsAt
                      )}
                    </p>
                  </div>
                </>
              )}
            </div>

            {appointment.status === "pending" && (
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button
                  className="flex-1 gap-1.5 px-6 py-5"
                  isLoading={isAccepting}
                  onClick={() => onAccept(appointment)}
                >
                  <Check className="size-4" />
                  Accept
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 px-6 py-5"
                  onClick={() => onOpenChange(false)}
                >
                  Close
                </Button>
              </div>
            )}

            {appointment.status === "confirmed" && (
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button
                  variant="ghost"
                  className="px-6 py-5 text-destructive hover:text-destructive"
                  isLoading={isCancelling}
                  onClick={() => onCancel(appointment)}
                >
                  Cancel Consultation
                </Button>
                <Button
                  className="gap-1 px-6 py-5"
                  onClick={() => onStart(appointment)}
                >
                  Start Consultation
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}