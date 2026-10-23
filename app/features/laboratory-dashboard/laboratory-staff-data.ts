export const LAB_STAFF_ROLES = [
  "Lab Administrator",
  "Senior Technician",
  "Lab Technician",
  "Phlebotomist",
  "Quality Assurance",
  "Reception",
] as const;

export type LabStaffRole = (typeof LAB_STAFF_ROLES)[number];

export const LAB_STAFF_PERMISSIONS = [
  "View Bookings",
  "Manage Bookings",
  "Check In Patients",
  "Collect Samples",
  "Manage Samples",
  "Upload Results",
  "Review Results",
  "Publish Results",
  "Manage Test Catalogue",
  "Compliance & Audit Access",
  "Staff Management",
  "All Permissions (Admin)",
] as const;

export type LabStaffPermission = (typeof LAB_STAFF_PERMISSIONS)[number];
export type StaffStatus = "Active" | "Inactive" | "Invited";

export type LabStaffMember = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: LabStaffRole;
  status: StaffStatus;
  lastActive: string;
  permissions: LabStaffPermission[];
};

export const INITIAL_LAB_STAFF: LabStaffMember[] = [
  {
    id: "staff-001",
    name: "Dr. Chiamaka Eze",
    email: "chiamaka.eze@ohealthplus.ng",
    phone: "+234 801 111 2222",
    role: "Lab Administrator",
    status: "Active",
    lastActive: "13 Sept, 09:30",
    permissions: ["All Permissions (Admin)"],
  },
  {
    id: "staff-002",
    name: "Dr. Yetunde Afolabi",
    email: "yetunde.afolabi@ohealthplus.ng",
    phone: "+234 802 222 3333",
    role: "Senior Technician",
    status: "Active",
    lastActive: "13 Sept, 10:15",
    permissions: [],
  },
  {
    id: "staff-003",
    name: "Mr. Babatunde Adisa",
    email: "babatunde.adisa@ohealthplus.ng",
    phone: "+234 803 333 4444",
    role: "Lab Technician",
    status: "Active",
    lastActive: "13 Sept, 11:05",
    permissions: [],
  },
  {
    id: "staff-004",
    name: "Nurse Kelechi Obi",
    email: "kelechi.obi@ohealthplus.ng",
    phone: "+234 804 444 5555",
    role: "Phlebotomist",
    status: "Active",
    lastActive: "13 Sept, 10:45",
    permissions: [],
  },
  {
    id: "staff-005",
    name: "Ms. Tosin Lawal",
    email: "tosin.lawal@ohealthplus.ng",
    phone: "+234 805 555 6666",
    role: "Reception",
    status: "Active",
    lastActive: "12 Sept, 18:00",
    permissions: [],
  },
  {
    id: "staff-006",
    name: "Mr. Adewale Ogundimu",
    email: "adewale.ogundimu@ohealthplus.ng",
    phone: "+234 806 666 7777",
    role: "Quality Assurance",
    status: "Inactive",
    lastActive: "08 Sept, 15:00",
    permissions: [],
  },
];
