import { Plus, AlertTriangle } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { PatientDetail } from "~/features/patients/types";

interface PatientHeaderProps {
  patient: PatientDetail;
}

export function PatientHeader({ patient }: PatientHeaderProps) {
  return (
    <div className="border-border bg-card rounded-lg border p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-full bg-slate-700 text-sm font-bold text-white">
            {patient.initials}
          </div>
          <div>
            <h1 className="text-foreground text-xl font-bold">
              {patient.name}
            </h1>
            <p className="text-muted-foreground text-sm">
              ID {patient.patientCode} • {patient.age ?? "—"} years old •{" "}
              {patient.gender}
            </p>
          </div>
        </div>

        <div className="text-right">
          <Button className="gap-1.5">
            <Plus className="size-4" />
            Add Note
          </Button>
          <p className="text-muted-foreground mt-2 text-xs">
            LAST VISIT {patient.lastVisit} • REGISTERED {patient.registered}
          </p>
        </div>
      </div>

      {patient.allergy && (
        <div className="border-destructive/20 bg-destructive/10 text-destructive mt-3 flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium">
          <AlertTriangle className="size-3.5" />
          ALLERGY • {patient.allergy}
        </div>
      )}
    </div>
  );
}
