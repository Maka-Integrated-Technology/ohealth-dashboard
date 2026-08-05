import { MessageSquare, Video, MapPin } from "lucide-react";
import type { ConsultationType } from "~/features/appointments/types";

const CONSULT_ICON = {
  Video: Video,
  Chat: MessageSquare,
  "In-Person": MapPin,
} as const;

export function ConsultTypeIcon({ type }: { type: ConsultationType }) {
  const Icon = CONSULT_ICON[type];
  return <Icon className="size-3.5" />;
}
