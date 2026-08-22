import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import type { Appointment } from "~/features/appointments/types";

type CancelAppointmentDialogProps = {
  appointment: Appointment | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isCancelling: boolean;
};

export function CancelAppointmentDialog({
  appointment,
  onOpenChange,
  onConfirm,
  isCancelling,
}: CancelAppointmentDialogProps) {
  return (
    <Dialog open={Boolean(appointment)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Cancel Appointment
          </DialogTitle>
        </DialogHeader>

        {/* Patient info row */}
        <div className="flex items-center gap-4 py-2">
          <Avatar className="size-14">
            <AvatarFallback className="bg-blue-100 text-base font-bold text-blue-600">
              {appointment?.patientInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-foreground font-semibold">
              {appointment?.patientName}
            </span>
            <span className="text-muted-foreground text-sm">
              {appointment?.reason}
            </span>
          </div>
        </div>

        {/* Confirmation box */}
        <div className="rounded-xl border p-5">
          <p className="text-foreground text-base leading-snug">
            Are you sure you want to cancel this patient&apos;s appointment?
          </p>

          <div className="mt-5 flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isCancelling}
            >
              Close
            </Button>
            <Button
              className="flex-1"
              isLoading={isCancelling}
              onClick={onConfirm}
            >
              Yes, confirm
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
