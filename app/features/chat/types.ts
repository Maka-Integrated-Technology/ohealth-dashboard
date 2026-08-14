export interface ChatMessage {
  id: string;
  sender: "doctor" | "patient";
  text: string;
  time: string;
}
