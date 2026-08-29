import { format } from "date-fns";
import { CalendarDays, Check, Clock, Pencil, X } from "lucide-react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils/helpers";
import type {
  AppointmentRequest,
  NextAppointment,
  PatientSex,
  TodayAppointment,
} from "~/features/appointments/types";
import {
  avatarColorClass,
  formatConsultationType,
  formatDuration,
  getCountdownText,
} from "./_primitives";

function PatientDetailsGrid({
  age,
  sex,
  lastAppointment,
  dateRegistered,
}: {
  age: number | null;
  sex: PatientSex;
  lastAppointment: string;
  dateRegistered: string;
}) {
  return (
    <div>
      <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-widest uppercase">
        PATIENT&apos;S DETAILS
      </p>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
        <div>
          <p className="text-muted-foreground text-xs">Age</p>
          <p className="text-foreground font-medium">{age ?? "—"}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Sex</p>
          <p className="text-foreground font-medium">
            {sex === "Unknown" ? "—" : sex}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Last Appointment</p>
          <p className="text-foreground font-medium">{lastAppointment}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Date Registered</p>
          <p className="text-foreground font-medium">{dateRegistered}</p>
        </div>
      </div>
    </div>
  );
}

function ConsultationSummaryCard({ summary }: { summary: string }) {
  return (
    <div className="border-border bg-muted/30 rounded-xl border p-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-foreground text-sm font-medium">
          Last Consultation Summary
        </p>
        <button
          type="button"
          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
        >
          <Pencil className="h-3 w-3" />
          Edit
        </button>
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed">{summary}</p>
    </div>
  );
}

export function TodayAppointmentDialog({
  appointment,
  open,
  onOpenChange,
}: {
  appointment: TodayAppointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!appointment) return null;

  const countdown = getCountdownText(appointment.startsAt);
  const startTime = format(new Date(appointment.startsAt), "h:mm a");
  const endTime = format(new Date(appointment.endsAt), "h:mm a");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-130 gap-0 overflow-hidden p-0">
        <div className="overflow-y-auto p-6">
          <div className="mb-5 flex items-start gap-4">
            <Avatar className="size-14 shrink-0">
              <AvatarFallback
                className={cn(
                  "text-lg font-semibold text-white",
                  avatarColorClass(appointment.patientName)
                )}
              >
                {appointment.patientInitials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <DialogTitle className="text-foreground text-xl font-bold">
                {appointment.patientName}
              </DialogTitle>
              <p className="text-muted-foreground text-sm">
                {formatConsultationType(appointment.consultationType)} •{" "}
                {startTime} – {endTime}
              </p>
            </div>
          </div>

          {countdown && (
            <div className="mb-5 flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-600">
              <Clock className="h-4 w-4 shrink-0" />
              Consultation is starting in {countdown}
            </div>
          )}

          <div className="border-border mb-5 border-t pt-5">
            <PatientDetailsGrid
              age={appointment.patientAge}
              sex={appointment.patientSex}
              lastAppointment={appointment.lastAppointment}
              dateRegistered={appointment.dateRegistered}
            />
          </div>

          {appointment.lastConsultationSummary && (
            <ConsultationSummaryCard
              summary={appointment.lastConsultationSummary}
            />
          )}
        </div>

        <div className="border-border flex gap-3 border-t px-6 py-4">
          <button
            type="button"
            className="border-border bg-background text-foreground hover:bg-muted flex-1 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors"
          >
            Reschedule
          </button>
          <button
            type="button"
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Join Consultation
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function NextAppointmentDialog({
  appointment,
  open,
  onOpenChange,
}: {
  appointment: NextAppointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!appointment) return null;

  const countdown = getCountdownText(appointment.startsAt);
  const startTime = format(new Date(appointment.startsAt), "h:mm a");
  const endTime = format(new Date(appointment.endsAt), "h:mm a");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-130 gap-0 overflow-hidden p-0">
        <div className="overflow-y-auto p-6">
          <div className="mb-5 flex items-start gap-4">
            <Avatar className="size-14 shrink-0">
              <AvatarFallback
                className={cn(
                  "text-lg font-semibold text-white",
                  avatarColorClass(appointment.patientName)
                )}
              >
                {appointment.patientInitials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <DialogTitle className="text-foreground text-xl font-bold">
                {appointment.patientName}
              </DialogTitle>
              <p className="text-muted-foreground text-sm">
                {formatConsultationType(appointment.consultationType)} •{" "}
                {startTime} – {endTime}
              </p>
            </div>
          </div>

          {countdown && (
            <div className="mb-5 flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-600">
              <Clock className="h-4 w-4 shrink-0" />
              Consultation is starting in {countdown}
            </div>
          )}

          <div className="border-border border-t pt-5">
            <PatientDetailsGrid
              age={appointment.patientAge}
              sex={appointment.patientSex}
              lastAppointment={appointment.lastAppointment}
              dateRegistered={appointment.dateRegistered}
            />
          </div>
        </div>

        <div className="border-border flex gap-3 border-t px-6 py-4">
          <button
            type="button"
            className="border-border bg-background text-foreground hover:bg-muted flex-1 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors"
          >
            Reschedule
          </button>
          <button
            type="button"
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Join Consultation
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function AppointmentRequestDialog({
  request,
  open,
  onOpenChange,
  onAccept,
  onReject,
  isAccepting,
  isRejecting,
}: {
  request: AppointmentRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  isAccepting: boolean;
  isRejecting: boolean;
}) {
  if (!request) return null;

  const scheduledDate = format(new Date(request.scheduledAt), "do MMMM, yyyy");
  const scheduledTime = format(new Date(request.scheduledAt), "h:mm a");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-130 gap-0 overflow-hidden p-0">
        <div className="overflow-y-auto p-6">
          <div className="mb-5 flex items-start gap-4">
            <Avatar className="size-14 shrink-0">
              <AvatarFallback
                className={cn(
                  "text-lg font-semibold text-white",
                  avatarColorClass(request.patientName)
                )}
              >
                {request.patientInitials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <DialogTitle className="text-foreground text-xl font-bold">
                {request.patientName}
              </DialogTitle>
              <p className="text-muted-foreground text-sm">
                {formatConsultationType(request.consultationType)} •{" "}
                {formatDuration(request.durationMinutes)}
              </p>
            </div>
          </div>

          <div className="mb-5 flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-600">
            <CalendarDays className="h-4 w-4 shrink-0" />
            Date: {scheduledDate} • Time: {scheduledTime}
          </div>

          <div className="border-border mb-5 border-t pt-5">
            <PatientDetailsGrid
              age={request.patientAge}
              sex={request.patientSex}
              lastAppointment={request.lastAppointment}
              dateRegistered={request.dateRegistered}
            />
          </div>

          {request.lastConsultationSummary && (
            <ConsultationSummaryCard
              summary={request.lastConsultationSummary}
            />
          )}
        </div>

        <div className="border-border flex gap-3 border-t px-6 py-4">
          <button
            type="button"
            disabled={isAccepting || isRejecting}
            onClick={() => onReject(request.id)}
            className="flex-1 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-500 transition-colors hover:border-red-300 hover:bg-red-50 disabled:opacity-50"
          >
            {isRejecting ? "Rejecting…" : "Reject Request"}
          </button>
          <button
            type="button"
            disabled={isAccepting || isRejecting}
            onClick={() => onAccept(request.id)}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {isAccepting ? "Accepting…" : "Accept Request"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SeeAllRequestsDialog({
  requests,
  total,
  open,
  onOpenChange,
  onAccept,
  onReject,
  isAccepting,
  isRejecting,
  acceptingId,
  rejectingId,
}: {
  requests: AppointmentRequest[];
  total: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  isAccepting: boolean;
  isRejecting: boolean;
  acceptingId?: string;
  rejectingId?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl gap-0 p-0">
        <div className="border-border border-b px-6 py-4">
          <DialogTitle className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
            APPOINTMENT REQUESTS{" "}
            <span className="font-normal tracking-normal normal-case">
              • {total} Appointments
            </span>
          </DialogTitle>
        </div>

        <ScrollArea className="max-h-[60vh]">
          <div className="divide-border divide-y px-2">
            {requests.map((req) => {
              const busy =
                (isAccepting && acceptingId === req.id) ||
                (isRejecting && rejectingId === req.id);
              return (
                <div
                  key={req.id}
                  className="flex items-center justify-between px-4 py-4"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="size-11">
                      <AvatarFallback
                        className={cn(
                          "text-sm font-semibold text-white",
                          avatarColorClass(req.patientName)
                        )}
                      >
                        {req.patientInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-foreground text-sm font-semibold">
                        {req.patientName}
                      </p>
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        {formatConsultationType(req.consultationType)} •{" "}
                        {formatDuration(req.durationMinutes)}
                      </p>
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        {format(new Date(req.scheduledAt), "d MMM")} •{" "}
                        {format(new Date(req.scheduledAt), "h:mm a")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={`Accept ${req.patientName}'s request`}
                      disabled={busy}
                      onClick={() => onAccept(req.id)}
                      className="flex size-8 items-center justify-center rounded-full border border-blue-600 text-blue-600 transition-colors hover:bg-blue-50 disabled:opacity-40"
                    >
                      <Check className="h-4 w-4" strokeWidth={2.5} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Reject ${req.patientName}'s request`}
                      disabled={busy}
                      onClick={() => onReject(req.id)}
                      className="flex size-8 items-center justify-center rounded-full border border-red-500 text-red-500 transition-colors hover:bg-red-50 disabled:opacity-40"
                    >
                      <X className="h-4 w-4" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
