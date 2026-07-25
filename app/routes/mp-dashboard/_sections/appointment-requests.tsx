import { useState } from "react";
import { format } from "date-fns";
import { Check, X } from "lucide-react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils/helpers";
import { notifyError, notifySuccess } from "~/lib/utils/toast";
import {
  useAcceptRequest,
  useAppointmentRequests,
  useRejectRequest,
} from "~/features/appointments/hooks";
import type { AppointmentRequest } from "~/features/appointments/types";
import {
  avatarColorClass,
  formatConsultationType,
  formatDuration,
} from "./_primitives";
import { AppointmentRequestDialog, SeeAllRequestsDialog } from "./dialogs";

const PREVIEW_COUNT = 3;

function AppointmentRequestsSkeleton() {
  return (
    <div className="border-border bg-card rounded-[20px] border p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-4 w-12" />
      </div>
      <div className="flex flex-col gap-6">
        {Array.from({ length: PREVIEW_COUNT }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="size-11 rounded-full" />
              <div>
                <Skeleton className="mb-1 h-4 w-36" />
                <Skeleton className="mb-1 h-3 w-44" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
            <div className="flex gap-3">
              <Skeleton className="size-8 rounded-full" />
              <Skeleton className="size-8 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AppointmentRequests() {
  const { data, isLoading, isError } = useAppointmentRequests();
  const {
    mutateAsync: acceptRequest,
    isPending: isAccepting,
    variables: acceptingId,
  } = useAcceptRequest();
  const {
    mutateAsync: rejectRequest,
    isPending: isRejecting,
    variables: rejectingId,
  } = useRejectRequest();

  const [selectedRequest, setSelectedRequest] =
    useState<AppointmentRequest | null>(null);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [seeAllOpen, setSeeAllOpen] = useState(false);

  if (isLoading) return <AppointmentRequestsSkeleton />;

  if (isError) {
    return (
      <div className="border-border bg-card rounded-[20px] border p-6 shadow-sm">
        <p className="text-muted-foreground text-sm">
          Failed to load appointment requests.
        </p>
      </div>
    );
  }

  const requests = data?.data ?? [];
  const total = data?.total ?? 0;
  const preview = requests.slice(0, PREVIEW_COUNT);

  async function handleAccept(id: string) {
    try {
      await acceptRequest(id);
      notifySuccess({ message: "Appointment request accepted." });
      setRequestDialogOpen(false);
    } catch {
      notifyError({ message: "Failed to accept request. Please try again." });
    }
  }

  async function handleReject(id: string) {
    try {
      await rejectRequest(id);
      notifySuccess({ message: "Appointment request rejected." });
      setRequestDialogOpen(false);
    } catch {
      notifyError({ message: "Failed to reject request. Please try again." });
    }
  }

  function handleRowClick(req: AppointmentRequest) {
    setSelectedRequest(req);
    setRequestDialogOpen(true);
  }

  return (
    <>
      <div className="border-border bg-card rounded-[20px] border p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            APPOINTMENT REQUEST
            <span className="text-muted-foreground ml-2 font-normal tracking-normal normal-case">
              • {total} Appointments
            </span>
          </h2>
          <button
            type="button"
            onClick={() => setSeeAllOpen(true)}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            See all
          </button>
        </div>

        {preview.length === 0 ? (
          <p className="text-muted-foreground text-sm">No pending requests.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {preview.map((req) => {
              const busy =
                (isAccepting && acceptingId === req.id) ||
                (isRejecting && rejectingId === req.id);

              return (
                <div key={req.id} className="flex items-center justify-between">
                  <button
                    type="button"
                    className="flex flex-1 items-center gap-4 text-left"
                    onClick={() => handleRowClick(req)}
                  >
                    <Avatar className="size-11 shrink-0 border-none">
                      <AvatarFallback
                        className={cn(
                          "text-sm font-semibold text-white",
                          avatarColorClass(req.patientName)
                        )}
                      >
                        {req.patientInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-foreground text-sm font-semibold">
                        {req.patientName}
                      </p>
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        {formatConsultationType(req.consultationType)} •{" "}
                        {formatDuration(req.durationMinutes)}
                      </p>
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        {format(new Date(req.scheduledAt), "d MMM")} •{" "}
                        {format(new Date(req.scheduledAt), "h:mm a")}
                      </p>
                    </div>
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-label={`Accept ${req.patientName}'s request`}
                      disabled={busy}
                      onClick={(e) => {
                        e.stopPropagation();
                        void handleAccept(req.id);
                      }}
                      className="flex size-8 items-center justify-center rounded-full border border-blue-600 text-blue-600 transition-colors hover:bg-blue-50 disabled:opacity-40"
                    >
                      <Check size={16} strokeWidth={2.5} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Reject ${req.patientName}'s request`}
                      disabled={busy}
                      onClick={(e) => {
                        e.stopPropagation();
                        void handleReject(req.id);
                      }}
                      className="flex size-8 items-center justify-center rounded-full border border-red-500 text-red-500 transition-colors hover:bg-red-50 disabled:opacity-40"
                    >
                      <X size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AppointmentRequestDialog
        request={selectedRequest}
        open={requestDialogOpen}
        onOpenChange={setRequestDialogOpen}
        onAccept={handleAccept}
        onReject={handleReject}
        isAccepting={isAccepting && acceptingId === selectedRequest?.id}
        isRejecting={isRejecting && rejectingId === selectedRequest?.id}
      />

      <SeeAllRequestsDialog
        requests={requests}
        total={total}
        open={seeAllOpen}
        onOpenChange={setSeeAllOpen}
        onAccept={(id) => void handleAccept(id)}
        onReject={(id) => void handleReject(id)}
        isAccepting={isAccepting}
        isRejecting={isRejecting}
        acceptingId={acceptingId}
        rejectingId={rejectingId}
      />
    </>
  );
}
