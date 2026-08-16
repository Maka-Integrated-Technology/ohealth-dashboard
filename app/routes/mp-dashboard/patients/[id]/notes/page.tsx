import { useParams } from "react-router";
import { Skeleton } from "~/components/ui/skeleton";
import { Empty } from "~/components/ui/empty";
import { NotebookPen, Pencil } from "lucide-react";
import { Breadcrumb } from "~/components/shared/breadcrumb";
import { usePatientDetail, usePatientNotes } from "~/features/patients/hooks";
import { PatientHeader } from "../_sections/patient-header";

export default function PatientNotesPage() {
  const { id } = useParams();
  const { data: patient, isLoading: isLoadingPatient } = usePatientDetail(id);
  const { data: notes = [], isLoading: isLoadingNotes } = usePatientNotes(id);

  if (isLoadingPatient) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-6">
        <Empty>
          <p className="text-muted-foreground text-sm">
            Couldn&apos;t load this patient&apos;s record.
          </p>
        </Empty>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", to: "/" },
          { label: "Patients", to: "/patients" },
          { label: patient.name, to: `/patients/${patient.id}` },
          { label: "Notes" },
        ]}
      />

      <PatientHeader patient={patient} />

      <div className="border-border bg-card mt-6 rounded-lg border p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <NotebookPen className="text-primary size-4" />
            <h2 className="text-foreground text-xs font-semibold tracking-wide uppercase">
              Notes
            </h2>
          </div>
          <span className="text-muted-foreground text-sm">
            {notes.length} Notes
          </span>
        </div>

        {isLoadingNotes ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : notes.length === 0 ? (
          <Empty>
            <p className="text-muted-foreground text-sm">
              No notes recorded yet.
            </p>
          </Empty>
        ) : (
          <div className="divide-border divide-y">
            {notes.map((note) => (
              <div
                key={note.id}
                className="flex items-start justify-between gap-3 py-4 first:pt-0"
              >
                <div>
                  <p className="text-muted-foreground text-xs">{note.date}</p>
                  <p className="text-foreground mt-1 text-sm leading-relaxed">
                    {note.text}
                  </p>
                </div>
                <button
                  type="button"
                  className="text-primary flex shrink-0 items-center gap-1 text-xs font-medium hover:underline"
                >
                  <Pencil className="size-3" />
                  Edit
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
