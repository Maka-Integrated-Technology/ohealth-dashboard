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

type AppointmentStatus =
  | "Pending"
  | "Confirmed"
  | "Rescheduled"
  | "Cancelled"
  | "Arrived"
  | "Completed";

type PaymentStatus = "Paid" | "Unpaid";

type PreviewAppointment = {
  id: string;
  initials: string;
  patient: string;
  detail: string;
  doctor: string;
  department: string;
  type: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  payment: PaymentStatus;
  phone?: string;
  bloodGroup?: string;
};

// Figma reference records only. Status edits on this screen do not call the API.
const appointmentSamples: PreviewAppointment[] = [
  { id: "APT-2041", initials: "JD", patient: "John Doe", detail: "45y · Male", doctor: "Dr. Sarah Chen", department: "Cardiology", type: "Consultation", date: "2024-12-20", time: "09:00 AM", status: "Confirmed", payment: "Paid" },
  { id: "APT-2042", initials: "MS", patient: "Maria Santos", detail: "32y · Female", doctor: "Dr. Emily Rodriguez", department: "Pediatrics", type: "Follow-up", date: "2024-12-20", time: "10:30 AM", status: "Pending", payment: "Unpaid", phone: "0912345678", bloodGroup: "O+" },
  { id: "APT-2043", initials: "DL", patient: "David Lee", detail: "67y · Male", doctor: "Dr. James Wilson", department: "Neurology", type: "Consultation", date: "2024-12-20", time: "11:00 AM", status: "Arrived", payment: "Paid" },
  { id: "APT-2044", initials: "EW", patient: "Emma Williams", detail: "39y · Female", doctor: "Dr. Sarah Chen", department: "Cardiology", type: "Check-up", date: "2024-12-20", time: "01:00 PM", status: "Pending", payment: "Unpaid" },
  { id: "APT-2045", initials: "AH", patient: "Ahmed Hassan", detail: "54y · Male", doctor: "Dr. Michael Patel", department: "Orthopedics", type: "Procedure", date: "2024-12-20", time: "02:30 PM", status: "Confirmed", payment: "Paid" },
  { id: "APT-2046", initials: "PS", patient: "Priya Sharma", detail: "23y · Female", doctor: "Dr. Aisha Thompson", department: "Dermatology", type: "Consultation", date: "2024-12-20", time: "03:00 PM", status: "Rescheduled", payment: "Unpaid" },
  { id: "APT-2047", initials: "SJ", patient: "Sarah Johnson", detail: "28y · Female", doctor: "Dr. Robert Kim", department: "General Medicine", type: "Consultation", date: "2024-12-20", time: "04:00 PM", status: "Cancelled", payment: "Unpaid" },
  { id: "APT-2048", initials: "CM", patient: "Carlos Martinez", detail: "71y · Male", doctor: "Dr. James Wilson", department: "Neurology", type: "Follow-up", date: "2024-12-20", time: "04:30 PM", status: "Completed", payment: "Paid" },
];

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
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${statusColors[status]}`}>
      <span className="size-2 rounded-full bg-current" />
      {status}
    </span>
  );
}

function AppointmentDrawer({
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
    setNotice(`Appointment marked ${status.toLowerCase()} in this preview only.`);
    setRescheduling(false);
  };

  const saveReschedule = () => {
    if (!newDate || !newTime) return;
    const [hour, minute] = newTime.split(":").map(Number);
    const formattedTime = `${String(hour % 12 || 12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
    onUpdate({ ...appointment, date: newDate, time: formattedTime, status: "Rescheduled" });
    setNotice("New appointment time saved in this preview only.");
    setRescheduling(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="presentation">
      <button aria-label="Close appointment details" type="button" onClick={onClose} className="absolute inset-0 bg-[#101828]/45" />
      <aside role="dialog" aria-modal="true" aria-label="Appointment Details" className="relative z-10 flex h-full w-full max-w-[757px] flex-col overflow-y-auto bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-6 sm:px-9">
          <h2 className="text-[24px] font-semibold text-[#1f2a37]">Appointment Details</h2>
          <button type="button" aria-label="Close details" onClick={onClose} className="rounded-lg p-2 text-[#6c737f] hover:bg-[#f3f4f6]">
            <X className="size-6" />
          </button>
        </div>
        <div className="flex-1 px-6 py-8 sm:px-9">
          <div className="flex items-center gap-5 border-b border-[#f1f5f9] pb-8">
            <div className="flex size-[82px] shrink-0 items-center justify-center rounded-full bg-[#0891b2] text-[27px] font-semibold text-white">{appointment.initials}</div>
            <div className="min-w-0">
              <h3 className="text-[24px] font-semibold text-[#1f2a37]">{appointment.patient}</h3>
              <p className="mt-1 text-[16px] text-[#6c737f]">{age.replace("y", " years")} · {gender}{appointment.bloodGroup ? ` · ${appointment.bloodGroup}` : ""}</p>
              {appointment.phone ? <p className="mt-2 flex items-center gap-2 text-[16px] text-[#4d5761]"><Phone className="size-4" />{appointment.phone}</p> : null}
            </div>
          </div>
          <div className="mt-7 flex items-center justify-between border-b border-[#f1f5f9] pb-6">
            <p className="text-sm font-semibold text-[#4d5761]">Appointment Status</p>
            <AppointmentBadge status={appointment.status} />
          </div>
          <dl className="mt-8 grid grid-cols-1 gap-x-8 gap-y-7 text-[17px] sm:grid-cols-2">
            {[
              ["Doctor", appointment.doctor],
              ["Department", appointment.department],
              ["Type", appointment.type],
              ["Date", appointment.date],
              ["Time", appointment.time],
              ["Source", appointment.patient === "Maria Santos" ? "OHealth App" : "Not available"],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="mb-2 text-[#6c737f]">{label}</dt>
                <dd className="font-medium text-[#1f2a37]">{value}</dd>
              </div>
            ))}
          </dl>
          {notice ? <p role="status" className="mt-8 rounded-xl bg-[#eff4ff] px-4 py-3 text-sm text-[#155eef]">{notice}</p> : null}
          {rescheduling ? (
            <div className="mt-8 rounded-xl border border-[#d2d6db] p-5">
              <h4 className="font-semibold text-[#1f2a37]">Reschedule Appointment</h4>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="text-sm text-[#4d5761]">New date
                  <input type="date" value={newDate} onChange={(event) => setNewDate(event.target.value)} className="mt-1 block w-full rounded-lg border border-[#d2d6db] p-3" />
                </label>
                <label className="text-sm text-[#4d5761]">New time
                  <input type="time" value={newTime} onChange={(event) => setNewTime(event.target.value)} className="mt-1 block w-full rounded-lg border border-[#d2d6db] p-3" />
                </label>
              </div>
              <div className="mt-4 flex gap-3">
                <button type="button" onClick={saveReschedule} disabled={!newDate || !newTime} className="rounded-lg bg-[#155eef] px-4 py-2 text-white disabled:opacity-50">Save time</button>
                <button type="button" onClick={() => setRescheduling(false)} className="rounded-lg border border-[#d2d6db] px-4 py-2 text-[#4d5761]">Back</button>
              </div>
            </div>
          ) : null}
        </div>
        <div className="sticky bottom-0 space-y-3 border-t border-[#f1f5f9] bg-white px-6 py-6 sm:px-9">
          <button type="button" onClick={() => changeStatus("Confirmed")} disabled={appointment.status === "Confirmed" || appointment.status === "Cancelled"} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#155eef] px-4 py-3 font-medium text-white hover:bg-[#004eeb] disabled:cursor-not-allowed disabled:opacity-50">
            <Check className="size-5" />Confirm Appointment
          </button>
          <button type="button" onClick={() => setRescheduling(true)} disabled={appointment.status === "Cancelled"} className="min-h-12 w-full rounded-xl border border-[#d2d6db] px-4 py-3 font-medium text-[#155eef] hover:bg-[#eff4ff] disabled:opacity-50">Reschedule</button>
          <button type="button" onClick={() => changeStatus("Cancelled")} disabled={appointment.status === "Cancelled"} className="min-h-12 w-full rounded-xl border border-[#ffc9c9] px-4 py-3 font-medium text-[#fb2c36] hover:bg-[#fef3f2] disabled:opacity-50">Cancel Appointment</button>
          <p className="text-center text-xs text-[#9da4ae]">Preview actions only — no patient records are changed on the server.</p>
        </div>
      </aside>
    </div>
  );
}

export default function HospitalAppointments() {
  const [records, setRecords] = useState(appointmentSamples);
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All");
  const [status, setStatus] = useState("All Status");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const departments = ["All", "Cardiology", "Neurology", "Orthopedics", "Pediatrics", "General Medicine", "Dermatology"];
  const statuses = ["All Status", "Pending", "Confirmed", "Rescheduled", "Cancelled", "Arrived", "Completed"];

  const filtered = useMemo(() => {
    const term = query.toLowerCase().trim();
    return records.filter((record) => {
      const matchesSearch = [record.patient, record.doctor, record.department, record.type, record.id].some((value) => value.toLowerCase().includes(term));
      return matchesSearch && (department === "All" || record.department === department) && (status === "All Status" || record.status === status);
    });
  }, [records, query, department, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / 8));
  const currentPage = Math.min(page, pageCount);
  const displayed = filtered.slice((currentPage - 1) * 8, currentPage * 8);
  const selected = records.find((record) => record.id === selectedId);

  return (
    <div className="max-w-[1155px] pb-12">
      <div className="mb-8">
        <h2 className="text-[22px] font-semibold text-[#1f2a37]">Appointments</h2>
        <p className="mt-1 text-[17px] text-[#4d5761]">12 appointments</p>
      </div>
      <div className="mb-8 flex flex-col gap-4 rounded-[19px] border border-[#f1f5f9] bg-white p-[21px] lg:flex-row">
        <label className="flex min-h-[48px] min-w-0 flex-1 items-center gap-3 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-4 text-[#62748e]">
          <Search className="size-[18px]" />
          <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} type="search" aria-label="Search patients and doctors" placeholder="Search patients, doctors..." className="min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-[#90a1b9]" />
        </label>
        <select value={department} onChange={(event) => { setDepartment(event.target.value); setPage(1); }} aria-label="Filter by department" className="min-h-[48px] rounded-xl border border-[#e2e8f0] bg-white px-4 text-[16px] text-[#4d5761] lg:w-[211px]">
          {departments.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} aria-label="Filter by status" className="min-h-[48px] rounded-xl border border-[#e2e8f0] bg-white px-4 text-[16px] text-[#4d5761] lg:w-[172px]">
          {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
      <div className="overflow-hidden rounded-[18px] border border-[#f1f5f9] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] border-collapse text-left">
            <thead className="border-b border-[#e5e7eb] bg-[#f8fafc] text-[14px] font-semibold text-[#62748e]">
              <tr>
                <th className="px-6 py-4">Patient</th>
                <th className="px-4 py-4">Doctor</th>
                <th className="px-4 py-4">Type</th>
                <th className="px-4 py-4">Date &amp; Time</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Payment</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {displayed.map((record) => (
                <tr key={record.id} className="text-[15px] hover:bg-[#fbfdff]">
                  <td className="px-6 py-[17px]">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#0891b2] font-semibold text-white">{record.initials}</span>
                      <span><span className="block font-medium text-[#1f2a37]">{record.patient}</span><span className="mt-0.5 block text-sm text-[#90a1b9]">{record.detail}</span></span>
                    </div>
                  </td>
                  <td className="px-4 py-[17px]"><span className="block font-medium text-[#1f2a37]">{record.doctor}</span><span className="mt-0.5 block text-sm text-[#90a1b9]">{record.department}</span></td>
                  <td className="px-4 py-[17px] text-[#4d5761]">{record.type}</td>
                  <td className="px-4 py-[17px]"><span className="block font-medium text-[#1f2a37]">{record.date}</span><span className="mt-0.5 block text-sm text-[#6c737f]">{record.time}</span></td>
                  <td className="px-4 py-[17px]"><AppointmentBadge status={record.status} /></td>
                  <td className="px-4 py-[17px]"><span className={`rounded-full px-3 py-1 text-sm font-medium ${record.payment === "Paid" ? "bg-[#ecfdf3] text-[#087443]" : "bg-[#fef3f2] text-[#d92d20]"}`}>{record.payment}</span></td>
                  <td className="px-6 py-[17px] text-right"><button type="button" onClick={() => setSelectedId(record.id)} className="inline-flex items-center gap-1 font-medium text-[#2970ff] hover:underline">View <ChevronRight className="size-4" /></button></td>
                </tr>
              ))}
              {displayed.length === 0 ? <tr><td colSpan={7} className="p-10 text-center text-[#62748e]">No appointments match the selected filters.</td></tr> : null}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#f1f5f9] px-6 py-5">
          <p className="text-[14px] text-[#6c737f]">Showing {filtered.length ? (currentPage - 1) * 8 + 1 : 0}–{Math.min(currentPage * 8, filtered.length)} of {filtered.length} preview records</p>
          <div className="flex gap-2">
            <button type="button" aria-label="Previous page" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)} className="rounded-lg border border-[#e2e8f0] p-2 text-[#4d5761] disabled:opacity-40"><ChevronLeft className="size-4" /></button>
            <span className="flex min-w-9 items-center justify-center rounded-lg bg-[#155eef] px-3 text-sm font-medium text-white">{currentPage}</span>
            <button type="button" aria-label="Next page" disabled={currentPage >= pageCount} onClick={() => setPage(currentPage + 1)} className="rounded-lg border border-[#e2e8f0] p-2 text-[#4d5761] disabled:opacity-40"><ChevronRight className="size-4" /></button>
          </div>
        </div>
      </div>
      <p className="mt-4 flex items-center gap-2 text-xs text-[#9da4ae]"><CalendarDays className="size-4" /><Clock3 className="size-4" />Only eight Figma example appointments have been loaded; no live bookings are shown.</p>
      {selected ? <AppointmentDrawer key={selected.id} appointment={selected} onClose={() => setSelectedId(null)} onUpdate={(updated) => setRecords((current) => current.map((record) => record.id === updated.id ? updated : record))} /> : null}
    </div>
  );
}
