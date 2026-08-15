import axiosInstance from "~/lib/config/axios";
import type {
  Consultation,
  GetPatientsParams,
  PatientDetail,
  PatientNote,
  PatientsResponse,
} from "./types";

export const patientsApi = {
  getPatients: async (
    params: GetPatientsParams
  ): Promise<PatientsResponse> => {
    const { data } = await axiosInstance.get<PatientsResponse>(
      "/api/patients",
      { params }
    );
    return data;
  },

  getPatientById: async (id: string): Promise<PatientDetail> => {
    const { data } = await axiosInstance.get<PatientDetail>(
      `/api/patients/${id}`
    );
    return data;
  },

  getConsultations: async (patientId: string): Promise<Consultation[]> => {
    const { data } = await axiosInstance.get<Consultation[]>(
      `/api/patients/${patientId}/consultations`
    );
    return data;
  },

  getNotes: async (patientId: string): Promise<PatientNote[]> => {
    const { data } = await axiosInstance.get<PatientNote[]>(
      `/api/patients/${patientId}/notes`
    );
    return data;
  },
};