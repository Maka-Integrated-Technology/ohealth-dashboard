import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "~/lib/utils/query-keys";
import { earningsApi } from "./api";

export function useEarnings() {
  return useQuery({
    queryKey: QUERY_KEYS.earnings.summary(),
    queryFn: earningsApi.getEarnings,
    staleTime: 5 * 60 * 1000,
  });
}
