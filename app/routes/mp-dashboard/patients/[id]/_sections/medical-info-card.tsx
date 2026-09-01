import { Stethoscope } from "lucide-react";
import type { PatientDetail } from "~/features/patients/types";

interface MedicalInfoCardProps {
  patient: PatientDetail;
}

export function MedicalInfoCard({ patient }: MedicalInfoCardProps) {
  const rows: { label: string; value: string }[] = [
    {
      label: "General",
      value: `H ${patient.heightCm ?? "—"}cm  W ${patient.weightKg ?? "—"}kg`,
    },
    { label: "Blood Group", value: patient.bloodGroup ?? "—" },
    { label: "Genotype", value: patient.genotype ?? "—" },
    { label: "Conditions", value: patient.conditions },
    { label: "Allergies", value: patient.allergies },
  ];

  return (
    <div className="border-border bg-card rounded-lg border p-5">
      <div className="mb-4 flex items-center gap-2">
        <Stethoscope className="text-primary size-4" />
        <h2 className="text-foreground text-xs font-semibold tracking-wide uppercase">
          Medical Information
        </h2>
      </div>

      <div className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-muted-foreground">{row.label}</span>
            <span className="text-foreground font-medium">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
