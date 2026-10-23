export type HospitalPatientRecord = {
  id: string;
  initials: string;
  patient: string;
  detail: string;
  lastAppointment: string;
  doctor: string;
  department: string;
  nextAppointment: string;
};

// Figma preview data only. These are not live patient records.
export const hospitalPatientRecords: HospitalPatientRecord[] = [
  {
    id: "john-doe",
    initials: "JD",
    patient: "John Doe",
    detail: "45y · Male",
    lastAppointment: "2024-11-15",
    doctor: "Dr. Sarah Chen",
    department: "Cardiology",
    nextAppointment: "2024-12-20",
  },
  {
    id: "maria-santos",
    initials: "MS",
    patient: "Maria Santos",
    detail: "32y · Female",
    lastAppointment: "2024-12-01",
    doctor: "Dr. Emily Rodriguez",
    department: "Pediatrics",
    nextAppointment: "2024-12-20",
  },
  {
    id: "david-lee",
    initials: "DL",
    patient: "David Lee",
    detail: "67y · Male",
    lastAppointment: "2024-11-28",
    doctor: "Dr. Michael Patel",
    department: "Orthopedics",
    nextAppointment: "2024-12-21",
  },
  {
    id: "sarah-johnson",
    initials: "SJ",
    patient: "Sarah Johnson",
    detail: "28y · Female",
    lastAppointment: "2024-12-10",
    doctor: "Dr. Robert Kim",
    department: "General Medicine",
    nextAppointment: "None",
  },
  {
    id: "ahmed-hassan",
    initials: "AH",
    patient: "Ahmed Hassan",
    detail: "54y · Male",
    lastAppointment: "2024-12-05",
    doctor: "Dr. Sarah Chen",
    department: "Cardiology",
    nextAppointment: "2024-12-22",
  },
  {
    id: "emma-williams",
    initials: "EW",
    patient: "Emma Williams",
    detail: "39y · Female",
    lastAppointment: "2024-11-20",
    doctor: "Dr. Sarah Chen",
    department: "Cardiology",
    nextAppointment: "2024-12-20",
  },
  {
    id: "carlos-martinez",
    initials: "CM",
    patient: "Carlos Martinez",
    detail: "71y · Male",
    lastAppointment: "2024-12-08",
    doctor: "Dr. Emily Rodriguez",
    department: "Pediatrics",
    nextAppointment: "2024-12-23",
  },
  {
    id: "priya-sharma",
    initials: "PS",
    patient: "Priya Sharma",
    detail: "23y · Female",
    lastAppointment: "2024-12-12",
    doctor: "Dr. Aisha Thompson",
    department: "Dermatology",
    nextAppointment: "2024-12-20",
  },
];
