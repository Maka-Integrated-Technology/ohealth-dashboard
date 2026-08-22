export interface TimePeriod {
  id: string;
  from: string; // 24h "HH:mm", e.g. "09:00"
  to: string;
}

export type WeekDay =
  | "Mon"
  | "Tue"
  | "Wed"
  | "Thu"
  | "Fri"
  | "Sat"
  | "Sun";

export interface DaySchedule {
  day: WeekDay;
  available: boolean;
  periods: TimePeriod[];
}

export interface WeeklySchedule {
  days: DaySchedule[];
}

export interface AvailabilityAppointment {
  id: string;
  patientName: string;
  startsAt: string;
  endsAt: string;
  consultationType: "Video" | "Chat" | "In-Person";
  status: "confirmed" | "pending" | "cancelled" | "completed";
}

export interface UpdateDayScheduleParams {
  day: WeekDay;
  available: boolean;
  periods: Omit<TimePeriod, "id">[];
  copyToDays?: WeekDay[];
}