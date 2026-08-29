import { Bell } from "lucide-react";
import { VerifiedBadge } from "~/components/shared/verified-badge";
import type { ProfessionalDashboardAppointment } from "~/features/professional-dashboard/types";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  day: "numeric",
  month: "short",
  year: "numeric",
});
const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

interface HeaderProps {
  verified: boolean;
  displayName?: string;
  nextAppointment?: ProfessionalDashboardAppointment | null;
}

function getAppointmentStart(appointment: ProfessionalDashboardAppointment) {
  return new Date(`${appointment.booking_date}T${appointment.booking_time}`);
}

function getAppointmentReminderText(
  appointment: ProfessionalDashboardAppointment
) {
  const minutesUntil = Math.floor(
    (getAppointmentStart(appointment).getTime() - Date.now()) / 60000
  );

  if (minutesUntil <= 0) return null;

  const timeText = minutesUntil === 1 ? "1 minute" : `${minutesUntil} minutes`;

  return `Your next appointment is in ${timeText} with ${appointment.patient_name}`;
}

export function Header({
  verified,
  displayName,
  nextAppointment,
}: HeaderProps) {
  const now = new Date();
  const greeting =
    now.getHours() < 12
      ? "Good morning"
      : now.getHours() < 18
        ? "Good afternoon"
        : "Good evening";
  const appointmentReminder = nextAppointment
    ? getAppointmentReminderText(nextAppointment)
    : null;

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col">
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          {greeting}, {displayName ?? "there"}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {dateFormatter.format(now)} • {timeFormatter.format(now)}
        </p>
      </div>

      <div className="flex flex-col items-end gap-3">
        <VerifiedBadge verified={verified} />

        {appointmentReminder && (
          <div className="flex w-fit items-center gap-2 rounded-lg border border-orange-100/50 bg-orange-50 px-4 py-2.5 text-sm text-orange-600 shadow-sm">
            <Bell size={16} className="fill-orange-500 text-orange-500" />
            <span className="font-medium">{appointmentReminder}</span>
          </div>
        )}
      </div>
    </div>
  );
}
