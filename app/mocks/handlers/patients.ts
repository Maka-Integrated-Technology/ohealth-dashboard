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
  "pat-002": {
    id: "pat-002",
    patientCode: "#HB-00376",
    name: "Fatima Ndiaye",
    initials: "FN",
    age: 29,
    gender: "Female",
    condition: "Migraine, Anxiety",
    lastVisit: "Feb 14, 2025",
    registered: "Jan 3, 2025",
    fullName: "Fatima Ndiaye",
    dateOfBirth: "3 June 1997",
    email: "fatimandiaye@gmail.com",
    heightCm: 162,
    weightKg: 58,
    bloodGroup: "A Positive (A+)",
    genotype: "AA",
    conditions: "Migraine, Anxiety",
    allergies: "None reported",
  },
  "pat-003": {
    id: "pat-003",
    patientCode: "#HB-00341",
    name: "Emeka Bello",
    initials: "EB",
    age: 35,
    gender: "Male",
    condition: "Post-op Recovery",
    lastVisit: "Jan 30, 2025",
    registered: "15th March, 2026",
    fullName: "Emeka Bello",
    dateOfBirth: "22 September 1990",
    email: "emekabello@gmail.com",
    heightCm: 175,
    weightKg: 82,
    bloodGroup: "O Positive (O+)",
    genotype: "AS",
    conditions: "Post-op Recovery",
    allergies: "Latex",
  },
  "pat-004": {
    id: "pat-004",
    patientCode: "#HB-00289",
    name: "Aisha Mohammed",
    initials: "AM",
    age: 41,
    gender: "Female",
    condition: "Thyroid Disorder",
    lastVisit: "Jan 10, 2025",
    registered: "10th Feb, 2025",
    fullName: "Aisha Mohammed",
    dateOfBirth: "12 April 1984",
    email: "aishamohammed@gmail.com",
    heightCm: 160,
    weightKg: 65,
    bloodGroup: "B Positive (B+)",
    genotype: "AA",
    conditions: "Thyroid Disorder",
    allergies: "None reported",
  },
  "pat-005": {
    id: "pat-005",
    patientCode: "#HB-00254",
    name: "Oluwaseun Taiwo",
    initials: "OT",
    age: 47,
    gender: "Male",
    condition: "Diabetes Type 2",
    lastVisit: "Dec 20, 2024",
    registered: "4th Nov, 2024",
    fullName: "Oluwaseun Taiwo",
    dateOfBirth: "8 January 1978",
    email: "oluwaseuntaiwo@gmail.com",
    heightCm: 178,
    weightKg: 90,
    bloodGroup: "AB Positive (AB+)",
    genotype: "AS",
    conditions: "Diabetes Type 2",
    allergies: "Sulfa drugs",
  },
  "pat-006": {
    id: "pat-006",
    patientCode: "#HB-00198",
    name: "Grace Okonkwo",
    initials: "GO",
    age: 29,
    gender: "Female",
    condition: "Hypertension",
    lastVisit: "Nov 5, 2024",
    registered: "3rd Oct, 2024",
    fullName: "Grace Okonkwo",
    dateOfBirth: "19 May 1996",
    email: "graceokonkwo@gmail.com",
    heightCm: 165,
    weightKg: 60,
    bloodGroup: "O Negative (O-)",
    genotype: "AA",
    conditions: "Hypertension",
    allergies: "None reported",
  },
  "pat-007": {
    id: "pat-007",
    patientCode: "#HB-00187",
    name: "Michael Obi",
    initials: "MO",
    age: 46,
    gender: "Male",
    condition: "Post-op Recovery",
    lastVisit: "Oct 18, 2024",
    registered: "9th Sept, 2024",
    fullName: "Michael Obi",
    dateOfBirth: "2 December 1979",
    email: "michaelobi@gmail.com",
    heightCm: 180,
    weightKg: 88,
    bloodGroup: "A Negative (A-)",
    genotype: "AS",
    conditions: "Post-op Recovery",
    allergies: "None reported",
  },
  "pat-008": {
    id: "pat-008",
    patientCode: "#HB-00165",
    name: "Blessing Eze",
    initials: "BE",
    age: 22,
    gender: "Female",
    condition: "Anxiety",
    lastVisit: "Sept 30, 2024",
    registered: "1st Aug, 2024",
    fullName: "Blessing Eze",
    dateOfBirth: "27 July 2003",
    email: "blessingeze@gmail.com",
    heightCm: 158,
    weightKg: 54,
    bloodGroup: "B Negative (B-)",
    genotype: "AA",
    conditions: "Anxiety",
    allergies: "None reported",
  },
  "pat-009": {
    id: "pat-009",
    patientCode: "#HB-00142",
    name: "Tunde Bakare",
    initials: "TB",
    age: 51,
    gender: "Male",
    condition: "Hypertension",
    lastVisit: "Aug 22, 2024",
    registered: "20th July, 2024",
    fullName: "Tunde Bakare",
    dateOfBirth: "30 March 1975",
    email: "tundebakare@gmail.com",
    heightCm: 172,
    weightKg: 85,
    bloodGroup: "O Positive (O+)",
    genotype: "AS",
    conditions: "Hypertension",
    allergies: "Aspirin",
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
  ],
  "pat-002": [
    {
      id: "cons-1",
      date: "14 FEB 2025",
      type: "Video",
      dayLabel: "Fri, 14 • 11:00 AM",
      summary:
        "Patient reported recurring migraine episodes, 2-3 times per week. Discussed trigger avoidance and prescribed preventive medication.",
    },
    {
      id: "cons-2",
      date: "20 JAN 2025",
      type: "Chat",
      dayLabel: "Mon, 20 • 9:15 AM",
      summary:
        "Follow-up on anxiety management. Patient reports improved sleep quality since starting evening relaxation routine.",
    },
  ],
  "pat-003": [
    {
      id: "cons-1",
      date: "30 JAN 2025",
      type: "Video",
      dayLabel: "Thu, 30 • 3:00 PM",
      summary:
        "Post-operative check-up. Incision healing well, no signs of infection. Cleared for light activity.",
    },
    {
      id: "cons-2",
      date: "16 JAN 2025",
      type: "Video",
      dayLabel: "Thu, 16 • 10:00 AM",
      summary:
        "First post-op review. Advised on wound care and pain management schedule.",
    },
  ],
  "pat-004": [
    {
      id: "cons-1",
      date: "10 JAN 2025",
      type: "Video",
      dayLabel: "Fri, 10 • 1:30 PM",
      summary:
        "Reviewed latest thyroid panel results. Adjusted levothyroxine dosage slightly upward.",
    },
  ],
  "pat-005": [
    {
      id: "cons-1",
      date: "20 DEC 2024",
      type: "Chat",
      dayLabel: "Fri, 20 • 4:00 PM",
      summary:
        "Blood glucose levels reviewed, trending stable. Reinforced dietary guidance and continued current medication regimen.",
    },
    {
      id: "cons-2",
      date: "5 DEC 2024",
      type: "Video",
      dayLabel: "Thu, 5 • 9:00 AM",
      summary:
        "Routine diabetes check-in. HbA1c slightly improved from last quarter.",
    },
  ],
  "pat-006": [
    {
      id: "cons-1",
      date: "5 NOV 2024",
      type: "Video",
      dayLabel: "Tue, 5 • 2:30 PM",
      summary:
        "Blood pressure readings stable on current medication. Advised to continue low-sodium diet.",
    },
  ],
  "pat-007": [
    {
      id: "cons-1",
      date: "18 OCT 2024",
      type: "Video",
      dayLabel: "Fri, 18 • 11:45 AM",
      summary:
        "Six-week post-op follow-up. Full recovery progressing as expected, no restrictions remaining.",
    },
  ],
  "pat-008": [
    {
      id: "cons-1",
      date: "30 SEP 2024",
      type: "Chat",
      dayLabel: "Mon, 30 • 5:00 PM",
      summary:
        "Patient reports reduced anxiety symptoms with current coping strategies. Continuing weekly check-ins.",
    },
  ],
  "pat-009": [
    {
      id: "cons-1",
      date: "22 AUG 2024",
      type: "Video",
      dayLabel: "Thu, 22 • 8:30 AM",
      summary:
        "Hypertension well-controlled. Continued current medication, scheduled routine follow-up in 3 months.",
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
  ],
  "pat-002": [
    {
      id: "note-1",
      date: "Feb 14, 2025",
      text: "Migraine frequency remains high. Started preventive medication trial, review in 4 weeks.",
    },
    {
      id: "note-2",
      date: "Jan 20, 2025",
      text: "Anxiety symptoms improving with evening routine. Continue current approach.",
    },
  ],
  "pat-003": [
    {
      id: "note-1",
      date: "Jan 30, 2025",
      text: "Incision site healthy, no signs of infection. Cleared for light activity starting next week.",
    },
  ],
  "pat-004": [
    {
      id: "note-1",
      date: "Jan 10, 2025",
      text: "Levothyroxine dosage adjusted from 75mcg to 88mcg. Recheck TSH levels in 6 weeks.",
    },
  ],
  "pat-005": [
    {
      id: "note-1",
      date: "Dec 20, 2024",
      text: "HbA1c improved to 6.8% from 7.2% last quarter. Continue current metformin dosage.",
    },
  ],
  "pat-006": [
    {
      id: "note-1",
      date: "Nov 5, 2024",
      text: "Blood pressure stable at 128/82. Continue lisinopril, reinforce low-sodium diet.",
    },
  ],
  "pat-007": [
    {
      id: "note-1",
      date: "Oct 18, 2024",
      text: "Full post-op recovery confirmed. No further restrictions, discharged from active monitoring.",
    },
  ],
  "pat-008": [
    {
      id: "note-1",
      date: "Sept 30, 2024",
      text: "Anxiety symptoms significantly reduced. Patient managing well with breathing exercises and journaling.",
    },
  ],
  "pat-009": [
    {
      id: "note-1",
      date: "Aug 22, 2024",
      text: "Hypertension well-controlled on amlodipine. Routine follow-up scheduled for November.",
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
      total: 121,
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
