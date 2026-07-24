import { useState } from "react";
import { Mail } from "lucide-react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils/helpers";
import { useNextAppointment } from "~/features/appointments/hooks";
import { avatarColorClass } from "./_primitives";
import { NextAppointmentDialog } from "./dialogs";

function NextAppointmentSkeleton() {
  return (
    <div className="border-border bg-card rounded-2xl border p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <Skeleton className="mx-auto mb-5 h-4 w-36" />
      <div className="flex flex-col items-center">
        <Skeleton className="mb-3 size-20 rounded-full" />
        <Skeleton className="mb-1 h-5 w-32" />
        <Skeleton className="h-4 w-28" />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="mt-5 h-10 w-full rounded-lg" />
      <Skeleton className="mt-3 h-10 w-full rounded-lg" />
    </div>
  );
}

function NextAppointmentEmpty() {
  return (
    <div className="border-border bg-card rounded-2xl border p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <CardHeader className="px-0 pt-0 pb-4 text-center">
        <CardTitle className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
          NEXT APPOINTMENT
        </CardTitle>
      </CardHeader>
      <p className="text-muted-foreground text-center text-sm">
        No upcoming appointments scheduled.
      </p>
    </div>
  );
}

export function NextAppointment() {
  const { data: apt, isLoading, isError } = useNextAppointment();
  const [dialogOpen, setDialogOpen] = useState(false);

  if (isLoading) return <NextAppointmentSkeleton />;

  if (isError) {
    return (
      <div className="border-border bg-card rounded-2xl border p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <p className="text-muted-foreground text-sm">
          Failed to load next appointment.
        </p>
      </div>
    );
  }

  if (!apt) return <NextAppointmentEmpty />;

  return (
    <>
      <div className="border-border bg-card rounded-2xl border p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <CardHeader className="px-0 pt-0 pb-4 text-center">
          <CardTitle className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
            NEXT APPOINTMENT
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-0 pb-0">
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="hover:bg-accent -m-2 flex w-[calc(100%+1rem)] flex-col items-center rounded-xl p-2 text-center transition-colors"
          >
            <Avatar className="mb-3 size-20 border-none">
              <AvatarFallback
                className={cn(
                  "text-3xl font-medium text-white",
                  avatarColorClass(apt.patientName)
                )}
              >
                {apt.patientInitials}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-lg font-semibold">{apt.patientName}</h3>
            <p className="text-muted-foreground text-sm">
              {apt.consultationType} Consultation
            </p>
          </button>
          
          <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs font-medium">Age</p>
              <p className="text-muted-foreground font-medium">
                {apt.patientAge}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium">Sex</p>
              <p className="text-muted-foreground font-medium">
                {apt.patientSex}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium">Last Appointment</p>
              <p className="text-muted-foreground font-medium">
                {apt.lastAppointment}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium">Date Registered</p>
              <p className="text-muted-foreground font-medium">
                {apt.dateRegistered}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="mt-2 w-full rounded-lg bg-blue-600 py-2.5 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Join Consultation
          </button>

          <a
            href={`mailto:${apt.patientEmail}`}
            className="border-border bg-card hover:bg-accent flex items-center justify-center gap-2 rounded-lg border p-2.5 text-sm transition-colors"
          >
            <Mail size={16} />
            <span>{apt.patientEmail}</span>
          </a>
        </CardContent>
      </div>

      <NextAppointmentDialog
        appointment={apt}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
