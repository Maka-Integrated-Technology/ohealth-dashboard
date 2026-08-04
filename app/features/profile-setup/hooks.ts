import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "~/lib/utils/query-keys";
import { profileSetupApi } from "./api";

export function useProfileSetupStatus() {
  return useQuery({
    queryKey: QUERY_KEYS.profileSetup.status(),
    queryFn: profileSetupApi.getStatus,
    staleTime: 60 * 1000,
  });
}