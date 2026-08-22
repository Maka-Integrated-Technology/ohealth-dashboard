import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "~/lib/utils/query-keys";
import { availabilityApi } from "./api";
import type { UpdateDayScheduleParams } from "./types";

export function useWeeklySchedule() {
  return useQuery({
    queryKey: QUERY_KEYS.availability.schedule(),
    queryFn: availabilityApi.getWeeklySchedule,
    staleTime: 60 * 1000,
  });
}

export function useUpdateDaySchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: UpdateDayScheduleParams) =>
      availabilityApi.updateDaySchedule(params),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.availability.schedule(),
      });
    },
  });
}

export function useAvailabilityAppointments(params: {
  from: string;
  to: string;
}) {
  return useQuery({
    queryKey: QUERY_KEYS.availability.appointments(params),
    queryFn: () => availabilityApi.getAppointmentsInRange(params),
    staleTime: 60 * 1000,
  });
}