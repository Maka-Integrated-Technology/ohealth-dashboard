import { FlaskConical, CheckCircle2, TestTube, Timer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

const STATS = [
  {
    icon: FlaskConical,
    label: "Pending tests",
    value: "31",
    hint: "4 marked priority",
  },
  {
    icon: CheckCircle2,
    label: "Results ready",
    value: "16",
    hint: "Awaiting release",
  },
  {
    icon: TestTube,
    label: "Samples received",
    value: "58",
    hint: "Today",
  },
  {
    icon: Timer,
    label: "Avg. turnaround",
    value: "6.2h",
    hint: "Last 7 days",
  },
];

export default function LaboratoryDashboard() {
  return (
    <div className="max-w-content mx-auto w-full px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="mb-1 text-2xl font-bold">Laboratory</h1>
        <p className="text-muted-foreground text-sm">
          Overview of pending tests, results, and samples.
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
