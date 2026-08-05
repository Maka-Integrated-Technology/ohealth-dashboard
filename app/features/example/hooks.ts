import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS, type SearchParams } from "~/lib/utils/query-keys";
import { exampleApi } from "./api";
import type { ExampleListParams } from "./types";

export function useExampleList(params: ExampleListParams = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.example.list(params as SearchParams),
    queryFn: () => exampleApi.list(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useExampleItem(id: number | null) {
  return useQuery({
    queryKey: QUERY_KEYS.example.byId(id!),
    queryFn: () => exampleApi.getById(id!),
    enabled: id !== null,
    staleTime: 10 * 60 * 1000,
  });
}
