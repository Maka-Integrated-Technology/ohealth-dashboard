import { delay, http, HttpResponse } from "msw";
import type {
  Consultation,
  Patient,
  PatientDetail,
  PatientNote,
  PatientsResponse,
} from "~/features/patients/types";

const patients: Patient[] = [
  {
    id: "pat-001",
    patientCode: "#HB-00398",
    name: "Kofi Agyemang",
    initials: "KA",
    age: 34,
    gender: "Male",
    condition: "Asthma",
    lastVisit: "Feb 28, 2025",
    registered: "Dec 1, 2025",
    allergy: "Penicillin",
  },
  {
    id: "pat-002",
    patientCode: "#HB-00376",
    name: "Fatima Ndiaye",
    initials: "FN",
    age: 29,
    gender: "Female",
    condition: "Migraine, Anxiety",
    lastVisit: "Feb 14, 2025",
    registered: "Jan 3, 2025",
  },
  {
    id: "pat-003",
    patientCode: "#HB-00341",
    name: "Emeka Bello",
    initials: "EB",
    age: 35,
    gender: "Male",
    condition: "Post-op Recovery",
    lastVisit: "Jan 30, 2025",
    registered: "15th March, 2026",
  },
  {
    id: "pat-004",
    patientCode: "#HB-00289",
    name: "Aisha Mohammed",
    initials: "AM",
    age: 41,
    gender: "Female",
    condition: "Thyroid Disorder",
    lastVisit: "Jan 10, 2025",
    registered: "10th Feb, 2025",
  },
  {
    id: "pat-005",
    patientCode: "#HB-00254",
    name: "Oluwaseun Taiwo",
    initials: "OT",
    age: 47,
    gender: "Male",
    condition: "Diabetes Type 2",
    lastVisit: "Dec 20, 2024",
    registered: "4th Nov, 2024",
  },
  {
    id: "pat-006",
    patientCode: "#HB-00198",
    name: "Grace Okonkwo",
    initials: "GO",
    age: 29,
    gender: "Female",
    condition: "Hypertension",
    lastVisit: "Nov 5, 2024",
    registered: "3rd Oct, 2024",
  },
  {
    id: "pat-007",
    patientCode: "#HB-00187",
    name: "Michael Obi",
    initials: "MO",
    age: 46,
    gender: "Male",
    condition: "Post-op Recovery",
    lastVisit: "Oct 18, 2024",
    registered: "9th Sept, 2024",
  },
  {
    id: "pat-008",
    patientCode: "#HB-00165",
    name: "Blessing Eze",
    initials: "BE",
    age: 22,
    gender: "Female",
    condition: "Anxiety",
    lastVisit: "Sept 30, 2024",
    registered: "1st Aug, 2024",
  },
  {
    id: "pat-009",
    patientCode: "#HB-00142",
    name: "Tunde Bakare",
    initials: "TB",
    age: 51,
    gender: "Male",
    condition: "Hypertension",
    lastVisit: "Aug 22, 2024",
    registered: "20th July, 2024",
  },
];

const patientDetails: Record<string, PatientDetail> = {
  "pat-001": {
    id: "pat-001",
    patientCode: "#HB-00398",
    name: "Kofi Agyemang",
    initials: "KA",
    age: 34,
    gender: "Male",
    condition: "Asthma",
    lastVisit: "Mar 3, 2026",
    registered: "Dec 1, 2025",
    allergy: "Penicillin",
    fullName: "Kofi Agyemang",
    dateOfBirth: "14 August 1992",
    email: "kofiagyemang@gmail.com",
    heightCm: 168,
    weightKg: 70,
    bloodGroup: "O Positive (O+)",
    genotype: "AS",
    conditions: "Asthma",
    allergies: "Penicillin",
  },
};

const consultationsByPatient: Record<string, Consultation[]> = {
  "pat-001": [
    {
      id: "cons-1",
      date: "15 MAR 2026",
      type: "Chat",
      dayLabel: "Thu, 15 • 2:00 PM",
      summary:
        "Patient reports recurring headaches over the past two weeks, especially in the evenings. Advised to reduce screen time and improve hydration.",
    },
    {
      id: "cons-2",
      date: "14 MAR 2026",
      type: "Video",
      dayLabel: "Wed, 14 • 10:30 AM",
      summary:
        "Patient experiencing mild anxiety related to work stress. Suggested relaxation techniques and follow-up if symptoms persist.",
    },
    {
      id: "cons-3",
      date: "14 MAR 2026",
      type: "Video",
      dayLabel: "Wed, 14 • 10:30 AM",
      summary:
        "Patient experiencing mild anxiety related to work stress. Suggested relaxation techniques and follow-up if symptoms persist.",
    },
    {
      id: "cons-4",
      date: "14 MAR 2026",
      type: "Video",
      dayLabel: "Wed, 14 • 10:30 AM",
      summary:
        "Patient experiencing mild anxiety related to work stress. Suggested relaxation techniques and follow-up if symptoms persist.",
    },
    {
      id: "cons-5",
      date: "14 MAR 2026",
      type: "Video",
      dayLabel: "Wed, 14 • 10:30 AM",
      summary:
        "Patient experiencing mild anxiety related to work stress. Suggested relaxation techniques and follow-up if symptoms persist.",
    },
    {
      id: "cons-6",
      date: "14 MAR 2026",
      type: "Video",
      dayLabel: "Wed, 14 • 10:30 AM",
      summary:
        "Patient experiencing mild anxiety related to work stress. Suggested relaxation techniques and follow-up if symptoms persist.",
    },
    {
      id: "cons-7",
      date: "14 MAR 2026",
      type: "Video",
      dayLabel: "Wed, 14 • 10:30 AM",
      summary:
        "Patient experiencing mild anxiety related to work stress. Suggested relaxation techniques and follow-up if symptoms persist.",
    },
  ],
};

const notesByPatient: Record<string, PatientNote[]> = {
  "pat-001": [
    {
      id: "note-1",
      date: "Mar 3, 2026",
      text: "Patient reports recurring headaches over the past two weeks, especially in the evenings. Advised to reduce screen time and improve hydration.",
    },
    {
      id: "note-2",
      date: "Feb 21, 2026",
      text: "Blood pressure slightly elevated during consultation. Recommended regular monitoring and lifestyle adjustments.",
    },
    {
      id: "note-3",
      date: "Feb 10, 2026",
      text: "Patient experiencing mild anxiety related to work stress. Suggested relaxation techniques and follow-up if symptoms persist.",
    },
    {
      id: "note-4",
      date: "Feb 11, 2026",
      text: "Patient reported improvement in anxiety symptoms. Introduced mindfulness exercises for daily practice.",
    },
    {
      id: "note-5",
      date: "Feb 12, 2026",
      text: "Follow-up visit. Patient expressed increased confidence in managing stress. Discussed coping strategies.",
    },
    {
      id: "note-6",
      date: "Feb 13, 2026",
      text: "Patient experiencing mild headaches due to stress. Recommended hydration and regular breaks during work.",
    },
    {
      id: "note-7",
      date: "Feb 14, 2026",
      text: "Patient reported headaches subsiding. Continued emphasis on relaxation techniques and monitoring overall well-being.",
    },
  ],
};

const MOCK_NETWORK_DELAY_MS = 500;

export const patientsHandlers = [
  http.get("/api/patients", async ({ request }) => {
    await delay(MOCK_NETWORK_DELAY_MS);

    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.toLowerCase() ?? "";
    const page = Number(url.searchParams.get("page") ?? "1");
    const pageSize = Number(url.searchParams.get("pageSize") ?? "9");

    let filtered = patients;
    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.patientCode.toLowerCase().includes(search) ||
          p.condition.toLowerCase().includes(search)
      );
    }

    const start = (page - 1) * pageSize;
    const paged = filtered.slice(start, start + pageSize);

    return HttpResponse.json<PatientsResponse>({
      data: paged,
      total: 121, // matches the design's stated total patient count
      page,
      pageSize,
    });
  }),

  http.get("/api/patients/:id", async ({ params }) => {
    await delay(MOCK_NETWORK_DELAY_MS);
    const detail = patientDetails[params.id as string];
    if (!detail) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(detail);
  }),

  http.get("/api/patients/:id/consultations", async ({ params }) => {
    await delay(MOCK_NETWORK_DELAY_MS);
    const consultations = consultationsByPatient[params.id as string] ?? [];
    return HttpResponse.json(consultations);
  }),

  http.get("/api/patients/:id/notes", async ({ params }) => {
    await delay(MOCK_NETWORK_DELAY_MS);
    const notes = notesByPatient[params.id as string] ?? [];
    return HttpResponse.json(notes);
  }),
];