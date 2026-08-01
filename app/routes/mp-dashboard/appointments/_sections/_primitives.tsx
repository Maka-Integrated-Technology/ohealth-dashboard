import { MessageSquare, Video, MapPin } from "lucide-react";
import type {
  AppointmentStatus,
  ConsultationType,
} from "~/features/appointments/types";

export const STATUS_LABEL: Record<AppointmentStatus, string> = {
  confirmed: "Confirmed",
  pending: "Pending",
  cancelled: "Cancelled",
  completed: "Completed",
};

export const STATUS_BADGE_CLASSES: Record<AppointmentStatus, string> = {
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  completed: "bg-gray-100 text-gray-600 border-gray-200",
};

export const STATUS_DOT_CLASSES: Record<AppointmentStatus, string> = {
  confirmed: "bg-blue-500",
  pending: "bg-amber-500",
  cancelled: "bg-red-500",
  completed: "bg-gray-400",
};

const CONSULT_ICON = {
  Video: Video,
  Chat: MessageSquare,
  "In-Person": MapPin,
} as const;

export function ConsultTypeIcon({ type }: { type: ConsultationType }) {
  const Icon = CONSULT_ICON[type];
  return <Icon className="size-3.5" />;
}

export function formatTimeRange(startsAt: string, endsAt: string) {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  const fmt = (d: Date) =>
    d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  return `${fmt(start)}- ${fmt(end)}`;
}

export function getWeekRange(date: Date) {
  const day = date.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const start = new Date(date);
  start.setDate(date.getDate() + diffToMonday);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

export function formatWeekRangeLabel(start: Date, end: Date) {
  const sameMonth = start.getMonth() === end.getMonth();
  const startLabel = start.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
  const endLabel = sameMonth
    ? end.getDate().toString()
    : end.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  return `${startLabel}-${endLabel}, ${end.getFullYear()}`;
}

export const CALENDAR_ROW_HEIGHT_PX = 64;

export function getDaysInRange(from: Date, to: Date): Date[] {
  const days: Date[] = [];
  const cursor = new Date(from);
  cursor.setHours(0, 0, 0, 0);
  const end = new Date(to);
  end.setHours(0, 0, 0, 0);

  while (cursor <= end) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

export function formatDayLabel(date: Date) {
  return {
    weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
    day: date.getDate(),
  };
}

export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function getHourRange(
  appointments: { startsAt: string; endsAt: string }[]
) {
  if (appointments.length === 0) {
    return { startHour: 9, endHour: 17 };
  }
  let minHour = 23;
  let maxHour = 0;

  for (const apt of appointments) {
    const start = new Date(apt.startsAt);
    const end = new Date(apt.endsAt);
    minHour = Math.min(minHour, start.getHours());
    maxHour = Math.max(
      maxHour,
      end.getHours() + (end.getMinutes() > 0 ? 1 : 0)
    );
  }
  return { startHour: minHour, endHour: Math.max(maxHour, minHour + 1) };
}

export function formatHourLabel(hour: number) {
  return {
    time: `${hour.toString().padStart(2, "0")}:00`,
    meridiem: hour < 12 ? "AM" : "PM",
  };
}

export function getCardPosition(
  appointment: { startsAt: string; endsAt: string },
  startHour: number
) {
  const start = new Date(appointment.startsAt);
  const end = new Date(appointment.endsAt);

  const startMinutesFromTop =
    (start.getHours() - startHour) * 60 + start.getMinutes();
  const durationMinutes = (end.getTime() - start.getTime()) / 60000;

  const CARD_GAP = 4;
  const MIN_CARD_HEIGHT = 52;

  const top = (startMinutesFromTop / 60) * CALENDAR_ROW_HEIGHT_PX + CARD_GAP;
  const height = (durationMinutes / 60) * CALENDAR_ROW_HEIGHT_PX - CARD_GAP * 2;

  return { top, height: Math.max(height, MIN_CARD_HEIGHT) };
}

export const STATUS_CARD_CLASSES: Record<AppointmentStatus, string> = {
  confirmed: "bg-blue-50 border-blue-200 text-blue-900",
  pending: "bg-amber-50 border-amber-200 text-amber-900",
  cancelled: "bg-red-50 border-red-200 text-red-900",
  completed: "bg-gray-50 border-gray-200 text-gray-600",
};
