import axiosInstance from "~/lib/config/axios";
import type {
  AppointmentRequestsResponse,
  GetAppoinmentsParams,
  Appointment,
  NextAppointment,
  TodayAppointment,
  UpcomingAppointment,
} from "./types";

export const appointmentsApi = {
  getNext: async (): Promise<NextAppointment | null> => {
    const { data } = await axiosInstance.get<NextAppointment | null>(
      "/api/appointments/next"
    );
    return data;
  },

  getToday: async (): Promise<TodayAppointment[]> => {
    const { data } = await axiosInstance.get<TodayAppointment[]>(
      "/api/appointments/today"
    );
    return data;
  },

  getUpcoming: async (): Promise<UpcomingAppointment[]> => {
    const { data } = await axiosInstance.get<UpcomingAppointment[]>(
      "/api/appointments/upcoming"
    );
    return data;
  },

  getRequests: async (): Promise<AppointmentRequestsResponse> => {
    const { data } = await axiosInstance.get<AppointmentRequestsResponse>(
      "/api/appointments/requests"
    );
    return data;
  },

  acceptRequest: async (id: string): Promise<void> => {
    await axiosInstance.post(`/api/appointments/requests/${id}/accept`);
  },

  rejectRequest: async (id: string): Promise<void> => {
    await axiosInstance.post(`/api/appointments/requests/${id}/reject`);
  },

  getAppoinmtents: async (
    params: GetAppoinmentsParams
  ): Promise<Appointment[]> => {
    const { data } = await axiosInstance.get<Appointment[]>("/api/appointments", { params })
    return data;
  },

  cancelAppointment: async (id: string): Promise<void> => {
    await axiosInstance.post(`/api/appointments/${id}/cancel`)
  },
};
