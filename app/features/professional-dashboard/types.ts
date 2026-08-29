export type ProfessionalDashboardAppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export type ProfessionalDashboardConsultationType = "chat" | "video";

export type ProfessionalDashboardProfile = {
  id: string;
  user_id: string;
  speciality_id: string;
  speciality: string;
  image?: string | null;
  about?: string | null;
  license_number?: string | null;
  years_of_experience: number;
  consultation_fee: number;
  consultation_type: "chat" | "video" | "both";
  verification_status: "pending" | "verified" | "rejected";
  profile_setup_completed: boolean;
  is_available: boolean;
  created_at: string;
  updated_at: string;
};

export type ProfessionalDashboardStats = {
  patients: number;
  patient_growth_percent: number;
  todays_appointments: number;
  completed_todays_appointments: number;
  remaining_todays_appointments: number;
  pending_appointments: number;
  pending_appointments_tomorrow: number;
};

export type ProfessionalDashboardAppointment = {
  id: string;
  patient_id: string;
  patient_name: string;
  professional_id: string;
  booking_date: string;
  booking_time: string;
  consultation_type: ProfessionalDashboardConsultationType;
  amount: number;
  status: ProfessionalDashboardAppointmentStatus;
  notes?: string | null;
  is_paid: boolean;
  created_at: string;
};

export type ProfessionalDashboardActivity = {
  title: string;
  message: string;
  occurred_at: string;
};

export type ProfessionalDashboardSetup = {
  verified: boolean;
  set_availability: boolean;
  add_profile_photo: boolean;
  add_description: boolean;
  completed: boolean;
};

export type ProfessionalDashboard = {
  date: string;
  profile: ProfessionalDashboardProfile;
  stats: ProfessionalDashboardStats;
  todays_appointments: ProfessionalDashboardAppointment[];
  appointment_requests: ProfessionalDashboardAppointment[];
  next_appointment: ProfessionalDashboardAppointment | null;
  activities: ProfessionalDashboardActivity[];
  setup: ProfessionalDashboardSetup;
};
