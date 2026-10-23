export type AppointmentStatus =
  | "Pending"
  | "Confirmed"
  | "Rescheduled"
  | "Cancelled"
  | "Arrived"
  | "Completed";

export type PaymentStatus = "Paid" | "Unpaid";

export type PreviewAppointment = {
  id: string;
  initials: string;
  patient: string;
  detail: string;
  doctor: string;
  department: string;
  type: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  payment: PaymentStatus;
  phone?: string;
  bloodGroup?: string;
};

// Figma reference records only. Status edits on this screen do not call the API.
export const appointmentSamples: PreviewAppointment[] = [
  {
    id: "APT-2041",
    initials: "JD",
    patient: "John Doe",
    detail: "45y · Male",
    doctor: "Dr. Sarah Chen",
    department: "Cardiology",
    type: "Consultation",
    date: "2024-12-20",
    time: "09:00 AM",
    status: "Confirmed",
    payment: "Paid",
  },
  {
    id: "APT-2042",
    initials: "MS",
    patient: "Maria Santos",
    detail: "32y · Female",
    doctor: "Dr. Emily Rodriguez",
    department: "Pediatrics",
    type: "Follow-up",
    date: "2024-12-20",
    time: "10:30 AM",
    status: "Pending",
    payment: "Unpaid",
    phone: "0912345678",
    bloodGroup: "O+",
  },
  {
    id: "APT-2043",
    initials: "DL",
    patient: "David Lee",
    detail: "67y · Male",
    doctor: "Dr. James Wilson",
    department: "Neurology",
    type: "Consultation",
    date: "2024-12-20",
    time: "11:00 AM",
    status: "Arrived",
    payment: "Paid",
  },
  {
    id: "APT-2044",
    initials: "EW",
    patient: "Emma Williams",
    detail: "39y · Female",
    doctor: "Dr. Sarah Chen",
    department: "Cardiology",
    type: "Check-up",
    date: "2024-12-20",
    time: "01:00 PM",
    status: "Pending",
    payment: "Unpaid",
  },
  {
    id: "APT-2045",
    initials: "AH",
    patient: "Ahmed Hassan",
    detail: "54y · Male",
    doctor: "Dr. Michael Patel",
    department: "Orthopedics",
    type: "Procedure",
    date: "2024-12-20",
    time: "02:30 PM",
    status: "Confirmed",
    payment: "Paid",
  },
  {
    id: "APT-2046",
    initials: "PS",
    patient: "Priya Sharma",
    detail: "23y · Female",
    doctor: "Dr. Aisha Thompson",
    department: "Dermatology",
    type: "Consultation",
    date: "2024-12-20",
    time: "03:00 PM",
    status: "Rescheduled",
    payment: "Unpaid",
  },
  {
    id: "APT-2047",
    initials: "SJ",
    patient: "Sarah Johnson",
    detail: "28y · Female",
    doctor: "Dr. Robert Kim",
    department: "General Medicine",
    type: "Consultation",
    date: "2024-12-20",
    time: "04:00 PM",
    status: "Cancelled",
    payment: "Unpaid",
  },
  {
    id: "APT-2048",
    initials: "CM",
    patient: "Carlos Martinez",
    detail: "71y · Male",
    doctor: "Dr. James Wilson",
    department: "Neurology",
    type: "Follow-up",
    date: "2024-12-20",
    time: "04:30 PM",
    status: "Completed",
    payment: "Paid",
  },
];
