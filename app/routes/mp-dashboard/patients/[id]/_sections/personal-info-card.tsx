import { User } from "lucide-react";
import type { PatientDetail } from "~/features/patients/types";

interface PersonalInfoCardProps {
  patient: PatientDetail;
}

export function PersonalInfoCard({ patient }: PersonalInfoCardProps) {
  const rows: { label: string; value: string }[] = [
    { label: "Full Name", value: patient.fullName },
    { label: "Date of Birth", value: patient.dateOfBirth },
    { label: "Gender", value: patient.gender },
    { label: "Email", value: patient.email },
    { label: "Registered", value: patient.registered },
    { label: "Patient ID", value: `ID ${patient.patientCode}` },
  ];

  return (
    <div className="border-border bg-card rounded-lg border p-5">
      <div className="mb-4 flex items-center gap-2">
        <User className="size-4 text-primary" />
        <h2 className="text-foreground text-xs font-semibold tracking-wide uppercase">
          Personal Information
        </h2>
      </div>

      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{row.label}</span>
            <span className="text-foreground font-medium">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}