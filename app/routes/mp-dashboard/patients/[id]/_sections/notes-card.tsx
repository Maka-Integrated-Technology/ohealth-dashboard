import { Link } from "react-router";
import { NotebookPen, ArrowRight, Pencil } from "lucide-react";
import { Empty } from "~/components/ui/empty";
import type { PatientNote } from "~/features/patients/types";

interface NotesCardProps {
  patientId: string;
  notes: PatientNote[];
}

const PREVIEW_COUNT = 3;

export function NotesCard({ patientId, notes }: NotesCardProps) {
  const preview = notes.slice(0, PREVIEW_COUNT);

  return (
    <div className="border-border bg-card rounded-lg border p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <NotebookPen className="size-4 text-primary" />
          <h2 className="text-foreground text-xs font-semibold tracking-wide uppercase">
            Notes
          </h2>
        </div>
        {notes.length > 0 && (
          <Link
            to={`/patients/${patientId}/notes`}
            className="text-primary flex items-center gap-1 text-sm font-medium hover:underline"
          >
            View all {notes.length} Notes
            <ArrowRight className="size-3.5" />
          </Link>
        )}
      </div>

      {preview.length === 0 ? (
        <Empty>
          <p className="text-muted-foreground text-sm">
            No notes recorded yet.
          </p>
        </Empty>
      ) : (
        <div className="divide-border divide-y">
          {preview.map((note) => (
            <div key={note.id} className="flex items-start justify-between gap-3 py-3 first:pt-0">
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
  );
}