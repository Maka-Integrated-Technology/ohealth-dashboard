import axiosInstance from "~/lib/config/axios";
import type { ChatMessage } from "./types";

export const chatApi = {
  getMessages: async (consultationId: string): Promise<ChatMessage[]> => {
    const { data } = await axiosInstance.get<ChatMessage[]>(
      `/api/consultations/${consultationId}/messages`
    );
    return data;
  },

  sendMessage: async (params: {
    consultationId: string;
    text: string;
  }): Promise<ChatMessage> => {
    const { data } = await axiosInstance.post<ChatMessage>(
      `/api/consultations/${params.consultationId}/messages`,
      { text: params.text }
    );
    return data;
  },
};
