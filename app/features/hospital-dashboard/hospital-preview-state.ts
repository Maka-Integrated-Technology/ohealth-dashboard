// Pure helpers shared by the hospital preview UI and its focused behavioral tests.
// The URL is the source of truth for active section, search and list filters.
export const hospitalSections = [
  "Dashboard",
  "Hospital Profile",
  "Appointments",
  "Patients",
  "Laboratory",
  "Prescriptions",
  "Reviews",
  "Notifications",
  "Settings",
] as const;

export type HospitalSection = (typeof hospitalSections)[number];

export function getHospitalSection(params: URLSearchParams): HospitalSection {
  const requested = params.get("section");
  return hospitalSections.find((section) => section === requested) ?? "Dashboard";
}

export function hospitalNavigationParams(
  current: URLSearchParams,
  section: HospitalSection
): URLSearchParams {
  const next = new URLSearchParams(current);
  if (section === "Dashboard") next.delete("section");
  else next.set("section", section);
  // Avoid carrying another screen's search/filter state into the destination.
  for (const key of ["q", "department", "status", "page", "tab"]) {
    next.delete(key);
  }
  return next;
}

export function hospitalFilterParams(
  current: URLSearchParams,
  key: "q" | "department" | "status" | "page",
  value: string,
  defaultValue = ""
): URLSearchParams {
  const next = new URLSearchParams(current);
  if (!value.trim() || value === defaultValue) next.delete(key);
  else next.set(key, value);
  if (key !== "page") next.delete("page");
  return next;
}

type SearchableAppointment = {
  patient: string;
  doctor: string;
  department: string;
  type: string;
  id: string;
  status: string;
};
type SearchablePatient = {
  id: string;
  patient: string;
  detail: string;
  doctor: string;
  department: string;
};

export function matchesAppointment(
  record: SearchableAppointment,
  query: string
): boolean {
  const term = query.toLowerCase().trim();
  return [
    record.patient,
    record.doctor,
    record.department,
    record.type,
    record.id,
    record.status,
  ].some((value) => value.toLowerCase().includes(term));
}

export function matchesPatient(
  record: SearchablePatient,
  query: string
): boolean {
  const term = query.toLowerCase().trim();
  return [
    record.id,
    record.patient,
    record.detail,
    record.doctor,
    record.department,
  ].some((value) => value.toLowerCase().includes(term));
}
