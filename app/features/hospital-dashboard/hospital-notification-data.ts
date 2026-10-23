export type HospitalNotificationCategory =
  | "Appointments"
  | "Verification"
  | "Laboratory"
  | "Reviews"
  | "Prescriptions"
  | "System"
  | "Patients";
export type NotificationDestination =
  | "Appointments"
  | "Laboratory"
  | "Reviews"
  | "Prescriptions"
  | "Hospital Profile"
  | "Patients";
type HospitalNotification = {
  id: string;
  category: HospitalNotificationCategory;
  title: string;
  time: string;
  description: string;
  action?: string;
  destination?: NotificationDestination;
  unread: boolean;
};

export const hospitalNotificationSamples: HospitalNotification[] = [
  {
    id: "new-appointment",
    category: "Appointments",
    title: "New appointment request",
    time: "5 min ago",
    description:
      "Maria Santos requested a consultation with Pediatrics for Dec 22.",
    action: "Review Request",
    destination: "Appointments",
    unread: true,
  },
  {
    id: "appointment-cancelled",
    category: "Appointments",
    title: "Appointment cancelled",
    time: "42 min ago",
    description:
      "Sarah Johnson cancelled her General Medicine appointment scheduled for today at 4:00 PM.",
    action: "View Details",
    destination: "Appointments",
    unread: true,
  },
  {
    id: "lab-upload",
    category: "Laboratory",
    title: "Lab results ready for upload",
    time: "1 hr ago",
    description:
      "ECG and cardiac marker results for Emma Williams are ready to be uploaded.",
    action: "Upload Results",
    destination: "Laboratory",
    unread: true,
  },
  {
    id: "new-review",
    category: "Reviews",
    title: "New patient review",
    time: "2 hrs ago",
    description:
      "John Doe left a 5-star review for Dr. Sarah Chen in Cardiology.",
    action: "View Review",
    destination: "Reviews",
    unread: true,
  },
  {
    id: "verification-update",
    category: "Verification",
    title: "Verification status updated",
    time: "3 hrs ago",
    description:
      "OHealth has received your submitted documents and is currently reviewing your application.",
    action: "View Status",
    destination: "Hospital Profile",
    unread: false,
  },
  {
    id: "patient-arrived",
    category: "Appointments",
    title: "Patient arrived",
    time: "4 hrs ago",
    description:
      "David Lee has checked in for his Neurology appointment at 11:00 AM.",
    action: "View Appointment",
    destination: "Appointments",
    unread: false,
  },
  {
    id: "prescription-updated",
    category: "Prescriptions",
    title: "Prescription updated",
    time: "5 hrs ago",
    description: "Dr. Wilson updated the prescription for Carlos Martinez.",
    action: "View Prescription",
    destination: "Prescriptions",
    unread: false,
  },
  {
    id: "maintenance",
    category: "System",
    title: "System maintenance scheduled",
    time: "Yesterday",
    description:
      "OHealth will perform scheduled maintenance on Dec 24 from 2:00–4:00 AM. Brief downtime expected.",
    unread: false,
  },
  {
    id: "appointment-rescheduled",
    category: "Appointments",
    title: "Appointment rescheduled",
    time: "Yesterday",
    description:
      "Priya Sharma rescheduled her Dermatology appointment to Dec 22 at 3:00 PM.",
    action: "View Appointment",
    destination: "Appointments",
    unread: false,
  },
  {
    id: "patient-registration",
    category: "Patients",
    title: "New patient registration",
    time: "2 days ago",
    description:
      "Ahmed Hassan has registered on OHealth and booked his first appointment with Orthopedics.",
    action: "View Patient",
    destination: "Patients",
    unread: false,
  },
];
