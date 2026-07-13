import {
  CalendarClock,
  Users,
  FileText,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

const STATS = [
  {
    icon: CalendarClock,
    label: "Today's appointments",
    value: "12",
    hint: "3 awaiting confirmation",
  },
  {
    icon: Users,
    label: "Active patients",
    value: "248",
    hint: "+8 this week",
  },
  {
    icon: FileText,
    label: "Prescriptions issued",
    value: "37",
    hint: "This month",
  },
  {
    icon: MessageSquare,
    label: "Unread messages",
    value: "5",
    hint: "2 flagged urgent",
  },
];

export default function MedicalProfessionalDashboard() {
  return (
    <div className="max-w-content mx-auto w-full px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="mb-1 text-2xl font-bold">Medical Professional</h1>
        <p className="text-muted-foreground text-sm">
          Overview of your appointments, patients, and prescriptions.
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
