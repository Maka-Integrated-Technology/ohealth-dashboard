import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";
import { Empty } from "~/components/ui/empty";
import type { Patient } from "~/features/patients/types";

interface PatientsTableProps {
  patients: Patient[];
  isLoading: boolean;
  isError: boolean;
}

export function PatientsTable({
  patients,
  isLoading,
  isError,
}: PatientsTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Empty>
        <p className="text-muted-foreground text-sm">
          Couldn&apos;t load patients. Try refreshing the page.
        </p>
      </Empty>
    );
  }

  if (patients.length === 0) {
    return (
      <Empty>
        <p className="text-muted-foreground text-sm">
          No patients match your search.
        </p>
      </Empty>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-border border-b text-left">
          <th className="text-muted-foreground px-4 py-3 text-xs font-medium tracking-wide uppercase">
            Patient
          </th>
          <th className="text-muted-foreground px-4 py-3 text-xs font-medium tracking-wide uppercase">
            ID
          </th>
          <th className="text-muted-foreground px-4 py-3 text-xs font-medium tracking-wide uppercase">
            Condition
          </th>
          <th className="text-muted-foreground px-4 py-3 text-xs font-medium tracking-wide uppercase">
            Last Visit
          </th>
          <th className="px-4 py-3" />
        </tr>
      </thead>
      <tbody>
        {patients.map((patient) => (
          <tr key={patient.id} className="border-border border-b last:border-b-0">
            <td className="text-foreground px-4 py-3 font-medium">
              {patient.name}
            </td>
            <td className="text-muted-foreground px-4 py-3">
              {patient.patientCode}
            </td>
            <td className="text-muted-foreground px-4 py-3">
              {patient.condition}
            </td>
            <td className="text-muted-foreground px-4 py-3">
              {patient.lastVisit}
            </td>
            <td className="px-4 py-3 text-right">
              <Link
                to={`/patients/${patient.id}`}
                className="border-border text-primary hover:bg-accent inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium"
              >
                View
                <ArrowRight className="size-3.5" />
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}