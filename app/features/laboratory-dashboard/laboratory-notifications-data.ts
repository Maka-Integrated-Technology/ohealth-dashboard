import { useSyncExternalStore } from "react";

export type LaboratoryNotificationCategory =
  | "Bookings"
  | "Samples"
  | "Results";

export type LaboratoryNotificationBadge =
  | "Booking Confirmed"
  | "Appointment Reminder"
  | "Sample Collected"
  | "Results Published"
  | "Results Ready"
  | "Test In Progress";

export type LaboratoryNotification = {
  id: string;
  category: LaboratoryNotificationCategory;
  title: string;
  badge: LaboratoryNotificationBadge;
  description: string;
  date: string;
  patient: string;
  icon: string;
  target: string;
  unread: boolean;
};

// Exact order, messaging, metadata and initial read states from the supplied
// laboratory Notifications design. These are not live system notifications.
const NOTIFICATIONS: LaboratoryNotification[] = [
  {
    id: "lab-notif-01",
    category: "Bookings",
    title: "Booking Confirmed",
    badge: "Booking Confirmed",
    description:
      "BK-2025-0845 for Ngozi Adeyemi (Lipid Profile) has been confirmed for 13 Sep, 11:00.",
    date: "13 Sept, 09:00",
    patient: "Ngozi Adeyemi",
    icon: "📅",
    target: "/test-bookings",
    unread: true,
  },
  {
    id: "lab-notif-02",
    category: "Bookings",
    title: "Appointment Reminder",
    badge: "Appointment Reminder",
    description:
      "Adaeze Okonkwo is scheduled for CBC at 09:00 today. 5 minutes to appointment.",
    date: "13 Sept, 09:55",
    patient: "Adaeze Okonkwo",
    icon: "⏰",
    target: "/test-bookings",
    unread: true,
  },
  {
    id: "lab-notif-03",
    category: "Samples",
    title: "Sample Collected",
    badge: "Sample Collected",
    description:
      "Sample SP-2025-0441 for Fatima Al-Hassan collected successfully by Nurse Kelechi Obi.",
    date: "13 Sept, 11:05",
    patient: "Fatima Al-Hassan",
    icon: "🧪",
    target: "/samples-tests",
    unread: true,
  },
  {
    id: "lab-notif-04",
    category: "Results",
    title: "Result Published",
    badge: "Results Published",
    description:
      "PSA result for Oluwaseun Ojo published. Patient notified via SMS.",
    date: "11 Sept, 15:31",
    patient: "Oluwaseun Ojo",
    icon: "📤",
    target: "/results",
    unread: false,
  },
  {
    id: "lab-notif-05",
    category: "Results",
    title: "Result Ready for Review",
    badge: "Results Ready",
    description:
      "Malaria Parasite Test result for Amina Sule is ready for your review.",
    date: "12 Sept, 10:46",
    patient: "Amina Sule",
    icon: "📋",
    target: "/results",
    unread: false,
  },
  {
    id: "lab-notif-06",
    category: "Samples",
    title: "Test In Progress",
    badge: "Test In Progress",
    description:
      "Urinalysis for Chidi Okeke is currently under analysis by Mr. Babatunde Adisa.",
    date: "13 Sept, 11:45",
    patient: "Chidi Okeke",
    icon: "🔬",
    target: "/samples-tests",
    unread: true,
  },
];

let store: LaboratoryNotification[] = NOTIFICATIONS;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeLabNotifications(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getLabNotifications(): LaboratoryNotification[] {
  return store;
}

export function useLabNotifications(): LaboratoryNotification[] {
  return useSyncExternalStore(
    subscribeLabNotifications,
    getLabNotifications,
    getLabNotifications
  );
}

export function markLabNotificationRead(id: string): void {
  if (!store.some((item) => item.id === id && item.unread)) return;
  store = store.map((item) =>
    item.id === id ? { ...item, unread: false } : item
  );
  emit();
}

export function markAllLabNotificationsRead(): void {
  if (!store.some((item) => item.unread)) return;
  store = store.map((item) => ({ ...item, unread: false }));
  emit();
}
