import { useSearchParams } from "react-router";
import { labListParams, labParam } from "./laboratory-list-state";
import { LaboratoryShell } from "./laboratory-shell";
import {
  markLabNotificationRead,
  useLabNotifications,
  type LaboratoryNotification,
  type LaboratoryNotificationBadge,
} from "./laboratory-notifications-data";

const BADGE_STYLE: Record<LaboratoryNotificationBadge, string> = {
  "Booking Confirmed": "text-[#155eef]",
  "Appointment Reminder": "bg-[#fff9e9] text-[#c45b00]",
  "Sample Collected": "bg-[#effaff] text-[#007db9]",
  "Results Published": "bg-[#ecfbf4] text-[#009873]",
  "Results Ready": "bg-[#ecfbf4] text-[#009873]",
  "Test In Progress": "bg-[#f4f0ff] text-[#7632ed]",
};

function NotificationCard({ item }: { item: LaboratoryNotification }) {
  return (
    <article
      className={
        "flex min-h-[112px] gap-[12px] rounded-[16px] border px-[14px] py-[15px] transition-colors sm:gap-[18px] sm:rounded-[17px] sm:px-[18px] sm:py-[19px] " +
        (item.unread
          ? "border-[#afd1ff] bg-[#eef5ff]"
          : "border-[#e0e8f3] bg-white")
      }
    >
      <span
        aria-hidden="true"
        className="flex size-[38px] shrink-0 items-center justify-center rounded-full border border-[#dee6f1] bg-white text-[18px] sm:size-[44px] sm:text-[21px]"
      >
        {item.icon}
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-start justify-between gap-x-[12px] gap-y-[5px]">
          <h2
            className={
              "inline-flex min-w-0 items-center gap-[9px] text-[14px] leading-[20px] font-semibold sm:text-[16px] sm:leading-[22px] " +
              (item.unread ? "text-[#1e2d44]" : "text-[#596577]")
            }
          >
            {item.title}
            {item.unread && (
              <span
                aria-label="Unread notification"
                className="size-[8px] shrink-0 rounded-full bg-[#2879ff]"
              />
            )}
          </h2>
          <span
            className={
              "inline-flex shrink-0 items-center rounded-full px-[10px] py-[4px] text-[11px] leading-[15px] font-medium sm:text-[13px] sm:leading-[17px] " +
              BADGE_STYLE[item.badge]
            }
          >
            {item.badge}
          </span>
        </div>
        <p
          className={
            "mt-[3px] text-[12px] leading-[18px] sm:text-[15px] sm:leading-[22px] " +
            (item.unread ? "text-[#4c5f7b]" : "text-[#7c8ca6]")
          }
        >
          {item.description}
        </p>
        <div className="mt-[9px] flex flex-wrap items-center gap-x-[14px] gap-y-[6px] sm:mt-[10px]">
          <span className="font-mono text-[10px] tracking-[-0.15px] text-[#8fa5c4] sm:text-[12px]">
            {item.date}
          </span>
          <span className="text-[11px] text-[#8fa5c4] sm:text-[12px]">
            Patient: {item.patient}
          </span>
          {item.unread && (
            <button
              type="button"
              onClick={() => markLabNotificationRead(item.id)}
              aria-label={
                "Mark " + item.title + " for " + item.patient + " as read"
              }
              className="ml-auto rounded-[6px] text-[12px] font-medium whitespace-nowrap text-[#155eef] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#155eef] sm:text-[13px]"
            >
              Mark as read
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default function LaboratoryNotifications() {
  const items = useLabNotifications();
  const [params, setParams] = useSearchParams();
  const headerSearch = labParam(params, "q");
  const setHeaderSearch = (value: string) => setParams((current) => labListParams(current, "q", value), { replace: true });
  const unreadCount = items.filter((item) => item.unread).length;
  const query = headerSearch.trim().toLowerCase();
  const visibleItems = query
    ? items.filter((item) =>
        [
          item.title,
          item.badge,
          item.description,
          item.patient,
          item.date,
          item.category,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query)
      )
    : items;

  return (
    <LaboratoryShell
      section="Notifications"
      search={headerSearch}
      onSearchChange={setHeaderSearch}
    >
      <div className="w-full px-[15px] pt-[24px] pb-[65px] sm:px-[30px] sm:pt-[43px] sm:pb-[75px]">
        <h1 className="text-[22px] leading-[30px] font-semibold tracking-[-0.4px] text-[#202b3a] sm:text-[29px] sm:leading-[37px]">
          Notifications
        </h1>
        <p className="mt-[1px] text-[13px] leading-[20px] text-[#566371] sm:text-[17px] sm:leading-[25px]">
          Stay updated on bookings, samples, and results
        </p>

        <div className="mt-[33px] w-full sm:mt-[42px]">
          <p className="mb-[17px] text-[13px] leading-[19px] text-[#7185a2] sm:mb-[18px] sm:text-[15px] sm:leading-[22px]">
            <strong className="font-semibold text-[#155eef]">
              {unreadCount} unread
            </strong>{" "}
            notifications
          </p>
          <div className="space-y-[14px] sm:space-y-[20px]">
            {visibleItems.map((item) => (
              <NotificationCard key={item.id} item={item} />
            ))}
            {visibleItems.length === 0 && (
              <div className="rounded-[15px] border border-[#e1e8f2] bg-white px-5 py-10 text-center text-[13px] text-[#7185a1]">
                No notifications match your search.
                <button
                  type="button"
                  className="ml-[7px] font-medium text-[#155eef] hover:underline"
                  onClick={() => setHeaderSearch("")}
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
          <p className="mt-[18px] text-[11px] leading-[17px] text-[#99a8bd]">
            Sample notifications from the reference design, not live messages.
            No patient SMS or email is sent.
          </p>
        </div>
      </div>
    </LaboratoryShell>
  );
}
