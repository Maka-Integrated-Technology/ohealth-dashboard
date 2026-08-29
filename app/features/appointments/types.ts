export type ConsultationType = "Video" | "Chat" | "In-Person";
export type AppointmentStatus =
  "completed" | "pending" | "confirmed" | "cancelled";
export type PatientSex = "Male" | "Female" | "Unknown";

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientInitials: string;
  patientEmail: string;
  patientAge: number | null;
  patientSex: PatientSex;
  consultationType: ConsultationType;
  reason: string;
  startsAt: string;
  endsAt: string;
  status: AppointmentStatus;
  lastAppointment: string;
  dateRegistered: string;
  lastConsultationSummary?: string;
}

export interface GetAppointmentsParams {
  [key: string]: string | number | boolean | undefined;
  from?: string;
  to?: string;
  status?: AppointmentStatus | "all";
  consultationType?: ConsultationType;
  patientName?: string;
  patientEmail?: string;
  patientAge?: number;
  patientSex?: "Male" | "Female";
}

export interface NextAppointment {
  id: string;
  patientId: string;
  patientName: string;
  patientInitials: string;
  patientEmail: string;
  patientAge: number | null;
  patientSex: PatientSex;
  consultationType: ConsultationType;
  startsAt: string;
  endsAt: string;
  lastAppointment: string;
  dateRegistered: string;
}

export interface TodayAppointment {
  id: string;
  patientName: string;
  patientInitials: string;
  patientAge: number | null;
  patientSex: PatientSex;
  consultationType: ConsultationType;
  startsAt: string;
  endsAt: string;
  status: AppointmentStatus;
  lastAppointment: string;
  dateRegistered: string;
  lastConsultationSummary?: string;
}

export interface UpcomingAppointment {
  id: string;
  patientName: string;
  patientInitials: string;
  consultationType: ConsultationType;
  startsAt: string;
  endsAt: string;
  status: "confirmed" | "pending";
}

export interface AppointmentRequest {
  id: string;
  patientName: string;
  patientInitials: string;
  patientAge: number | null;
  patientSex: PatientSex;
  consultationType: ConsultationType;
  durationMinutes: number;
  scheduledAt: string;
  lastAppointment: string;
  dateRegistered: string;
  lastConsultationSummary?: string;
}

export interface AppointmentRequestsResponse {
  data: AppointmentRequest[];
  total: number;
}

export interface PreviousConsultation {
  label: string;
  date: string;
}

export interface ConsultationDetail {
  id: string;
  patientId: string;
  patientName: string;
  patientInitials: string;
  patientSex: PatientSex;
  patientAge: number | null;
  condition: string;
  bloodType: string;
  allergies: string;
  lastVisit: string;
  consultationType: ConsultationType;
  title: string;
  startsAt: string;
  endsAt: string;
  previousConsultations: PreviousConsultation[];
}
