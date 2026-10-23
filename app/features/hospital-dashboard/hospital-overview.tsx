import {
  Bell,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FlaskConical,
  MessageSquareText,
  Pill,
  Star,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { type ReactNode } from "react";
import { type PreviewAppointment } from "~/features/hospital-dashboard/hospital-appointment-data";
import { type HospitalSection } from "~/features/hospital-dashboard/hospital-preview-state";

type Appointment = PreviewAppointment;

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
    <section className="min-h-[147px] rounded-xl border border-[#e2e8f0] bg-white p-[15px] shadow-[0_1px_2px_rgba(15,23,42,0.025)] sm:min-h-[207px] sm:rounded-2xl sm:p-[22px]">
      <div
        className={`flex size-10 items-center justify-center rounded-lg sm:size-12 sm:rounded-xl ${metric.iconClass}`}
        aria-hidden="true"
      >
        <Icon className="size-[23px]" strokeWidth={1.8} />
      </div>
      <p className="h-[42px] text-[28px] leading-[42px] font-semibold tracking-[-1.2px] text-[#0f172b] sm:h-[59px] sm:text-[36px] sm:leading-[59px]">
        {metric.value}
      </p>
      <p className="text-[12px] leading-[18px] font-medium text-[#344256] sm:text-[15px] sm:leading-6">
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
        <h2 className="text-[16px] font-semibold tracking-[-0.35px] text-[#0f172b] sm:text-lg">
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

export default function HospitalOverview({
  appointments,
  filteredAppointments,
  search,
  onNavigate,
  onOpenAppointment,
}: {
  appointments: PreviewAppointment[];
  filteredAppointments: PreviewAppointment[];
  search: string;
  onNavigate: (section: HospitalSection) => void;
  onOpenAppointment: (id: string) => void;
}) {
  return (
    <>
              <div className="mb-[24px] sm:mb-[41px]">
                <h2 className="text-[23px] leading-[32px] font-semibold tracking-[-0.7px] text-[#0f172b] sm:text-[28px] sm:leading-[43px]">
                  Good afternoon, St. Mary&apos;s
                </h2>
                <p className="text-[13px] leading-[20px] text-[#62748e] sm:text-[15px] sm:leading-[29px]">
                  Here&apos;s what&apos;s happening at your hospital today.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-x-[30px] xl:gap-y-7">
                {metrics.map((metric) => (
                  <MetricCard key={metric.label} metric={metric} />
                ))}
              </div>

              <section className="mt-10 rounded-xl border border-[#e2e8f0] bg-white sm:mt-32 sm:rounded-2xl">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f1f5f9] px-4 py-3 sm:px-6 sm:py-5">
                  <SectionHeading
                    title="Today’s Appointments"
                    description="Review and manage your scheduled appointments."
                  />
                  <button
                    type="button"
                    onClick={() => onNavigate("Appointments")}
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
                                onOpenAppointment(appointment.id)
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
                    onClick={() => onNavigate("Appointments")}
                    className="text-xs font-semibold text-[#155eef] hover:underline"
                  >
                    Manage appointments
                  </button>
                </div>
              </section>

              <div className="mt-7 space-y-8">
                <section className="overflow-hidden rounded-[15px] border border-[#f1f5f9] bg-white sm:rounded-[22px]">
                  <h3 className="flex items-center gap-2 border-b border-[#f1f5f9] px-4 py-[14px] text-[16px] font-semibold text-[#1f2a37] sm:gap-3 sm:px-7 sm:py-[21px] sm:text-[19px]">
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
                      className="flex items-start gap-3 border-b border-[#f8fafc] px-4 py-[13px] last:border-0 sm:gap-4 sm:px-7 sm:py-[21px]"
                    >
                      <span
                        className={`flex size-[34px] shrink-0 items-center justify-center rounded-2xl sm:size-[43px] ${item.color}`}
                      >
                        <item.Icon className="size-5" strokeWidth={1.8} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] leading-[18px] font-semibold text-[#1f2a37] sm:text-base sm:leading-[22px]">
                          {item.title}
                        </p>
                        <p className="mt-1 text-[12px] text-[#90a1b9] sm:text-[15px]">
                          {item.time}
                        </p>
                        <button
                          type="button"
                          onClick={() => onNavigate(item.destination)}
                          className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-[#2970ff] hover:underline sm:text-[15px]"
                        >
                          {item.action} <ChevronRight className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </section>

                <section className="overflow-hidden rounded-[15px] border border-[#f1f5f9] bg-white sm:rounded-[22px]">
                  <h3 className="flex items-center gap-2 border-b border-[#f1f5f9] px-4 py-[14px] text-[16px] font-semibold text-[#1d293d] sm:gap-3 sm:px-7 sm:py-[21px] sm:text-[19px]">
                    <Bell className="size-[22px] text-[#45556c]" />
                    Recent Activity
                  </h3>
                  <div className="px-4 py-3 sm:px-7 sm:py-4">
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
                        className="flex items-start gap-3 border-b border-[#f8fafc] py-3 last:border-0 sm:gap-4 sm:py-4"
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
                          <p className="text-[13px] leading-[18px] font-medium text-[#314158] sm:text-base sm:leading-[22px]">
                            {title}
                          </p>
                          <p className="text-[12px] leading-[18px] text-[#90a1b9] sm:text-[15px] sm:leading-[22px]">
                            {detail}
                          </p>
                        </div>
                        <time className="shrink-0 font-mono text-[12px] text-[#90a1b9] sm:text-[15px]">
                          {time}
                        </time>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </>
  );
}
