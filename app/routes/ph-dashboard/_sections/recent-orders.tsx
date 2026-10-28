import { Card } from "~/components/ui/card";

const RECENT_ORDERS = [
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

const STATUS_CLASSES = {
  Delivered:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  Processing: "bg-primary/10 text-primary",
  Pending:
    "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
} as const;

type OrderStatusValue = (typeof RECENT_ORDERS)[number]["status"];

function OrderStatus({ status }: { status: OrderStatusValue }) {
  return (
    <span
      className={`inline-flex rounded-md px-2 py-1 text-[11px] leading-4 font-medium whitespace-nowrap ${STATUS_CLASSES[status]}`}
    >
      {status}
    </span>
  );
}

export function RecentOrders() {
  return (
    <section>
      <Card className="border-border gap-0 border py-0 shadow-[0_1px_2px_rgba(15,23,42,0.025)] ring-0">
        <div className="border-border flex min-h-[61px] items-center border-b px-4 py-3 sm:px-[17px]">
          <div>
            <h2 className="text-foreground text-base leading-5 font-semibold sm:text-[17px]">
              Recent Orders
            </h2>
            <p className="text-muted-foreground mt-0.5 text-xs leading-4 sm:text-[13px]">
              Real-time medicine orders and fulfillment status
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] table-fixed border-collapse text-left">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground h-[32px] text-[11px] font-semibold sm:text-xs">
                <th className="w-[18%] px-3 sm:px-[17px]">Order ID</th>
                <th className="w-[22%] px-2">Customer</th>
                <th className="w-[21%] px-2">Medicine</th>
                <th className="w-[17%] px-2">Status</th>
                <th className="w-[22%] px-3 text-right sm:px-[17px]">Date</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_ORDERS.map((order) => (
                <tr
                  key={order.id}
                  className="border-border text-muted-foreground h-[39px] border-t text-xs"
                >
                  <td className="text-foreground px-3 font-semibold whitespace-nowrap sm:px-[17px]">
                    {order.id}
                  </td>
                  <td className="px-2 whitespace-nowrap">{order.customer}</td>
                  <td className="px-2 whitespace-nowrap">{order.medicine}</td>
                  <td className="px-2">
                    <OrderStatus status={order.status} />
                  </td>
                  <td className="px-3 text-right whitespace-nowrap sm:px-[17px]">
                    {order.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
}
