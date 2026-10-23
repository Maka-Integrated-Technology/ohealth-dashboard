export type BookingStatus =
  | "Booking Received"
  | "Confirmed"
  | "Checked In"
  | "Sample Collected"
  | "Test In Progress"
  | "Results Ready"
  | "Completed"
  | "Cancelled"
  | "Rescheduled";

export type Booking = {
  id: string;
  patient: string;
  patientId: string;
  test: string;
  category: string;
  date: string;
  time: string;
  status: BookingStatus;
  staff: string;
  phone: string;
  email: string;
  notes: string;
  created: string;
  upcoming: boolean;
};

const initialContact = {
  phone: "+234 812 345 6789",
  email: "adaeze.o@email.com",
  notes: "Patient is fasting. First-time visit.",
  created: "11 Sept, 15:32",
};

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "BK-2025-0841",
    patient: "Adaeze Okonkwo",
    patientId: "PT-10042",
    test: "Complete Blood Count (CBC)",
    category: "Blood Tests",
    date: "13 Sept 2025",
    time: "09:00 AM",
    status: "Confirmed",
    staff: "Dr. Chiamaka Eze",
    ...initialContact,
    upcoming: false,
  },
  {
    id: "BK-2025-0842",
    patient: "Emeka Nwosu",
    patientId: "PT-10043",
    test: "Hepatitis B Surface Antigen",
    category: "Infectious Disease Tests",
    date: "13 Sept 2025",
    time: "09:30 AM",
    status: "Checked In",
    staff: "Nurse Kelechi Obi",
    phone: "—",
    email: "—",
    notes: "Not specified in the reference.",
    created: "—",
    upcoming: false,
  },
  {
    id: "BK-2025-0843",
    patient: "Fatima Al-Hassan",
    patientId: "PT-10044",
    test: "Thyroid Function Test (TFT)",
    category: "Hormonal Tests",
    date: "13 Sept 2025",
    time: "10:00 AM",
    status: "Sample Collected",
    staff: "Dr. Chiamaka Eze",
    phone: "—",
    email: "—",
    notes: "Not specified in the reference.",
    created: "—",
    upcoming: false,
  },
  {
    id: "BK-2025-0844",
    patient: "Chidi Okeke",
    patientId: "PT-10045",
    test: "Urinalysis",
    category: "Urinalysis",
    date: "13 Sept 2025",
    time: "10:30 AM",
    status: "Test In Progress",
    staff: "Mr. Babatunde Adisa",
    phone: "—",
    email: "—",
    notes: "Not specified in the reference.",
    created: "—",
    upcoming: false,
  },
  {
    id: "BK-2025-0845",
    patient: "Ngozi Adeyemi",
    patientId: "PT-10046",
    test: "Lipid Profile",
    category: "Blood Tests",
    date: "13 Sept 2025",
    time: "11:00 AM",
    status: "Booking Received",
    staff: "—",
    phone: "—",
    email: "—",
    notes: "Not specified in the reference.",
    created: "—",
    upcoming: true,
  },
  {
    id: "BK-2025-0846",
    patient: "Tunde Bakare",
    patientId: "PT-10047",
    test: "Electrocardiogram (ECG)",
    category: "Cardiology",
    date: "14 Sept 2025",
    time: "08:30 AM",
    status: "Confirmed",
    staff: "Dr. Yetunde Afolabi",
    phone: "—",
    email: "—",
    notes: "Not specified in the reference.",
    created: "—",
    upcoming: true,
  },
  {
    id: "BK-2025-0847",
    patient: "Amina Sule",
    patientId: "PT-10048",
    test: "Malaria Parasite Test",
    category: "Infectious Disease Tests",
    date: "14 Sept 2025",
    time: "09:00 AM",
    status: "Results Ready",
    staff: "Mr. Babatunde Adisa",
    phone: "—",
    email: "—",
    notes: "Not specified in the reference.",
    created: "—",
    upcoming: true,
  },
  {
    id: "BK-2025-0838",
    patient: "Oluwaseun Ojo",
    patientId: "PT-10049",
    test: "Prostate Specific Antigen (PSA)",
    category: "Blood Tests",
    date: "11 Sept 2025",
    time: "09:00 AM",
    status: "Completed",
    staff: "Dr. Chiamaka Eze",
    phone: "—",
    email: "—",
    notes: "Not specified in the reference.",
    created: "—",
    upcoming: false,
  },
  {
    id: "BK-2025-0839",
    patient: "Emeka Nwosu",
    patientId: "PT-10043",
    test: "Blood Sugar (Random)",
    category: "Blood Tests",
    date: "10 Sept 2025",
    time: "14:00",
    status: "Cancelled",
    staff: "—",
    phone: "—",
    email: "—",
    notes: "Not specified in the reference.",
    created: "—",
    upcoming: false,
  },
];

export const LIFECYCLE = [
  "Received",
  "Confirmed",
  "Checked In",
  "Sample Collected",
  "In Progress",
  "Results Ready",
  "Completed",
] as const;

export function lifecycleIndex(status: BookingStatus): number {
  const value: Record<BookingStatus, number> = {
    "Booking Received": 0,
    Confirmed: 1,
    "Checked In": 2,
    "Sample Collected": 3,
    "Test In Progress": 4,
    "Results Ready": 5,
    Completed: 6,
    Cancelled: 0,
    Rescheduled: 1,
  };
  return value[status];
}

export function statusStyle(status: BookingStatus): string {
  switch (status) {
    case "Confirmed":
      return "bg-[#edf3ff] text-[#155eef]";
    case "Checked In":
      return "bg-[#e7f6ff] text-[#0875b5]";
    case "Sample Collected":
      return "bg-[#f2edff] text-[#7139ee]";
    case "Test In Progress":
      return "bg-[#fff5e5] text-[#c45b05]";
    case "Results Ready":
    case "Completed":
      return "bg-[#e5f8ef] text-[#02845f]";
    case "Cancelled":
      return "bg-[#fdecf0] text-[#df1121]";
    case "Rescheduled":
      return "bg-[#fff4e3] text-[#b15c06]";
    default:
      return "bg-[#edf2f8] text-[#415670]";
  }
}

export const CATEGORIES = [
  "Blood Tests",
  "Infectious Disease Tests",
  "Hormonal Tests",
  "Urinalysis",
  "Cardiology",
];
