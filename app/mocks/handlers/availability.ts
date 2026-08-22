import { delay, http, HttpResponse } from "msw";
import type {
  AvailabilityAppointment,
  DaySchedule,
  WeeklySchedule,
  WeekDay,
} from "~/features/availability/types";

let weeklySchedule: WeeklySchedule = {
  days: [
    {
      day: "Mon",
      available: true,
      periods: [
        { id: "p-mon-1", from: "09:00", to: "12:00" },
        { id: "p-mon-2", from: "13:00", to: "17:00" },
      ],
    },
    {
      day: "Tue",
      available: true,
      periods: [{ id: "p-tue-1", from: "13:00", to: "17:00" }],
    },
    { day: "Wed", available: false, periods: [] },
    {
      day: "Thu",
      available: true,
      periods: [
        { id: "p-thu-1", from: "09:00", to: "12:00" },
        { id: "p-thu-2", from: "13:00", to: "17:00" },
      ],
    },
    {
      day: "Fri",
      available: true,
      periods: [{ id: "p-fri-1", from: "09:00", to: "12:00" }],
    },
    { day: "Sat", available: false, periods: [] },
    { day: "Sun", available: false, periods: [] },
  ],
};

const appointments: AvailabilityAppointment[] = [
  {
    id: "avail-apt-1",
    patientName: "Amara Okafor",
    startsAt: new Date("2026-05-25T09:00:00").toISOString(),
    endsAt: new Date("2026-05-25T09:45:00").toISOString(),
    consultationType: "Video",
    status: "confirmed",
  },
  {
    id: "avail-apt-2",
    patientName: "James Whitfield",
    startsAt: new Date("2026-05-27T11:00:00").toISOString(),
    endsAt: new Date("2026-05-27T11:45:00").toISOString(),
    consultationType: "Chat",
    status: "pending",
  },
  {
    id: "avail-apt-3",
    patientName: "Fatima Hassan",
    startsAt: new Date("2026-05-29T09:00:00").toISOString(),
    endsAt: new Date("2026-05-29T09:45:00").toISOString(),
    consultationType: "In-Person",
    status: "cancelled",
  },
  {
    id: "avail-apt-4",
    patientName: "Amara Okafor",
    startsAt: new Date("2026-06-02T09:00:00").toISOString(),
    endsAt: new Date("2026-06-02T09:45:00").toISOString(),
    consultationType: "Video",
    status: "confirmed",
  },
  {
    id: "avail-apt-5",
    patientName: "Amara Okafor",
    startsAt: new Date("2026-06-12T09:00:00").toISOString(),
    endsAt: new Date("2026-06-12T09:45:00").toISOString(),
    consultationType: "Video",
    status: "confirmed",
  },
  {
    id: "avail-apt-6",
    patientName: "James Whitfield",
    startsAt: new Date("2026-06-16T14:00:00").toISOString(),
    endsAt: new Date("2026-06-16T14:45:00").toISOString(),
    consultationType: "Chat",
    status: "pending",
  },
  {
    id: "avail-apt-7",
    patientName: "Fatima Hassan",
    startsAt: new Date("2026-06-21T09:00:00").toISOString(),
    endsAt: new Date("2026-06-21T09:45:00").toISOString(),
    consultationType: "In-Person",
    status: "cancelled",
  },
  {
    id: "avail-apt-8",
    patientName: "Amara Okafor",
    startsAt: new Date("2026-06-23T09:00:00").toISOString(),
    endsAt: new Date("2026-06-23T09:45:00").toISOString(),
    consultationType: "Video",
    status: "confirmed",
  },
  {
    id: "avail-apt-9",
    patientName: "Fatima Hassan",
    startsAt: new Date("2026-06-31T09:00:00").toISOString(),
    endsAt: new Date("2026-06-31T09:45:00").toISOString(),
    consultationType: "In-Person",
    status: "cancelled",
  },
];

const MOCK_NETWORK_DELAY_MS = 500;

export const availabilityHandlers = [
  http.get("/api/availability/schedule", async () => {
    await delay(MOCK_NETWORK_DELAY_MS);
    return HttpResponse.json(weeklySchedule);
  }),

  http.put("/api/availability/schedule/:day", async ({ request }) => {
    await delay(MOCK_NETWORK_DELAY_MS);
    const body = (await request.json()) as {
      day: WeekDay;
      available: boolean;
      periods: { from: string; to: string }[];
      copyToDays?: WeekDay[];
    };

    const targetDays = [body.day, ...(body.copyToDays ?? [])];

    weeklySchedule = {
      days: weeklySchedule.days.map((d): DaySchedule => {
        if (!targetDays.includes(d.day)) return d;
        return {
          day: d.day,
          available: body.available,
          periods: body.periods.map((p, i) => ({
            id: `p-${d.day.toLowerCase()}-${i}`,
            from: p.from,
            to: p.to,
          })),
        };
      }),
    };

    return HttpResponse.json({ success: true });
  }),

  http.get("/api/availability/appointments", async ({ request }) => {
    await delay(MOCK_NETWORK_DELAY_MS);

    const url = new URL(request.url);
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");

    let filtered = appointments;
    if (from && to) {
      const fromTime = new Date(from).getTime();
      const toTime = new Date(to).getTime();
      filtered = filtered.filter((apt) => {
        const startTime = new Date(apt.startsAt).getTime();
        return startTime >= fromTime && startTime <= toTime;
      });
    }

    return HttpResponse.json(filtered);
  }),
];