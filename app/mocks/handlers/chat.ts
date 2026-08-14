import { delay, http, HttpResponse } from "msw";
import type { ChatMessage } from "~/features/chat/types";

const chatThreads: Record<string, ChatMessage[]> = {
  "list-002": [
    {
      id: "msg-1",
      sender: "patient",
      text: "Hello doctor, I've been experiencing severe headaches for the past 3 days.",
      time: "14:32",
    },
    {
      id: "msg-2",
      sender: "doctor",
      text: "Hello James. I'm sorry to hear that. Can you describe the pain? Is it throbbing, sharp, or dull?",
      time: "14:33",
    },
    {
      id: "msg-3",
      sender: "patient",
      text: "It's mostly throbbing, especially on the right side of my head.",
      time: "14:34",
    },
  ],
};

const MOCK_NETWORK_DELAY_MS = 400;

export const chatHandlers = [
  http.get("/api/consultations/:id/messages", async ({ params }) => {
    await delay(MOCK_NETWORK_DELAY_MS);
    const id = params.id as string;
    if (!chatThreads[id]) {
      chatThreads[id] = [];
    }
    return HttpResponse.json(chatThreads[id]);
  }),

  http.post("/api/consultations/:id/messages", async ({ params, request }) => {
    await delay(MOCK_NETWORK_DELAY_MS);
    const id = params.id as string;
    const body = (await request.json()) as { text: string };

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "doctor",
      text: body.text,
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };

    if (!chatThreads[id]) {
      chatThreads[id] = [];
    }
    chatThreads[id].push(message);

    return HttpResponse.json(message);
  }),
];
