import { useState, type FormEvent } from "react";
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

const TABS = ["All Bookings", "Upcoming", "Today", "Completed", "Cancelled"] as const;
type BookingTab = (typeof TABS)[number];

function matchesTab(booking: Booking, tab: BookingTab): boolean {
  switch (tab) {
    case "Upcoming":
      return booking.upcoming && booking.status !== "Cancelled" && booking.status !== "Completed";
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
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function formattedTime(timeValue: string): string {
  const [hour, minute] = timeValue.split(":").map(Number);
  const formattedHour = hour % 12 || 12;
  return formattedHour + ":" + String(minute).padStart(2, "0");
}

export default function LaboratoryTestBookingsRoute() {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [activeTab, setActiveTab] = useState<BookingTab>("All Bookings");
  const [query, setQuery] = useState("");
  const [headerQuery, setHeaderQuery] = useState("");
  const [category, setCategory] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("2026-05-02");
  const [newTime, setNewTime] = useState("13:30");
  const [toast, setToast] = useState("");

  const selected = bookings.find((booking) => booking.id === selectedId) ?? null;
  const reschedule = bookings.find((booking) => booking.id === rescheduleId) ?? null;
  const cancel = bookings.find((booking) => booking.id === cancelId) ?? null;

  const visible = bookings.filter((booking) => {
    const haystack = [
      booking.patient, booking.patientId, booking.test, booking.category,
      booking.id, booking.staff, booking.status,
    ].join(" ").toLowerCase();
    return matchesTab(booking, activeTab) &&
      (!category || booking.category === category) &&
      haystack.includes(query.trim().toLowerCase()) &&
      haystack.includes(headerQuery.trim().toLowerCase());
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
    setToast("Booking " + id + " rescheduled to " + date + " at " + time + " (preview)");
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
    <LaboratoryShell section="Test Bookings" search={headerQuery} onSearchChange={setHeaderQuery}>
      <div className="mx-auto w-full max-w-[1500px] px-[20px] pt-[45px] pb-[74px] sm:px-[30px]">
        <h1 className="text-[29px] leading-[37px] font-semibold tracking-[-0.5px] text-[#202b3a]">Test Bookings</h1>
        <p className="mt-[1px] text-[17px] leading-[25px] text-[#566371]">Manage and track all laboratory test bookings</p>

        <section className="mt-[39px] overflow-hidden rounded-[17px] border border-[#e4eaf2] bg-white">
          <div className="flex flex-wrap items-center gap-[16px] px-[19px] pt-[16px] pb-[8px]">
            <div className="relative min-w-[230px] flex-1 sm:max-w-[281px]">
              <Search className="pointer-events-none absolute top-[10px] left-[13px] size-[16px] text-[#9ca6b4]" strokeWidth={1.8} />
              <input
                type="search"
                aria-label="Search bookings by name, ID or test"
                placeholder="Search by name, ID, test..."
                value={query}
                onChange={(event) => setQuery(event.currentTarget.value)}
                className="h-[37px] w-full rounded-[11px] border border-[#dce4f0] bg-white pr-3 pl-[36px] text-[13px] text-[#344660] outline-none placeholder:text-[#90a4bf] focus:border-[#155eef] focus:ring-2 focus:ring-[#dce8ff]"
              />
            </div>
            <div className="relative w-full sm:w-[214px]">
              <select
                aria-label="Filter by test category"
                value={category}
                onChange={(event) => setCategory(event.currentTarget.value)}
                className="h-[37px] w-full appearance-none rounded-[11px] border border-[#dce4f0] bg-white px-[16px] pr-[35px] text-[13px] text-[#34435a] outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#dce8ff]"
              >
                <option value="">Filter by category</option>
                {CATEGORIES.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-[11px] right-[13px] size-[15px] text-[#223552]" />
            </div>
          </div>
          <div role="tablist" aria-label="Booking filters" className="mx-[19px] mt-[5px] flex items-stretch justify-between gap-1 overflow-x-auto border-b border-[#dfe6f0]">
            {TABS.map((tab) => {
              const selectedTab = tab === activeTab;
              const count = bookings.filter((booking) => matchesTab(booking, tab)).length;
              return (
                <button
                  type="button"
                  role="tab"
                  key={tab}
                  aria-selected={selectedTab}
                  onClick={() => setActiveTab(tab)}
                  className={
                    "flex min-h-[42px] shrink-0 items-center gap-[8px] border-b-[2px] px-[14px] text-[13px] font-medium transition-colors " +
                    (selectedTab ? "border-[#155eef] text-[#155eef]" : "border-transparent text-[#617799] hover:text-[#155eef]")
                  }
                >
                  {tab}
                  <span className={"flex min-w-[19px] items-center justify-center rounded-full px-[5px] py-[2px] text-[10px] leading-[13px] " + (selectedTab ? "bg-[#e4edff] text-[#155eef]" : "bg-[#eef2f7] text-[#7187a5]")}>{count}</span>
                </button>
              );
            })}
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[950px] border-collapse text-left">
              <thead>
                <tr className="h-[42px] border-b border-[#e2e9f3] bg-[#f7f9fc] text-[11px] font-semibold tracking-[0.15px] text-[#60738f]">
                  <th scope="col" className="w-[16%] px-[16px]">PATIENT</th>
                  <th scope="col" className="w-[26%] px-[16px]">TEST</th>
                  <th scope="col" className="w-[13%] px-[16px]">SCHEDULED</th>
                  <th scope="col" className="w-[17%] px-[16px]">STATUS</th>
                  <th scope="col" className="w-[16%] px-[16px]">ASSIGNED STAFF</th>
                  <th scope="col" className="w-[12%] px-[16px]">BOOKING ID</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((booking) => (
                  <tr
                    key={booking.id}
                    tabIndex={0}
                    role="button"
                    aria-label={"View booking " + booking.id + " for " + booking.patient}
                    onClick={() => openBooking(booking.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openBooking(booking.id);
                      }
                    }}
                    className="h-[64px] cursor-pointer border-b border-[#eef2f7] bg-white transition-colors last:border-b-0 hover:bg-[#f8fbff] focus-visible:bg-[#edf4ff] focus-visible:outline-2 focus-visible:outline-[#155eef]"
                  >
                    <td className="px-[16px] py-[9px]">
                      <span className="block text-[14px] leading-[19px] font-medium text-[#24334e]">{booking.patient}</span>
                      <span className="block font-mono text-[11px] leading-[15px] text-[#8da2c0]">{booking.patientId}</span>
                    </td>
                    <td className="px-[16px] py-[9px]">
                      <span className="block text-[14px] leading-[19px] text-[#394b68]">{booking.test}</span>
                      <span className="block text-[12px] leading-[15px] text-[#90a5c3]">{booking.category}</span>
                    </td>
                    <td className="px-[16px] py-[9px]">
                      <span className="block text-[14px] leading-[18px] text-[#405574]">{booking.date}</span>
                      <span className="block font-mono text-[12px] leading-[16px] text-[#3c506c]">{booking.time}</span>
                    </td>
                    <td className="px-[16px] py-[9px]">
                      <span className={"inline-flex items-center rounded-[9px] px-[9px] py-[3px] text-[12px] leading-[16px] font-medium " + statusStyle(booking.status)}>{booking.status}</span>
                    </td>
                    <td className="px-[16px] py-[9px] text-[12px] leading-[18px] text-[#6d82a3]">{booking.staff}</td>
                    <td className="px-[16px] py-[9px] font-mono text-[12px] leading-[18px] text-[#90a5c2]">{booking.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {visible.length === 0 && (
              <div className="px-4 py-14 text-center text-sm text-[#7287a2]">
                No bookings match your filters.
                <button type="button" className="ml-2 font-semibold text-[#155eef] hover:underline" onClick={() => { setQuery(""); setHeaderQuery(""); setCategory(""); setActiveTab("All Bookings"); }}>Clear filters</button>
              </div>
            )}
          </div>

          <div className="flex min-h-[55px] items-center justify-between border-t border-[#eef2f7] px-[19px]">
            <span className="text-[12px] text-[#8ea4c1]">{visible.length} {visible.length === 1 ? "booking" : "bookings"}</span>
            <div className="flex items-center gap-[9px]" aria-label="Pagination">
              <button type="button" aria-label="Page 1" aria-current="page" className="flex size-[29px] items-center justify-center rounded-[5px] bg-[#155eef] text-[12px] font-semibold text-white">1</button>
              <button type="button" disabled title="Only one page of preview bookings is available" aria-label="Page 2 unavailable" className="flex size-[29px] cursor-not-allowed items-center justify-center text-[12px] text-[#7c91ae] disabled:opacity-65">2</button>
              <button type="button" disabled title="Only one page of preview bookings is available" aria-label="Page 3 unavailable" className="flex size-[29px] cursor-not-allowed items-center justify-center text-[12px] text-[#7c91ae] disabled:opacity-65">3</button>
            </div>
          </div>
        </section>
        <p className="mt-4 text-[11px] text-[#96a4b5]">Interactive preview data from the reference design. Changes are temporary and are not saved to a server.</p>
      </div>

      {selected && (
        <LaboratoryBookingDrawer
          booking={selected}
          onClose={() => { setSelectedId(null); setToast(""); }}
          onStatusChange={(status) => changeStatus(selected.id, status)}
          onReschedule={() => startReschedule(selected.id)}
          onCancelRequest={() => requestCancel(selected.id)}
          toast={toast}
          onDismissToast={() => setToast("")}
        />
      )}

      {reschedule && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0f172a]/15 p-5 backdrop-blur-[5px]" onMouseDown={() => setRescheduleId(null)} role="presentation">
          <form role="dialog" aria-modal="true" aria-labelledby="reschedule-heading" onMouseDown={(event) => event.stopPropagation()} onSubmit={submitReschedule} className="w-full max-w-[490px] rounded-[21px] bg-white px-[30px] pt-[32px] pb-[29px] shadow-[0_20px_45px_rgba(15,23,42,0.15)]">
            <h2 id="reschedule-heading" className="text-[21px] font-semibold tracking-[-0.3px] text-[#131f33]">Reschedule Appointment</h2>
            <p className="mt-[22px] text-[17px] text-[#657b9b]">Patient: <span className="font-semibold">{reschedule.patient}</span></p>
            <label className="mt-[22px] block text-[15px] font-medium text-[#465d7c]">
              New Date
              <span className="relative mt-[7px] block">
                <input required type="date" value={newDate} onChange={(event) => setNewDate(event.currentTarget.value)} className="h-[49px] w-full rounded-[14px] border border-[#dce4ef] bg-white px-[23px] pr-12 text-[16px] text-[#405573] outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#dce8ff]" />
                <CalendarDays aria-hidden="true" className="pointer-events-none absolute top-[14px] right-[22px] size-[20px] text-[#1e293b]" />
              </span>
            </label>
            <label className="mt-[17px] block text-[15px] font-medium text-[#465d7c]">
              New Time
              <span className="relative mt-[7px] block">
                <input required type="time" value={newTime} onChange={(event) => setNewTime(event.currentTarget.value)} className="h-[49px] w-full rounded-[14px] border border-[#dce4ef] bg-white px-[23px] pr-12 text-[16px] text-[#405573] outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#dce8ff]" />
                <Clock3 aria-hidden="true" className="pointer-events-none absolute top-[14px] right-[22px] size-[20px] text-[#1e293b]" />
              </span>
            </label>
            <div className="mt-[25px] flex flex-wrap justify-end gap-[10px]">
              <button type="button" onClick={() => { setRescheduleId(null); setSelectedId(reschedule.id); }} className="min-h-[49px] rounded-[15px] border border-[#c9d5e6] px-[20px] text-[17px] font-medium text-[#394c67] hover:bg-[#f8fafc]">Cancel</button>
              <button type="submit" className="min-h-[49px] rounded-[15px] bg-[#155eef] px-[20px] text-[17px] font-medium text-white shadow-sm hover:bg-[#0049d0]">Confirm Reschedule</button>
            </div>
          </form>
        </div>
      )}

      {cancel && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0f172a]/15 p-5 backdrop-blur-[5px]" onMouseDown={() => { setCancelId(null); setSelectedId(cancel.id); }} role="presentation">
          <div role="alertdialog" aria-modal="true" aria-labelledby="cancel-heading" onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-[430px] rounded-[20px] bg-white p-[28px] shadow-xl">
            <div className="flex justify-between gap-3">
              <h2 id="cancel-heading" className="text-[20px] font-semibold text-[#17243d]">Cancel Booking</h2>
              <button type="button" aria-label="Close confirmation" onClick={() => { setCancelId(null); setSelectedId(cancel.id); }}><X className="size-[19px] text-[#90a4bf]" /></button>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#546680]">Cancel booking <strong>{cancel.id}</strong> for {cancel.patient}? This only changes the local preview.</p>
            <div className="mt-7 flex justify-end gap-3">
              <button type="button" onClick={() => { setCancelId(null); setSelectedId(cancel.id); }} className="rounded-xl border border-[#cdd7e5] px-5 py-3 text-sm text-[#384b67]">Keep Booking</button>
              <button type="button" onClick={confirmCancel} className="rounded-xl bg-[#df0008] px-5 py-3 text-sm font-semibold text-white">Cancel Booking</button>
            </div>
          </div>
        </div>
      )}
    </LaboratoryShell>
  );
}
