import { Check, X } from "lucide-react";
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
    <div className="rounded-[20px] border border-gray-100 bg-white p-6 shadow-sm">
      {/* Card Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
          APPOINTMENT REQUEST
          <span className="ml-2 font-normal tracking-normal text-gray-400 normal-case">
            • 23 Appointments
          </span>
        </h2>
        <a
          href="#"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          See all
        </a>
      </div>

      {/* Requests List */}
      <div className="flex flex-col gap-6">
        {APPOINTMENT_REQUESTS.map((req) => (
          <div key={req.initials} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-11 border-none">
                <AvatarFallback
                  className={`text-sm font-semibold text-white ${req.avatarBg}`}
                >
                  {req.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {req.name}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">{req.type}</p>
                <p className="mt-0.5 text-xs text-gray-500">{req.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label={`Accept ${req.name}'s request`}
                className="flex size-8 items-center justify-center rounded-full border border-blue-600 text-blue-600 transition-colors hover:bg-blue-50"
              >
                <Check size={16} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                aria-label={`Reject ${req.name}'s request`}
                className="flex size-8 items-center justify-center rounded-full border border-red-500 text-red-500 transition-colors hover:bg-red-50"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
