import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent } from "~/components/ui/card";
import { Empty } from "~/components/ui/empty";
import { Skeleton } from "~/components/ui/skeleton";
import type { RevenueTrendPoint } from "~/features/earnings/types";
import { formatNaira } from "./_primitives";

type RevenueTrendChartProps = {
  data: RevenueTrendPoint[];
  isLoading: boolean;
};

const REVENUE_TICKS = [0, 20_000, 50_000, 100_000, 200_000];

export function RevenueTrendChart({ data, isLoading }: RevenueTrendChartProps) {
  const rangeLabel =
    data.length >= 2 ? `${data[0].month} - ${data[data.length - 1].month}` : "";

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-foreground text-[18px] font-bold uppercase">
          Revenue Trend
        </h2>
        <p className="text-muted-foreground text-sm">{rangeLabel}</p>
      </div>

      <Card className="border-border h-65 gap-0 rounded-2xl border py-0 shadow-none ring-0">
        <CardContent className="h-full px-4 py-4">
          {isLoading ? (
            <Skeleton className="h-full w-full rounded-xl" />
          ) : data.length === 0 ? (
            <Empty>
              <p className="text-muted-foreground">
                No revenue data available.
              </p>
            </Empty>
          ) : (
            <ResponsiveContainer height="100%" width="100%">
              <AreaChart
                data={data}
                margin={{ top: 16, right: 14, bottom: 8, left: 0 }}
              >
                <defs>
                  <linearGradient id="revenue-fill" x1="0" x2="0" y1="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--primary)"
                      stopOpacity={0.12}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--primary)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <XAxis
                  axisLine={false}
                  dataKey="month"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  tickFormatter={(month: string) => month.split(" ")[0]}
                  tickLine={false}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  domain={[0, 210_000]}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  tickFormatter={(value: number) => formatNaira(value)}
                  tickLine={false}
                  ticks={REVENUE_TICKS}
                  width={88}
                />
                <Tooltip
                  formatter={(value) => formatNaira(Number(value))}
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  dataKey="amount"
                  dot={{
                    fill: "var(--background)",
                    r: 3.5,
                    stroke: "var(--primary)",
                    strokeWidth: 2,
                  }}
                  fill="url(#revenue-fill)"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  type="monotone"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
