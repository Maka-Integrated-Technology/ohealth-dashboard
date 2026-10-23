import {
  Bell,
  Building2,
  CalendarDays,
  ChevronDown,
  FlaskConical,
  LayoutDashboard,
  LogOut,
  Menu,
  Pill,
  Search,
  Settings,
  Star,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import {
  getHospitalSection,
  hospitalFilterParams,
  hospitalNavigationParams,
  matchesAppointment,
  replacePreviewAppointment,
  markPreviewNotificationRead,
  type HospitalSection,
} from "~/features/hospital-dashboard/hospital-preview-state";
import HospitalOverview from "~/features/hospital-dashboard/hospital-overview";
import HospitalPatientDetails from "~/features/hospital-dashboard/patient-details";
import HospitalProfile from "~/features/hospital-dashboard/hospital-profile";
import HospitalLaboratory from "~/features/hospital-dashboard/hospital-laboratory";
import HospitalPrescriptions from "~/features/hospital-dashboard/hospital-prescriptions";
import HospitalReviews from "~/features/hospital-dashboard/hospital-reviews";
import HospitalSettings from "~/features/hospital-dashboard/hospital-settings";
import HospitalNotifications from "~/features/hospital-dashboard/hospital-notifications";
import { hospitalNotificationSamples } from "~/features/hospital-dashboard/hospital-notification-data";
import HospitalAppointments, {
  AppointmentDrawer,
} from "~/features/hospital-dashboard/hospital-appointments";
import {
  appointmentSamples,
  type PreviewAppointment,
} from "~/features/hospital-dashboard/hospital-appointment-data";
import HospitalPatientsList from "~/features/hospital-dashboard/patients-list";
import { hospitalPatientRecords } from "~/features/hospital-dashboard/hospital-patient-data";
import Logo from "~/components/shared/logo";

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

export default function HospitalDashboardPage() {
  const navigate = useNavigate();
  const { id: patientId } = useParams();
  const [sectionParams, setSectionParams] = useSearchParams();
  const activeSection = getHospitalSection(sectionParams);
  const search = sectionParams.get("q") ?? "";
  const setSearch = (value: string) =>
    setSectionParams((current) => hospitalFilterParams(current, "q", value), {
      replace: true,
    });
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
    setAppointments((current) => replacePreviewAppointment(current, updated));
  const selectedPatient = patientId
    ? [...appointments, ...hospitalPatientRecords].find(
        (patient) => patient.id === patientId
      )
    : undefined;
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>(() =>
    hospitalNotificationSamples
      .filter((item) => !item.unread)
      .map((item) => item.id)
  );
  const unreadNotificationCount = hospitalNotificationSamples.filter(
    (item) => !readNotificationIds.includes(item.id)
  ).length;
  const markNotificationRead = (id: string) =>
    setReadNotificationIds((current) =>
      markPreviewNotificationRead(current, id)
    );
  const markAllNotificationsRead = () =>
    setReadNotificationIds(hospitalNotificationSamples.map((item) => item.id));

  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return appointments;
    return appointments.filter((appointment) =>
      matchesAppointment(appointment, query)
    );
  }, [appointments, search]);

  const selectNavigation = (section: HospitalSection) => {
    const next = hospitalNavigationParams(sectionParams, section);
    if (patientId) {
      navigate("/dashboard" + (next.size ? "?" + next.toString() : ""));
    } else {
      setSectionParams(next);
    }
    setMenuOpen(false);
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
                  {(
                    item.label === "Notifications"
                      ? unreadNotificationCount > 0
                      : Boolean(item.count)
                  ) ? (
                    <span className="flex size-5 items-center justify-center rounded-full bg-[#155eef] text-[10px] font-semibold text-white">
                      {item.label === "Notifications"
                        ? unreadNotificationCount
                        : item.count}
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
                    {(
                      item.label === "Notifications"
                        ? unreadNotificationCount > 0
                        : Boolean(item.count)
                    ) ? (
                      <span className="ml-auto rounded-full bg-[#155eef] px-2 py-0.5 text-xs text-white">
                        {item.label === "Notifications"
                          ? unreadNotificationCount
                          : item.count}
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
        <header className="sticky top-0 z-20 flex h-[64px] items-center gap-3 border-b border-[#e2e8f0] bg-white px-4 sm:h-[88px] sm:gap-4 sm:px-8 lg:px-[35px]">
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
              aria-label="Search hospital patients and appointments"
              placeholder="Search patients, appointments..."
              value={search}
              disabled={
                Boolean(patientId) ||
                !["Dashboard", "Patients", "Appointments"].includes(
                  activeSection
                )
              }
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
            {unreadNotificationCount > 0 ? (
              <span className="absolute top-2 right-2 size-2 rounded-full bg-[#155eef] ring-2 ring-white" />
            ) : null}
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

        <main className="mx-auto w-full max-w-[1440px] px-4 pt-6 pb-9 sm:px-8 sm:pt-8 sm:pb-12 lg:pt-[36px] lg:pr-[35px] lg:pl-10">
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
            <HospitalOverview
              appointments={appointments}
              filteredAppointments={filteredAppointments}
              search={search}
              onNavigate={selectNavigation}
              onOpenAppointment={setSelectedAppointmentId}
            />
          ) : activeSection === "Patients" ? (
            <HospitalPatientsList
              search={search}
              onSearchChange={setSearch}
              onView={(id) => navigate("/patients/" + encodeURIComponent(id))}
            />
          ) : activeSection === "Hospital Profile" ? (
            <HospitalProfile />
          ) : activeSection === "Appointments" ? (
            <HospitalAppointments
              records={appointments}
              onUpdate={updateAppointment}
              search={search}
              onSearchChange={setSearch}
            />
          ) : activeSection === "Laboratory" ? (
            <HospitalLaboratory />
          ) : activeSection === "Prescriptions" ? (
            <HospitalPrescriptions />
          ) : activeSection === "Reviews" ? (
            <HospitalReviews />
          ) : activeSection === "Notifications" ? (
            <HospitalNotifications
              readIds={readNotificationIds}
              onRead={markNotificationRead}
              onReadAll={markAllNotificationsRead}
              onNavigate={selectNavigation}
            />
          ) : activeSection === "Settings" ? (
            <HospitalSettings />
          ) : null}
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
