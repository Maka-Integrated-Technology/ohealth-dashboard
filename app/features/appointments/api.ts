import axiosInstance from "~/lib/config/axios";
import type {
  AppointmentRequestsResponse,
  GetAppointmentsParams,
  Appointment,
  NextAppointment,
  TodayAppointment,
  UpcomingAppointment,
  ConsultationDetail,
} from "./types";

/** Accept a bare array or `{ data: T[] }` envelope; never return a non-array. */
function ensureArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value;
  if (
    value &&
    typeof value === "object" &&
    "data" in value &&
    Array.isArray((value as { data: unknown }).data)
  ) {
    return (value as { data: T[] }).data;
  }
  return [];
}

export const appointmentsApi = {
  getNext: async (): Promise<NextAppointment | null> => {
    const { data } = await axiosInstance.get<NextAppointment | null>(
      "/api/appointments/next"
    );

    // SPA fallbacks / error HTML can land here as a string — treat as empty.
    if (!data || typeof data !== "object") return null;
    return data;
  },

  getToday: async (): Promise<TodayAppointment[]> => {
    const { data } = await axiosInstance.get<unknown>(
      "/api/appointments/today"
    );
    return ensureArray<TodayAppointment>(data);
  },

  getUpcoming: async (): Promise<UpcomingAppointment[]> => {
    const { data } = await axiosInstance.get<unknown>(
      "/api/appointments/upcoming"
    );
    return ensureArray<UpcomingAppointment>(data);
  },

  getRequests: async (): Promise<AppointmentRequestsResponse> => {
    const { data } = await axiosInstance.get<unknown>(
      "/api/appointments/requests"
    );
    const list = ensureArray<AppointmentRequestsResponse["data"][number]>(data);
    const total =
      data &&
      typeof data === "object" &&
      "total" in data &&
      typeof (data as { total: unknown }).total === "number"
        ? (data as { total: number }).total
        : list.length;
    return { data: list, total };
  },

  acceptRequest: async (id: string): Promise<void> => {
    await axiosInstance.patch(`/api/v1/professionals/me/bookings/${id}/accept`);
  },

  rejectRequest: async (id: string): Promise<void> => {
    await axiosInstance.patch(`/api/v1/professionals/me/bookings/${id}/reject`);
  },

  getAppointments: async (
    params: GetAppointmentsParams
  ): Promise<Appointment[]> => {
    const { data } = await axiosInstance.get<unknown>("/api/appointments", {
      params,
    });
    return ensureArray<Appointment>(data);
  },

  getConsultationById: async (id: string): Promise<ConsultationDetail> => {
    const { data } = await axiosInstance.get<ConsultationDetail>(
      `/api/appointments/${id}/consultation`
    );
    return {
      ...data,
      previousConsultations: ensureArray(data?.previousConsultations),
    };
  },

  cancelAppointment: async (id: string): Promise<void> => {
    await axiosInstance.post(`/api/appointments/${id}/cancel`);
  },

  completeAppointment: async (id: string): Promise<void> => {
    await axiosInstance.post(`/api/appointments/${id}/complete`);
  },
};
