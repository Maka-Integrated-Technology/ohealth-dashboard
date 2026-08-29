import axiosInstance from "~/lib/config/axios";
import { unwrapApiData, type ApiEnvelope } from "~/lib/utils/api-response";
import type {
  ProfessionalDashboard,
  ProfessionalDashboardStats,
} from "./types";

function normalizeStats(
  dashboard: ProfessionalDashboard
): ProfessionalDashboardStats {
  const stats = dashboard.stats ?? {};
  const todaysAppointments = Array.isArray(dashboard.todays_appointments)
    ? dashboard.todays_appointments
    : [];
  const completedTodaysAppointments =
    stats.completed_todays_appointments ??
    todaysAppointments.filter(
      (appointment) => appointment.status === "completed"
    ).length;
  const remainingTodaysAppointments =
    stats.remaining_todays_appointments ??
    todaysAppointments.filter(
      (appointment) => appointment.status === "confirmed"
    ).length;

  return {
    patients: stats.patients ?? 0,
    patient_growth_percent: stats.patient_growth_percent ?? 0,
    todays_appointments: stats.todays_appointments ?? 0,
    completed_todays_appointments: completedTodaysAppointments,
    remaining_todays_appointments: remainingTodaysAppointments,
    pending_appointments: stats.pending_appointments ?? 0,
    pending_appointments_tomorrow: stats.pending_appointments_tomorrow ?? 0,
  };
}

export const professionalDashboardApi = {
  getDashboard: async (date: string): Promise<ProfessionalDashboard> => {
    const { data } = await axiosInstance.get<
      ApiEnvelope<ProfessionalDashboard>
    >("/api/v1/professionals/me/dashboard", { params: { date } });

    const dashboard = unwrapApiData(data);

    return {
      ...dashboard,
      stats: normalizeStats(dashboard),
      todays_appointments: Array.isArray(dashboard.todays_appointments)
        ? dashboard.todays_appointments
        : [],
      appointment_requests: Array.isArray(dashboard.appointment_requests)
        ? dashboard.appointment_requests
        : [],
      activities: Array.isArray(dashboard.activities)
        ? dashboard.activities
        : [],
      next_appointment: dashboard.next_appointment ?? null,
    };
  },
};
