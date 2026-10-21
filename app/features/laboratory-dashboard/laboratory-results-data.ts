export type ResultStatus = "Pending" | "Under Review" | "Published";

export type ResultHistoryEntry = {
  stamp: string;
  action: string;
  actor: string;
};

export type LaboratoryResult = {
  id: string;
  patient: string;
  patientId: string;
  test: string;
  date: string;
  status: ResultStatus;
  fileName: string | null;
  reviewedBy: string;
  approved: boolean;
  history: ResultHistoryEntry[];
  newlyPublished: boolean;
};

export const INITIAL_LAB_RESULTS: LaboratoryResult[] = [
  {
    id: "RES-2025-0391",
    patient: "Amina Sule",
    patientId: "PT-10048",
    test: "Malaria Parasite Test",
    date: "12 Sept 2025",
    status: "Under Review",
    fileName: "malaria_result_amina_sule.pdf",
    reviewedBy: "Dr. Chiamaka Eze",
    approved: false,
    history: [{ stamp: "12 Sept", action: "Result on file; review pending", actor: "Preview" }],
    newlyPublished: false,
  },
  {
    id: "RES-2025-0390",
    patient: "Oluwaseun Ojo",
    patientId: "PT-10049",
    test: "Prostate Specific Antigen (PSA)",
    date: "11 Sept 2025",
    status: "Published",
    fileName: "psa_result_oluwaseun_ojo.pdf",
    reviewedBy: "Dr. Yetunde Afolabi",
    approved: true,
    history: [{ stamp: "11 Sept", action: "Published in example design", actor: "Preview" }],
    newlyPublished: false,
  },
  {
    id: "RES-2025-0392",
    patient: "Emeka Nwosu",
    patientId: "PT-10043",
    test: "Hepatitis B Surface Antigen",
    date: "13 Sept 2025",
    status: "Pending",
    fileName: null,
    reviewedBy: "—",
    approved: false,
    history: [{ stamp: "13 Sept, 11:00", action: "Result record created", actor: "System" }],
    newlyPublished: false,
  },
];

export const RESULTS_TABS = ["All", "Pending", "Under Review", "Published"] as const;
export type ResultsTab = (typeof RESULTS_TABS)[number];

export function resultStatusStyles(status: ResultStatus): string {
  if (status === "Pending") return "bg-[#fff8e7] text-[#c25308]";
  if (status === "Published") return "bg-[#e9faf1] text-[#008766]";
  return "bg-[#eef4ff] text-[#155eef]";
}
