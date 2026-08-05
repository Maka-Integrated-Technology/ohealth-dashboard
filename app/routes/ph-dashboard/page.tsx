import { ClipboardList, Package, RefreshCw, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

const STATS = [
  {
    icon: ClipboardList,
    label: "Pending orders",
    value: "18",
    hint: "6 ready for pickup",
  },
  {
    icon: RefreshCw,
    label: "Refill requests",
    value: "24",
    hint: "9 awaiting approval",
  },
  {
    icon: Package,
    label: "Inventory items",
    value: "1,342",
    hint: "Across 4 categories",
  },
  {
    icon: AlertTriangle,
    label: "Low stock",
    value: "7",
    hint: "Reorder recommended",
  },
];

export default function PharmacyDashboard() {
  return (
    <div className="max-w-content mx-auto w-full px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="mb-1 text-2xl font-bold">Pharmacy</h1>
        <p className="text-muted-foreground text-sm">
          Overview of orders, refills, and inventory.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <div className="bg-primary/10 mb-1 flex size-9 items-center justify-center rounded-lg">
                <stat.icon className="text-primary size-5" strokeWidth={1.5} />
              </div>
              <CardTitle className="text-muted-foreground text-sm font-medium">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-muted-foreground mt-1 text-xs">{stat.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
