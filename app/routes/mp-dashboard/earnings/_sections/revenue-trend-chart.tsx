import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Empty } from "~/components/ui/empty";
import { Skeleton } from "~/components/ui/skeleton";
import type { RevenueTrendPoint } from "~/features/earnings/types";
import { formatCompactNaira, formatNaira } from "./_primitives";

interface RevenueTrendChartProps {
  data: RevenueTrendPoint[];
  isLoading: boolean;
}

export function RevenueTrendChart({ data, isLoading }: RevenueTrendChartProps) {
  const rangeLabel =
    data.length >= 2 ? `${data[0].month} - ${data[data.length - 1].month}` : "";

  return (
    <div className="border-border bg-card rounded-2xl border p-6">
      <div className="mb-4">
        <h2 className="text-foreground text-base font-semibold">
          Revenue Trend
        </h2>
        {rangeLabel && (
          <p className="text-muted-foreground text-sm">{rangeLabel}</p>
        )}
      </div>

      {isLoading ? (
        <Skeleton className="h-72 w-full" />
      ) : data.length === 0 ? (
        <Empty>
          <p className="text-muted-foreground">No revenue data available.</p>
        </Empty>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--primary)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--primary)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                tickFormatter={(value) => formatCompactNaira(Number(value))}
                width={52}
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
              <Area
                type="monotone"
                dataKey="amount"
                stroke="var(--primary)"
                strokeWidth={2}
                fill="url(#revenue-fill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
