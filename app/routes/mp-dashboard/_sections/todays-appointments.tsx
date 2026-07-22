import { CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils/helpers";

const TODAY_APPOINTMENTS = [
  {
    id: 0,
    time: "09:00",
    name: "Michael Lee",
    type: "Chat Consultation",
    duration: "30 minutes",
    status: "completed" as const,
  },
  {
    id: 1,
    time: "10:00",
    name: "Sara Johnson",
    type: "Chat Consultation",
    duration: "30 minutes",
    status: "completed" as const,
  },
  {
    id: 2,
    time: "12:00",
    name: "Emeka Bello",
    type: "Video Consultation",
    duration: "1 hour",
    status: "pending" as const,
    consultationType: "Video",
  },
  {
    id: 3,
    time: "13:00",
    name: "Fatima Khan",
    type: "Video Consultation",
    duration: "2 hours",
    status: "pending" as const,
    consultationType: "Video",
  },
  {
    id: 4,
    time: "15:00",
    name: "Raj Patel",
    type: "Chat Consultation",
    duration: "1 hour",
    status: "pending" as const,
    consultationType: "Chat",
  },
];

export function TodaysAppointments() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">
          TODAY&apos;S APPOINTMENT{" "}
          <span className="text-muted-foreground font-normal">
            • {TODAY_APPOINTMENTS.length} Appointments
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-0 p-0">
        {TODAY_APPOINTMENTS.map((apt, index) => {
          const [hour, minute] = apt.time.split(":");
          return (
            <div
              key={apt.id}
              className={cn(
                "flex items-center justify-between p-4",
                index !== TODAY_APPOINTMENTS.length - 1 &&
                  "border-b border-gray-100"
              )}
            >
              <div className="flex items-center gap-4">
                <div className="text-muted-foreground flex size-14 shrink-0 flex-col items-center justify-center rounded-lg bg-gray-100 text-sm leading-tight font-medium">
                  <span>{hour}</span>
                  <span>{minute}</span>
                </div>
                <div>
                  <p
                    className={cn(
                      "text-base font-medium",
                      apt.status === "completed"
                        ? "text-muted-foreground"
                        : "text-foreground"
                    )}
                  >
                    {apt.name}
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-sm">
                    {apt.type} • {apt.duration}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {apt.status === "completed" ? (
                  <span className="text-muted-foreground text-xs font-medium">
                    Completed
                  </span>
                ) : (
                  <>
                    <Badge
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-xs font-medium",
                        apt.consultationType === "Chat"
                          ? "border-indigo-100 bg-indigo-50 text-indigo-600"
                          : "border-blue-100 bg-blue-50 text-blue-600"
                      )}
                    >
                      {apt.consultationType}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="rounded-full border-orange-100 bg-orange-50 text-orange-500 hover:bg-orange-100"
                    >
                      Pending
                    </Badge>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </div>
  );
}
