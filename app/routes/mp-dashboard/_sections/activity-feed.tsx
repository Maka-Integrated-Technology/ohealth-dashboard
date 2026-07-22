import { AlertCircle, Calendar } from "lucide-react";
import { CardContent, CardHeader, CardTitle } from "~/components/ui/card";

const ACTIVITY_ITEMS = [
  {
    text: "Chidi Nwosu cancelled their 2:30 PM appointment today.",
    time: "12 minutes ago",
    lineColor: "bg-red-400",
    icon: AlertCircle,
    iconColor: "text-red-500",
  },
  {
    text: "Oluwaseun Taiwo has requested to move Thursday's 2:00 PM appointment to Friday, 9 May at 10:00 AM. Review and confirm.",
    time: "52 minutes ago",
    lineColor: "bg-orange-400",
    icon: Calendar,
    iconColor: "text-orange-500",
  },
  {
    text: "New booking from Ngozi Adeyemi — Friday, 9 May at 11:30 AM. In-Person consultation. Payment confirmed.",
    time: "Today • 9:12 AM",
    lineColor: "bg-blue-400",
    icon: Calendar,
    iconColor: "text-blue-500",
  },
];

export function ActivityFeed() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-medium">ACTIVITY</CardTitle>
        <a
          href="#"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          See all
        </a>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        {ACTIVITY_ITEMS.map((item, idx) => (
          <div key={idx} className="flex gap-3">
            <div className="flex shrink-0 flex-col items-center gap-1 pt-0.5">
              <div className={`h-8 w-1 rounded-full ${item.lineColor}`} />
              <item.icon className={`size-3.5 ${item.iconColor}`} />
            </div>
            <div className="space-y-1">
              <p className="text-sm leading-snug text-gray-900">{item.text}</p>
              <p className="text-muted-foreground text-xs">{item.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </div>
  );
}
