import { useState, type FormEvent } from "react";
import { useSearchParams } from "react-router";
import { labListParams, labParam } from "~/features/laboratory-dashboard/laboratory-list-state";
import { CalendarDays, ChevronDown, Clock3, Search, X } from "lucide-react";
import { LaboratoryShell } from "~/features/laboratory-dashboard/laboratory-shell";
import { LaboratoryBookingDrawer } from "~/features/laboratory-dashboard/laboratory-booking-drawer";
import {
  CATEGORIES,
  INITIAL_BOOKINGS,
  statusStyle,
  type Booking,
  type BookingStatus,
} from "~/features/laboratory-dashboard/laboratory-bookings-data";

const TABS = [
  "All Bookings",
  "Upcoming",
  "Today",
  "Completed",
  "Cancelled",
] as const;
type BookingTab = (typeof TABS)[number];

function matchesTab(booking: Booking, tab: BookingTab): boolean {
  switch (tab) {
    case "Upcoming":
      return (
        booking.upcoming &&
        booking.status !== "Cancelled" &&
        booking.status !== "Completed"
      );
    case "Today":
      return booking.date === "13 Sept 2025";
    case "Completed":
      return booking.status === "Completed";
    case "Cancelled":
      return booking.status === "Cancelled";
    default:
      return true;
  }
}

function formattedDate(dateValue: string): string {
  const [year, month, day] = dateValue.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formattedTime(timeValue: string): string {
  const [hour, minute] = timeValue.split(":").map(Number);
  const formattedHour = hour % 12 || 12;
  return formattedHour + ":" + String(minute).padStart(2, "0");
}

export default function LaboratoryTestBookings() {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [params, setParams] = useSearchParams();
  const activeTab = labParam(params, "tab", TABS, "All Bookings") as BookingTab;
  const setActiveTab = (value: BookingTab) => setParams((current) => labListParams(current, "tab", value, "All Bookings"));
  const query = labParam(params, "q");
  const setQuery = (value: string) => setParams((current) => labListParams(current, "q", value), { replace: true });
  const headerQuery = query;
  const setHeaderQuery = setQuery;
  const category = labParam(params, "category", CATEGORIES);
  const setCategory = (value: string) => setParams((current) => labListParams(current, "category", value));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("2026-05-02");
  const [newTime, setNewTime] = useState("13:30");
  const [toast, setToast] = useState("");

  const selected =
    bookings.find((booking) => booking.id === selectedId) ?? null;
  const reschedule =
    bookings.find((booking) => booking.id === rescheduleId) ?? null;
  const cancel = bookings.find((booking) => booking.id === cancelId) ?? null;

  const visible = bookings.filter((booking) => {
    const haystack = [
      booking.patient,
      booking.patientId,
      booking.test,
      booking.category,
      booking.id,
      booking.staff,
      booking.status,
    ]
      .join(" ")
      .toLowerCase();
    return (
      matchesTab(booking, activeTab) &&
      (!category || booking.category === category) &&
      haystack.includes(query.trim().toLowerCase()) &&
      haystack.includes(headerQuery.trim().toLowerCase())
    );
  });

  const changeStatus = (id: string, status: BookingStatus) => {
    setBookings((current) =>
      current.map((booking) =>
        booking.id === id ? { ...booking, status } : booking
      )
    );
    setToast("Booking " + id + " updated to: " + status + " (preview)");
  };

  const startReschedule = (id: string) => {
    setSelectedId(null);
    setToast("");
    setRescheduleId(id);
    setNewDate("2026-05-02");
    setNewTime("13:30");
  };

  const submitReschedule = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!reschedule || !newDate || !newTime) return;
    const id = reschedule.id;
    const date = formattedDate(newDate);
    const time = formattedTime(newTime);
    setBookings((current) =>
      current.map((booking) =>
        booking.id === id
          ? { ...booking, status: "Rescheduled", date, time, upcoming: true }
          : booking
      )
    );
    setRescheduleId(null);
    setSelectedId(id);
    setToast(
      "Booking " + id + " rescheduled to " + date + " at " + time + " (preview)"
    );
  };

  const requestCancel = (id: string) => {
    setSelectedId(null);
    setToast("");
    setCancelId(id);
  };

  const confirmCancel = () => {
    if (!cancel) return;
    const id = cancel.id;
    changeStatus(id, "Cancelled");
    setCancelId(null);
    setSelectedId(id);
  };

  const openBooking = (id: string) => {
    setSelectedId(id);
    setToast("");
  };

  return (
    <LaboratoryShell
      section="Test Bookings"
      search={headerQuery}
      onSearchChange={setHeaderQuery}
    >
      <div className="mx-auto w-full max-w-[1500px] px-[15px] pt-[24px] pb-[44px] sm:px-[30px] sm:pt-[45px] sm:pb-[74px]">
        <h1 className="text-[22px] leading-[30px] font-semibold tracking-[-0.4px] text-[#202b3a] sm:text-[29px] sm:leading-[37px] sm:tracking-[-0.5px]">
          Test Bookings
        </h1>
        <p className="mt-[1px] text-[13px] leading-[20px] text-[#566371] sm:text-[17px] sm:leading-[25px]">
          Manage and track all laboratory test bookings
        </p>

        <section className="mt-[23px] overflow-hidden rounded-[13px] border border-[#e4eaf2] bg-white sm:mt-[39px] sm:rounded-[17px]">
          <div className="flex flex-wrap items-center gap-[10px] px-[12px] pt-[12px] pb-[8px] sm:gap-[16px] sm:px-[19px] sm:pt-[16px]">
            <div className="relative min-w-[180px] flex-1 sm:max-w-[281px]">
              <Search
                className="pointer-events-none absolute top-[10px] left-[13px] size-[16px] text-[#9ca6b4]"
                strokeWidth={1.8}
              />
              <input
                type="search"
                aria-label="Search bookings by name, ID or test"
                placeholder="Search by name, ID, test..."
                value={query}
                onChange={(event) => setQuery(event.currentTarget.value)}
                className="h-[35px] w-full rounded-[9px] border border-[#dce4f0] bg-white pr-3 pl-[36px] text-[12px] text-[#344660] outline-none placeholder:text-[#90a4bf] focus:border-[#155eef] focus:ring-2 focus:ring-[#dce8ff] sm:h-[37px] sm:rounded-[11px] sm:text-[13px]"
              />
            </div>
            <div className="relative w-full sm:w-[214px]">
              <select
                aria-label="Filter by test category"
                value={category}
                onChange={(event) => setCategory(event.currentTarget.value)}
                className="h-[35px] w-full appearance-none rounded-[9px] border border-[#dce4f0] bg-white px-[13px] pr-[35px] text-[12px] text-[#34435a] outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#dce8ff] sm:h-[37px] sm:rounded-[11px] sm:px-[16px] sm:pr-[35px] sm:text-[13px]"
              >
                <option value="">Filter by category</option>
                {CATEGORIES.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute top-[11px] right-[13px] size-[15px] text-[#223552]"
              />
            </div>
          </div>
          <div
            role="tablist"
            aria-label="Booking filters"
            className="mx-[12px] mt-[5px] flex items-stretch justify-between gap-1 overflow-x-auto border-b border-[#dfe6f0] sm:mx-[19px]"
          >
            {TABS.map((tab) => {
              const selectedTab = tab === activeTab;
              const count = bookings.filter((booking) =>
                matchesTab(booking, tab)
              ).length;
              return (
                <button
                  type="button"
                  role="tab"
                  key={tab}
                  aria-selected={selectedTab}
                  onClick={() => setActiveTab(tab)}
                  className={
                    "flex min-h-[38px] shrink-0 items-center gap-[6px] border-b-[2px] px-[10px] text-[12px] font-medium transition-colors sm:min-h-[42px] sm:gap-[8px] sm:px-[14px] sm:text-[13px] " +
                    (selectedTab
                      ? "border-[#155eef] text-[#155eef]"
                      : "border-transparent text-[#617799] hover:text-[#155eef]")
                  }
                >
                  {tab}
                  <span
                    className={
                      "flex min-w-[19px] items-center justify-center rounded-full px-[5px] py-[2px] text-[10px] leading-[13px] " +
                      (selectedTab
                        ? "bg-[#e4edff] text-[#155eef]"
                        : "bg-[#eef2f7] text-[#7187a5]")
                    }
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[950px] border-collapse text-left">
              <thead>
                <tr className="h-[42px] border-b border-[#e2e9f3] bg-[#f7f9fc] text-[11px] font-semibold tracking-[0.15px] text-[#60738f]">
                  <th scope="col" className="w-[16%] px-[16px]">
                    PATIENT
                  </th>
                  <th scope="col" className="w-[26%] px-[16px]">
                    TEST
                  </th>
                  <th scope="col" className="w-[13%] px-[16px]">
                    SCHEDULED
                  </th>
                  <th scope="col" className="w-[17%] px-[16px]">
                    STATUS
                  </th>
                  <th scope="col" className="w-[16%] px-[16px]">
                    ASSIGNED STAFF
                  </th>
                  <th scope="col" className="w-[12%] px-[16px]">
                    BOOKING ID
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((booking) => (
                  <tr
                    key={booking.id}
                    tabIndex={0}
                    role="button"
                    aria-label={
                      "View booking " + booking.id + " for " + booking.patient
                    }
                    onClick={() => openBooking(booking.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openBooking(booking.id);
                      }
                    }}
                    className="h-[55px] cursor-pointer border-b border-[#eef2f7] bg-white transition-colors last:border-b-0 hover:bg-[#f8fbff] focus-visible:bg-[#edf4ff] focus-visible:outline-2 focus-visible:outline-[#155eef]"
                  >
                    <td className="px-[16px] py-[9px]">
                      <span className="block text-[12px] leading-[17px] font-medium text-[#24334e] sm:text-[14px] sm:leading-[19px]">
                        {booking.patient}
                      </span>
                      <span className="block font-mono text-[11px] leading-[15px] text-[#8da2c0]">
                        {booking.patientId}
                      </span>
                    </td>
                    <td className="px-[16px] py-[9px]">
                      <span className="block text-[12px] leading-[17px] text-[#394b68] sm:text-[14px] sm:leading-[19px]">
                        {booking.test}
                      </span>
                      <span className="block text-[12px] leading-[15px] text-[#90a5c3]">
                        {booking.category}
                      </span>
                    </td>
                    <td className="px-[16px] py-[9px]">
                      <span className="block text-[12px] leading-[17px] text-[#405574] sm:text-[14px] sm:leading-[18px]">
                        {booking.date}
                      </span>
                      <span className="block font-mono text-[12px] leading-[16px] text-[#3c506c]">
                        {booking.time}
                      </span>
                    </td>
                    <td className="px-[16px] py-[9px]">
                      <span
                        className={
                          "inline-flex items-center rounded-[9px] px-[8px] py-[3px] text-[11px] leading-[15px] font-medium sm:px-[9px] sm:text-[12px] sm:leading-[16px] " +
                          statusStyle(booking.status)
                        }
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-[16px] py-[9px] text-[12px] leading-[18px] text-[#6d82a3]">
                      {booking.staff}
                    </td>
                    <td className="px-[16px] py-[9px] font-mono text-[12px] leading-[18px] text-[#90a5c2]">
                      {booking.id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {visible.length === 0 && (
              <div className="px-4 py-14 text-center text-sm text-[#7287a2]">
                No bookings match your filters.
                <button
                  type="button"
                  className="ml-2 font-semibold text-[#155eef] hover:underline"
                  onClick={() => {
                    setQuery("");
                    setHeaderQuery("");
                    setCategory("");
                    setActiveTab("All Bookings");
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          <div className="flex min-h-[48px] items-center justify-between border-t border-[#eef2f7] px-[19px] sm:min-h-[55px]">
            <span className="text-[12px] text-[#8ea4c1]">
              {visible.length} {visible.length === 1 ? "booking" : "bookings"}
            </span>
            <div
              className="flex items-center gap-[9px]"
              aria-label="Pagination"
            >
              <button
                type="button"
                aria-label="Page 1"
                aria-current="page"
                className="flex size-[29px] items-center justify-center rounded-[5px] bg-[#155eef] text-[12px] font-semibold text-white"
              >
                1
              </button>
              <button
                type="button"
                disabled
                title="Only one page of preview bookings is available"
                aria-label="Page 2 unavailable"
                className="flex size-[29px] cursor-not-allowed items-center justify-center text-[12px] text-[#7c91ae] disabled:opacity-65"
              >
                2
              </button>
              <button
                type="button"
                disabled
                title="Only one page of preview bookings is available"
                aria-label="Page 3 unavailable"
                className="flex size-[29px] cursor-not-allowed items-center justify-center text-[12px] text-[#7c91ae] disabled:opacity-65"
              >
                3
              </button>
            </div>
          </div>
        </section>
        <p className="mt-4 text-[11px] text-[#96a4b5]">
          Interactive preview data from the reference design. Changes are
          temporary and are not saved to a server.
        </p>
      </div>

      {selected && (
        <LaboratoryBookingDrawer
          booking={selected}
          onClose={() => {
            setSelectedId(null);
            setToast("");
          }}
          onStatusChange={(status) => changeStatus(selected.id, status)}
          onReschedule={() => startReschedule(selected.id)}
          onCancelRequest={() => requestCancel(selected.id)}
          toast={toast}
          onDismissToast={() => setToast("")}
        />
      )}

      {reschedule && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0f172a]/15 p-5 backdrop-blur-[5px]"
          onMouseDown={() => setRescheduleId(null)}
          role="presentation"
        >
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="reschedule-heading"
            onMouseDown={(event) => event.stopPropagation()}
            onSubmit={submitReschedule}
            className="w-full max-w-[490px] rounded-[17px] bg-white px-[20px] pt-[24px] pb-[22px] shadow-[0_20px_45px_rgba(15,23,42,0.15)] sm:rounded-[21px] sm:px-[30px] sm:pt-[32px] sm:pb-[29px]"
          >
            <h2
              id="reschedule-heading"
              className="text-[18px] font-semibold tracking-[-0.2px] text-[#131f33] sm:text-[21px] sm:tracking-[-0.3px]"
            >
              Reschedule Appointment
            </h2>
            <p className="mt-[18px] text-[14px] text-[#657b9b] sm:mt-[22px] sm:text-[17px]">
              Patient:{" "}
              <span className="font-semibold">{reschedule.patient}</span>
            </p>
            <label className="mt-[22px] block text-[13px] font-medium text-[#465d7c] sm:text-[15px]">
              New Date
              <span className="relative mt-[7px] block">
                <input
                  required
                  type="date"
                  value={newDate}
                  onChange={(event) => setNewDate(event.currentTarget.value)}
                  className="h-[44px] w-full rounded-[12px] border border-[#dce4ef] bg-white px-[15px] pr-12 text-[14px] text-[#405573] outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#dce8ff] sm:h-[49px] sm:rounded-[14px] sm:px-[23px] sm:text-[16px]"
                />
                <CalendarDays
                  aria-hidden="true"
                  className="pointer-events-none absolute top-[14px] right-[22px] size-[20px] text-[#1e293b]"
                />
              </span>
            </label>
            <label className="mt-[17px] block text-[13px] font-medium text-[#465d7c] sm:text-[15px]">
              New Time
              <span className="relative mt-[7px] block">
                <input
                  required
                  type="time"
                  value={newTime}
                  onChange={(event) => setNewTime(event.currentTarget.value)}
                  className="h-[44px] w-full rounded-[12px] border border-[#dce4ef] bg-white px-[15px] pr-12 text-[14px] text-[#405573] outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#dce8ff] sm:h-[49px] sm:rounded-[14px] sm:px-[23px] sm:text-[16px]"
                />
                <Clock3
                  aria-hidden="true"
                  className="pointer-events-none absolute top-[14px] right-[22px] size-[20px] text-[#1e293b]"
                />
              </span>
            </label>
            <div className="mt-[25px] flex flex-wrap justify-end gap-[10px]">
              <button
                type="button"
                onClick={() => {
                  setRescheduleId(null);
                  setSelectedId(reschedule.id);
                }}
                className="min-h-[44px] rounded-[12px] border border-[#c9d5e6] px-[14px] text-[14px] font-medium text-[#394c67] hover:bg-[#f8fafc] sm:min-h-[49px] sm:rounded-[15px] sm:px-[20px] sm:text-[17px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="min-h-[44px] rounded-[12px] bg-[#155eef] px-[14px] text-[14px] font-medium text-white shadow-sm hover:bg-[#0049d0] sm:min-h-[49px] sm:rounded-[15px] sm:px-[20px] sm:text-[17px]"
              >
                Confirm Reschedule
              </button>
            </div>
          </form>
        </div>
      )}

      {cancel && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0f172a]/15 p-5 backdrop-blur-[5px]"
          onMouseDown={() => {
            setCancelId(null);
            setSelectedId(cancel.id);
          }}
          role="presentation"
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="cancel-heading"
            onMouseDown={(event) => event.stopPropagation()}
            className="w-full max-w-[430px] rounded-[20px] bg-white p-[28px] shadow-xl"
          >
            <div className="flex justify-between gap-3">
              <h2
                id="cancel-heading"
                className="text-[20px] font-semibold text-[#17243d]"
              >
                Cancel Booking
              </h2>
              <button
                type="button"
                aria-label="Close confirmation"
                onClick={() => {
                  setCancelId(null);
                  setSelectedId(cancel.id);
                }}
              >
                <X className="size-[19px] text-[#90a4bf]" />
              </button>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#546680]">
              Cancel booking <strong>{cancel.id}</strong> for {cancel.patient}?
              This only changes the local preview.
            </p>
            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setCancelId(null);
                  setSelectedId(cancel.id);
                }}
                className="rounded-xl border border-[#cdd7e5] px-5 py-3 text-sm text-[#384b67]"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={confirmCancel}
                className="rounded-xl bg-[#df0008] px-5 py-3 text-sm font-semibold text-white"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </LaboratoryShell>
  );
}
