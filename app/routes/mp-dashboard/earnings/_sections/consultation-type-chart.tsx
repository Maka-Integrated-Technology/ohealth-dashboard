import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Empty } from "~/components/ui/empty";
import { Skeleton } from "~/components/ui/skeleton";
import type { ConsultationTypeRevenue } from "~/features/earnings/types";
import { formatNaira } from "./_primitives";

const BAR_FILLS: Record<ConsultationTypeRevenue["type"], string> = {
  Video: "var(--primary)",
  Chat: "#10b981",
  "In-Person": "var(--chart-2)",
};

interface ConsultationTypeChartProps {
  data: ConsultationTypeRevenue[];
  isLoading: boolean;
}

export function ConsultationTypeChart({
  data,
  isLoading,
}: ConsultationTypeChartProps) {
  return (
    <div className="border-border bg-card rounded-2xl border p-6">
      <div className="mb-4">
        <h2 className="text-foreground text-base font-semibold">
          By Consultation Type
        </h2>
        <p className="text-muted-foreground text-sm">
          Revenue split for the current month
        </p>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : data.length === 0 ? (
        <Empty>
          <p className="text-muted-foreground">
            No consultation type data available.
          </p>
        </Empty>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="type"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 13 }}
                width={72}
              />
              <Tooltip
                formatter={(value) => formatNaira(Number(value))}
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.75rem",
                  fontSize: "0.875rem",
                }}
                labelStyle={{ color: "var(--muted-foreground)" }}
              />
              <Bar dataKey="amount" radius={[0, 6, 6, 0]} barSize={28}>
                {data.map((entry) => (
                  <Cell key={entry.type} fill={BAR_FILLS[entry.type]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
