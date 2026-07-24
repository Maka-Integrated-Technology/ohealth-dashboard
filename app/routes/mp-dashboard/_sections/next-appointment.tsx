import { Mail } from "lucide-react";
import { CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";

const NEXT_APPOINTMENT = {
  initials: "EB",
  name: "Emeka Bello",
  type: "Video Consultation",
  age: 35,
  sex: "Male",
  lastAppointment: "First Timer",
  dateRegistered: "15th March, 2026",
  email: "emekabello@gmail.com",
};

export function NextAppointment() {
  const apt = NEXT_APPOINTMENT;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <CardHeader className="x-0 pt-0 pb-4 text-center">
        <CardTitle className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
          NEXT APPOINTMENT
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-0 pb-0">
        <div className="flex flex-col items-center text-center">
          <Avatar className="mb-3 size-20 border-none">
            <AvatarFallback className="bg-[#3F4448] text-3xl font-medium text-white">
              {apt.initials}
            </AvatarFallback>
          </Avatar>
          <h3 className="text-lg font-semibold">{apt.name}</h3>
          <p className="text-muted-foreground text-sm">{apt.type}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs font-medium">Age</p>
            <p className="text-muted-foreground font-medium">{apt.age}</p>
          </div>
          <div>
            <p className="text-xs font-medium">Sex</p>
            <p className="text-muted-foreground font-medium">{apt.sex}</p>
          </div>
          <div>
            <p className="text-xs font-medium">Last Appointment</p>
            <p className="text-muted-foreground font-medium">
              {apt.lastAppointment}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium">
              Date Registered
            </p>
            <p className="text-muted-foreground font-medium ">
              {apt.dateRegistered}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="mt-2 w-full rounded-lg bg-blue-600 py-2.5 font-medium text-white transition-colors hover:bg-blue-700"
        >
          Join Consultation
        </button>

        <div className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-2.5 text-sm">
          <Mail size={16} />
          <span>{apt.email}</span>
        </div>
      </CardContent>
    </div>
  );
}
