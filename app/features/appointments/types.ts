export type ConsultationType = "Video" | "Chat" | "In-Person";
export type AppointmentStatus = "completed" | "pending" | "confirmed";

export interface NextAppointment {
  id: string;
  patientId: string;
  patientName: string;
  patientInitials: string;
  patientEmail: string;
  patientAge: number;
  patientSex: "Male" | "Female";
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
  patientAge: number;
  patientSex: "Male" | "Female";
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
  patientAge: number;
  patientSex: "Male" | "Female";
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
