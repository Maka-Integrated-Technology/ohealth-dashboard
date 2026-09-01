import axiosInstance from "~/lib/config/axios";
import type { ApiEnvelope } from "~/lib/utils/api-response";
import type {
  Consultation,
  GetPatientsParams,
  Patient,
  PatientDetail,
  PatientNote,
  PatientsResponse,
} from "./types";

interface ServerPatientProfile {
  id: string;
  full_name: string;
  patient_reference: string;
  email: string;
  gender: string | null;
  dob: string | null;
  age: number | null;
  registered_at: string | null;
  medical_conditions: string[];
  allergies: string[];
  blood_group: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  genotype: string | null;
}

interface ServerPatientListItem extends ServerPatientProfile {
  condition: string;
  last_visit_date: string | null;
}

interface ServerPaginationMeta {
  page: number;
  limit: number;
  total: number;
}

interface ServerPatientsResponse {
  records: ServerPatientListItem[];
  meta: ServerPaginationMeta;
}

interface ServerPatientDetailResponse {
  profile: ServerPatientProfile;
  personal_information: {
    full_name: string;
    dob: string | null;
    gender: string | null;
    email: string;
    registered_at: string | null;
    patient_reference: string;
  };
  medical_information: {
    height_cm: number | null;
    weight_kg: number | null;
    blood_group: string | null;
    genotype: string | null;
    medical_conditions: string[];
    allergies: string[];
    primary_condition: string | null;
    primary_allergy: string | null;
  };
  summary: {
    last_visit_date: string | null;
  };
}

interface ServerConsultation {
  id: string;
  booking_date: string;
  consultation_type: string;
  date_day: string;
  date_month_year: string;
  consultation_label: string;
  description: string | null;
}

interface ServerConsultationsResponse {
  records: ServerConsultation[];
}

interface ServerNote {
  id: string;
  content: string;
  date_label: string;
}

interface ServerNotesResponse {
  records: ServerNote[];
}

function unwrapServerData<T>(value: ApiEnvelope<T> | T): T {
  if (
    value &&
    typeof value === "object" &&
    "status_code" in value &&
    "data" in value
  ) {
    return (value as ApiEnvelope<T>).data;
  }
  return value as T;
}

function getInitials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "PT"
  );
}

function normalizeGender(value: string | null): Patient["gender"] {
  const normalized = value?.toLowerCase();
  if (normalized === "male") return "Male";
  if (normalized === "female") return "Female";
  return "Unknown";
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function mapPatient(item: ServerPatientListItem): Patient {
  return {
    id: item.id,
    patientCode: item.patient_reference,
    name: item.full_name,
    initials: getInitials(item.full_name),
    age: item.age,
    gender: normalizeGender(item.gender),
    condition: item.condition,
    lastVisit: formatDate(item.last_visit_date),
    registered: formatDate(item.registered_at),
    allergy: item.allergies[0],
  };
}

function mapPatientDetail(item: ServerPatientDetailResponse): PatientDetail {
  const {
    profile,
    personal_information: personal,
    medical_information: medical,
  } = item;
  const conditions = medical.medical_conditions ?? [];
  const allergies = medical.allergies ?? [];

  return {
    id: profile.id,
    patientCode: personal.patient_reference,
    name: personal.full_name,
    initials: getInitials(personal.full_name),
    age: profile.age,
    gender: normalizeGender(personal.gender),
    condition: medical.primary_condition ?? conditions.join(", "),
    lastVisit: formatDate(item.summary.last_visit_date),
    registered: formatDate(personal.registered_at),
    allergy: medical.primary_allergy ?? allergies[0],
    fullName: personal.full_name,
    dateOfBirth: formatDate(personal.dob),
    email: personal.email,
    heightCm: medical.height_cm,
    weightKg: medical.weight_kg,
    bloodGroup: medical.blood_group,
    genotype: medical.genotype,
    conditions: conditions.length > 0 ? conditions.join(", ") : "None reported",
    allergies: allergies.length > 0 ? allergies.join(", ") : "None reported",
  };
}

export const patientsApi = {
  getPatients: async (params: GetPatientsParams): Promise<PatientsResponse> => {
    const { pageSize, ...query } = params;
    const { data } = await axiosInstance.get<
      ApiEnvelope<ServerPatientsResponse> | PatientsResponse
    >("/api/professionals/me/patients", {
      params: { ...query, limit: pageSize },
    });
    const payload = unwrapServerData<ServerPatientsResponse | PatientsResponse>(
      data
    );

    // Preserve the development mock response while it is still in use.
    if (!("records" in payload)) return payload;

    return {
      data: payload.records.map(mapPatient),
      total: payload.meta.total,
      page: payload.meta.page,
      pageSize: payload.meta.limit,
    };
  },

  getPatientById: async (id: string): Promise<PatientDetail> => {
    const { data } = await axiosInstance.get<
      ApiEnvelope<ServerPatientDetailResponse> | PatientDetail
    >(`/api/professionals/me/patients/${id}`);
    const payload = unwrapServerData<
      ServerPatientDetailResponse | PatientDetail
    >(data);
    return "profile" in payload ? mapPatientDetail(payload) : payload;
  },

  getConsultations: async (patientId: string): Promise<Consultation[]> => {
    const { data } = await axiosInstance.get<
      ApiEnvelope<ServerConsultationsResponse> | Consultation[]
    >(`/api/professionals/me/patients/${patientId}/consultations`);
    const payload = unwrapServerData<
      ServerConsultationsResponse | Consultation[]
    >(data);
    if (Array.isArray(payload)) return payload;

    return payload.records.map((consultation) => ({
      id: consultation.id,
      date: formatDate(consultation.booking_date),
      type: consultation.consultation_type === "video" ? "Video" : "Chat",
      dayLabel: [consultation.date_day, consultation.date_month_year]
        .filter(Boolean)
        .join(" "),
      summary:
        consultation.description ?? consultation.consultation_label ?? "",
    }));
  },

  getNotes: async (patientId: string): Promise<PatientNote[]> => {
    const { data } = await axiosInstance.get<
      ApiEnvelope<ServerNotesResponse> | PatientNote[]
    >(`/api/professionals/me/patients/${patientId}/notes`);
    const payload = unwrapServerData<ServerNotesResponse | PatientNote[]>(data);
    if (Array.isArray(payload)) return payload;

    return payload.records.map((note) => ({
      id: note.id,
      date: note.date_label,
      text: note.content,
    }));
  },
};
