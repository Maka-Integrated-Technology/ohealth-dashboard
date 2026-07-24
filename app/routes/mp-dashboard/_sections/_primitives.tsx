import type { ConsultationType } from "~/features/appointments/types";

const AVATAR_COLORS = [
  "bg-blue-600",
  "bg-gray-700",
  "bg-[#4A0E1B]",
  "bg-emerald-700",
  "bg-purple-700",
  "bg-orange-600",
];

export function avatarColorClass(name: string): string {
  const sum = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} minutes`;
  const h = minutes / 60;
  return h === 1 ? "1 hour" : `${h} hours`;
}

export function formatConsultationType(type: ConsultationType): string {
  if (type === "In-Person") return "In-Person Meeting";
  return `${type} Consultation`;
}

export function getCountdownText(startsAt: string): string | null {
  const diff = new Date(startsAt).getTime() - Date.now();
  if (diff <= 0) return null;
  const totalMins = Math.floor(diff / 60000);
  if (totalMins < 60) return `${totalMins} mins`;
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  return m > 0 ? `${h} hr ${m} mins` : `${h} hrs`;
}
