export type CatalogueCategory =
  | "Blood Tests"
  | "Urinalysis"
  | "Imaging"
  | "Cardiology"
  | "Hormonal Tests"
  | "Infectious Disease Tests"
  | "Preventive Health Screening";

export type CatalogueTest = {
  id: string;
  name: string;
  category: CatalogueCategory;
  price: number;
  turnaround: string;
  active: boolean;
};

export const CATEGORY_SUMMARY: {
  label: string;
  category: CatalogueCategory;
}[] = [
  { label: "Blood", category: "Blood Tests" },
  { label: "Urinalysis", category: "Urinalysis" },
  { label: "Imaging", category: "Imaging" },
  { label: "Cardiology", category: "Cardiology" },
  { label: "Hormonal", category: "Hormonal Tests" },
  { label: "Infectious Disease", category: "Infectious Disease Tests" },
  {
    label: "Preventive Health Screening",
    category: "Preventive Health Screening",
  },
];

export const INITIAL_CATALOGUE_TESTS: CatalogueTest[] = [
  { id: "CAT-001", name: "Complete Blood Count (CBC)", category: "Blood Tests", price: 4500, turnaround: "4–6 hours", active: true },
  { id: "CAT-002", name: "Lipid Profile", category: "Blood Tests", price: 6500, turnaround: "4–6 hours", active: true },
  { id: "CAT-003", name: "Fasting Blood Sugar (FBS)", category: "Blood Tests", price: 2000, turnaround: "1–2 hours", active: true },
  { id: "CAT-004", name: "Liver Function Test (LFT)", category: "Blood Tests", price: 8000, turnaround: "6–8 hours", active: true },
  { id: "CAT-005", name: "Urinalysis", category: "Urinalysis", price: 2500, turnaround: "1–2 hours", active: true },
  { id: "CAT-006", name: "Urine Culture & Sensitivity", category: "Urinalysis", price: 7500, turnaround: "48–72 hours", active: true },
  { id: "CAT-007", name: "Electrocardiogram (ECG)", category: "Cardiology", price: 12000, turnaround: "Same day", active: true },
  { id: "CAT-008", name: "Echocardiogram", category: "Cardiology", price: 45000, turnaround: "Same day", active: false },
  { id: "CAT-009", name: "Thyroid Function Test (TFT)", category: "Hormonal Tests", price: 10000, turnaround: "24 hours", active: true },
  { id: "CAT-010", name: "Hormone Profile (Female)", category: "Hormonal Tests", price: 18000, turnaround: "24–48 hours", active: true },
  { id: "CAT-011", name: "HIV 1 & 2 Antibody Test", category: "Infectious Disease Tests", price: 3500, turnaround: "2–4 hours", active: true },
  { id: "CAT-012", name: "Hepatitis B Surface Antigen", category: "Infectious Disease Tests", price: 3000, turnaround: "2–4 hours", active: true },
  { id: "CAT-013", name: "Malaria Parasite Test", category: "Infectious Disease Tests", price: 2500, turnaround: "1–2 hours", active: true },
  { id: "CAT-014", name: "Prostate Specific Antigen (PSA)", category: "Blood Tests", price: 7000, turnaround: "6–8 hours", active: true },
  { id: "CAT-015", name: "Full Body Screening Package", category: "Preventive Health Screening", price: 55000, turnaround: "24–48 hours", active: true },
];

export function formatCataloguePrice(price: number): string {
  return "₦" + price.toLocaleString("en-NG");
}
