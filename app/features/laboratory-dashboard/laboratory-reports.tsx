import { useState } from "react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Download } from "lucide-react";
import { LaboratoryShell } from "./laboratory-shell";

type Period = "Last 7 Months" | "Last 3 Months" | "This Month";

type Metric = {
  value: string;
  label: string;
  note: string;
  background: string;
  color: string;
};

const METRICS: Metric[] = [
  { value: "338", label: "Total Tests Performed", note: "This period", background: "bg-[#eff5ff]", color: "text-[#1763ff]" },
  { value: "₦1,590,000", label: "Revenue Generated", note: "Cumulative", background: "bg-[#ebfcf4]", color: "text-[#009d71]" },
  { value: "6.4h", label: "Avg Turnaround Time", note: "Across all test types", background: "bg-[#fffae9]", color: "text-[#e47300]" },
  { value: "92%", label: "Appointment Completion", note: "Completed vs scheduled", background: "bg-[#f5f2ff]", color: "text-[#7c2dff]" },
];

// The screenshots show the chart shapes and axes, not exact individual monthly measurements.
// These plotted points visually approximate the March–September Figma reference.
const MONTHLY = [
  { month: "Mar", revenue: 180, completed: 86, cancelled: 11 },
  { month: "Apr", revenue: 215, completed: 102, cancelled: 9 },
  { month: "May", revenue: 195, completed: 94, cancelled: 12 },
  { month: "Jun", revenue: 245, completed: 120, cancelled: 8 },
  { month: "Jul", revenue: 260, completed: 136, cancelled: 8 },
  { month: "Aug", revenue: 320, completed: 160, cancelled: 9 },
  { month: "Sep", revenue: 177, completed: 81, cancelled: 7 },
];

const CATEGORIES = [
  { name: "Blood", value: 142, color: "#2861ed" },
  { name: "Urinalysis", value: 58, color: "#12a5df" },
  { name: "Hormonal", value: 34, color: "#7f38f0" },
  { name: "Infectious Disease", value: 67, color: "#06986d" },
  { name: "Cardiology", value: 22, color: "#e77e00" },
  { name: "Preventive", value: 15, color: "#df292f" },
];

const TURNAROUND = [
  { name: "CBC", hours: 4.5 },
  { name: "Lipid Profile", hours: 5.5 },
  { name: "Urinalysis", hours: 1.8 },
  { name: "TFT", hours: 24 },
  { name: "Malaria RDT", hours: 1.2 },
  { name: "Hep B Ag", hours: 3.4 },
];

// Exact row order, test totals and revenue labels from the supplied screenshot.
const MOST_REQUESTED = [
  { name: "CBC", count: 142, revenue: "₦639,000" },
  { name: "Urinalysis", count: 58, revenue: "₦145,000" },
  { name: "Malaria RDT", count: 67, revenue: "₦167,500" },
  { name: "Hepatitis B", count: 44, revenue: "₦132,000" },
  { name: "Lipid Profile", count: 39, revenue: "₦253,500" },
  { name: "TFT", count: 28, revenue: "₦280,000" },
];

const CSV_NOTICE = "SAMPLE PREVIEW ONLY — NOT VERIFIED LABORATORY OR FINANCIAL DATA";
type ReportName = "Test Volume Report" | "Revenue Report" | "Patient Activity" | "Operational Performance";

function csvRows(rows: (string | number)[][]): string {
  return rows
    .map((row) => row.map((cell) => '"' + String(cell).replaceAll('"', '""') + '"').join(","))
    .join("\r\n");
}

function downloadData(report: ReportName, data: typeof MONTHLY): string {
  const intro: (string | number)[][] = [[CSV_NOTICE], [report], []];
  switch (report) {
    case "Test Volume Report":
      return csvRows([
        ...intro,
        ["Category", "Test count"],
        ...CATEGORIES.map((item) => [item.name, item.value]),
        [],
        ["Most Requested Test", "Count", "Revenue label (NGN)"],
        ...MOST_REQUESTED.map((item) => [item.name, item.count, item.revenue]),
      ]);
    case "Revenue Report":
      return csvRows([
        ...intro,
        ["Cumulative revenue shown in design", "NGN 1590000"],
        ["Month", "Approximate chart revenue (NGN thousands)"],
        ...data.map((item) => [item.month, item.revenue]),
      ]);
    case "Patient Activity":
      return csvRows([
        ...intro,
        ["Notice", "No patient-level activity data was supplied in the design; this is not a patient activity export."],
      ]);
    case "Operational Performance":
      return csvRows([
        ...intro,
        ["Average turnaround", "6.4h"],
        ["Appointment completion rate", "92%"],
        [],
        ["Test", "Approximate chart turnaround (hours)"],
        ...TURNAROUND.map((item) => [item.name, item.hours]),
        [],
        ["Month", "Approximate completed appointments", "Approximate cancelled appointments"],
        ...data.map((item) => [item.month, item.completed, item.cancelled]),
      ]);
  }
}

function CsvDownload({
  report, data,
}: {
  report: ReportName;
  data: typeof MONTHLY;
}) {
  return (
    <a
      href={"data:text/csv;charset=utf-8," + encodeURIComponent(downloadData(report, data))}
      download={"ohealth-preview-" + report.toLowerCase().replaceAll(" ", "-") + ".csv"}
      className="inline-flex min-h-[27px] items-center gap-[5px] rounded-[9px] border border-[#cbd8e9] bg-white px-[10px] text-[11px] font-medium text-[#3c5372] hover:border-[#155eef] hover:text-[#155eef]"
      title="Download only the available sample design data"
    >
      <Download className="size-[12px]" aria-hidden="true" />
      Download
    </a>
  );
}

function SummaryMetric({ metric }: { metric: Metric }) {
  return (
    <div className={"flex min-h-[115px] flex-col justify-center rounded-[13px] border border-[#e0e8f3] px-[15px] py-[16px] sm:min-h-[117px] sm:rounded-[15px] sm:px-[20px] sm:py-[19px] " + metric.background}>
      <p className={"text-[23px] leading-[31px] font-bold tracking-[-0.6px] sm:text-[29px] sm:leading-[37px] " + metric.color}>{metric.value}</p>
      <h2 className="mt-[7px] text-[12px] leading-[18px] font-semibold text-[#33445f] sm:text-[14px] sm:leading-[20px]">{metric.label}</h2>
      <p className="mt-[2px] text-[11px] leading-[16px] text-[#92a7c5] sm:text-[12px]">{metric.note}</p>
    </div>
  );
}

function PanelHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="text-[13px] leading-[19px] font-semibold text-[#25354e] sm:text-[15px] sm:leading-[22px]">{title}</h2>
      <p className="mt-[1px] text-[11px] leading-[17px] text-[#92a6c1] sm:text-[12px]">{subtitle}</p>
    </div>
  );
}

const CHART_TOOLTIP = {
  fontSize: 12,
  borderRadius: 10,
  borderColor: "#e6edf6",
  color: "#34435d",
};

export default function LaboratoryReportsAndAnalytics() {
  const [period, setPeriod] = useState<Period>("Last 7 Months");
  const [category, setCategory] = useState("All Categories");
  const [headerQuery, setHeaderQuery] = useState("");

  const monthly = period === "This Month" ? MONTHLY.slice(-1) :
    period === "Last 3 Months" ? MONTHLY.slice(-3) : MONTHLY;
  const activeCategories = category === "All Categories"
    ? CATEGORIES : CATEGORIES.filter((item) => item.name === category);
  const requested = MOST_REQUESTED.filter((item) =>
    item.name.toLowerCase().includes(headerQuery.trim().toLowerCase())
  );

  const exports: { report: ReportName; note: string }[] = [
    { report: "Test Volume Report", note: "CSV of all tests by period" },
    { report: "Revenue Report", note: "Financial summary by month" },
    { report: "Patient Activity", note: "Patient visit history" },
    { report: "Operational Performance", note: "Turnaround & completion rates" },
  ];

  return (
    <LaboratoryShell section="Reports & Analytics" search={headerQuery} onSearchChange={setHeaderQuery}>
      <div className="mx-auto w-full max-w-[1500px] px-[15px] pt-[24px] pb-[65px] sm:px-[30px] sm:pt-[42px] sm:pb-[80px]">
        <h1 className="text-[22px] leading-[30px] font-semibold tracking-[-0.4px] text-[#202b3a] sm:text-[29px] sm:leading-[37px]">Reports and Analytics</h1>
        <p className="mt-[1px] text-[13px] leading-[20px] text-[#566371] sm:text-[17px] sm:leading-[25px]">Laboratory performance, test volumes, and revenue insights</p>

        <div className="mt-[25px] flex flex-wrap items-center gap-[10px] sm:mt-[38px] sm:gap-[11px]">
          <label className="sr-only" htmlFor="lab-report-period">Report period</label>
          <select
            id="lab-report-period" value={period}
            onChange={(event) => setPeriod(event.currentTarget.value as Period)}
            className="h-[34px] rounded-[10px] border border-[#d8e3f1] bg-white px-[11px] pr-[25px] text-[12px] text-[#34435b] outline-none focus:border-[#155eef] sm:h-[36px] sm:text-[13px]"
          >
            <option>Last 7 Months</option>
            <option>Last 3 Months</option>
            <option>This Month</option>
          </select>
          <label className="sr-only" htmlFor="lab-report-category">Test category</label>
          <select
            id="lab-report-category" value={category}
            onChange={(event) => setCategory(event.currentTarget.value)}
            className="h-[34px] rounded-[10px] border border-[#d8e3f1] bg-white px-[11px] pr-[25px] text-[12px] text-[#34435b] outline-none focus:border-[#155eef] sm:h-[36px] sm:text-[13px]"
          >
            <option>All Categories</option>
            {CATEGORIES.map((item) => <option key={item.name}>{item.name}</option>)}
          </select>
          <a
            href={"data:text/csv;charset=utf-8," + encodeURIComponent(downloadData("Revenue Report", monthly))}
            download="ohealth-preview-revenue-report.csv"
            className="inline-flex h-[34px] items-center gap-[6px] rounded-[10px] border border-[#cbd8e8] bg-white px-[12px] text-[12px] font-medium text-[#344762] hover:border-[#155eef] hover:text-[#155eef] sm:h-[36px] sm:text-[13px]"
          >
            <Download className="size-[13px]" aria-hidden="true" /> Export Report
          </a>
        </div>

        <div className="mt-[19px] grid grid-cols-2 gap-[11px] sm:mt-[20px] sm:gap-[14px] xl:grid-cols-4">
          {METRICS.map((metric) => <SummaryMetric key={metric.label} metric={metric} />)}
        </div>

        <div className="mt-[23px] grid grid-cols-1 gap-[16px] lg:grid-cols-2 lg:gap-[18px]">
          <section className="min-w-0 rounded-[15px] border border-[#e8edf4] bg-white px-[13px] pt-[18px] pb-[14px] sm:rounded-[17px] sm:px-[20px] sm:pt-[21px] sm:pb-[17px]">
            <PanelHeading title="Revenue Trend" subtitle="Monthly laboratory revenue" />
            <div className="mt-[13px] h-[225px] w-full sm:mt-[16px] sm:h-[265px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthly} margin={{ top: 5, right: 7, bottom: 3, left: -13 }}>
                  <defs>
                    <linearGradient id="lab-reports-area-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2867ef" stopOpacity={0.11} />
                      <stop offset="100%" stopColor="#2867ef" stopOpacity={0.006} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#e9eff8" strokeDasharray="3 5" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#91a5c2", fontSize: 11 }} />
                  <YAxis domain={[0, 320]} ticks={[0, 80, 160, 240, 320]} width={52}
                    axisLine={false} tickLine={false} tick={{ fill: "#91a5c2", fontSize: 11 }}
                    tickFormatter={(value: number) => "₦" + value + "k"} />
                  <Tooltip formatter={(value) => ["≈₦" + (Number(value) * 1000).toLocaleString("en-NG"), "Monthly revenue (preview)"]} contentStyle={CHART_TOOLTIP} />
                  <Area type="monotone" dataKey="revenue" stroke="#2865f0" strokeWidth={2.25}
                    fill="url(#lab-reports-area-fill)" dot={monthly.length === 1} activeDot={{ r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="min-w-0 rounded-[15px] border border-[#e8edf4] bg-white px-[13px] pt-[18px] pb-[14px] sm:rounded-[17px] sm:px-[20px] sm:pt-[21px] sm:pb-[17px]">
            <PanelHeading title="Appointment Completion" subtitle="Completed vs cancelled" />
            <div className="mt-[13px] h-[225px] w-full sm:mt-[16px] sm:h-[265px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly} margin={{ top: 5, right: 7, bottom: 3, left: -14 }} barGap={2}>
                  <CartesianGrid stroke="#e9eff8" strokeDasharray="3 5" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#91a5c2", fontSize: 11 }} />
                  <YAxis domain={[0, 165]} ticks={[0, 40, 80, 120, 160]} width={40}
                    tickLine={false} axisLine={false} tick={{ fill: "#91a5c2", fontSize: 11 }} />
                  <Tooltip contentStyle={CHART_TOOLTIP} formatter={(value, name) => [value, String(name) + " (approx. preview)"]} />
                  <Bar dataKey="completed" name="Completed" fill="#009b70" maxBarSize={32} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="cancelled" name="Cancelled" fill="#f6a1a2" maxBarSize={32} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        <div className="mt-[16px] grid grid-cols-1 items-stretch gap-[16px] md:grid-cols-2 xl:grid-cols-3 xl:gap-[18px]">
          <section className="min-w-0 rounded-[15px] border border-[#e8edf4] bg-white px-[14px] pt-[18px] pb-[18px] sm:rounded-[17px] sm:px-[19px] sm:pt-[21px]">
            <PanelHeading title="Tests by Category" subtitle="Volume distribution" />
            <div className="mx-auto mt-[13px] h-[178px] w-full sm:mt-[18px] sm:h-[201px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activeCategories} nameKey="name" dataKey="value"
                    cx="50%" cy="50%" innerRadius="47%" outerRadius="72%"
                    stroke="#ffffff" strokeWidth={1.75} paddingAngle={0}
                  >
                    {activeCategories.map((item) => <Cell key={item.name} fill={item.color} />)}
                  </Pie>
                  <Tooltip contentStyle={CHART_TOOLTIP} formatter={(value) => [value, "Tests"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-[12px] grid grid-cols-2 gap-x-[10px] gap-y-[8px] sm:gap-y-[10px]">
              {CATEGORIES.map((item) => (
                <button
                  key={item.name} type="button"
                  aria-pressed={category === item.name}
                  onClick={() => setCategory(category === item.name ? "All Categories" : item.name)}
                  className={"flex min-w-0 items-center gap-[6px] text-left text-[10px] leading-[15px] sm:text-[11px] " +
                    (category === item.name ? "font-semibold text-[#155eef]" : "text-[#576b86]")}
                >
                  <span aria-hidden="true" className="size-[8px] shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="min-w-0 flex-1">{item.name}</span>
                  <span className="shrink-0 font-semibold text-[#243752]">{item.value}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="min-w-0 rounded-[15px] border border-[#e8edf4] bg-white px-[14px] pt-[18px] pb-[18px] sm:rounded-[17px] sm:px-[19px] sm:pt-[21px]">
            <PanelHeading title="Avg Turnaround (hours)" subtitle="By test type" />
            <div className="mt-[20px] h-[269px] w-full sm:mt-[22px] sm:h-[275px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TURNAROUND} layout="vertical" margin={{ top: 0, right: 7, bottom: 5, left: 0 }} barSize={23}>
                  <CartesianGrid stroke="#e9eff8" strokeDasharray="3 5" horizontal={false} />
                  <XAxis type="number" domain={[0, 24]} ticks={[0, 6, 12, 18, 24]} tickLine={false} axisLine={false}
                    tick={{ fill: "#91a5c2", fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" width={95} tickLine={false} axisLine={false}
                    tick={{ fill: "#7388a7", fontSize: 11 }} />
                  <Tooltip contentStyle={CHART_TOOLTIP} formatter={(value) => [Number(value).toFixed(1) + "h (approx.)", "Turnaround"]} />
                  <Bar dataKey="hours" fill="#8136ef" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="min-w-0 overflow-hidden rounded-[15px] border border-[#e8edf4] bg-white sm:rounded-[17px] md:col-span-2 xl:col-span-1">
            <div className="px-[14px] pt-[18px] pb-[16px] sm:px-[19px] sm:pt-[21px]">
              <PanelHeading title="Most Requested Tests" subtitle="By volume this period" />
            </div>
            <ol>
              {requested.map((item) => (
                <li key={item.name} className="flex min-h-[62px] items-center gap-[13px] border-b border-[#edf1f6] px-[14px] py-[9px] last:border-b-0 sm:min-h-[67px] sm:px-[19px]">
                  <span className="w-[13px] shrink-0 text-center text-[13px] font-semibold text-[#c6d3e4] sm:text-[14px]">{MOST_REQUESTED.indexOf(item) + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12px] leading-[18px] font-medium text-[#34465e] sm:text-[14px] sm:leading-[20px]">{item.name}</span>
                    <span className="block text-[11px] leading-[16px] text-[#91a5c2] sm:text-[12px]">{item.revenue} revenue</span>
                  </span>
                  <strong className="text-[13px] text-[#24334d] sm:text-[14px]">{item.count}</strong>
                </li>
              ))}
              {requested.length === 0 && (
                <li className="px-[19px] py-[35px] text-[12px] text-[#8094ae]">No tests match the header search.</li>
              )}
            </ol>
          </section>
        </div>

        <section className="mt-[19px] rounded-[15px] border border-[#e8edf4] bg-white px-[14px] py-[18px] sm:mt-[21px] sm:rounded-[17px] sm:px-[20px] sm:py-[21px]">
          <h2 className="text-[13px] font-semibold text-[#25354e] sm:text-[15px]">Export Reports</h2>
          <div className="mt-[12px] grid grid-cols-1 gap-[10px] sm:grid-cols-2 xl:grid-cols-4">
            {exports.map(({ report, note }) => (
              <div key={report} className="flex min-h-[92px] flex-col items-start rounded-[12px] border border-[#dce5f1] bg-white px-[12px] py-[12px] sm:px-[14px]">
                <h3 className="text-[11px] font-semibold text-[#2f3e56] sm:text-[12px]">{report}</h3>
                <p className="mt-[3px] flex-1 text-[10px] text-[#90a4bf] sm:text-[11px]">{note}</p>
                <div className="mt-[10px]"><CsvDownload report={report} data={monthly} /></div>
              </div>
            ))}
          </div>
        </section>
        <p className="mt-[12px] text-[11px] leading-[17px] text-[#90a4bf]">
          Design-reference preview only. Summary metrics, category totals and top-test revenues reflect the screenshots;
          monthly chart points and individual turnaround bars are approximations, not verified medical or financial data.
          Downloads do not access live records.
        </p>
      </div>
    </LaboratoryShell>
  );
}
