import { useSyncExternalStore } from "react";

export type LaboratoryNotificationCategory =
  | "Bookings"
  | "Samples"
  | "Results"
  | "System";

export type LaboratoryNotification = {
  id: string;
  category: LaboratoryNotificationCategory;
  title: string;
  description: string;
  date: string;
  icon: string;
  target: string;
  unread: boolean;
};

const NOTIFICATIONS: LaboratoryNotification[] = [
  {
    id: "lab-notif-01", category: "Bookings", title: "New test booking received",
    description: "Ngozi Adeyemi booked a Lipid Profile. Awaiting confirmation.",
    date: "13 Sept, 11:00", icon: "📅", target: "/test-bookings", unread: true,
  },
  {
    id: "lab-notif-02", category: "Samples", title: "Sample awaiting collection",
    description: "Adaeze Okonkwo's CBC sample is still awaiting collection.",
    date: "13 Sept, 10:50", icon: "🧪", target: "/samples-tests", unread: true,
  },
  {
    id: "lab-notif-03", category: "Results", title: "Result ready for review",
    description: "Amina Sule's malaria parasite result is ready for review.",
    date: "13 Sept, 10:35", icon: "📋", target: "/results", unread: true,
  },
  {
    id: "lab-notif-04", category: "Samples", title: "Sample under analysis",
    description: "Fatima Al-Hassan's TFT sample is under analysis.",
    date: "13 Sept, 10:20", icon: "🔬", target: "/samples-tests", unread: true,
  },
  {
    id: "lab-notif-05", category: "Bookings", title: "Patient checked in",
    description: "Emeka Nwosu checked in for the Hepatitis B Surface Antigen test.",
    date: "13 Sept, 09:30", icon: "✅", target: "/test-bookings", unread: false,
  },
  {
    id: "lab-notif-06", category: "Results", title: "Result published",
    description: "Oluwaseun Ojo's PSA result appears as published in the sample data.",
    date: "12 Sept, 15:31", icon: "📤", target: "/results", unread: false,
  },
  {
    id: "lab-notif-07", category: "Bookings", title: "Upcoming test appointment",
    description: "Tunde Bakare has an ECG booking for 14 September at 08:30.",
    date: "12 Sept, 14:00", icon: "⏰", target: "/test-bookings", unread: false,
  },
];

let store: LaboratoryNotification[] = NOTIFICATIONS;
const listeners = new Set<() => void>();

function emit() { listeners.forEach((listener) => listener()); }

export function subscribeLabNotifications(listener: () => void): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function getLabNotifications(): LaboratoryNotification[] {
  return store;
}

export function useLabNotifications(): LaboratoryNotification[] {
  return useSyncExternalStore(subscribeLabNotifications, getLabNotifications, getLabNotifications);
}

export function markLabNotificationRead(id: string): void {
  store = store.map((notification) => notification.id === id
    ? { ...notification, unread: false } : notification);
  emit();
}

export function markAllLabNotificationsRead(): void {
  store = store.map((notification) => ({ ...notification, unread: false }));
  emit();
}
