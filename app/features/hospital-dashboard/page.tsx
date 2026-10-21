import {
  ArrowUpRight,
  Bell,
  Building2,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  FlaskConical,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  Pill,
  Search,
  Settings,
  Star,
  TrendingDown,
  TrendingUp,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import HospitalPatientDetails from "~/features/hospital-dashboard/patient-details";
import HospitalProfile from "~/features/hospital-dashboard/hospital-profile";
import HospitalAppointments, {
  AppointmentDrawer,
  appointmentSamples,
  type PreviewAppointment,
} from "~/features/hospital-dashboard/hospital-appointments";
import HospitalPatientsList, {
  hospitalPatientRecords,
} from "~/features/hospital-dashboard/patients-list";
import Logo from "~/components/shared/logo";

type HospitalSection =
  | "Dashboard"
  | "Hospital Profile"
  | "Appointments"
  | "Patients"
  | "Laboratory"
  | "Prescriptions"
  | "Reviews"
  | "Notifications"
  | "Settings";

type Appointment = PreviewAppointment;

const navigation: {
  label: HospitalSection;
  icon: LucideIcon;
  count?: string;
}[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Hospital Profile", icon: Building2 },
  { label: "Appointments", icon: CalendarDays },
  { label: "Patients", icon: Users },
  { label: "Laboratory", icon: FlaskConical },
  { label: "Prescriptions", icon: Pill },
  { label: "Reviews", icon: Star },
  { label: "Notifications", icon: Bell, count: "4" },
  { label: "Settings", icon: Settings },
];

const metrics = [
  {
    label: "Total Appointments",
    value: "12",
    caption: "12% this week",
    direction: "up",
    icon: CalendarCheck,
    iconClass: "bg-blue-50 text-blue-700",
    trendClass: "text-emerald-600",
  },
  {
    label: "Upcoming",
    value: "8",
    caption: "4 scheduled today",
    direction: "neutral",
    icon: CalendarClock,
    iconClass: "bg-violet-50 text-violet-700",
    trendClass: "text-slate-500",
  },
  {
    label: "Completed",
    value: "1",
    caption: "8% this month",
    direction: "up",
    icon: CheckCircle2,
    iconClass: "bg-emerald-50 text-emerald-700",
    trendClass: "text-emerald-600",
  },
  {
    label: "Cancelled",
    value: "1",
    caption: "3% this week",
    direction: "down",
    icon: CalendarClock,
    iconClass: "bg-rose-50 text-rose-700",
    trendClass: "text-rose-600",
  },
  {
    label: "Pending Requests",
    value: "4",
    caption: "Awaiting confirmation",
    direction: "neutral",
    icon: Clock3,
    iconClass: "bg-amber-50 text-amber-700",
    trendClass: "text-amber-700",
  },
  {
    label: "Patient Reviews",
    value: "24",
    caption: "4.7 ★ average rating",
    direction: "neutral",
    icon: Star,
    iconClass: "bg-sky-50 text-sky-700",
    trendClass: "text-slate-500",
  },
] as const;

const statusStyles: Record<Appointment["status"], string> = {
  Confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  Rescheduled: "bg-violet-50 text-violet-700 ring-violet-100",
  Pending: "bg-amber-50 text-amber-700 ring-amber-100",
  Arrived: "bg-blue-50 text-blue-700 ring-blue-100",
  Completed: "bg-slate-100 text-slate-700 ring-slate-200",
  Cancelled: "bg-rose-50 text-rose-700 ring-rose-100",
};

const paymentStyles: Record<Appointment["payment"], string> = {
  Paid: "bg-emerald-50 text-emerald-700",
  Unpaid: "bg-rose-50 text-rose-700",
};

function StatusBadge({ status }: { status: Appointment["status"] }) {
  return (
    <span
      className={`inline-flex min-h-7 items-center rounded-full px-3 text-xs font-medium ring-1 ring-inset ${statusStyles[status]}`}
    >
      <span className="mr-1.5 size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function PaymentBadge({ payment }: { payment: Appointment["payment"] }) {
  return (
    <span
      className={`inline-flex min-h-7 items-center rounded-full px-3 text-xs font-medium ${paymentStyles[payment]}`}
    >
      {payment}
    </span>
  );
}

function MetricCard({ metric }: { metric: (typeof metrics)[number] }) {
  const Icon = metric.icon;
  return (
    <section className="min-h-[207px] rounded-2xl border border-[#e2e8f0] bg-white p-[22px] shadow-[0_1px_2px_rgba(15,23,42,0.025)]">
      <div
        className={`flex size-12 items-center justify-center rounded-xl ${metric.iconClass}`}
        aria-hidden="true"
      >
        <Icon className="size-[23px]" strokeWidth={1.8} />
      </div>
      <p className="h-[59px] text-[36px] leading-[59px] font-semibold tracking-[-1.2px] text-[#0f172b]">
        {metric.value}
      </p>
      <p className="text-[15px] leading-6 font-medium text-[#344256]">
        {metric.label}
      </p>
      <p
        className={`mt-1.5 flex items-center gap-1.5 text-xs ${metric.trendClass}`}
      >
        {metric.direction === "up" ? (
          <TrendingUp className="size-3.5" />
        ) : metric.direction === "down" ? (
          <TrendingDown className="size-3.5" />
        ) : null}
        {metric.caption}
      </p>
    </section>
  );
}

function SectionHeading({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold tracking-[-0.35px] text-[#0f172b]">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm leading-5 text-[#62748e]">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export default function HospitalDashboardPage() {
  const navigate = useNavigate();
  const { id: patientId } = useParams();
  const [sectionParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState<HospitalSection>(
    () =>
      navigation.find((item) => item.label === sectionParams.get("section"))
        ?.label ?? "Dashboard"
  );
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [appointments, setAppointments] =
    useState<Appointment[]>(appointmentSamples);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);
  const selectedAppointment = appointments.find(
    (appointment) => appointment.id === selectedAppointmentId
  );
  const updateAppointment = (updated: PreviewAppointment) =>
    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === updated.id ? updated : appointment
      )
    );
  const selectedPatient = patientId
    ? [...appointments, ...hospitalPatientRecords].find(
        (patient) => patient.id === patientId
      )
    : undefined;
  const [readNotifications, setReadNotifications] = useState(false);

  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return appointments;
    return appointments.filter((appointment) =>
      [
        appointment.patient,
        appointment.doctor,
        appointment.department,
        appointment.type,
        appointment.status,
        appointment.id,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [appointments, search]);

  const selectNavigation = (section: HospitalSection) => {
    if (patientId) {
      navigate(
        section === "Dashboard"
          ? "/dashboard"
          : "/dashboard?section=" + encodeURIComponent(section)
      );
    } else {
      setActiveSection(section);
    }
    setMenuOpen(false);
    setSearch("");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172b]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[240px] flex-col border-r border-[#e2e8f0] bg-white lg:flex">
        <div className="flex h-[88px] items-center border-b border-[#f1f5f9] px-6">
          <Logo size="auth" to="/dashboard" />
        </div>
        <nav className="flex-1 px-6 py-6" aria-label="Hospital navigation">
          <div className="space-y-3.5">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = patientId
                ? item.label === "Patients"
                : activeSection === item.label;
              return (
                <button
                  className={`flex h-[44px] w-full items-center gap-3 rounded-lg px-4 text-left text-[13px] transition-colors ${
                    active
                      ? "bg-[#155eef]/[0.08] font-semibold text-[#155eef]"
                      : "font-medium text-[#45556c] hover:bg-[#f8fafc] hover:text-[#0f172b]"
                  }`}
                  key={item.label}
                  type="button"
                  onClick={() => {
                    selectNavigation(item.label);
                  }}
                >
                  <Icon className="size-[19px]" strokeWidth={1.8} />
                  <span className="flex-1">{item.label}</span>
                  {item.count ? (
                    <span className="flex size-5 items-center justify-center rounded-full bg-[#155eef] text-[10px] font-semibold text-white">
                      {item.count}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </nav>
        <div className="border-t border-[#e2e8f0] p-5">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-slate-50"
            onClick={() => navigate("/")}
          >
            <div className="flex size-10 items-center justify-center rounded-full bg-[#e8f0ff] text-sm font-semibold text-[#155eef]">
              JD
            </div>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-[#1d293d]">
                John Doe
              </span>
              <span className="mt-0.5 block text-xs text-[#62748e]">
                Hospital Admin
              </span>
            </span>
            <LogOut className="size-4 text-[#62748e]" />
          </button>
        </div>
      </aside>

      {menuOpen ? (
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden">
          <div className="h-full w-[min(300px,85vw)] bg-white px-5 py-5 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <Logo size="auth" to="/dashboard" />
              <button
                type="button"
                aria-label="Close navigation"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X className="size-5" />
              </button>
            </div>
            <nav className="space-y-2" aria-label="Mobile hospital navigation">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      selectNavigation(item.label);
                    }}
                    className={`flex h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm ${
                      (
                        patientId
                          ? item.label === "Patients"
                          : activeSection === item.label
                      )
                        ? "bg-[#155eef]/[0.08] font-semibold text-[#155eef]"
                        : "text-[#45556c] hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="size-5" />
                    {item.label}
                    {item.count ? (
                      <span className="ml-auto rounded-full bg-[#155eef] px-2 py-0.5 text-xs text-white">
                        {item.count}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      ) : null}

      <div className="min-h-screen lg:pl-[240px]">
        <header className="sticky top-0 z-20 flex h-[88px] items-center gap-4 border-b border-[#e2e8f0] bg-white px-5 sm:px-8 lg:px-[35px]">
          <button
            type="button"
            aria-label="Open navigation"
            className="rounded-lg p-2 text-[#45556c] hover:bg-slate-100 lg:hidden"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="size-5" />
          </button>
          <h1 className="hidden min-w-[150px] text-[22px] font-semibold tracking-[-0.4px] text-[#0f172b] sm:block">
            {patientId ? "Patients" : activeSection}
          </h1>
          <label className="relative ml-auto flex h-[42px] w-full max-w-[421px] items-center gap-3 rounded-lg border border-[#e2e8f0] bg-white px-4 text-[#62748e] focus-within:border-[#155eef] focus-within:ring-4 focus-within:ring-[#155eef]/[0.08]">
            <Search className="size-[19px] shrink-0" strokeWidth={1.8} />
            <input
              type="search"
              aria-label="Search patients and appointments"
              placeholder="Search patients, appointments..."
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              className="min-w-0 flex-1 bg-transparent text-sm text-[#1d293d] outline-none placeholder:text-[#90a1b9]"
            />
          </label>
          <button
            type="button"
            aria-label="Open notifications"
            onClick={() => selectNavigation("Notifications")}
            className="relative hidden size-10 shrink-0 items-center justify-center rounded-full text-[#45556c] hover:bg-slate-50 sm:flex"
          >
            <Bell className="size-5" strokeWidth={1.8} />
            <span className="absolute top-2 right-2 size-2 rounded-full bg-[#155eef] ring-2 ring-white" />
          </button>
          <button
            type="button"
            className="hidden items-center gap-2 rounded-lg py-1 pr-2 pl-1 text-left hover:bg-slate-50 md:flex"
            onClick={() => navigate("/")}
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-[#e8f0ff] text-xs font-semibold text-[#155eef]">
              JD
            </span>
            <ChevronDown className="size-4 text-[#62748e]" />
          </button>
        </header>

        <main className="mx-auto w-full max-w-[1440px] px-5 pt-8 pb-12 sm:px-8 lg:pt-[36px] lg:pr-[35px] lg:pl-10">
          {patientId ? (
            selectedPatient ? (
              <HospitalPatientDetails
                patient={selectedPatient}
                onBack={() => navigate("/dashboard?section=Patients")}
              />
            ) : (
              <section className="rounded-2xl border border-[#f1f5f9] bg-white p-6">
                <h2 className="text-lg font-semibold">Patient not found</h2>
                <p className="mt-2 text-sm text-[#62748e]">
                  This patient is not included in the preview data.
                </p>
                <button
                  type="button"
                  className="mt-4 text-sm font-semibold text-[#155eef]"
                  onClick={() => navigate("/dashboard")}
                >
                  Return to dashboard
                </button>
              </section>
            )
          ) : activeSection === "Dashboard" ? (
            <>
              <div className="mb-[41px]">
                <h2 className="text-[28px] leading-[43px] font-semibold tracking-[-0.7px] text-[#0f172b]">
                  Good afternoon, St. Mary&apos;s
                </h2>
                <p className="text-[15px] leading-[29px] text-[#62748e]">
                  Here&apos;s what&apos;s happening at your hospital today.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:gap-x-[30px] xl:gap-y-7">
                {metrics.map((metric) => (
                  <MetricCard key={metric.label} metric={metric} />
                ))}
              </div>

              <section className="mt-32 rounded-2xl border border-[#e2e8f0] bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f1f5f9] px-6 py-5">
                  <SectionHeading
                    title="Today’s Appointments"
                    description="Review and manage your scheduled appointments."
                  />
                  <button
                    type="button"
                    onClick={() => setActiveSection("Appointments")}
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#d7e0ec] px-4 text-sm font-semibold text-[#155eef] transition hover:bg-[#f5f8ff]"
                  >
                    View all <ChevronRight className="size-4" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[950px] border-collapse text-left">
                    <thead>
                      <tr className="bg-[#f8fafc] text-xs font-semibold text-[#62748e]">
                        <th className="px-6 py-4">Patient</th>
                        <th className="px-5 py-4">Appointment</th>
                        <th className="px-5 py-4">Doctor</th>
                        <th className="px-5 py-4">Status</th>
                        <th className="px-5 py-4">Payment</th>
                        <th className="px-5 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#edf1f6]">
                      {filteredAppointments.map((appointment) => (
                        <tr
                          key={appointment.id}
                          className="text-sm hover:bg-[#fbfdff]"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#eef4ff] text-xs font-semibold text-[#155eef]">
                                {appointment.initials}
                              </span>
                              <span className="min-w-0">
                                <span className="block font-semibold text-[#1d293d]">
                                  {appointment.patient}
                                </span>
                                <span className="mt-1 block text-xs text-[#62748e]">
                                  {appointment.detail}
                                </span>
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="block font-medium text-[#1d293d]">
                              {appointment.time}
                            </span>
                            <span className="mt-1 block text-xs text-[#62748e]">
                              {appointment.type}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="block font-medium text-[#1d293d]">
                              {appointment.doctor}
                            </span>
                            <span className="mt-1 block text-xs text-[#62748e]">
                              {appointment.department}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <StatusBadge status={appointment.status} />
                          </td>
                          <td className="px-5 py-4">
                            <PaymentBadge payment={appointment.payment} />
                          </td>
                          <td className="px-5 py-4 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedAppointmentId(appointment.id)
                              }
                              className="inline-flex h-9 items-center justify-center rounded-lg border border-[#d7e0ec] px-3.5 text-xs font-semibold text-[#155eef] hover:bg-[#f5f8ff]"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredAppointments.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-10 text-center text-sm text-[#62748e]"
                          >
                            No appointments match “{search}”.
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between border-t border-[#edf1f6] px-6 py-4">
                  <p className="text-xs text-[#62748e]">
                    Showing {filteredAppointments.length} of{" "}
                    {appointments.length} appointments
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveSection("Appointments")}
                    className="text-xs font-semibold text-[#155eef] hover:underline"
                  >
                    Manage appointments
                  </button>
                </div>
              </section>

              <div className="mt-7 space-y-8">
                <section className="overflow-hidden rounded-[22px] border border-[#f1f5f9] bg-white">
                  <h3 className="flex items-center gap-3 border-b border-[#f1f5f9] px-7 py-[21px] text-[19px] font-semibold text-[#1f2a37]">
                    <CalendarClock className="size-[22px] text-[#45556c]" />
                    Needs Your Attention
                  </h3>
                  {[
                    {
                      title: "4 appointment requests awaiting confirmation",
                      time: "5 min ago",
                      action: "Review Requests",
                      destination: "Appointments" as HospitalSection,
                      Icon: CalendarClock,
                      color: "bg-[#ecfeff] text-[#0891b2]",
                    },
                    {
                      title: "2 laboratory requests awaiting action",
                      time: "1 hr ago",
                      action: "View Lab Requests",
                      destination: "Laboratory" as HospitalSection,
                      Icon: FlaskConical,
                      color: "bg-[#faf5ff] text-[#9333ea]",
                    },
                    {
                      title: "1 unread patient reviews",
                      time: "2 hrs ago",
                      action: "View Reviews",
                      destination: "Reviews" as HospitalSection,
                      Icon: MessageSquareText,
                      color: "bg-[#fff7ed] text-[#ea580c]",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="flex items-start gap-4 border-b border-[#f8fafc] px-7 py-[21px] last:border-0"
                    >
                      <span
                        className={`flex size-[43px] shrink-0 items-center justify-center rounded-2xl ${item.color}`}
                      >
                        <item.Icon className="size-5" strokeWidth={1.8} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-base leading-[22px] font-semibold text-[#1f2a37]">
                          {item.title}
                        </p>
                        <p className="mt-1 text-[15px] text-[#90a1b9]">
                          {item.time}
                        </p>
                        <button
                          type="button"
                          onClick={() => setActiveSection(item.destination)}
                          className="mt-2 inline-flex items-center gap-1 text-[15px] font-medium text-[#2970ff] hover:underline"
                        >
                          {item.action} <ChevronRight className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </section>

                <section className="overflow-hidden rounded-[22px] border border-[#f1f5f9] bg-white">
                  <h3 className="flex items-center gap-3 border-b border-[#f1f5f9] px-7 py-[21px] text-[19px] font-semibold text-[#1d293d]">
                    <Bell className="size-[22px] text-[#45556c]" />
                    Recent Activity
                  </h3>
                  <div className="px-7 py-4">
                    {[
                      [
                        "Appointment confirmed",
                        "John Doe — Cardiology",
                        "9:02 AM",
                      ],
                      [
                        "Patient marked as arrived",
                        "David Lee — Neurology",
                        "11:00 AM",
                      ],
                      ["New review received", "John Doe — 5 stars", "11:30 AM"],
                      [
                        "Lab results uploaded",
                        "Emma Williams — Cardiac Panel",
                        "12:15 PM",
                      ],
                      [
                        "Appointment cancelled",
                        "Sarah Johnson — General Medicine",
                        "1:45 PM",
                      ],
                      [
                        "Prescription created",
                        "Ahmed Hassan — Dr. Patel",
                        "2:20 PM",
                      ],
                      [
                        "Consultation completed",
                        "Carlos Martinez — Neurology",
                        "4:30 PM",
                      ],
                    ].map(([title, detail, time], index) => (
                      <div
                        key={title}
                        className="flex items-start gap-4 border-b border-[#f8fafc] py-4 last:border-0"
                      >
                        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#f8fafc] text-[#62748e]">
                          {index === 2 ? (
                            <Star className="size-4" />
                          ) : index === 3 ? (
                            <FlaskConical className="size-4" />
                          ) : index === 5 ? (
                            <Pill className="size-4" />
                          ) : index === 1 ? (
                            <Users className="size-4" />
                          ) : (
                            <CalendarDays className="size-4" />
                          )}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-base leading-[22px] font-medium text-[#314158]">
                            {title}
                          </p>
                          <p className="text-[15px] leading-[22px] text-[#90a1b9]">
                            {detail}
                          </p>
                        </div>
                        <time className="shrink-0 font-mono text-[15px] text-[#90a1b9]">
                          {time}
                        </time>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </>
          ) : activeSection === "Patients" ? (
            <HospitalPatientsList
              onView={(id) => navigate("/patients/" + encodeURIComponent(id))}
            />
          ) : activeSection === "Hospital Profile" ? (
            <HospitalProfile />
          ) : activeSection === "Appointments" ? (
            <HospitalAppointments
              records={appointments}
              onUpdate={updateAppointment}
            />
          ) : activeSection === "Notifications" ? (
            <section className="rounded-2xl border border-[#e2e8f0] bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <SectionHeading
                  title="Notifications"
                  description="Hospital requests, results, reviews, and account updates."
                />
                <button
                  type="button"
                  onClick={() => setReadNotifications(true)}
                  className="rounded-lg border border-[#d7e0ec] px-4 py-2 text-sm font-semibold text-[#155eef] hover:bg-[#f5f8ff]"
                >
                  {readNotifications ? "All caught up" : "Mark all as read"}
                </button>
              </div>
              <div className="mt-5 space-y-3">
                {[
                  [
                    "Appointment request received",
                    "Four appointment requests are waiting for confirmation.",
                    "8 min ago",
                  ],
                  [
                    "Laboratory result ready",
                    "A result is ready for the attending doctor to review.",
                    "38 min ago",
                  ],
                  [
                    "New patient review",
                    "A patient has shared feedback about their visit.",
                    "2 hours ago",
                  ],
                ].map(([title, description, time], index) => (
                  <div
                    key={title}
                    className={`flex items-start gap-3 rounded-xl border border-[#e2e8f0] p-4 ${!readNotifications && index === 0 ? "bg-[#f5f8ff]" : "bg-white"}`}
                  >
                    <span className="mt-1 size-2 shrink-0 rounded-full bg-[#155eef]" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#1d293d]">
                        {title}
                      </p>
                      <p className="mt-1 text-sm leading-5 text-[#62748e]">
                        {description}
                      </p>
                      <p className="mt-2 text-xs text-[#90a1b9]">{time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <section className="rounded-2xl border border-[#e2e8f0] bg-white p-6">
              <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-[#eef4ff] text-[#155eef]">
                {activeSection === "Laboratory" ? (
                  <FlaskConical className="size-5" />
                ) : null}
                {activeSection === "Prescriptions" ? (
                  <Pill className="size-5" />
                ) : null}
                {activeSection === "Reviews" ? (
                  <Star className="size-5" />
                ) : null}
                {activeSection === "Settings" ? (
                  <Settings className="size-5" />
                ) : null}
              </span>
              <h2 className="text-lg font-semibold text-[#0f172b]">
                {activeSection}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#62748e]">
                This area is included in the hospital navigation. Its full
                screen will be implemented against the corresponding Figma frame
                next. This preview currently uses sample data only.
              </p>
              <button
                type="button"
                onClick={() => setActiveSection("Dashboard")}
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-[#155eef] px-4 text-sm font-semibold text-white hover:bg-[#174fc5]"
              >
                Return to dashboard <ArrowUpRight className="size-4" />
              </button>
            </section>
          )}
        </main>
      </div>
      {selectedAppointment ? (
        <AppointmentDrawer
          key={selectedAppointment.id}
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointmentId(null)}
          onUpdate={updateAppointment}
        />
      ) : null}
    </div>
  );
}
