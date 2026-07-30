import { useCallback, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useCustomSearchParams } from "~/hooks/use-custom-search-params";
import {
  useAppointments,
  useCancelAppointment,
} from "~/features/appointments/hooks";
import type {
  Appointment,
  AppointmentStatus,
} from "~/features/appointments/types";
import { AppointmentsHeader } from "./_sections/header";
import { ListView } from "./_sections/list-view";
import { getWeekRange } from "./_sections/_primitives";
import { CalendarView } from "./_sections/calendar-view";
import { AppointmentDetailDialog } from "./_sections/appointment-detail-dialog";

type ViewMode = "calendar" | "list";
type StatusFilter = AppointmentStatus | "all";

function parseView(value: string): ViewMode {
  return value === "calendar" ? "calendar" : "list";
}

function parseStatus(value: string): StatusFilter {
  const allowed: StatusFilter[] = [
    "all",
    "confirmed",
    "pending",
    "cancelled",
    "completed",
  ];
  return (allowed as string[]).includes(value)
    ? (value as StatusFilter)
    : "all";
}

export default function AppointmentsPage() {
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();

  const {
    view: rawView,
    status: rawStatus,
    from: rawFrom,
    to: rawTo,
  } = useCustomSearchParams<{
    view: string;
    status: string;
    from: string;
    to: string;
  }>(["view", "status", "from", "to"]);

  const view = parseView(rawView);
  const status = parseStatus(rawStatus);

  const { start: defaultFrom, end: defaultTo } = useMemo(
    () => getWeekRange(new Date()),
    []
  );

  const from = rawFrom ? new Date(rawFrom) : defaultFrom;
  const to = rawTo ? new Date(rawTo) : defaultTo;

  const {
    data: appointments = [],
    isLoading,
    isError,
  } = useAppointments({
    from: from.toISOString(),
    to: to.toISOString(),
    status,
  });

  const {
    mutateAsync: cancelAppointment,
    isPending: isCancelling,
    variables: cancellingId,
  } = useCancelAppointment();

  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const handleViewChange = useCallback(
    (nextView: ViewMode) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("view", nextView);
        return next;
      });
    },
    [setSearchParams]
  );

  const handleStatusChange = useCallback(
    (nextStatus: StatusFilter) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (nextStatus === "all") {
          next.delete("status");
        } else {
          next.set("status", nextStatus);
        }
        return next;
      });
    },
    [setSearchParams]
  );

  const handleDateRangeChange = useCallback(
    (range: { from: Date; to: Date }) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("from", range.from.toISOString());
        next.set("to", range.to.toISOString());
        return next;
      });
    },
    [setSearchParams]
  );

  const handleStart = useCallback(
    (appointment: Appointment) => {
      navigate(`/appointments/${appointment.id}/consult`);
    },
    [navigate]
  );

  const handleReschedule = useCallback((_appointment: Appointment) => {
    // No design yet for reschedule flow — stubbed for now.
  }, []);

  const handleCancel = useCallback(
    async (appointment: Appointment) => {
      await cancelAppointment(appointment.id);
    },
    [cancelAppointment]
  );

  const handleCancelFromDialog = useCallback(
    async (appointment: Appointment) => {
      await handleCancel(appointment);
      setSelectedAppointment(null);
    },
    [handleCancel]
  );

  return (
    <div className="p-6">
      <AppointmentsHeader
        from={from}
        to={to}
        onDateRangeChange={handleDateRangeChange}
        status={status}
        onStatusChange={handleStatusChange}
        view={view}
        onViewChange={handleViewChange}
      />

      {view === "list" ? (
        <ListView
          appointments={appointments}
          isLoading={isLoading}
          isError={isError}
          onStart={handleStart}
          onReschedule={handleReschedule}
          onCancel={handleCancel}
          cancellingId={isCancelling ? (cancellingId as string) : undefined}
        />
      ) : (
        <CalendarView
          from={from}
          to={to}
          appointments={appointments}
          isLoading={isLoading}
          isError={isError}
          onSelect={setSelectedAppointment}
        />
      )}

      <AppointmentDetailDialog
        appointment={selectedAppointment}
        onOpenChange={(open) => !open && setSelectedAppointment(null)}
        onStart={handleStart}
        onCancel={handleCancelFromDialog}
        isCancelling={isCancelling}
      />
    </div>
  );
}