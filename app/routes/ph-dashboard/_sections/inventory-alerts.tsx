import { Card } from "~/components/ui/card";

const INVENTORY_ALERTS = [
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

export function InventoryAlerts() {
  return (
    <Card className="border-border gap-0 border px-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.025)] ring-0 sm:px-[17px]">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="text-foreground text-sm font-semibold sm:text-[15px]">
          Inventory Alerts
        </h2>
        <span className="bg-destructive/10 text-destructive inline-flex rounded-sm px-1.5 py-1 text-[10px] font-semibold whitespace-nowrap">
          3 Low Stock
        </span>
      </div>
      <ul>
        {INVENTORY_ALERTS.map((item) => (
          <li
            key={item.medicine}
            className="border-border border-b py-2 last:border-0 last:pb-0"
          >
            <p className="text-foreground text-xs leading-4 font-semibold sm:text-[13px]">
              {item.medicine}
            </p>
            <p className="text-muted-foreground mt-0.5 text-[11px] leading-4 sm:text-xs">
              {item.type}
              <span className="text-border mx-1.5">•</span>
              <span className="text-destructive font-medium">
                {item.remaining}
              </span>
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
