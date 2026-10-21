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
import { useNavigate } from "react-router";
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

type Appointment = {
  id: string;
  initials: string;
  patient: string;
  detail: string;
  time: string;
  kind: string;
  doctor: string;
  department: string;
  status: "Confirmed" | "Pending" | "Arrived" | "Completed" | "Cancelled";
  payment: "Paid" | "Unpaid" | "Insurance";
};

const navigation: { label: HospitalSection; icon: LucideIcon; count?: string }[] = [
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

const initialAppointments: Appointment[] = [
  {
    id: "APT-2041",
    initials: "JD",
    patient: "John Doe",
    detail: "45y · Male",
    time: "09:00 AM",
    kind: "Consultation",
    doctor: "Dr. Sarah Chen",
    department: "Cardiology",
    status: "Confirmed",
    payment: "Paid",
  },
  {
    id: "APT-2042",
    initials: "AM",
    patient: "Adaeze Martins",
    detail: "32y · Female",
    time: "09:30 AM",
    kind: "Follow-up",
    doctor: "Dr. Michael Okafor",
    department: "General Medicine",
    status: "Pending",
    payment: "Unpaid",
  },
  {
    id: "APT-2043",
    initials: "TO",
    patient: "Tunde Okoye",
    detail: "57y · Male",
    time: "10:15 AM",
    kind: "Consultation",
    doctor: "Dr. Sarah Chen",
    department: "Cardiology",
    status: "Arrived",
    payment: "Insurance",
  },
  {
    id: "APT-2044",
    initials: "FN",
    patient: "Fatima Nwosu",
    detail: "28y · Female",
    time: "11:00 AM",
    kind: "Consultation",
    doctor: "Dr. David Bello",
    department: "Paediatrics",
    status: "Completed",
    payment: "Paid",
  },
];

const statusStyles: Record<Appointment["status"], string> = {
  Confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  Pending: "bg-amber-50 text-amber-700 ring-amber-100",
  Arrived: "bg-blue-50 text-blue-700 ring-blue-100",
  Completed: "bg-slate-100 text-slate-700 ring-slate-200",
  Cancelled: "bg-rose-50 text-rose-700 ring-rose-100",
};

const paymentStyles: Record<Appointment["payment"], string> = {
  Paid: "bg-emerald-50 text-emerald-700",
  Unpaid: "bg-rose-50 text-rose-700",
  Insurance: "bg-violet-50 text-violet-700",
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
      <p className="text-[15px] font-medium leading-6 text-[#344256]">
        {metric.label}
      </p>
      <p className={`mt-1.5 flex items-center gap-1.5 text-xs ${metric.trendClass}`}>
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
  const [activeSection, setActiveSection] = useState<HospitalSection>("Dashboard");
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [readNotifications, setReadNotifications] = useState(false);

  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return appointments;
    return appointments.filter((appointment) =>
      [
        appointment.patient,
        appointment.doctor,
        appointment.department,
        appointment.kind,
        appointment.status,
        appointment.id,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [appointments, search]);

  const changeStatus = (id: string, status: Appointment["status"]) => {
    setAppointments((items) =>
      items.map((item) => (item.id === id ? { ...item, status } : item))
    );
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
              const active = activeSection === item.label;
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
                    setActiveSection(item.label);
                    setMenuOpen(false);
                    setSearch("");
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
                      setActiveSection(item.label);
                      setMenuOpen(false);
                      setSearch("");
                    }}
                    className={`flex h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm ${
                      activeSection === item.label
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
            {activeSection}
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
            onClick={() => setActiveSection("Notifications")}
            className="relative hidden size-10 shrink-0 items-center justify-center rounded-full text-[#45556c] hover:bg-slate-50 sm:flex"
          >
            <Bell className="size-5" strokeWidth={1.8} />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-[#155eef] ring-2 ring-white" />
          </button>
          <button
            type="button"
            className="hidden items-center gap-2 rounded-lg py-1 pl-1 pr-2 text-left hover:bg-slate-50 md:flex"
            onClick={() => navigate("/")}
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-[#e8f0ff] text-xs font-semibold text-[#155eef]">
              JD
            </span>
            <ChevronDown className="size-4 text-[#62748e]" />
          </button>
        </header>

        <main className="mx-auto w-full max-w-[1440px] px-5 pb-12 pt-8 sm:px-8 lg:pr-[35px] lg:pl-10 lg:pt-[36px]">
          {activeSection === "Dashboard" ? (
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
                        <tr key={appointment.id} className="text-sm hover:bg-[#fbfdff]">
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
                              {appointment.kind}
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
                              onClick={() => setSelectedAppointment(appointment)}
                              className="inline-flex h-9 items-center justify-center rounded-lg border border-[#d7e0ec] px-3.5 text-xs font-semibold text-[#155eef] hover:bg-[#f5f8ff]"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredAppointments.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-10 text-center text-sm text-[#62748e]">
                            No appointments match “{search}”.
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between border-t border-[#edf1f6] px-6 py-4">
                  <p className="text-xs text-[#62748e]">
                    Showing {filteredAppointments.length} of {appointments.length} appointments
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

              <div className="mt-7 grid grid-cols-1 gap-7 xl:grid-cols-[1.1fr_0.9fr]">
                <section className="rounded-2xl border border-[#e2e8f0] bg-white p-6">
                  <SectionHeading
                    title="Needs Your Attention"
                    description="A few items may need your review."
                    action={
                      <span className="rounded-full bg-[#fff7e8] px-2.5 py-1 text-xs font-semibold text-[#9a5b00]">
                        6 pending
                      </span>
                    }
                  />
                  <div className="mt-5 divide-y divide-[#edf1f6]">
                    <button
                      type="button"
                      onClick={() => setActiveSection("Appointments")}
                      className="flex w-full items-center gap-3 py-4 text-left hover:bg-[#fbfdff]"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#fff7e8] text-[#b76a00]">
                        <CalendarClock className="size-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-[#1d293d]">
                          Appointment requests
                        </span>
                        <span className="mt-1 block text-xs text-[#62748e]">
                          4 appointment requests awaiting confirmation
                        </span>
                      </span>
                      <ChevronRight className="size-4 text-[#90a1b9]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSection("Laboratory")}
                      className="flex w-full items-center gap-3 py-4 text-left hover:bg-[#fbfdff]"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#eef4ff] text-[#155eef]">
                        <FlaskConical className="size-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-[#1d293d]">
                          Laboratory requests
                        </span>
                        <span className="mt-1 block text-xs text-[#62748e]">
                          1 laboratory request awaiting action
                        </span>
                      </span>
                      <ChevronRight className="size-4 text-[#90a1b9]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSection("Reviews")}
                      className="flex w-full items-center gap-3 py-4 text-left hover:bg-[#fbfdff]"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f3edff] text-[#7247bf]">
                        <MessageSquareText className="size-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-[#1d293d]">
                          Patient reviews
                        </span>
                        <span className="mt-1 block text-xs text-[#62748e]">
                          1 review has not received a response
                        </span>
                      </span>
                      <ChevronRight className="size-4 text-[#90a1b9]" />
                    </button>
                  </div>
                </section>

                <section className="rounded-2xl border border-[#e2e8f0] bg-white p-6">
                  <SectionHeading
                    title="Recent Activity"
                    description="Recent updates across your hospital."
                    action={
                      <button
                        type="button"
                        onClick={() => setActiveSection("Notifications")}
                        className="text-xs font-semibold text-[#155eef] hover:underline"
                      >
                        View all
                      </button>
                    }
                  />
                  <div className="mt-5 space-y-5">
                    <div className="flex gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#eafaf1] text-emerald-700">
                        <CheckCircle2 className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm leading-5 text-[#344256]">
                          Appointment <strong className="font-semibold text-[#1d293d]">APT-2038</strong> was confirmed.
                        </p>
                        <p className="mt-1 text-xs text-[#90a1b9]">12 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#eef4ff] text-[#155eef]">
                        <Users className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm leading-5 text-[#344256]">
                          A new patient profile was added to the hospital.
                        </p>
                        <p className="mt-1 text-xs text-[#90a1b9]">38 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#fff7e8] text-[#b76a00]">
                        <FlaskConical className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm leading-5 text-[#344256]">
                          A laboratory result is ready to review.
                        </p>
                        <p className="mt-1 text-xs text-[#90a1b9]">1 hour ago</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f3edff] text-[#7247bf]">
                        <Star className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm leading-5 text-[#344256]">
                          A patient left a new review.
                        </p>
                        <p className="mt-1 text-xs text-[#90a1b9]">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </>
          ) : activeSection === "Appointments" ? (
            <section className="rounded-2xl border border-[#e2e8f0] bg-white p-6">
              <SectionHeading
                title="Appointments"
                description="Manage upcoming and recent hospital appointments."
                action={
                  <button
                    type="button"
                    onClick={() => setActiveSection("Dashboard")}
                    className="rounded-lg border border-[#d7e0ec] px-4 py-2 text-sm font-semibold text-[#155eef] hover:bg-[#f5f8ff]"
                  >
                    Back to dashboard
                  </button>
                }
              />
              <p className="mt-5 text-sm text-[#62748e]">
                The appointment management screen is next in the Figma implementation sequence. The search above already filters the sample appointments on the dashboard.
              </p>
            </section>
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
                  ["Appointment request received", "Four appointment requests are waiting for confirmation.", "8 min ago"],
                  ["Laboratory result ready", "A result is ready for the attending doctor to review.", "38 min ago"],
                  ["New patient review", "A patient has shared feedback about their visit.", "2 hours ago"],
                ].map(([title, description, time], index) => (
                  <div key={title} className={`flex items-start gap-3 rounded-xl border border-[#e2e8f0] p-4 ${!readNotifications && index === 0 ? "bg-[#f5f8ff]" : "bg-white"}`}>
                    <span className="mt-1 size-2 shrink-0 rounded-full bg-[#155eef]" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#1d293d]">{title}</p>
                      <p className="mt-1 text-sm leading-5 text-[#62748e]">{description}</p>
                      <p className="mt-2 text-xs text-[#90a1b9]">{time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <section className="rounded-2xl border border-[#e2e8f0] bg-white p-6">
              <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-[#eef4ff] text-[#155eef]">
                {activeSection === "Hospital Profile" ? <Building2 className="size-5" /> : null}
                {activeSection === "Patients" ? <Users className="size-5" /> : null}
                {activeSection === "Laboratory" ? <FlaskConical className="size-5" /> : null}
                {activeSection === "Prescriptions" ? <Pill className="size-5" /> : null}
                {activeSection === "Reviews" ? <Star className="size-5" /> : null}
                {activeSection === "Settings" ? <Settings className="size-5" /> : null}
              </span>
              <h2 className="text-lg font-semibold text-[#0f172b]">{activeSection}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#62748e]">
                This area is included in the hospital navigation. Its full screen will be implemented against the corresponding Figma frame next. This preview currently uses sample data only.
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172b]/35 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedAppointment(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="appointment-dialog-title"
            className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.12em] text-[#155eef] uppercase">
                  Appointment details · {selectedAppointment.id}
                </p>
                <h2 id="appointment-dialog-title" className="mt-2 text-xl font-semibold text-[#0f172b]">
                  {selectedAppointment.patient}
                </h2>
                <p className="mt-1 text-sm text-[#62748e]">{selectedAppointment.detail}</p>
              </div>
              <button
                type="button"
                aria-label="Close appointment details"
                onClick={() => setSelectedAppointment(null)}
                className="rounded-lg p-2 text-[#62748e] hover:bg-slate-100"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-4 rounded-xl bg-[#f8fafc] p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-[#62748e]">Time</p>
                <p className="mt-1 text-sm font-semibold text-[#1d293d]">{selectedAppointment.time}</p>
              </div>
              <div>
                <p className="text-xs text-[#62748e]">Appointment type</p>
                <p className="mt-1 text-sm font-semibold text-[#1d293d]">{selectedAppointment.kind}</p>
              </div>
              <div>
                <p className="text-xs text-[#62748e]">Doctor</p>
                <p className="mt-1 text-sm font-semibold text-[#1d293d]">{selectedAppointment.doctor}</p>
              </div>
              <div>
                <p className="text-xs text-[#62748e]">Department</p>
                <p className="mt-1 text-sm font-semibold text-[#1d293d]">{selectedAppointment.department}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={selectedAppointment.status} />
                <PaymentBadge payment={selectedAppointment.payment} />
              </div>
              <div className="flex gap-2">
                {selectedAppointment.status === "Pending" ? (
                  <button
                    type="button"
                    onClick={() => {
                      changeStatus(selectedAppointment.id, "Confirmed");
                      setSelectedAppointment({ ...selectedAppointment, status: "Confirmed" });
                    }}
                    className="rounded-lg bg-[#155eef] px-4 py-2 text-sm font-semibold text-white hover:bg-[#174fc5]"
                  >
                    Confirm
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => setSelectedAppointment(null)}
                  className="rounded-lg border border-[#d7e0ec] px-4 py-2 text-sm font-semibold text-[#344256] hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
            <p className="mt-4 text-xs leading-5 text-[#90a1b9]">
              Preview only: changing an appointment updates this screen&apos;s sample data, not a live hospital record.
            </p>
          </section>
        </div>
      ) : null}
    </div>
  );
}
