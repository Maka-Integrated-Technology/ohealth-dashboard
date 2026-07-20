import {
  Users,
  CalendarDays,
  Clock,
  Mail,
  Check,
  X,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { cn } from "~/lib/utils";

const STATS = [
  {
    icon: Users,
    label: "PATIENTS",
    value: "121",
    hint: (
      <>
        <span className="text-blue-600">↑ 3%</span>{" "}
        <span className="text-muted-foreground">in the last 30 days</span>
      </>
    ),
    iconWrapperClass: "bg-blue-50 text-blue-600",
  },
  {
    icon: CalendarDays,
    label: "TODAY'S APPOINTMENT",
    value: "5",
    hint: (
      <>
        <span className="text-emerald-600">2 completed</span>
        <span className="text-muted-foreground"> • </span>
        <span className="text-orange-500">3 remaining</span>
      </>
    ),
    iconWrapperClass: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Clock,
    label: "PENDING APPOINTMENTS",
    value: "9",
    hint: (
      <span className="text-muted-foreground">2 appointments tomorrow</span>
    ),
    iconWrapperClass: "bg-orange-50 text-orange-500",
  },
];

const TODAY_APPOINTMENTS = [
  {
    id: 1,
    time: "12:00",
    name: "Emeka Bello",
    type: "Video Consultation",
    duration: "1 hour",
    tags: ["Video", "Pending"],
  },
  {
    id: 2,
    time: "13:00",
    name: "Fatima Khan",
    type: "Video Consultation",
    duration: "2 hours",
    tags: ["Video", "Pending"],
  },
  {
    id: 3,
    time: "15:00",
    name: "Raj Patel",
    type: "Chat Consultation",
    duration: "1 hour",
    tags: ["Chat", "Pending"],
  },
];

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

export default function MedicalProfessionalDashboard() {
  return (
    <div className="max-w-content mx-auto w-full">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 space-y-6">
          {/* 1. Top Stats Grid */}
          <div className="grid gap-6 sm:grid-cols-3">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
              >
                <div className="flex items-center justify-between pb-2">
                  <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    {stat.label}
                  </p>
                  <div
                    className={cn("rounded-lg p-1.5", stat.iconWrapperClass)}
                  >
                    <stat.icon className="size-4" strokeWidth={1.5} />
                  </div>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <div className="mt-1 text-xs">{stat.hint}</div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">
                TODAY&apos;S APPOINTMENT{" "}
                <span className="text-muted-foreground font-normal">
                  • 5 Appointments
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
                    <div className="flex items-start gap-6">
                      <div className="text-muted-foreground flex w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-gray-100 py-2.5 text-sm leading-tight font-medium">
                        <span>{hour}</span>
                        <span>{minute}</span>
                      </div>
                      <div>
                        <p className="text-foreground text-base font-medium">
                          {apt.name}
                        </p>
                        <p className="text-muted-foreground mt-0.5 text-sm">
                          {apt.type} • {apt.duration}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={cn(
                          "rounded-full border px-2.5 py-0.5 text-xs font-medium",
                          apt.tags[0] === "Chat"
                            ? "border-indigo-100 bg-indigo-50 text-indigo-600"
                            : "border-blue-100 bg-blue-50 text-blue-600"
                        )}
                      >
                        {apt.tags[0]}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="rounded-full border-orange-100 bg-orange-50 text-orange-500 hover:bg-orange-100"
                      >
                        {apt.tags[1]}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </div>

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
                <div
                  key={req.initials}
                  className="flex items-center justify-between"
                >
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
                      <p className="text-muted-foreground text-xs">
                        {req.type}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {req.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex size-8 items-center justify-center rounded-full border border-blue-600 bg-white text-blue-600 shadow-none transition-colors hover:bg-blue-50">
                      <Check size={16} strokeWidth={2.5} />
                    </button>
                    <button className="flex size-8 items-center justify-center rounded-full border border-red-500 bg-white text-red-500 shadow-none transition-colors hover:bg-red-50">
                      <X size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              ))}
            </CardContent>
          </div>
        </div>

        <div className="w-full shrink-0 space-y-6 lg:w-85">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <CardHeader className="px-0 pt-0 pb-4">
              <CardTitle className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
                NEXT APPOINTMENT
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-0 pb-0">
              <div className="flex flex-col items-center text-center">
                <Avatar className="mb-3 size-20 border-none bg-[#3F4448]">
                  <AvatarFallback className="text-3xl font-medium text-white">
                    EB
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold">Emeka Bello</h3>
                <p className="text-muted-foreground text-sm">
                  Video Consultation
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-y border-gray-100 py-2 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs font-medium">
                    Age
                  </p>
                  <p className="font-medium">35</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium">
                    Sex
                  </p>
                  <p className="font-medium">Male</p>
                </div>
                <div className="col-span-1">
                  <p className="text-muted-foreground text-xs font-medium">
                    Last Appointment
                  </p>
                  <p className="font-medium">First Timer</p>
                </div>
                <div className="col-span-1">
                  <p className="text-muted-foreground text-xs font-medium">
                    Date Registered
                  </p>
                  <p className="font-medium">15th March, 2026</p>
                </div>
              </div>

              <button className="mt-2 w-full rounded-lg bg-blue-600 py-2.5 font-medium text-white transition-colors hover:bg-blue-700">
                Join Consultation
              </button>

              <div className="text-muted-foreground mt-4 flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-2.5 text-sm">
                <Mail size={16} />
                <span>emekabello@gmail.com</span>
              </div>
            </CardContent>
          </div>

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
                    <p className="text-sm leading-snug text-gray-900">
                      {item.text}
                    </p>
                    <p className="text-muted-foreground text-xs">{item.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </div>
        </div>
      </div>
    </div>
  );
}
