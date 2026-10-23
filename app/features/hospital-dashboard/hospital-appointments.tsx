import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Phone,
  Search,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { hospitalFilterParams, matchesAppointment } from "~/features/hospital-dashboard/hospital-preview-state";
import { type AppointmentStatus, type PreviewAppointment } from "~/features/hospital-dashboard/hospital-appointment-data";

const statusColors: Record<AppointmentStatus, string> = {
  Pending: "bg-[#fff8e6] text-[#b7791f]",
  Confirmed: "bg-[#ecfdf3] text-[#087443]",
  Rescheduled: "bg-[#eff4ff] text-[#155eef]",
  Cancelled: "bg-[#fef3f2] text-[#d92d20]",
  Arrived: "bg-[#ecfdf3] text-[#067647]",
  Completed: "bg-[#f0f2f5] text-[#475467]",
};

function AppointmentBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${statusColors[status]}`}
    >
      <span className="size-2 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function AppointmentDrawer({
  appointment,
  onClose,
  onUpdate,
}: {
  appointment: PreviewAppointment;
  onClose: () => void;
  onUpdate: (appointment: PreviewAppointment) => void;
}) {
  const [rescheduling, setRescheduling] = useState(false);
  const [newDate, setNewDate] = useState(appointment.date);
  const [newTime, setNewTime] = useState("10:30");
  const [notice, setNotice] = useState("");
  const [age, gender] = appointment.detail.split(" · ");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const changeStatus = (status: AppointmentStatus) => {
    onUpdate({ ...appointment, status });
    setNotice(
      `Appointment marked ${status.toLowerCase()} in this preview only.`
    );
    setRescheduling(false);
  };

  const saveReschedule = () => {
    if (!newDate || !newTime) return;
    const [hour, minute] = newTime.split(":").map(Number);
    const formattedTime = `${String(hour % 12 || 12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
    onUpdate({
      ...appointment,
      date: newDate,
      time: formattedTime,
      status: "Rescheduled",
    });
    setNotice("New appointment time saved in this preview only.");
    setRescheduling(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="presentation">
      <button
        aria-label="Close appointment details"
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-[#101828]/45"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Appointment Details"
        className="relative z-10 flex h-full w-full max-w-[757px] flex-col overflow-y-auto bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[#e5e7eb] px-4 py-4 sm:px-6 sm:px-9 sm:py-6">
          <h2 className="text-[19px] font-semibold text-[#1f2a37] sm:text-[24px]">
            Appointment Details
          </h2>
          <button
            type="button"
            aria-label="Close details"
            onClick={onClose}
            className="rounded-lg p-2 text-[#6c737f] hover:bg-[#f3f4f6]"
          >
            <X className="size-6" />
          </button>
        </div>
        <div className="flex-1 px-4 py-4 sm:px-6 sm:px-9 sm:py-8">
          <div className="flex items-center gap-5 border-b border-[#f1f5f9] pb-8">
            <div className="flex size-[60px] shrink-0 items-center justify-center rounded-full bg-[#0891b2] text-[21px] font-semibold text-white sm:size-[82px] sm:text-[27px]">
              {appointment.initials}
            </div>
            <div className="min-w-0">
              <h3 className="text-[19px] font-semibold text-[#1f2a37] sm:text-[24px]">
                {appointment.patient}
              </h3>
              <p className="mt-1 text-[13px] text-[#6c737f] sm:text-[16px]">
                {age.replace("y", " years")} · {gender}
                {appointment.bloodGroup ? ` · ${appointment.bloodGroup}` : ""}
              </p>
              {appointment.phone ? (
                <p className="mt-2 flex items-center gap-2 text-[13px] text-[#4d5761] sm:text-[16px]">
                  <Phone className="size-4" />
                  {appointment.phone}
                </p>
              ) : null}
            </div>
          </div>
          <div className="mt-7 flex items-center justify-between border-b border-[#f1f5f9] pb-6">
            <p className="text-sm font-semibold text-[#4d5761]">
              Appointment Status
            </p>
            <AppointmentBadge status={appointment.status} />
          </div>
          <dl className="mt-8 grid grid-cols-1 gap-x-8 gap-y-7 text-[14px] sm:grid-cols-2 sm:text-[17px]">
            {[
              ["Doctor", appointment.doctor],
              ["Department", appointment.department],
              ["Type", appointment.type],
              ["Date", appointment.date],
              ["Time", appointment.time],
              [
                "Source",
                appointment.patient === "Maria Santos"
                  ? "OHealth App"
                  : "Not available",
              ],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="mb-2 text-[#6c737f]">{label}</dt>
                <dd className="font-medium text-[#1f2a37]">{value}</dd>
              </div>
            ))}
          </dl>
          {notice ? (
            <p
              role="status"
              className="mt-8 rounded-xl bg-[#eff4ff] px-4 py-3 text-sm text-[#155eef]"
            >
              {notice}
            </p>
          ) : null}
          {rescheduling ? (
            <div className="mt-8 rounded-xl border border-[#d2d6db] p-5">
              <h4 className="font-semibold text-[#1f2a37]">
                Reschedule Appointment
              </h4>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="text-sm text-[#4d5761]">
                  New date
                  <input
                    type="date"
                    value={newDate}
                    onChange={(event) => setNewDate(event.target.value)}
                    className="mt-1 block w-full rounded-lg border border-[#d2d6db] p-3"
                  />
                </label>
                <label className="text-sm text-[#4d5761]">
                  New time
                  <input
                    type="time"
                    value={newTime}
                    onChange={(event) => setNewTime(event.target.value)}
                    className="mt-1 block w-full rounded-lg border border-[#d2d6db] p-3"
                  />
                </label>
              </div>
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={saveReschedule}
                  disabled={!newDate || !newTime}
                  className="rounded-lg bg-[#155eef] px-4 py-2 text-white disabled:opacity-50"
                >
                  Save time
                </button>
                <button
                  type="button"
                  onClick={() => setRescheduling(false)}
                  className="rounded-lg border border-[#d2d6db] px-4 py-2 text-[#4d5761]"
                >
                  Back
                </button>
              </div>
            </div>
          ) : null}
        </div>
        <div className="sticky bottom-0 space-y-3 border-t border-[#f1f5f9] bg-white px-4 py-4 sm:px-6 sm:px-9 sm:py-6">
          <button
            type="button"
            onClick={() => changeStatus("Confirmed")}
            disabled={
              appointment.status === "Confirmed" ||
              appointment.status === "Cancelled"
            }
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#155eef] px-4 py-3 font-medium text-white hover:bg-[#004eeb] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check className="size-5" />
            Confirm Appointment
          </button>
          <button
            type="button"
            onClick={() => setRescheduling(true)}
            disabled={appointment.status === "Cancelled"}
            className="min-h-12 w-full rounded-xl border border-[#d2d6db] px-4 py-3 font-medium text-[#155eef] hover:bg-[#eff4ff] disabled:opacity-50"
          >
            Reschedule
          </button>
          <button
            type="button"
            onClick={() => changeStatus("Cancelled")}
            disabled={appointment.status === "Cancelled"}
            className="min-h-12 w-full rounded-xl border border-[#ffc9c9] px-4 py-3 font-medium text-[#fb2c36] hover:bg-[#fef3f2] disabled:opacity-50"
          >
            Cancel Appointment
          </button>
          <p className="text-center text-xs text-[#9da4ae]">
            Preview actions only — no patient records are changed on the server.
          </p>
        </div>
      </aside>
    </div>
  );
}

export default function HospitalAppointments({
  records,
  onUpdate,
  search,
  onSearchChange,
}: {
  records: PreviewAppointment[];
  onUpdate: (appointment: PreviewAppointment) => void;
  search: string;
  onSearchChange: (value: string) => void;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = search;
  const department = searchParams.get("department") ?? "All";
  const status = searchParams.get("status") ?? "All Status";
  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const setDepartment = (value: string) =>
    setSearchParams((current) => hospitalFilterParams(current, "department", value, "All"));
  const setStatus = (value: string) =>
    setSearchParams((current) => hospitalFilterParams(current, "status", value, "All Status"));
  const setPage = (value: number) =>
    setSearchParams((current) => hospitalFilterParams(current, "page", String(value), "1"));
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const departments = [
    "All",
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "General Medicine",
    "Dermatology",
  ];
  const statuses = [
    "All Status",
    "Pending",
    "Confirmed",
    "Rescheduled",
    "Cancelled",
    "Arrived",
    "Completed",
  ];

  const filtered = useMemo(() => {
    return records.filter((record) => {
      const matchesSearch = matchesAppointment(record, query);
      return (
        matchesSearch &&
        (department === "All" || record.department === department) &&
        (status === "All Status" || record.status === status)
      );
    });
  }, [records, query, department, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / 8));
  const currentPage = Math.min(page, pageCount);
  const displayed = filtered.slice((currentPage - 1) * 8, currentPage * 8);
  const selected = records.find((record) => record.id === selectedId);

  return (
    <div className="max-w-[1155px] pb-12">
      <div className="mb-8">
        <h2 className="text-[18px] font-semibold text-[#1f2a37] sm:text-[22px]">
          Appointments
        </h2>
        <p className="mt-1 text-[14px] text-[#4d5761] sm:text-[17px]">
          12 appointments
        </p>
      </div>
      <div className="mb-8 flex flex-col gap-4 rounded-[19px] border border-[#f1f5f9] bg-white p-[15px] sm:p-[21px] lg:flex-row">
        <label className="flex min-h-[48px] min-w-0 flex-1 items-center gap-3 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-4 text-[#62748e]">
          <Search className="size-[18px]" />
          <input
            value={query}
            onChange={(event) => {
              onSearchChange(event.target.value);
            }}
            type="search"
            aria-label="Search patients and doctors"
            placeholder="Search patients, doctors..."
            className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#90a1b9] sm:text-[16px]"
          />
        </label>
        <select
          value={department}
          onChange={(event) => {
            setDepartment(event.target.value);
          }}
          aria-label="Filter by department"
          className="min-h-[48px] rounded-xl border border-[#e2e8f0] bg-white px-4 text-[13px] text-[#4d5761] sm:text-[16px] lg:w-[211px]"
        >
          {departments.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
          }}
          aria-label="Filter by status"
          className="min-h-[48px] rounded-xl border border-[#e2e8f0] bg-white px-4 text-[13px] text-[#4d5761] sm:text-[16px] lg:w-[172px]"
        >
          {statuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-hidden rounded-[18px] border border-[#f1f5f9] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] border-collapse text-left">
            <thead className="border-b border-[#e5e7eb] bg-[#f8fafc] text-[14px] font-semibold text-[#62748e]">
              <tr>
                <th className="px-4 py-4 sm:px-6">Patient</th>
                <th className="px-4 py-4">Doctor</th>
                <th className="px-4 py-4">Type</th>
                <th className="px-4 py-4">Date &amp; Time</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Payment</th>
                <th className="px-4 py-4 text-right sm:px-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {displayed.map((record) => (
                <tr
                  key={record.id}
                  className="text-[13px] hover:bg-[#fbfdff] sm:text-[15px]"
                >
                  <td className="px-4 py-[17px] sm:px-6">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#0891b2] font-semibold text-white">
                        {record.initials}
                      </span>
                      <span>
                        <span className="block font-medium text-[#1f2a37]">
                          {record.patient}
                        </span>
                        <span className="mt-0.5 block text-sm text-[#90a1b9]">
                          {record.detail}
                        </span>
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-[17px]">
                    <span className="block font-medium text-[#1f2a37]">
                      {record.doctor}
                    </span>
                    <span className="mt-0.5 block text-sm text-[#90a1b9]">
                      {record.department}
                    </span>
                  </td>
                  <td className="px-4 py-[17px] text-[#4d5761]">
                    {record.type}
                  </td>
                  <td className="px-4 py-[17px]">
                    <span className="block font-medium text-[#1f2a37]">
                      {record.date}
                    </span>
                    <span className="mt-0.5 block text-sm text-[#6c737f]">
                      {record.time}
                    </span>
                  </td>
                  <td className="px-4 py-[17px]">
                    <AppointmentBadge status={record.status} />
                  </td>
                  <td className="px-4 py-[17px]">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${record.payment === "Paid" ? "bg-[#ecfdf3] text-[#087443]" : "bg-[#fef3f2] text-[#d92d20]"}`}
                    >
                      {record.payment}
                    </span>
                  </td>
                  <td className="px-4 py-[17px] text-right sm:px-6">
                    <button
                      type="button"
                      onClick={() => setSelectedId(record.id)}
                      className="inline-flex items-center gap-1 font-medium text-[#2970ff] hover:underline"
                    >
                      View <ChevronRight className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {displayed.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-[#62748e]">
                    No appointments match the selected filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#f1f5f9] px-4 py-5 sm:px-6">
          <p className="text-[14px] text-[#6c737f]">
            Showing {filtered.length ? (currentPage - 1) * 8 + 1 : 0}–
            {Math.min(currentPage * 8, filtered.length)} of {filtered.length}{" "}
            preview records
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous page"
              disabled={currentPage <= 1}
              onClick={() => setPage(currentPage - 1)}
              className="rounded-lg border border-[#e2e8f0] p-2 text-[#4d5761] disabled:opacity-40"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="flex min-w-9 items-center justify-center rounded-lg bg-[#155eef] px-3 text-sm font-medium text-white">
              {currentPage}
            </span>
            <button
              type="button"
              aria-label="Next page"
              disabled={currentPage >= pageCount}
              onClick={() => setPage(currentPage + 1)}
              className="rounded-lg border border-[#e2e8f0] p-2 text-[#4d5761] disabled:opacity-40"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
      <p className="mt-4 flex items-center gap-2 text-xs text-[#9da4ae]">
        <CalendarDays className="size-4" />
        <Clock3 className="size-4" />
        Only eight Figma example appointments have been loaded; no live bookings
        are shown.
      </p>
      {selected ? (
        <AppointmentDrawer
          key={selected.id}
          appointment={selected}
          onClose={() => setSelectedId(null)}
          onUpdate={onUpdate}
        />
      ) : null}
    </div>
  );
}
