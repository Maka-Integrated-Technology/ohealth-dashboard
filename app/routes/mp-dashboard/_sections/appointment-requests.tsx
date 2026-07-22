import { Check, X } from "lucide-react";
import { CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";

const APPOINTMENT_REQUESTS = [
  {
    initials: "UF",
    name: "Ugwu Felicia",
    type: "Video Consultation • 1 hour",
    date: "14 Jun • 10:30 AM",
    avatarBg: "bg-gray-600",
  },
  {
    initials: "OA",
    name: "Oladapo Adeniyi",
    type: "Video Consultation • 1 hour",
    date: "14 Jun • 2:00 PM",
    avatarBg: "bg-blue-600",
  },
  {
    initials: "JA",
    name: "John Adams",
    type: "In-Person Meeting • 2 hours",
    date: "15 Jun • 1:00 PM",
    avatarBg: "bg-[#4A0E1B]",
  },
];

export function AppointmentRequests() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-medium">
          APPOINTMENT REQUEST{" "}
          <span className="text-muted-foreground font-normal">
            • 23 Appointments
          </span>
        </CardTitle>
        <a
          href="#"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          See all
        </a>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        {APPOINTMENT_REQUESTS.map((req) => (
          <div key={req.initials} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-10 shrink-0 border-none">
                <AvatarFallback
                  className={`text-sm font-bold text-white ${req.avatarBg}`}
                >
                  {req.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{req.name}</p>
                <p className="text-muted-foreground text-xs">{req.type}</p>
                <p className="text-muted-foreground text-xs">{req.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={`Accept ${req.name}'s request`}
                className="flex size-8 items-center justify-center rounded-full border border-blue-600 bg-white text-blue-600 transition-colors hover:bg-blue-50"
              >
                <Check size={16} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                aria-label={`Reject ${req.name}'s request`}
                className="flex size-8 items-center justify-center rounded-full border border-red-500 bg-white text-red-500 transition-colors hover:bg-red-50"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        ))}
      </CardContent>
    </div>
  );
}
