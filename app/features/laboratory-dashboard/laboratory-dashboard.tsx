import { useState } from "react";
import { useNavigate } from "react-router";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowRight, X } from "lucide-react";
import { LaboratoryShell } from "./laboratory-shell";

type Metric = {
  label: string;
  value: string;
  caption: string;
  icon: string;
  trend?: string;
};

const METRICS: Metric[] = [
  { label: "NEW BOOKINGS", value: "1", caption: "Awaiting confirmation", icon: "📅", trend: "12% vs last period" },
  { label: "TODAY'S APPOINTMENTS", value: "5", caption: "Sep 13", icon: "🗓️" },
  { label: "SAMPLES PROCESSING", value: "3", caption: "1 awaiting · 2 in analysis", icon: "🧪" },
  { label: "RESULTS PENDING", value: "2", caption: "1 need review", icon: "📋" },
  { label: "TESTS IN PROGRESS", value: "2", caption: "Under analysis", icon: "⚗️" },
  { label: "RESULTS READY", value: "1", caption: "For review", icon: "✔" },
  { label: "PUBLISHED TODAY", value: "1", caption: "Sent to patients", icon: "📤" },
  { label: "TODAY'S REVENUE", value: "₦87,500", caption: "Est. from bookings", icon: "₦", trend: "8% vs last period" },
];

const SCHEDULE = [
  { name: "Adaeze Okonkwo", test: "Complete Blood Count (CBC)", time: "09:00", status: "Confirmed", statusStyle: "bg-[#eef3ff] text-[#2563eb]" },
  { name: "Emeka Nwosu", test: "Hepatitis B Surface Antigen", time: "09:30", status: "Checked In", statusStyle: "bg-[#e9f7ff] text-[#1486c9]" },
  { name: "Fatima Al-Hassan", test: "Thyroid Function Test (TFT)", time: "10:00", status: "Sample Collected", statusStyle: "bg-[#f3efff] text-[#7c3aed]" },
  { name: "Chidi Okeke", test: "Urinalysis", time: "10:30", status: "Test In Progress", statusStyle: "bg-[#fff6e8] text-[#c46b0a]" },
  { name: "Ngozi Adeyemi", test: "Lipid Profile", time: "11:00", status: "Booking Received", statusStyle: "bg-[#edf2f7] text-[#526782]" },
];

const ACTIVITY = [
  { icon: "🧪", summary: "Sample SP-2025-0441 analysis started for Fatima Al-Hassan", date: "13 Sept, 11:45" },
  { icon: "📦", summary: "Sample collected for Fatima Al-Hassan (TFT)", date: "13 Sept, 11:05" },
  { icon: "✅", summary: "Emeka Nwosu checked in for Hepatitis B Ag", date: "13 Sept, 10:30" },
  { icon: "⏰", summary: "Reminder sent: Adaeze Okonkwo at 09:00 for CBC", date: "13 Sept, 09:55" },
  { icon: "📋", summary: "PSA result published for Oluwaseun Ojo", date: "12 Sept, 15:31" },
];

const REVENUE = [
  { month: "Mar", amount: 178 },
  { month: "Apr", amount: 214 },
  { month: "May", amount: 197 },
  { month: "Jun", amount: 244 },
  { month: "Jul", amount: 256 },
  { month: "Aug", amount: 314 },
  { month: "Sep", amount: 173 },
];

const CATEGORIES = [
  { name: "Blood", count: 142, color: "#2563eb" },
  { name: "Urinalysis", count: 58, color: "#0ea5e9" },
  { name: "Hormonal", count: 34, color: "#7c3aed" },
  { name: "Infectious Disease", count: 67, color: "#059669" },
  { name: "Cardiology", count: 22, color: "#ea7500" },
  { name: "Preventive", count: 15, color: "#e42d36" },
];

const categoryTotal = CATEGORIES.reduce((sum, category) => sum + category.count, 0);
let lastAngle = 0;
const categoryGradient = "conic-gradient(" +
  CATEGORIES.map((category) => {
    const start = lastAngle;
    lastAngle += (category.count / categoryTotal) * 360;
    return category.color + " " + start.toFixed(3) + "deg " + lastAngle.toFixed(3) + "deg";
  }).join(", ") + ")";

function MetricCard({ metric }: { metric: Metric }) {
  return (
    <div className="relative flex min-h-[151px] flex-col rounded-[16px] border border-[#e9eef5] bg-white px-[17px] pt-[26px] pb-[17px]">
      <div className="absolute top-[17px] right-[17px] flex size-[33px] items-center justify-center rounded-[12px] bg-[#f7f8fa] text-[14px] text-[#2563eb]" aria-hidden="true">
        {metric.icon}
      </div>
      <p className="max-w-[138px] pr-1 text-[11px] leading-[14px] font-bold tracking-[0.15px] text-[#607594]">{metric.label}</p>
      <div className="mt-[22px]">
        <p className="text-[22px] leading-[25px] font-bold tracking-[-0.55px] text-[#0e1830]">{metric.value}</p>
        <p className="mt-[3px] text-[11px] leading-[16px] text-[#8ea2bf]">{metric.caption}</p>
        {metric.trend && (
          <p className="mt-[11px] text-[11px] leading-[15px] font-medium text-[#009c62]">
            <span className="mr-1 text-[11px]" aria-hidden="true">▲</span>{metric.trend}
          </p>
        )}
      </div>
    </div>
  );
}

function RevenueChart({ onReport }: { onReport: () => void }) {
  return (
    <section className="min-w-0 rounded-[16px] border border-[#e9eef5] bg-white px-[25px] pt-[27px] pb-[17px]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[12px] font-semibold leading-[17px] text-[#23324b]">Revenue (7 months)</h3>
          <p className="mt-[1px] text-[11px] text-[#8ea2bf]">Monthly revenue trend</p>
        </div>
        <button type="button" onClick={onReport} className="inline-flex shrink-0 items-center gap-1 pt-[9px] text-[11px] text-[#2466ff] hover:underline">
          View full report <ArrowRight className="size-[12px]" />
        </button>
      </div>
      <div className="mt-[9px] h-[178px] w-full text-[10px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={REVENUE} margin={{ top: 2, right: 2, left: -19, bottom: 0 }}>
            <defs>
              <linearGradient id="labRevenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity={0.10} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0.005} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#eef2f8" strokeDasharray="2 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#91a5c4", fontSize: 10 }} dy={4} />
            <YAxis domain={[0, 320]} ticks={[0, 80, 160, 240, 320]} tickLine={false} axisLine={false} tick={{ fill: "#91a5c4", fontSize: 10 }} tickFormatter={(value: number) => "₦" + value + "k"} width={44} />
            <Tooltip contentStyle={{ border: "1px solid #e9eef5", borderRadius: 10, fontSize: 12 }} formatter={(value) => ["₦" + Number(value).toLocaleString("en-NG") + ",000", "Revenue"]} />
            <Area type="monotone" dataKey="amount" stroke="#2563ff" strokeWidth={1.8} fill="url(#labRevenueFill)" dot={false} activeDot={{ r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function CategoryChart() {
  return (
    <section className="min-w-0 rounded-[16px] border border-[#e9eef5] bg-white px-[17px] pt-[18px] pb-[15px]">
      <h3 className="text-[12px] font-semibold leading-[17px] text-[#23324b]">Tests by Category</h3>
      <p className="mt-[1px] text-[11px] leading-[15px] text-[#8ea2bf]">This month</p>
      <div className="mx-auto mt-[21px] flex size-[125px] items-center justify-center rounded-full" style={{ background: categoryGradient }} role="img" aria-label="Tests by category: Blood 142, Urinalysis 58, Hormonal 34, Infectious Disease 67, Cardiology 22, Preventive 15">
        <div className="size-[84px] rounded-full bg-white" />
      </div>
      <div className="mt-[9px] grid grid-cols-2 gap-x-[9px] gap-y-[7px]">
        {[0, 2, 4].map((index) => (
          <div key={index} className="contents">
            {[CATEGORIES[index], CATEGORIES[index + 1]].map((category) => (
              <div key={category.name} className="flex min-w-0 items-start gap-1 text-[10px] leading-[15px] text-[#4a5d79]">
                <span className="mt-[4px] size-[7px] shrink-0 rounded-full" style={{ backgroundColor: category.color }} />
                <span className="min-w-0 flex-1">{category.name}</span>
                <span className="shrink-0 font-semibold text-[#273b57]">{category.count}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function LaboratoryDashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [reportOpen, setReportOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<(typeof SCHEDULE)[number] | null>(null);
  const filteredSchedule = SCHEDULE.filter((entry) =>
    (entry.name + " " + entry.test + " " + entry.status + " " + entry.time).toLowerCase().includes(search.trim().toLowerCase())
  );
  const filteredActivity = ACTIVITY.filter((entry) =>
    (entry.summary + " " + entry.date).toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <LaboratoryShell section="Overview" search={search} onSearchChange={setSearch}>
      <div className="px-[20px] pt-[29px] pb-14 sm:px-[32px] lg:pr-[60px] lg:pl-[43px]">
        <div>
          <h1 className="text-[25px] leading-[33px] font-semibold tracking-[-0.55px] text-[#202b3a]">Good afternoon, MedCore Diagnostics</h1>
          <p className="mt-[1px] text-[15px] leading-[23px] text-[#525e6d]">Saturday, 13 september</p>
        </div>
        <div className="mt-[41px] grid grid-cols-1 gap-x-[18px] gap-y-[19px] sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map((metric) => <MetricCard key={metric.label} metric={metric} />)}
        </div>

        <div className="mt-[52px] grid grid-cols-1 items-stretch gap-[25px] lg:grid-cols-[minmax(0,1.025fr)_minmax(0,1fr)]">
          <section className="overflow-hidden rounded-[15px] border border-[#e9eef5] bg-white">
            <div className="flex h-[46px] items-center justify-between px-[17px] pt-[9px]">
              <h2 className="text-[12px] font-semibold text-[#23324b]">Today's Schedule</h2>
              <button type="button" onClick={() => navigate("/test-bookings")} className="inline-flex items-center gap-1 text-[11px] text-[#2466ff] hover:underline">View all <ArrowRight className="size-[12px]" /></button>
            </div>
            <div>
              {filteredSchedule.length ? filteredSchedule.map((entry) => (
                <button type="button" key={entry.name} onClick={() => setSelectedAppointment(entry)} className="flex min-h-[70px] w-full items-start justify-between gap-3 border-b border-[#f1f4f8] px-[17px] py-[12px] text-left last:border-b-0 hover:bg-[#fbfcff]">
                  <span className="min-w-0">
                    <span className="block text-[13px] leading-[17px] font-medium text-[#293854]">{entry.name}</span>
                    <span className="mt-[1px] block truncate text-[11px] leading-[14px] text-[#6d82a3]">{entry.test}</span>
                    <span className="mt-[2px] block font-mono text-[11px] leading-[14px] text-[#8da3c2]">{entry.time}</span>
                  </span>
                  <span className={"mt-[1px] shrink-0 rounded-[5px] px-[6px] py-[2px] text-[8px] leading-[11px] font-semibold " + entry.statusStyle}>{entry.status}</span>
                </button>
              )) : <p className="p-6 text-sm text-[#8ea2bf]">No matching appointments.</p>}
            </div>
          </section>

          <section className="overflow-hidden rounded-[15px] border border-[#e9eef5] bg-white">
            <div className="flex h-[46px] items-center px-[17px] pt-[9px]">
              <h2 className="text-[12px] font-semibold text-[#23324b]">Recent Activity</h2>
            </div>
            <div>
              {filteredActivity.length ? filteredActivity.map((entry) => (
                <div key={entry.summary} className="flex min-h-[70px] items-start gap-[12px] border-b border-[#f1f4f8] px-[17px] py-[12px] last:border-b-0">
                  <span aria-hidden="true" className="w-[15px] shrink-0 pt-[3px] text-center text-[13px]">{entry.icon}</span>
                  <div className="min-w-0">
                    <p className="text-[11px] leading-[16px] text-[#3e516e]">{entry.summary}</p>
                    <p className="mt-[4px] font-mono text-[10px] tracking-[0.2px] text-[#8ca4c6]">{entry.date}</p>
                  </div>
                </div>
              )) : <p className="p-6 text-sm text-[#8ea2bf]">No matching activity.</p>}
            </div>
          </section>
        </div>

        <div className="mt-[20px] grid grid-cols-1 gap-[23px] lg:grid-cols-[minmax(0,2.08fr)_minmax(0,1fr)]">
          <RevenueChart onReport={() => setReportOpen(true)} />
          <CategoryChart />
        </div>
        {reportOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/40 p-5" role="presentation" onMouseDown={() => setReportOpen(false)}>
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" role="dialog" aria-modal="true" aria-label="Revenue report" onMouseDown={(event) => event.stopPropagation()}>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">Revenue (7 months)</h2>
                <button type="button" aria-label="Close report" onClick={() => setReportOpen(false)}><X className="size-5" /></button>
              </div>
              <p className="mt-1 text-sm text-[#667085]">September sample dashboard data · ₦ thousands</p>
              <div className="mt-4 space-y-2">
                {REVENUE.map((entry) => (
                  <div key={entry.month} className="flex items-center justify-between border-b border-[#e9eef5] py-2 text-sm">
                    <span>{entry.month}</span>
                    <span className="font-medium">₦{entry.amount.toLocaleString("en-NG")},000</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-[#667085]">These values reproduce the screenshot's preview chart and are not live financial records.</p>
            </div>
          </div>
        )}
        {selectedAppointment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/40 p-5" role="presentation" onMouseDown={() => setSelectedAppointment(null)}>
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" role="dialog" aria-modal="true" aria-label="Appointment details" onMouseDown={(event) => event.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Appointment details</h2>
                <button type="button" aria-label="Close appointment details" onClick={() => setSelectedAppointment(null)}><X className="size-5" /></button>
              </div>
              <h3 className="mt-6 text-base font-semibold">{selectedAppointment.name}</h3>
              <p className="mt-1 text-sm text-[#667085]">{selectedAppointment.test}</p>
              <p className="mt-2 text-sm text-[#667085]">13 September · {selectedAppointment.time}</p>
              <span className={"mt-4 inline-block rounded-md px-3 py-1 text-xs font-semibold " + selectedAppointment.statusStyle}>{selectedAppointment.status}</span>
              <p className="mt-5 text-xs text-[#667085]">This is a screenshot-based preview. No appointment record is updated.</p>
            </div>
          </div>
        )}
      </div>
    </LaboratoryShell>
  );
}
