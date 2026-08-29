import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "~/lib/utils/query-keys";
import { professionalDashboardApi } from "./api";

export function useProfessionalDashboard(date: string) {
  return useQuery({
    queryKey: QUERY_KEYS.professionalDashboard.byDate(date),
    queryFn: () => professionalDashboardApi.getDashboard(date),
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  });
}
