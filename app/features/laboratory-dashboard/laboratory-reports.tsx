import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUpRight, Download } from "lucide-react";
import { LaboratoryShell } from "./laboratory-shell";

type Period = "Last 7 Months" | "Last 3 Months" | "This Month";
const REVENUE = [
  { month: "Mar", revenue: 178, tests: 210 },
  { month: "Apr", revenue: 214, tests: 246 },
  { month: "May", revenue: 197, tests: 228 },
  { month: "Jun", revenue: 244, tests: 284 },
  { month: "Jul", revenue: 256, tests: 291 },
  { month: "Aug", revenue: 314, tests: 325 },
  { month: "Sep", revenue: 173, tests: 338 },
];

const TEST_CATEGORIES = [
  { category: "Blood", value: 142, color: "#2563eb" },
  { category: "Urinalysis", value: 58, color: "#06a7dc" },
  { category: "Hormonal", value: 34, color: "#7c3aed" },
  { category: "Infectious Disease", value: 67, color: "#059669" },
  { category: "Cardiology", value: 22, color: "#ee8500" },
  { category: "Preventive", value: 15, color: "#dc2b34" },
];
const totalTests = TEST_CATEGORIES.reduce((sum, item) => sum + item.value, 0);

function AnalyticsCard({
  label,
  value,
  subtitle,
  icon,
}: {
  label: string;
  value: string;
  subtitle: string;
  icon: string;
}) {
  return (
    <div className="flex min-h-[120px] flex-col rounded-[14px] border border-[#e6ebf3] bg-white px-[14px] py-[17px] sm:min-h-[143px] sm:rounded-[16px] sm:px-[19px] sm:py-[22px]">
      <div className="flex items-start justify-between gap-2">
        <h3 className="max-w-[155px] text-[11px] leading-[15px] font-semibold text-[#667b9a] sm:text-[12px]">
          {label.toUpperCase()}
        </h3>
        <span
          className="flex size-[29px] items-center justify-center rounded-[10px] bg-[#f4f7fb] text-[14px] sm:size-[32px]"
          aria-hidden="true"
        >
          {icon}
        </span>
      </div>
      <p className="mt-[10px] text-[22px] leading-[29px] font-semibold tracking-[-0.4px] text-[#131e32] sm:mt-[13px] sm:text-[26px] sm:leading-[34px]">
        {value}
      </p>
      <p className="mt-[3px] text-[10px] leading-[15px] text-[#92a5be] sm:text-[12px] sm:leading-[18px]">
        {subtitle}
      </p>
    </div>
  );
}

export default function LaboratoryReportsAndAnalytics() {
  const [period, setPeriod] = useState<Period>("Last 7 Months");
  const [headerSearch, setHeaderSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedBar, setSelectedBar] = useState<string | null>(null);
  const series =
    period === "This Month"
      ? REVENUE.slice(-1)
      : period === "Last 3 Months"
        ? REVENUE.slice(-3)
        : REVENUE;
  const matchingCategories = TEST_CATEGORIES.filter((item) =>
    item.category.toLowerCase().includes(headerSearch.trim().toLowerCase())
  );
  const categoryData = selectedCategory === "All"
    ? matchingCategories
    : matchingCategories.filter((item) => item.category === selectedCategory);
  const csv = [
    "OHealth+ Lab Reports & Analytics — SAMPLE DATA (not live)",
    "Month,Estimated revenue NGN (thousands),Example test volume",
    ...series.map((item) => [item.month, item.revenue, item.tests].join(",")),
    "",
    "Test category,Number of tests (example)",
    ...TEST_CATEGORIES.map((item) => [item.category, item.value].join(",")),
  ].join("\n");

  return (
    <LaboratoryShell section="Reports & Analytics" search={headerSearch} onSearchChange={setHeaderSearch}>
      <div className="mx-auto w-full max-w-[1500px] px-[15px] pt-[24px] pb-[70px] sm:px-[30px] sm:pt-[45px]">
        <div className="flex flex-wrap items-start justify-between gap-[14px]">
          <div>
            <h1 className="text-[22px] leading-[30px] font-semibold tracking-[-0.4px] text-[#202b3a] sm:text-[29px] sm:leading-[37px]">
              Reports &amp; Analytics
            </h1>
            <p className="mt-[1px] text-[13px] leading-[20px] text-[#566371] sm:text-[17px] sm:leading-[25px]">
              Monitor laboratory activity, test volumes and performance
            </p>
          </div>
          <a
            href={"data:text/csv;charset=utf-8," + encodeURIComponent(csv)}
            download="ohealth-lab-preview-analytics.csv"
            className="inline-flex min-h-[35px] items-center gap-[7px] rounded-[11px] bg-[#155eef] px-[12px] text-[12px] font-medium text-white shadow-sm hover:bg-[#084bd5] sm:min-h-[37px] sm:px-[16px] sm:text-[13px]"
          >
            <Download className="size-[15px]" /> Download Report
          </a>
        </div>

        <div className="mt-[27px] flex flex-wrap items-center gap-[11px] sm:mt-[36px]">
          <label
            htmlFor="lab-report-period"
            className="text-[12px] font-medium text-[#556a85] sm:text-[13px]"
          >
            Reporting period
          </label>
          <select
            id="lab-report-period"
            value={period}
            onChange={(event) => setPeriod(event.currentTarget.value as Period)}
            className="min-h-[36px] rounded-[10px] border border-[#dce5f0] bg-white px-[12px] text-[12px] text-[#34445d] outline-none focus:border-[#155eef] sm:text-[13px]"
          >
            <option>Last 7 Months</option>
            <option>Last 3 Months</option>
            <option>This Month</option>
          </select>
          <span className="text-[11px] text-[#94a5bc]">
            Example figures only · not live reporting
          </span>
        </div>

        <div className="mt-[21px] grid grid-cols-2 gap-[11px] sm:grid-cols-2 sm:gap-[17px] xl:grid-cols-4">
          <AnalyticsCard
            label="Tests by category"
            value={totalTests.toLocaleString("en-NG")}
            subtitle="Example monthly category total"
            icon="🧪"
          />
          <AnalyticsCard
            label="Today's appointments"
            value="5"
            subtitle="13 September sample data"
            icon="📅"
          />
          <AnalyticsCard
            label="Results pending"
            value="2"
            subtitle="Example dashboard pending count"
            icon="📋"
          />
          <AnalyticsCard
            label="Today's revenue"
            value="₦87,500"
            subtitle="Estimated from example bookings"
            icon="₦"
          />
        </div>

        <div className="mt-[23px] grid grid-cols-1 gap-[17px] xl:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
          <section className="rounded-[14px] border border-[#e7edf4] bg-white px-[14px] pt-[19px] pb-[17px] sm:rounded-[17px] sm:px-[23px] sm:pt-[24px]">
            <h2 className="text-[13px] font-semibold text-[#26364e] sm:text-[15px]">
              Revenue Trend
            </h2>
            <p className="mt-[2px] text-[11px] text-[#8da2bf] sm:text-[12px]">
              Estimated monthly revenue (₦ thousands)
            </p>
            <div className="mt-[20px] h-[210px] w-full sm:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={series}
                  margin={{ top: 6, right: 8, bottom: 5, left: -16 }}
                >
                  <defs>
                    <linearGradient
                      id="lab-analytics-area"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#2563eb"
                        stopOpacity={0.15}
                      />
                      <stop
                        offset="100%"
                        stopColor="#2563eb"
                        stopOpacity={0.006}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#edf2f8" strokeDasharray="2 4" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#8da2be", fontSize: 11 }}
                  />
                  <YAxis
                    domain={[0, 360]}
                    ticks={[0, 80, 160, 240, 320]}
                    tickLine={false}
                    axisLine={false}
                    width={46}
                    tick={{ fill: "#8da2be", fontSize: 10 }}
                    tickFormatter={(value: number) => "₦" + value + "k"}
                  />
                  <Tooltip
                    formatter={(value) => [
                      "₦" + Number(value).toLocaleString("en-NG") + ",000",
                      "Est. revenue",
                    ]}
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 10,
                      borderColor: "#e4eaf2",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2563ff"
                    strokeWidth={2}
                    fill="url(#lab-analytics-area)"
                    dot={series.length === 1}
                    activeDot={{ r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>
          <section className="rounded-[14px] border border-[#e7edf4] bg-white px-[14px] pt-[19px] pb-[17px] sm:rounded-[17px] sm:px-[23px] sm:pt-[24px]">
            <h2 className="text-[13px] font-semibold text-[#26364e] sm:text-[15px]">
              Tests by Category
            </h2>
            <p className="mt-[2px] text-[11px] text-[#8da2bf] sm:text-[12px]">
              This month · sample distribution
            </p>
            <div className="mx-auto mt-[12px] h-[180px] max-w-[320px] sm:h-[215px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius="48%"
                    outerRadius="72%"
                    paddingAngle={2}
                  >
                    {categoryData.map((item) => (
                      <Cell key={item.category} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [String(value) + " tests", "Count"]}
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 10,
                      borderColor: "#e4eaf2",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-x-[12px] gap-y-[7px]">
              {matchingCategories.map((item) => (
                <button
                  key={item.category}
                  type="button"
                  aria-pressed={selectedCategory === item.category}
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === item.category ? "All" : item.category
                    )
                  }
                  className={
                    "flex items-start gap-[6px] rounded-[5px] text-left text-[10px] leading-[15px] sm:text-[11px] " +
                    (selectedCategory === item.category
                      ? "font-semibold text-[#155eef]"
                      : "text-[#50647f]")
                  }
                >
                  <span
                    className="mt-[4px] size-[7px] shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="flex-1">{item.category}</span>
                  <span className="font-semibold">{item.value}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-[19px] rounded-[14px] border border-[#e7edf4] bg-white px-[14px] pt-[19px] pb-[17px] sm:rounded-[17px] sm:px-[23px] sm:pt-[23px]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-[13px] font-semibold text-[#26364e] sm:text-[15px]">
                Test Volume
              </h2>
              <p className="mt-[2px] text-[11px] text-[#8da2bf] sm:text-[12px]">
                Illustrative laboratory test volume over time
              </p>
            </div>
            {selectedBar && (
              <span className="text-[11px] text-[#506786]">
                {selectedBar} selected (preview)
              </span>
            )}
          </div>
          <div className="mt-[17px] h-[193px] w-full sm:h-[225px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={series}
                margin={{ top: 6, right: 10, left: -20, bottom: 5 }}
                onClick={(event) => {
                  if (event?.activeLabel != null)
                    setSelectedBar(String(event.activeLabel));
                }}
              >
                <CartesianGrid
                  stroke="#edf2f8"
                  strokeDasharray="2 4"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#8ca1be", fontSize: 11 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#8ca1be", fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value) => [value, "Example tests"]}
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 10,
                    borderColor: "#e4eaf2",
                  }}
                />
                <Bar
                  dataKey="tests"
                  fill="#2765f0"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={47}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="mt-[19px] overflow-hidden rounded-[14px] border border-[#e7edf4] bg-white sm:rounded-[17px]">
          <div className="flex items-center justify-between gap-3 px-[15px] py-[18px] sm:px-[23px]">
            <div>
              <h2 className="text-[13px] font-semibold text-[#26364e] sm:text-[15px]">
                Category Breakdown
              </h2>
              <p className="mt-[2px] text-[11px] text-[#8da2bf]">
                Illustrative counts from the Overview sample chart
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#155eef]">
              Total {totalTests} <ArrowUpRight className="size-[13px]" />
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[570px] text-left">
              <thead className="border-y border-[#e5ebf3] bg-[#f7f9fc] text-[11px] font-semibold text-[#617792]">
                <tr>
                  <th className="px-[17px] py-[12px] sm:px-[23px]">
                    TEST CATEGORY
                  </th>
                  <th className="px-[17px] py-[12px]">TESTS</th>
                  <th className="px-[17px] py-[12px]">SHARE</th>
                </tr>
              </thead>
              <tbody>
                {matchingCategories.map((item) => (
                  <tr
                    key={item.category}
                    className="border-b border-[#eef2f6] text-[12px] text-[#435673] last:border-b-0 sm:text-[13px]"
                  >
                    <td className="px-[17px] py-[12px] sm:px-[23px]">
                      <span
                        className="mr-[8px] inline-block size-[8px] rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.category}
                    </td>
                    <td className="px-[17px] py-[12px] font-medium text-[#26364f]">
                      {item.value}
                    </td>
                    <td className="px-[17px] py-[12px]">
                      {((item.value / totalTests) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <p className="mt-[15px] text-[11px] leading-[18px] text-[#91a4bc]">
          All charts and exported CSV values are sample placeholders from the
          laboratory preview, not validated financial or clinical reports.
        </p>
      </div>
    </LaboratoryShell>
  );
}
