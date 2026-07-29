import { MessageSquare, Video, MapPin } from "lucide-react";
import type { AppointmentStatus, ConsultationType } from "~/features/appointments/types";

export const STATUS_LABEL: Record<AppointmentStatus, string> = {
  confirmed: "Confirmed",
  pending: "Pending",
  cancelled: "Cancelled",
  completed: "Completed",
}

export const STATUS_BADGE_CLASSES: Record<AppointmentStatus, string> = {
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  completed: "bg-gray-100 text-gray-600 border-gray-200",
}

export const STATUS_DOT_CLASSES: Record<AppointmentStatus, string> = {
  confirmed: "bg-blue-500",
  pending: "bg-amber-500",
  cancelled: "bg-red-500",
  completed: "bg-gray-400",
}

const CONSULT_ICON = {
  Video: Video,
  Chat: MessageSquare,
  "In-Person": MapPin
} as const;

export function ConsultTypeIcon({ type }: { type: ConsultationType }) {
  const Icon = CONSULT_ICON[type];
  return <Icon className="size-3.5" />
}

export function formatTimeRange(startsAt: string, endsAt: string) {
  const start = new Date(startsAt)
  const end = new Date(endsAt)
  const fmt = (d: Date) => d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
  return `${fmt(start)}- ${fmt(end)}`
}

export function getWeekRange(date: Date) {
  const day = date.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day

  const start = new Date(date)
  start.setDate(date.getDate() + diffToMonday)
  start.setHours(0, 0, 0, 0)

  const end = new Date(start)
  end.setDate(start.getDate() + 5)
  end.setHours(23, 59, 59, 999)

  return { start, end }
}

export function formatWeekRangeLabel(start: Date, end: Date) {
  const sameMonth = start.getMonth() === end.getMonth()
  const startLabel = start.toLocaleDateString("en-US", { month: "long", day: "numeric" })
  const endLabel = sameMonth ? end.getDate().toString() : end.toLocaleDateString("en-US", { month: "long", day: "numeric" })
  return `${startLabel}-${endLabel}, ${end.getFullYear()}`
}