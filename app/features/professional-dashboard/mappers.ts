import type {
  AppointmentRequest,
  ConsultationType,
  NextAppointment,
  TodayAppointment,
} from "~/features/appointments/types";
import type { ProfessionalDashboardAppointment } from "./types";

const DEFAULT_APPOINTMENT_DURATION_MINUTES = 30;

function getInitials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "PT"
  );
}

function toConsultationType(
  type: ProfessionalDashboardAppointment["consultation_type"]
): ConsultationType {
  return type === "video" ? "Video" : "Chat";
}

function toAppointmentDateTime(appointment: ProfessionalDashboardAppointment) {
  return new Date(
    `${appointment.booking_date}T${appointment.booking_time || "00:00:00"}`
  );
}

function addMinutes(date: Date, minutes: number) {
  const next = new Date(date);
  next.setMinutes(next.getMinutes() + minutes);
  return next;
}

function getBaseAppointmentFields(
  appointment: ProfessionalDashboardAppointment
) {
  const startsAt = toAppointmentDateTime(appointment);
  const endsAt = addMinutes(startsAt, DEFAULT_APPOINTMENT_DURATION_MINUTES);

  return {
    id: appointment.id,
    patientName: appointment.patient_name,
    patientInitials: getInitials(appointment.patient_name),
    patientAge: null,
    patientSex: "Unknown" as const,
    consultationType: toConsultationType(appointment.consultation_type),
    startsAt: startsAt.toISOString(),
    endsAt: endsAt.toISOString(),
    lastAppointment: "—",
    dateRegistered: "—",
  };
}

export function toTodayAppointment(
  appointment: ProfessionalDashboardAppointment
): TodayAppointment {
  return {
    ...getBaseAppointmentFields(appointment),
    status: appointment.status,
  };
}

export function toAppointmentRequest(
  appointment: ProfessionalDashboardAppointment
): AppointmentRequest {
  return {
    ...getBaseAppointmentFields(appointment),
    durationMinutes: DEFAULT_APPOINTMENT_DURATION_MINUTES,
    scheduledAt: toAppointmentDateTime(appointment).toISOString(),
  };
}

export function toNextAppointment(
  appointment: ProfessionalDashboardAppointment
): NextAppointment {
  return {
    ...getBaseAppointmentFields(appointment),
    patientId: appointment.patient_id,
    patientEmail: "",
  };
}
