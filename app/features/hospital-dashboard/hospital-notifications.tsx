import {
  Bell,
  CalendarCheck,
  CheckCheck,
  ChevronRight,
  FlaskConical,
  MessageSquareText,
  Pill,
  Search,
  Settings,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { hospitalNotificationSamples, hospitalNotificationFilters, type HospitalNotificationCategory, type NotificationDestination } from "~/features/hospital-dashboard/hospital-notification-data";

const categoryIcons: Record<HospitalNotificationCategory, LucideIcon> = {
  Appointments: CalendarCheck,
  Verification: ShieldCheck,
  Laboratory: FlaskConical,
  Reviews: MessageSquareText,
  Prescriptions: Pill,
  System: Settings,
  Patients: Users,
};
const categoryStyles: Record<HospitalNotificationCategory, string> = {
  Appointments: "bg-[#eff4ff] text-[#155eef]",
  Verification: "bg-[#f5f3ff] text-[#7c3aed]",
  Laboratory: "bg-[#ecfeff] text-[#0891b2]",
  Reviews: "bg-[#fffbeb] text-[#d97706]",
  Prescriptions: "bg-[#f5f3ff] text-[#7c3aed]",
  System: "bg-[#f1f5f9] text-[#62748e]",
  Patients: "bg-[#ecfdf3] text-[#067647]",
};

export default function HospitalNotifications({
  readIds,
  onRead,
  onReadAll,
  onNavigate,
}: {
  readIds: string[];
  onRead: (id: string) => void;
  onReadAll: () => void;
  onNavigate: (destination: NotificationDestination) => void;
}) {
  const [filter, setFilter] = useState<"All" | HospitalNotificationCategory>(
    "All"
  );
  const unreadCount = hospitalNotificationSamples.filter(
    (item) => !readIds.includes(item.id)
  ).length;
  const visible = useMemo(
    () =>
      hospitalNotificationSamples.filter(
        (item) => filter === "All" || item.category === filter
      ),
    [filter]
  );

  return (
    <div className="mx-auto w-full max-w-[1080px] pb-14">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-[19px] leading-[34px] font-semibold text-[#0f172b] sm:text-[24px] sm:leading-[42px]">
            Notifications
          </h2>
          <p className="text-[15px] text-[#62748e] sm:text-[19px]">
            {unreadCount} unread
          </p>
        </div>
        <button
          type="button"
          disabled={unreadCount === 0}
          onClick={onReadAll}
          className="inline-flex items-center gap-2 rounded-[16px] border border-[#e2e8f0] px-[18px] py-3 font-medium text-[#2970ff] hover:bg-[#f5f8ff] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CheckCheck className="size-5" />
          Mark all as read
        </button>
      </div>
      <div className="mb-6 flex flex-wrap gap-2 border-b border-[#e2e8f0] pb-3">
        {hospitalNotificationFilters.map((category) => {
          const number =
            category === "All"
              ? hospitalNotificationSamples.length
              : hospitalNotificationSamples.filter(
                  (item) => item.category === category
                ).length;
          return (
            <button
              key={category}
              type="button"
              aria-pressed={category === filter}
              onClick={() => setFilter(category)}
              className={`inline-flex items-center gap-2 rounded-[15px] px-4 py-3 text-[13px] font-medium transition-colors sm:text-[16px] ${filter === category ? "bg-[#2970ff] text-white" : "bg-[#f8fafc] text-[#4d5761] hover:bg-[#eff4ff]"}`}
            >
              {category}
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${filter === category ? "bg-white/20 text-white" : "bg-[#e2e8f0] text-[#62748e]"}`}
              >
                {number}
              </span>
            </button>
          );
        })}
      </div>
      <div className="space-y-4">
        {visible.map((item) => {
          const Icon = categoryIcons[item.category];
          const unread = !readIds.includes(item.id);
          return (
            <article
              key={item.id}
              className={`flex items-start gap-4 rounded-[18px] border px-5 py-5 sm:px-6 ${unread ? "border-[#dbeafe] bg-[#f8fbff]" : "border-[#f1f5f9] bg-white"}`}
            >
              <span
                className={`flex size-12 shrink-0 items-center justify-center rounded-[14px] ${categoryStyles[item.category]}`}
              >
                <Icon className="size-6" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                  <h3 className="text-[14px] font-semibold text-[#1f2a37] sm:text-[18px]">
                    {item.title}
                  </h3>
                  <span className="text-[13px] text-[#62748e]">
                    {item.time}
                  </span>
                </div>
                <p className="mt-2 text-[13px] leading-6 text-[#4d5761] sm:text-[15px]">
                  {item.description}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
                  {item.action && item.destination ? (
                    <button
                      type="button"
                      onClick={() => {
                        onRead(item.id);
                        if (item.destination) onNavigate(item.destination);
                      }}
                      className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#2970ff] hover:underline sm:text-[15px]"
                    >
                      {item.action}
                      <ChevronRight className="size-4" />
                    </button>
                  ) : null}
                  {unread ? (
                    <button
                      type="button"
                      onClick={() => onRead(item.id)}
                      className="inline-flex items-center gap-1 text-[14px] font-medium text-[#62748e] hover:text-[#155eef]"
                    >
                      <CheckCheck className="size-4" />
                      Mark as read
                    </button>
                  ) : null}
                </div>
              </div>
              {unread ? (
                <span
                  aria-label="Unread notification"
                  className="mt-2 size-2.5 shrink-0 rounded-full bg-[#2970ff]"
                />
              ) : null}
            </article>
          );
        })}
        {visible.length === 0 ? (
          <div className="rounded-[18px] border border-[#f1f5f9] bg-white p-12 text-center text-[#6c737f]">
            <Bell className="mx-auto mb-3 size-7 text-[#90a1b9]" />
            No notifications in this category.
          </div>
        ) : null}
      </div>
      <p className="mt-5 flex items-center gap-2 text-xs text-[#90a1b9]">
        <Search className="size-4" />
        Figma example notifications only; no live notification service is
        connected.
      </p>
    </div>
  );
}
