import {
  ArrowUpRight,
  Award,
  Check,
  ClipboardList,
  Package,
  Pill,
} from "lucide-react";

const stats = [
  {
    icon: ClipboardList,
    label: "Total Medicines",
    value: "1,247",
    change: "+4.2%",
  },
  {
    icon: Package,
    label: "Pending Orders",
    value: "23",
    change: "-12%",
  },
  {
    icon: Pill,
    label: "Prescriptions Filled",
    value: "89",
    change: "+8.7%",
  },
  {
    icon: Award,
    label: "Compliance Score",
    value: "98%",
    change: "Optimal",
  },
] as const;

const recentOrders = [
  {
    id: "ORD-8492",
    customer: "Emily Thompson",
    medicine: "Amoxicillin 500mg",
    status: "Delivered",
    date: "Today",
  },
  {
    id: "ORD-8491",
    customer: "Robert Carter",
    medicine: "Lisinopril 10mg",
    status: "Processing",
    date: "Today",
  },
  {
    id: "ORD-8490",
    customer: "Maria Lopez",
    medicine: "Metformin 850mg",
    status: "Pending",
    date: "Yesterday",
  },
  {
    id: "ORD-8489",
    customer: "William Davis",
    medicine: "Atorvastatin 20mg",
    status: "Delivered",
    date: "Yesterday",
  },
  {
    id: "ORD-8488",
    customer: "Sandra Miller",
    medicine: "Ibuprofen 400mg",
    status: "Delivered",
    date: "Aug 29, 2026",
  },
  {
    id: "ORD-8487",
    customer: "James Taylor",
    medicine: "Albuterol Inhaler",
    status: "Processing",
    date: "Aug 28, 2026",
  },
] as const;

const inventoryAlerts = [
  {
    medicine: "Amoxicillin 500mg",
    type: "Antibiotic",
    remaining: "12 units left",
  },
  {
    medicine: "Metformin 850mg",
    type: "Antidiabetic",
    remaining: "8 units left",
  },
  {
    medicine: "Lisinopril 10mg",
    type: "ACE Inhibitor",
    remaining: "15 units left",
  },
] as const;

const verificationDetails = [
  {
    title: "Pharmacy License Verified",
    detail: "State license verified on Aug 26, 2026",
  },
  {
    title: "DEA Registration Active",
    detail: "Federal authority check passed successfully",
  },
  {
    title: "Compliance Onboarding",
    detail: "Completed final activation walkthrough",
  },
] as const;

const statusClasses = {
  Delivered: "bg-[#eafbf2] text-[#09965a]",
  Processing: "bg-[#eef4ff] text-[#1769ff]",
  Pending: "bg-[#fff7e8] text-[#d97706]",
} as const;

function OrderStatus({
  status,
}: {
  status: (typeof recentOrders)[number]["status"];
}) {
  return (
    <span
      className={`inline-flex rounded-md px-2 py-1 text-[11px] leading-4 font-medium whitespace-nowrap ${statusClasses[status]}`}
    >
      {status}
    </span>
  );
}

// Begin codeing and sign test
// Testing
export default function PharmacyDashboard() {
  return (
    <div className="bg-[#fcfcfc] px-5 pt-6 pb-8 sm:px-6 lg:px-[30px] lg:pt-[26px]">
      <div className="mx-auto w-full max-w-[1680px]">
        <header className="mb-5">
          <h1 className="text-[clamp(24px,2.2vw,34px)] leading-tight font-bold tracking-[-0.035em] text-[#171f2e]">
            Welcome back, MedPlus Pharmacy
          </h1>
          <p className="mt-1 text-[13px] leading-5 text-[#758094] sm:text-sm">
            Today is Monday, August 31, 2026
          </p>
        </header>

        <section
          aria-label="Pharmacy overview"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-[18px]"
        >
          {stats.map(({ icon: Icon, label, value, change }) => (
            <article
              key={label}
              className="rounded-xl border border-[#e4e8ee] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.025)] sm:min-h-[120px] sm:p-[15px]"
            >
              <div className="flex items-center justify-between gap-2.5">
                <h2 className="text-[13px] font-medium text-[#5e687a] sm:text-[clamp(12px,0.9vw,15px)]">
                  {label}
                </h2>
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#eef4ff] text-[#1262f5]">
                  <Icon className="size-4" strokeWidth={2} />
                </div>
              </div>
              <p className="mt-2 text-[clamp(20px,1.5vw,28px)] leading-[27px] font-bold tracking-[-0.035em] text-[#171f2e]">
                {value}
              </p>
              <div className="mt-1 flex items-center gap-1.5 text-xs leading-[14px]">
                <span className="inline-flex items-center gap-0.5 rounded-sm bg-[#e8fbf1] px-1 font-semibold text-emerald-700">
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-3 text-emerald-600"
                    strokeWidth={2.5}
                  />
                  {change}
                </span>
                <span className="text-[#929bab]">vs last month</span>
              </div>
            </article>
          ))}
        </section>

        <div className="mt-6 grid items-start gap-[18px] lg:grid-cols-[minmax(0,1fr)_clamp(285px,24vw,380px)]">
          <section className="min-w-0 overflow-hidden rounded-[13px] border border-[#e4e8ee] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.025)]">
            <div className="flex min-h-[61px] items-center border-b border-[#edf0f4] px-4 py-3 sm:px-[17px]">
              <div>
                <h2 className="text-base leading-5 font-semibold text-[#172033] sm:text-[17px]">
                  Recent Orders
                </h2>
                <p className="mt-0.5 text-xs leading-4 text-[#7d8798] sm:text-[13px]">
                  Real-time medicine orders and fulfillment status
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] table-fixed border-collapse text-left">
                <thead>
                  <tr className="h-[32px] bg-[#f8f9fb] text-[11px] font-semibold text-[#4d5869] sm:text-xs">
                    <th className="w-[18%] px-3 sm:px-[17px]">Order ID</th>
                    <th className="w-[22%] px-2">Customer</th>
                    <th className="w-[21%] px-2">Medicine</th>
                    <th className="w-[17%] px-2">Status</th>
                    <th className="w-[22%] px-3 text-right sm:px-[17px]">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="h-[39px] border-t border-[#edf0f4] text-xs text-[#4e596b]"
                    >
                      <td className="px-3 font-semibold whitespace-nowrap text-[#172033] sm:px-[17px]">
                        {order.id}
                      </td>
                      <td className="px-2 whitespace-nowrap">
                        {order.customer}
                      </td>
                      <td className="px-2 whitespace-nowrap">
                        {order.medicine}
                      </td>
                      <td className="px-2">
                        <OrderStatus status={order.status} />
                      </td>
                      <td className="px-3 text-right whitespace-nowrap text-[#929bab] sm:px-[17px]">
                        {order.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-1">
            <aside className="rounded-[13px] border border-[#e4e8ee] bg-white px-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.025)] sm:px-[17px]">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-[#172033] sm:text-[15px]">
                  Inventory Alerts
                </h2>
                <span className="inline-flex rounded-[3px] bg-[#fff0ee] px-1.5 py-1 text-[10px] font-semibold whitespace-nowrap text-[#ef4444]">
                  3 Low Stock
                </span>
              </div>
              <ul>
                {inventoryAlerts.map((item) => (
                  <li
                    key={item.medicine}
                    className="border-b border-[#edf0f4] py-2 last:border-0 last:pb-0"
                  >
                    <p className="text-xs leading-4 font-semibold text-[#172033] sm:text-[13px]">
                      {item.medicine}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-4 text-[#8993a3] sm:text-xs">
                      {item.type}
                      <span className="mx-1.5 text-[#c5cad3]">•</span>
                      <span className="font-medium text-red-500">
                        {item.remaining}
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            </aside>

            <aside className="rounded-[13px] border border-[#e4e8ee] bg-white px-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.025)] sm:px-[17px]">
              <h2 className="text-sm font-semibold text-[#172033] sm:text-[15px]">
                Verification Details
              </h2>
              <ul className="mt-2 space-y-2">
                {verificationDetails.map((item) => (
                  <li key={item.title} className="flex items-start gap-2">
                    <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-[#e8fbf1] text-emerald-600">
                      <Check className="size-[11px]" strokeWidth={2.5} />
                    </span>
                    <span>
                      <span className="block text-xs leading-[15px] font-semibold text-[#172033]">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-[13px] text-[#8993a3]">
                        {item.detail}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
