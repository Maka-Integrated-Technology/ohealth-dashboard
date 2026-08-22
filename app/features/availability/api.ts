import axiosInstance from "~/lib/config/axios";
import type {
  AvailabilityAppointment,
  UpdateDayScheduleParams,
  WeeklySchedule,
} from "./types";

export const availabilityApi = {
  getWeeklySchedule: async (): Promise<WeeklySchedule> => {
    const { data } = await axiosInstance.get<WeeklySchedule>(
      "/api/availability/schedule"
    );
    return data;
  },

  updateDaySchedule: async (
    params: UpdateDayScheduleParams
  ): Promise<void> => {
    await axiosInstance.put(
      `/api/availability/schedule/${params.day}`,
      params
    );
  },

  getAppointmentsInRange: async (params: {
    from: string;
    to: string;
  }): Promise<AvailabilityAppointment[]> => {
    const { data } = await axiosInstance.get<AvailabilityAppointment[]>(
      "/api/availability/appointments",
      { params }
    );
    return data;
  },
};