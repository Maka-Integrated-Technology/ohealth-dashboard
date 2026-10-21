import { useMemo, useState } from "react";
import { CheckCheck, ChevronRight, Search } from "lucide-react";
import { useNavigate } from "react-router";
import { LaboratoryShell } from "./laboratory-shell";
import {
  markAllLabNotificationsRead,
  markLabNotificationRead,
  useLabNotifications,
  type LaboratoryNotificationCategory,
} from "./laboratory-notifications-data";

type Category = "All" | "Unread" | LaboratoryNotificationCategory;
const FILTERS: Category[] = [
  "All",
  "Unread",
  "Bookings",
  "Samples",
  "Results",
  "System",
];

export default function LaboratoryNotifications() {
  const items = useLabNotifications();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Category>("All");
  const [search, setSearch] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const unreadCount = items.filter((item) => item.unread).length;
  const filteredItems = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const globalNeedle = globalSearch.trim().toLowerCase();
    return items.filter((item) => {
      const match = [item.title, item.description, item.category, item.date]
        .join(" ")
        .toLowerCase();
      return (
        (filter === "All" ||
          (filter === "Unread" ? item.unread : item.category === filter)) &&
        match.includes(needle) &&
        match.includes(globalNeedle)
      );
    });
  }, [items, filter, search, globalSearch]);

  const openNotification = (id: string, target: string) => {
    markLabNotificationRead(id);
    navigate(target);
  };

  return (
    <LaboratoryShell
      section="Notifications"
      search={globalSearch}
      onSearchChange={setGlobalSearch}
    >
      <div className="mx-auto w-full max-w-[1500px] px-[15px] pt-[24px] pb-[65px] sm:px-[30px] sm:pt-[45px]">
        <div className="flex flex-wrap items-start justify-between gap-[14px]">
          <div>
            <h1 className="text-[22px] leading-[30px] font-semibold text-[#202b3a] sm:text-[29px] sm:leading-[37px]">
              Notifications
            </h1>
            <p className="mt-[1px] text-[13px] leading-[20px] text-[#566371] sm:text-[17px] sm:leading-[25px]">
              Stay updated on bookings, samples, and laboratory results
            </p>
          </div>
          <button
            type="button"
            disabled={!unreadCount}
            onClick={markAllLabNotificationsRead}
            className="inline-flex min-h-[35px] items-center gap-[7px] rounded-[10px] border border-[#d9e4f4] bg-white px-[13px] text-[12px] font-medium text-[#155eef] hover:bg-[#f7faff] disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-[37px] sm:text-[13px]"
          >
            <CheckCheck className="size-[15px]" /> Mark all as read
          </button>
        </div>

        <section className="mt-[28px] overflow-hidden rounded-[15px] border border-[#e5ebf3] bg-white sm:mt-[41px] sm:rounded-[17px]">
          <div className="flex flex-wrap items-center justify-between gap-[12px] px-[13px] pt-[14px] sm:px-[19px]">
            <div className="relative min-w-[180px] flex-1 sm:max-w-[300px]">
              <Search className="pointer-events-none absolute top-[10px] left-[12px] size-[15px] text-[#91a5c1]" />
              <input
                type="search"
                aria-label="Search notifications"
                placeholder="Search notifications..."
                value={search}
                onChange={(event) => setSearch(event.currentTarget.value)}
                className="h-[36px] w-full rounded-[10px] border border-[#dce4ef] bg-white pr-[10px] pl-[35px] text-[12px] text-[#33445d] outline-none placeholder:text-[#91a5c1] focus:border-[#155eef] sm:text-[13px]"
              />
            </div>
            <div className="flex items-center gap-[6px] text-[12px] text-[#778dab]">
              <span className="inline-block size-[7px] rounded-full bg-[#155eef]" />
              {unreadCount} unread
            </div>
          </div>
          <div
            role="tablist"
            aria-label="Notification filters"
            className="mx-[13px] mt-[10px] flex gap-1 overflow-x-auto border-b border-[#e3eaf3] sm:mx-[19px] sm:mt-[13px]"
          >
            {FILTERS.map((category) => {
              const active = filter === category;
              const count =
                category === "All"
                  ? items.length
                  : category === "Unread"
                    ? unreadCount
                    : items.filter((item) => item.category === category).length;
              return (
                <button
                  type="button"
                  role="tab"
                  aria-selected={active}
                  key={category}
                  onClick={() => setFilter(category)}
                  className={
                    "flex min-h-[39px] shrink-0 items-center gap-[6px] border-b-[2px] px-[10px] text-[12px] sm:min-h-[44px] sm:px-[13px] sm:text-[13px] " +
                    (active
                      ? "border-[#155eef] font-medium text-[#155eef]"
                      : "border-transparent text-[#6980a0] hover:text-[#155eef]")
                  }
                >
                  {category}
                  <span
                    className={
                      "rounded-full px-[6px] py-[2px] text-[10px] " +
                      (active
                        ? "bg-[#e8efff] text-[#155eef]"
                        : "bg-[#f1f4f8] text-[#7287a5]")
                    }
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={
                  "flex items-start gap-[11px] border-b border-[#edf1f6] px-[13px] py-[14px] last:border-b-0 sm:gap-[15px] sm:px-[19px] sm:py-[18px] " +
                  (item.unread ? "bg-[#fafdff]" : "bg-white")
                }
              >
                <button
                  type="button"
                  onClick={() => openNotification(item.id, item.target)}
                  aria-label={"Open " + item.title}
                  className="flex min-w-0 flex-1 items-start gap-[11px] text-left sm:gap-[15px]"
                >
                  <span
                    aria-hidden="true"
                    className="flex size-[35px] shrink-0 items-center justify-center rounded-[11px] bg-[#f1f5fc] text-[16px] sm:size-[41px] sm:text-[19px]"
                  >
                    {item.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-[8px]">
                      <span className="text-[12px] leading-[18px] font-semibold text-[#273853] sm:text-[14px] sm:leading-[21px]">
                        {item.title}
                      </span>
                      {item.unread && (
                        <span
                          aria-label="Unread"
                          className="size-[7px] rounded-full bg-[#155eef]"
                        />
                      )}
                    </span>
                    <span className="mt-[2px] block text-[11px] leading-[17px] text-[#607594] sm:text-[13px] sm:leading-[20px]">
                      {item.description}
                    </span>
                    <span className="mt-[6px] block font-mono text-[10px] text-[#8fa3bd] sm:text-[11px]">
                      {item.date}
                    </span>
                  </span>
                </button>
                <div className="flex shrink-0 items-center gap-[8px]">
                  {item.unread && (
                    <button
                      type="button"
                      onClick={() => markLabNotificationRead(item.id)}
                      className="rounded-[8px] border border-[#dae5f4] px-[8px] py-[5px] text-[10px] text-[#155eef] hover:bg-[#f0f6ff] sm:text-[11px]"
                    >
                      Mark read
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => openNotification(item.id, item.target)}
                    aria-label={"Go to " + item.category}
                    className="p-[5px] text-[#8ea2bf] hover:text-[#155eef]"
                  >
                    <ChevronRight className="size-[16px]" />
                  </button>
                </div>
              </div>
            ))}
            {filteredItems.length === 0 && (
              <div className="px-5 py-[45px] text-center text-[13px] text-[#7890ad]">
                No notifications match these filters.
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setGlobalSearch("");
                    setFilter("All");
                  }}
                  className="ml-[7px] font-medium text-[#155eef]"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
          <div className="flex min-h-[48px] items-center border-t border-[#edf1f6] px-[19px] text-[12px] text-[#91a5bf]">
            {filteredItems.length}{" "}
            {filteredItems.length === 1 ? "notification" : "notifications"}
          </div>
        </section>
        <p className="mt-[13px] text-[11px] text-[#98a8ba]">
          Example notifications only. No emails, text messages or push
          notifications are sent.
        </p>
      </div>
    </LaboratoryShell>
  );
}
