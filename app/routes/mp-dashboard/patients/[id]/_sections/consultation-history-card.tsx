import { Link } from "react-router";
import { FileText, ArrowRight, Video, MessageSquare } from "lucide-react";
import { Empty } from "~/components/ui/empty";
import type { Consultation } from "~/features/patients/types";

interface ConsultationHistoryCardProps {
  patientId: string;
  consultations: Consultation[];
}

const PREVIEW_COUNT = 2;

export function ConsultationHistoryCard({
  patientId,
  consultations,
}: ConsultationHistoryCardProps) {
  const preview = consultations.slice(0, PREVIEW_COUNT);

  return (
    <div className="border-border bg-card rounded-lg border p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-primary" />
          <h2 className="text-foreground text-xs font-semibold tracking-wide uppercase">
            Consultation History
          </h2>
        </div>
        {consultations.length > 0 && (
          <Link
            to={`/patients/${patientId}/consultations`}
            className="text-primary flex items-center gap-1 text-sm font-medium hover:underline"
          >
            View all {consultations.length} Consultations
            <ArrowRight className="size-3.5" />
          </Link>
        )}
      </div>

      {preview.length === 0 ? (
        <Empty>
          <p className="text-muted-foreground text-sm">
            No consultations recorded yet.
          </p>
        </Empty>
      ) : (
        <div className="divide-border divide-y">
          {preview.map((c) => (
            <div key={c.id} className="flex gap-4 py-4 first:pt-0">
              <div className="w-14 shrink-0 text-center">
                <p className="text-foreground text-lg font-bold leading-none">
                  {c.date.split(" ")[0]}
                </p>
                <p className="text-muted-foreground text-xs uppercase">
                  {c.date.split(" ").slice(1).join(" ")}
                </p>
              </div>
              <div className="flex-1">
                <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
                  {c.type === "Chat" ? (
                    <MessageSquare className="size-3.5" />
                  ) : (
                    <Video className="size-3.5" />
                  )}
                  {c.type} consultation
                </div>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {c.dayLabel}
                </p>
                <p className="text-foreground mt-1 text-sm leading-relaxed">
                  {c.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}