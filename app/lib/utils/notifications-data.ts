import {
  CalendarX2,
  CalendarClock,
  CalendarPlus,
  FileWarning,
  UserCheck,
  type LucideIcon,
} from "lucide-react";

export type NotificationAccent = "alert" | "warning" | "info";

export interface NotificationItem {
  id: number;
  prefix: string;
  name: string;
  rest: string;
  time: string;
  icon: LucideIcon;
  accent: NotificationAccent;
}

// TODO: replace with real activity-log data once that endpoint exists.
export const NOTIFICATION_ITEMS: NotificationItem[] = [
  {
    id: 0,
    prefix: "",
    name: "Chidi Nwosu",
    rest: " cancelled their 2:30 PM appointment today.",
    time: "12 minutes ago",
    icon: CalendarX2,
    accent: "alert",
  },
  {
    id: 1,
    prefix: "",
    name: "Oluwaseun Taiwo",
    rest: " has requested to move Thursday's 2:00 PM appointment to Friday, 9 May at 10:00 AM. Review and confirm.",
    time: "52 minutes ago",
    icon: CalendarClock,
    accent: "warning",
  },
  {
    id: 2,
    prefix: "New booking from ",
    name: "Ngozi Adeyemi",
    rest: " — Friday, 9 May at 11:30 AM. In-Person consultation. Payment confirmed.",
    time: "Today • 9:12 AM",
    icon: CalendarPlus,
    accent: "info",
  },
  {
    id: 3,
    prefix: "",
    name: "You have 3 unreviewed consultation notes",
    rest: " from this week. Complete them before your next session.",
    time: "Today • 8:00 AM",
    icon: FileWarning,
    accent: "info",
  },
  {
    id: 4,
    prefix: "Returning patient ",
    name: "Adaeze Okonjo",
    rest: " has booked a follow-up for Wednesday, 14 May at 11:00 AM. Payment confirmed.",
    time: "Yesterday • 9:12 PM",
    icon: UserCheck,
    accent: "info",
  },
  {
    id: 5,
    prefix: "",
    name: "Fatima Ndiaye",
    rest: " cancelled tomorrow's 11:00 AM appointment. The slot is now open for new bookings.",
    time: "3 Apr • 8:19 AM",
    icon: CalendarX2,
    accent: "alert",
  },
  {
    id: 6,
    prefix: "",
    name: "Fatima Ndiaye",
    rest: " cancelled tomorrow's 11:00 AM appointment. The slot is now open for new bookings.",
    time: "3 Apr • 8:19 AM",
    icon: CalendarX2,
    accent: "alert",
  },
  {
    id: 7,
    prefix: "",
    name: "Fatima Ndiaye",
    rest: " cancelled tomorrow's 11:00 AM appointment. The slot is now open for new bookings.",
    time: "3 Apr • 8:19 AM",
    icon: CalendarX2,
    accent: "alert",
  },
];

export const ACCENT_STYLES: Record<NotificationAccent, { row: string; iconWrap: string }> = {
  alert: {
    row: "border-l-4 border-red-400 bg-muted",
      iconWrap: "bg-red-50 text-red-500",
  },
  warning: {
    row: "border-l-4 border-orange-400 bg-muted",
      iconWrap: "bg-orange-50 text-orange-500",
  },
  info: {
    row: "border-l-4 border-transparent bg-card",
      iconWrap: "bg-blue-50 text-blue-500",
  },
};