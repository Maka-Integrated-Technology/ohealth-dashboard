export interface Patient {
  id: string;
  patientCode: string;
  name: string;
  initials: string;
  age: number | null;
  gender: "Male" | "Female" | "Unknown";
  condition: string;
  lastVisit: string;
  registered: string;
  allergy?: string;
}

export interface PatientDetail extends Patient {
  fullName: string;
  dateOfBirth: string;
  email: string;
  heightCm: number | null;
  weightKg: number | null;
  bloodGroup: string | null;
  genotype: string | null;
  conditions: string;
  allergies: string;
}

export interface Consultation {
  id: string;
  date: string;
  type: "Chat" | "Video";
  dayLabel: string;
  summary: string;
}

export interface PatientNote {
  id: string;
  date: string;
  text: string;
}

export interface GetPatientsParams {
  [key: string]: string | number | boolean | undefined;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface PatientsResponse {
  data: Patient[];
  total: number;
  page: number;
  pageSize: number;
}
