import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent } from "~/components/ui/card";
import { Empty } from "~/components/ui/empty";
import { Skeleton } from "~/components/ui/skeleton";
import type { ConsultationTypeRevenue } from "~/features/earnings/types";
import { formatNaira } from "./_primitives";

type ConsultationTypeChartProps = {
  data: ConsultationTypeRevenue[];
  isLoading: boolean;
};

const CONSULTATION_TICKS = [0, 20_000, 50_000, 100_000, 200_000];

export function ConsultationTypeChart({
  data,
  isLoading,
}: ConsultationTypeChartProps) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-foreground text-[18px] font-bold uppercase">
          By Consultation Type
        </h2>
      </div>

      <Card className="border-border h-65 gap-0 rounded-2xl border py-0 shadow-none ring-0">
        <CardContent className="h-full px-4 py-4">
          {isLoading ? (
            <Skeleton className="h-full w-full rounded-xl" />
          ) : data.length === 0 ? (
            <Empty>
              <p className="text-muted-foreground">
                No consultation type data available.
              </p>
            </Empty>
          ) : (
            <ResponsiveContainer height="100%" width="100%">
              <BarChart
                barCategoryGap={16}
                data={data}
                layout="vertical"
                margin={{ top: 16, right: 12, bottom: 8, left: 0 }}
              >
                <XAxis
                  axisLine={false}
                  domain={[0, 200_000]}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  tickFormatter={(value: number) => formatNaira(value)}
                  tickLine={false}
                  ticks={CONSULTATION_TICKS}
                  type="number"
                />
                <YAxis
                  axisLine={false}
                  dataKey="type"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  tickLine={false}
                  type="category"
                  width={62}
                />
                <Tooltip
                  formatter={(value) => formatNaira(Number(value))}
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  barSize={64}
                  dataKey="amount"
                  fill="#7da5f5"
                  radius={[0, 8, 8, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
