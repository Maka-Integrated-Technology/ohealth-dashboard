import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "~/lib/utils/query-keys";
import { patientsApi } from "./api";
import type { GetPatientsParams } from "./types";

export function usePatients(params: GetPatientsParams) {
  return useQuery({
    queryKey: QUERY_KEYS.patients.list(params),
    queryFn: () => patientsApi.getPatients(params),
    staleTime: 60 * 1000,
  });
}

export function usePatientDetail(id: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.patients.byId(id ?? ""),
    queryFn: () => patientsApi.getPatientById(id as string),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  });
}

export function usePatientConsultations(id: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.patients.consultations(id ?? ""),
    queryFn: () => patientsApi.getConsultations(id as string),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  });
}

export function usePatientNotes(id: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.patients.notes(id ?? ""),
    queryFn: () => patientsApi.getNotes(id as string),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  });
}
