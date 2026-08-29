import { QUERY_KEYS } from "~/lib/utils/query-keys";
import { reviewsApi } from "./api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useReviews(professionalId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.reviews.byProfessional(professionalId ?? ""),
    queryFn: () => reviewsApi.getReviews(professionalId as string),
    enabled: Boolean(professionalId),
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useRespondToReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reviewsApi.respondToReview,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.reviews.all,
      });
    },
  });
}
