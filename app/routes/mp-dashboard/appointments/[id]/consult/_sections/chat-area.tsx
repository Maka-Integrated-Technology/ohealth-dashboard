import { useState } from "react";
import { Send, Image, Paperclip } from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";
import { useChatMessages, useSendMessage } from "~/features/chat/hooks";
import { cn } from "~/lib/utils/helpers";

interface ChatAreaProps {
  consultationId: string;
  patientInitials: string;
}

export function ChatArea({ consultationId, patientInitials }: ChatAreaProps) {
  const { data: messages = [], isLoading } = useChatMessages(consultationId);
  const { mutateAsync: sendMessage, isPending } =
    useSendMessage(consultationId);
  const [draft, setDraft] = useState("");

  async function handleSend() {
    if (!draft.trim() || isPending) return;
    const text = draft.trim();
    setDraft("");
    await sendMessage(text);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  return (
    <div className="bg-muted/30 flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-4 flex justify-center">
          <span className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs">
            Session started at 14:30
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="ml-auto h-12 w-64" />
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-end gap-2",
                  message.sender === "doctor" && "flex-row-reverse"
                )}
              >
                {message.sender === "patient" && (
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-white">
                    {patientInitials}
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-xs rounded-2xl px-4 py-2.5 text-sm",
                    message.sender === "doctor"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-card text-foreground rounded-bl-sm"
                  )}
                >
                  {message.text}
                  <div
                    className={cn(
                      "mt-1 text-[10px] opacity-70",
                      message.sender === "doctor" ? "text-right" : "text-left"
                    )}
                  >
                    {message.time}
                  </div>
                </div>
                {message.sender === "doctor" && (
                  <div className="bg-primary text-primary-foreground flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                    DR
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-border border-t p-4">
        <div className="border-input bg-background flex items-center gap-2 rounded-full border px-4 py-2">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="placeholder:text-muted-foreground flex-1 bg-transparent text-sm focus:outline-none"
          />
          <button type="button" className="text-muted-foreground">
            <Image className="size-4" />
          </button>
          <button type="button" className="text-muted-foreground">
            <Paperclip className="size-4" />
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={isPending}
            className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full disabled:opacity-50"
          >
            <Send className="size-4" />
          </button>
        </div>
        <p className="text-muted-foreground mt-2 text-center text-xs">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
