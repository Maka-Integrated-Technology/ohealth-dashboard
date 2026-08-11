import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "~/lib/utils/query-keys";
import { chatApi } from "./api";

export function useChatMessages(consultationId: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.chat.messages(consultationId ?? ""),
    queryFn: () => chatApi.getMessages(consultationId as string),
    enabled: Boolean(consultationId),
    staleTime: 0,
  });
}

export function useSendMessage(consultationId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (text: string) =>
      chatApi.sendMessage({ consultationId: consultationId as string, text }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.chat.messages(consultationId ?? ""),
      });
    },
  });
}