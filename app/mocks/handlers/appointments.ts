import { delay, http, HttpResponse } from "msw";
import type {
  Appointment,
  AppointmentRequest,
  AppointmentRequestsResponse,
  NextAppointment,
  TodayAppointment,
  UpcomingAppointment,
  ConsultationDetail,
} from "~/features/appointments/types";

const appointments: Appointment[] = [
  {
    id: "list-001",
    patientId: "pat-101",
    patientName: "Emeka Bello",
    patientInitials: "EB",
    patientEmail: "emekabello@gmail.com",
    patientAge: 35,
    patientSex: "Male",
    consultationType: "Video",
    startsAt: new Date("2026-06-14T10:30:00").toISOString(),
    endsAt: new Date("2026-06-14T11:30:00").toISOString(),
    reason: "General health checkup",
    status: "confirmed",
    lastAppointment: "First Timer",
    dateRegistered: "15th March, 2026",
  },
  {
    id: "list-002",
    patientId: "pat-102",
    patientName: "James Whitfield",
    patientInitials: "JW",
    patientEmail: "jameswhitfield@gmail.com",
    patientAge: 42,
    patientSex: "Male",
    reason: "Anxiety consultation",
    consultationType: "Chat",
    startsAt: new Date("2026-05-28T10:00:00").toISOString(),
    endsAt: new Date("2026-05-28T10:45:00").toISOString(),
    status: "pending",
    lastAppointment: "First Timer",
    dateRegistered: "15th March, 2026",
  },
  {
    id: "list-003",
    patientId: "pat-103",
    patientName: "Priya Nair",
    patientInitials: "PN",
    patientEmail: "priyanair@gmail.com",
    patientAge: 29,
    patientSex: "Female",
    reason: "Diabetes management",
    consultationType: "Video",
    startsAt: new Date("2026-05-25T11:00:00").toISOString(),
    endsAt: new Date("2026-05-25T12:00:00").toISOString(),
    status: "confirmed",
    lastAppointment: "First Timer",
    dateRegistered: "15th March, 2026",
  },
  {
    id: "list-004",
    patientId: "pat-104",
    patientName: "David Chen",
    patientInitials: "DC",
    patientEmail: "davidchen@gmail.com",
    patientAge: 50,
    patientSex: "Male",
    reason: "Post-op review",
    consultationType: "Video",
    startsAt: new Date("2026-05-25T14:00:00").toISOString(),
    endsAt: new Date("2026-05-25T14:30:00").toISOString(),
    status: "confirmed",
    lastAppointment: "First Timer",
    dateRegistered: "15th March, 2026",
  },
  {
    id: "list-005",
    patientId: "pat-105",
    patientName: "David Chang",
    patientInitials: "DC",
    patientEmail: "davidchang@gmail.com",
    patientAge: 50,
    patientSex: "Male",
    reason: "Post-op review",
    consultationType: "Video",
    startsAt: new Date("2026-05-30T11:00:00").toISOString(),
    endsAt: new Date("2026-05-30T11:45:00").toISOString(),
    status: "confirmed",
    lastAppointment: "First Timer",
    dateRegistered: "15th March, 2026",
  },
  {
    id: "list-006",
    patientId: "pat-106",
    patientName: "Fatima Al-Hassan",
    patientInitials: "FA",
    patientEmail: "fatimaalhassan@gmail.com",
    patientAge: 28,
    patientSex: "Female",
    reason: "Skin rash assessment",
    consultationType: "Chat",
    startsAt: new Date("2026-05-28T13:00:00").toISOString(),
    endsAt: new Date("2026-05-28T13:45:00").toISOString(),
    status: "cancelled",
    lastAppointment: "First Timer",
    dateRegistered: "15th March, 2026",
  },
  {
    id: "list-007",
    patientId: "pat-107",
    patientName: "Fathia Al-Hassan",
    patientInitials: "FA",
    patientEmail: "fathiaalhassan@gmail.com",
    patientAge: 28,
    patientSex: "Female",
    reason: "Skin rash assessment",
    consultationType: "Chat",
    startsAt: new Date("2026-05-30T09:00:00").toISOString(),
    endsAt: new Date("2026-05-30T09:45:00").toISOString(),
    status: "cancelled",
    lastAppointment: "First Timer",
    dateRegistered: "15th March, 2026",
  },
  {
    id: "list-008",
    patientId: "pat-108",
    patientName: "Marcus Reid",
    patientInitials: "MR",
    patientEmail: "marcusreid@gmail.com",
    patientAge: 45,
    patientSex: "Male",
    reason: "Cardiac screening",
    consultationType: "Video",
    startsAt: new Date("2026-05-28T13:00:00").toISOString(),
    endsAt: new Date("2026-05-28T13:45:00").toISOString(),
    status: "completed",
    lastAppointment: "First Timer",
    dateRegistered: "15th March, 2026",
  },
]

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

const consultationDetails: Record<string, ConsultationDetail> = {
  "list-001": {
    id: "list-001",
    patientId: "pat-101",
    patientName: "Emeka Bello",
    patientInitials: "EB",
    patientSex: "Male",
    patientAge: 35,
    condition: "General checkup",
    bloodType: "O+",
    allergies: "None reported",
    lastVisit: "March 15, 2026",
    consultationType: "Video",
    title: "General Health Checkup",
    startsAt: new Date("2026-06-14T10:30:00").toISOString(),
    endsAt: new Date("2026-06-14T11:30:00").toISOString(),
    previousConsultations: [{ label: "First Timer", date: "N/A" }],
  },
};

function getConsultationDetail(id: string): ConsultationDetail | undefined {
  if (consultationDetails[id]) return consultationDetails[id];

  const appointment = appointments.find((apt) => apt.id === id);
  if (!appointment) return undefined;

  return {
    id: appointment.id,
    patientId: appointment.patientId,
    patientName: appointment.patientName,
    patientInitials: appointment.patientInitials,
    patientSex: appointment.patientSex,
    patientAge: appointment.patientAge,
    condition: appointment.reason,
    bloodType: "Not on file",
    allergies: "Not on file",
    lastVisit: appointment.dateRegistered,
    consultationType: appointment.consultationType,
    title: appointment.reason,
    startsAt: appointment.startsAt,
    endsAt: appointment.endsAt,
    previousConsultations: [],
  };
}

export const appointmentHandlers = [
  http.get("/api/appointments", async ({ request }) => {
    await delay(MOCK_NETWORK_DELAY_MS);

    const url = new URL(request.url);
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    const status = url.searchParams.get("status");

    let filteredAppointments = appointments;

    if (from && to) {
      const fromTime = new Date(from).getTime();
      const toTime = new Date(to).getTime();
      filteredAppointments = filteredAppointments.filter((apt) => {
        const startTime = new Date(apt.startsAt).getTime();
        return startTime >= fromTime && startTime <= toTime;
      });
    }

    if (status && status !== "all") {
      filteredAppointments = filteredAppointments.filter(
        (apt) => apt.status === status
      );
    }

    return HttpResponse.json(filteredAppointments);
  }),

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

  http.post("/api/appointments/:id/cancel", async ({ params }) => {
    await delay(MOCK_NETWORK_DELAY_MS);
    const appointment = appointments.find((apt) => apt.id === params.id);
    if (appointment) {
      appointment.status = "cancelled";
    }
    return HttpResponse.json({ success: true });
  }),

  http.get("/api/appointments/:id/consultation", async ({ params }) => {
    await delay(MOCK_NETWORK_DELAY_MS);
    const detail = getConsultationDetail(params.id as string);
    if (!detail) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(detail);
  }),
];
