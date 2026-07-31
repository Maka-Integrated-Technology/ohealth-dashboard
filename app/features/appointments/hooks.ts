import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "~/lib/utils/query-keys";
import { appointmentsApi } from "./api";
import type { GetAppoinmentsParams } from "./types";

export function useNextAppointment() {
  return useQuery({
    queryKey: QUERY_KEYS.appointments.next(),
    queryFn: appointmentsApi.getNext,
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  });
}

export function useTodayAppointments() {
  return useQuery({
    queryKey: QUERY_KEYS.appointments.today(),
    queryFn: appointmentsApi.getToday,
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  });
}

export function useUpcomingAppointments() {
  return useQuery({
    queryKey: QUERY_KEYS.appointments.upcoming(),
    queryFn: appointmentsApi.getUpcoming,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAppointmentRequests() {
  return useQuery({
    queryKey: QUERY_KEYS.appointments.requests(),
    queryFn: appointmentsApi.getRequests,
    staleTime: 60 * 1000,
  });
}

export function useAcceptRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: appointmentsApi.acceptRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.appointments.requests(),
      });
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.appointments.upcoming(),
      });
    },
  });
}

export function useRejectRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: appointmentsApi.rejectRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.appointments.requests(),
      });
    },
  });
}

export function useAppointments(params: GetAppoinmentsParams) {
  return useQuery({
    queryKey: QUERY_KEYS.appointments.list(params),
    queryFn: () => appointmentsApi.getAppointments(params),
    staleTime: 60 * 1000,
  })
}

export function useCancelAppointment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: appointmentsApi.cancelAppointment,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.appointments.all
      })
    }
  })
}

export function useConsultationDetail(id: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.appointments.consultation(id ?? ""),
    queryFn: () => appointmentsApi.getConsultationById(id as string),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  });
}