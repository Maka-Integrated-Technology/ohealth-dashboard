import { delay, http, HttpResponse } from "msw";
import type {
  AppointmentRequest,
  AppointmentRequestsResponse,
  NextAppointment,
  TodayAppointment,
  UpcomingAppointment,
} from "~/features/appointments/types";

const nextAppointment: NextAppointment = {
  id: "apt-001",
  patientId: "pat-001",
  patientName: "Emeka Bello",
  patientInitials: "EB",
  patientEmail: "emekabello@gmail.com",
  patientAge: 35,
  patientSex: "Male",
  consultationType: "Video",
  // starts 38 minutes from now so the countdown shows correctly
  startsAt: new Date(Date.now() + 38 * 60 * 1000).toISOString(),
  endsAt: new Date(Date.now() + 98 * 60 * 1000).toISOString(),
  lastAppointment: "First Timer",
  dateRegistered: "15th March, 2026",
};

const today = new Date();

function todayAt(hours: number, minutes: number) {
  const d = new Date(today);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
}

const todayAppointments: TodayAppointment[] = [
  {
    id: "today-003",
    patientName: "Emeka Bello",
    patientInitials: "EB",
    patientAge: 35,
    patientSex: "Male",
    consultationType: "Video",
    startsAt: todayAt(12, 0),
    endsAt: todayAt(13, 0),
    status: "pending",
    lastAppointment: "First Timer",
    dateRegistered: "15th March, 2026",
    lastConsultationSummary:
      "Patient reported recurring headaches and fatigue over the past week. Advised increased hydration, reduced screen exposure, and adequate rest.",
  },
  {
    id: "today-004",
    patientName: "Fatima Khan",
    patientInitials: "FK",
    patientAge: 27,
    patientSex: "Female",
    consultationType: "Video",
    startsAt: todayAt(13, 0),
    endsAt: todayAt(15, 0),
    status: "pending",
    lastAppointment: "21st March, 2026",
    dateRegistered: "9th Feb, 2026",
    lastConsultationSummary:
      "Patient reported recurring headaches and fatigue over the past week. Advised increased hydration, reduced screen exposure, and adequate rest. Follow-up recommended if symptoms persist.",
  },
  {
    id: "today-005",
    patientName: "Raj Patel",
    patientInitials: "RP",
    patientAge: 41,
    patientSex: "Male",
    consultationType: "Chat",
    startsAt: todayAt(15, 0),
    endsAt: todayAt(16, 0),
    status: "pending",
    lastAppointment: "10th Feb, 2026",
    dateRegistered: "20th Jan, 2026",
  },
];

const upcomingAppointments: UpcomingAppointment[] = [
  {
    id: "up-001",
    patientName: "Ugwu Felicia",
    patientInitials: "UF",
    consultationType: "Video",
    startsAt: new Date("2026-06-14T10:30:00").toISOString(),
    endsAt: new Date("2026-06-14T11:30:00").toISOString(),
    status: "confirmed",
  },
  {
    id: "up-002",
    patientName: "Oladapo Adeniyi",
    patientInitials: "OA",
    consultationType: "Video",
    startsAt: new Date("2026-06-14T14:00:00").toISOString(),
    endsAt: new Date("2026-06-14T15:00:00").toISOString(),
    status: "pending",
  },
  {
    id: "up-003",
    patientName: "John Adams",
    patientInitials: "JA",
    consultationType: "In-Person",
    startsAt: new Date("2026-06-15T13:00:00").toISOString(),
    endsAt: new Date("2026-06-15T15:00:00").toISOString(),
    status: "confirmed",
  },
  {
    id: "up-004",
    patientName: "Sarah Morgan",
    patientInitials: "SM",
    consultationType: "Chat",
    startsAt: new Date("2026-06-16T15:15:00").toISOString(),
    endsAt: new Date("2026-06-16T15:45:00").toISOString(),
    status: "pending",
  },
];

const appointmentRequests: AppointmentRequest[] = [
  {
    id: "req-001",
    patientName: "Ugwu Felicia",
    patientInitials: "UF",
    patientAge: 32,
    patientSex: "Female",
    consultationType: "Video",
    durationMinutes: 60,
    scheduledAt: new Date("2026-06-14T10:30:00").toISOString(),
    lastAppointment: "22nd April, 2026",
    dateRegistered: "4th April, 2026",
    lastConsultationSummary:
      "Patient reported recurring headaches and fatigue over the past week. Advised increased hydration, reduced screen exposure, and adequate rest. Follow-up recommended if symptoms persist.",
  },
  {
    id: "req-002",
    patientName: "Oladapo Adeniyi",
    patientInitials: "OA",
    patientAge: 43,
    patientSex: "Male",
    consultationType: "Video",
    durationMinutes: 60,
    scheduledAt: new Date("2026-06-14T14:00:00").toISOString(),
    lastAppointment: "First Timer",
    dateRegistered: "4th April, 2026",
  },
  {
    id: "req-003",
    patientName: "John Adams",
    patientInitials: "JA",
    patientAge: 38,
    patientSex: "Male",
    consultationType: "In-Person",
    durationMinutes: 120,
    scheduledAt: new Date("2026-06-15T13:00:00").toISOString(),
    lastAppointment: "First Timer",
    dateRegistered: "2nd March, 2026",
  },
  {
    id: "req-004",
    patientName: "Sarah Morgan",
    patientInitials: "SM",
    patientAge: 26,
    patientSex: "Female",
    consultationType: "Chat",
    durationMinutes: 30,
    scheduledAt: new Date("2026-06-16T15:15:00").toISOString(),
    lastAppointment: "10th March, 2026",
    dateRegistered: "1st Feb, 2026",
  },
];

const MOCK_NETWORK_DELAY_MS = 900;

export const appointmentHandlers = [
  http.get("/api/appointments/next", async () => {
    await delay(MOCK_NETWORK_DELAY_MS);
    return HttpResponse.json(nextAppointment);
  }),

  http.get("/api/appointments/today", async () => {
    await delay(MOCK_NETWORK_DELAY_MS);
    return HttpResponse.json(todayAppointments);
  }),

  http.get("/api/appointments/upcoming", async () => {
    await delay(MOCK_NETWORK_DELAY_MS);
    return HttpResponse.json(upcomingAppointments);
  }),

  http.get("/api/appointments/requests", async () => {
    await delay(MOCK_NETWORK_DELAY_MS);
    return HttpResponse.json<AppointmentRequestsResponse>({
      data: appointmentRequests,
      total: 23,
    });
  }),

  http.post("/api/appointments/requests/:id/accept", ({ params }) => {
    console.info(`[MSW] Accepted request ${params.id}`);
    return HttpResponse.json({ success: true });
  }),

  http.post("/api/appointments/requests/:id/reject", ({ params }) => {
    console.info(`[MSW] Rejected request ${params.id}`);
    return HttpResponse.json({ success: true });
  }),
];
