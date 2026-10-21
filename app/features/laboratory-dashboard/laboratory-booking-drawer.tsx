import { Check, X } from "lucide-react";
import type { ReactNode } from "react";
import type { Booking, BookingStatus } from "./laboratory-bookings-data";
import { LIFECYCLE, lifecycleIndex } from "./laboratory-bookings-data";

type Props = {
  booking: Booking;
  onClose: () => void;
  onStatusChange: (status: BookingStatus) => void;
  onReschedule: () => void;
  onCancelRequest: () => void;
  toast: string;
  onDismissToast: () => void;
};

function InformationCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-h-[67px] min-w-0 flex-col justify-center rounded-[15px] bg-[#f7f9fb] px-[13px] py-[10px]">
      <p className="text-[13px] leading-[20px] text-[#8da2c0]">{label}</p>
      <p className="mt-[2px] break-words text-[15px] leading-[20px] font-medium text-[#1c2a40]">{value}</p>
    </div>
  );
}

function BookingLifecycle({ booking }: { booking: Booking }) {
  const current = lifecycleIndex(booking.status);
  return (
    <section className="rounded-[17px] bg-[#f7f9fc] px-[17px] pt-[17px] pb-[15px]" aria-label="Booking lifecycle">
      <h3 className="text-[12px] leading-[19px] font-semibold tracking-[0.1px] text-[#5d7396]">BOOKING LIFECYCLE</h3>
      <ol className="relative mt-[17px] grid grid-cols-7">
        <div className="pointer-events-none absolute top-[12px] right-[7%] left-[7%] h-[2px] bg-[#e3e9f1]" aria-hidden="true" />
        <div
          className="pointer-events-none absolute top-[12px] left-[7%] h-[2px] bg-[#1763ff] transition-all"
          style={{ width: (current * 86) / 6 + "%" }}
          aria-hidden="true"
        />
        {LIFECYCLE.map((label, index) => {
          const past = index < current;
          const active = index === current;
          return (
            <li key={label} aria-current={active ? "step" : undefined} className="relative z-10 flex min-w-0 flex-col items-center text-center">
              <span
                className={
                  "flex size-[26px] shrink-0 items-center justify-center rounded-full " +
                  (past
                    ? "bg-[#1763ff] text-white"
                    : active
                      ? "border-[5px] border-[#a6c7ff] bg-[#1763ff] text-white ring-[3px] ring-[#e6efff]"
                      : "bg-[#e1e8f2] text-[#91a5c1]")
                }
              >
                {past ? <Check className="size-[13px]" strokeWidth={2.5} /> : <span className={"size-[8px] rounded-full " + (active ? "bg-white" : "bg-current")} />}
              </span>
              <span className={"mt-[8px] text-[10px] leading-[14px] " + (active ? "font-semibold text-[#1463ff]" : past ? "text-[#384b67]" : "text-[#8ea3c1]")}>{label}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function LaboratoryBookingDrawer({
  booking,
  onClose,
  onStatusChange,
  onReschedule,
  onCancelRequest,
  toast,
  onDismissToast,
}: Props) {
  const primaryClass = "min-h-[42px] rounded-[13px] bg-[#155eef] px-[17px] text-[15px] font-medium text-white shadow-sm hover:bg-[#064bd5]";
  const successClass = "min-h-[42px] rounded-[13px] bg-[#009965] px-[18px] text-[15px] font-medium text-white shadow-sm hover:bg-[#008355]";
  const neutralClass = "min-h-[42px] rounded-[13px] border border-[#c4d1e4] bg-white px-[17px] text-[15px] font-medium text-[#344760] hover:bg-[#f7faff]";
  const cancelled = booking.status === "Cancelled";
  const completed = booking.status === "Completed";
  let actions: ReactNode;

  if (completed) {
    actions = (
      <div className="rounded-xl border border-[#a6f0d2] bg-[#eafcf4] px-4 py-[11px] text-[13px] leading-5 text-[#007e59]">
        <span className="mr-2 font-semibold">✓</span>This booking has been completed successfully.
      </div>
    );
  } else if (cancelled) {
    actions = (
      <div className="rounded-xl border border-[#ffc9cd] bg-[#fff0f0] px-4 py-[11px] text-[13px] text-[#c62332]">
        This booking has been cancelled.
      </div>
    );
  } else if (booking.status === "Results Ready") {
    actions = <button type="button" className={successClass} onClick={() => onStatusChange("Completed")}>Mark Complete</button>;
  } else if (booking.status === "Test In Progress") {
    actions = <button type="button" className={successClass} onClick={() => onStatusChange("Results Ready")}>Mark Results Ready</button>;
  } else if (booking.status === "Sample Collected") {
    actions = <button type="button" className={primaryClass} onClick={() => onStatusChange("Test In Progress")}>Start Test</button>;
  } else if (booking.status === "Checked In") {
    actions = <button type="button" className={primaryClass} onClick={() => onStatusChange("Sample Collected")}>Mark Sample Collected</button>;
  } else {
    actions = (
      <div className="flex flex-wrap items-center gap-[8px]">
        <button type="button" className={primaryClass} onClick={() => onStatusChange(booking.status === "Booking Received" ? "Confirmed" : "Checked In")}>
          {booking.status === "Booking Received" ? "Confirm Booking" : "Check In Patient"}
        </button>
        <button type="button" className={neutralClass} onClick={onReschedule}>Reschedule</button>
        <button type="button" className="min-h-[42px] rounded-[13px] bg-[#df0008] px-[17px] text-[15px] font-medium text-white shadow-sm hover:bg-[#b50007]" onClick={onCancelRequest}>Cancel Booking</button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#0f172a]/10 backdrop-blur-[4px]" onMouseDown={onClose} role="presentation">
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="lab-booking-heading"
        onMouseDown={(event) => event.stopPropagation()}
        className="flex h-full w-full max-w-[625px] flex-col overflow-hidden bg-white shadow-[-10px_0_36px_rgba(16,24,40,0.08)]"
      >
        <div className="flex min-h-[62px] shrink-0 items-center justify-between border-b border-[#e5eaf2] px-[26px]">
          <h2 id="lab-booking-heading" className="text-[17px] font-semibold tracking-[-0.25px] text-[#151d32]">Booking {booking.id}</h2>
          <button type="button" aria-label="Close booking details" onClick={onClose} className="text-[#91a3bf] hover:text-[#35465c]"><X className="size-[19px]" /></button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-[26px] pt-[26px] pb-[90px]">
          <BookingLifecycle booking={booking} />
          <div className="mt-[26px]">{actions}</div>
          <section className="mt-[26px]">
            <h3 className="mb-[12px] text-[12px] font-semibold tracking-[0.15px] text-[#617796]">PATIENT INFORMATION</h3>
            <div className="grid grid-cols-2 gap-[12px]">
              <InformationCell label="Name" value={booking.patient} />
              <InformationCell label="Patient ID" value={booking.patientId} />
              <InformationCell label="Phone" value={booking.phone} />
              <InformationCell label="Email" value={booking.email} />
            </div>
          </section>
          <section className="mt-[27px]">
            <h3 className="mb-[12px] text-[12px] font-semibold tracking-[0.15px] text-[#617796]">TEST INFORMATION</h3>
            <div className="grid grid-cols-2 gap-[12px]">
              <InformationCell label="Test" value={booking.test} />
              <InformationCell label="Category" value={booking.category} />
              <InformationCell label="Scheduled Date" value={booking.date} />
              <InformationCell label="Scheduled Time" value={booking.time} />
              <InformationCell label="Assigned Staff" value={booking.staff} />
              <InformationCell label="Status" value={booking.status} />
            </div>
          </section>
          <section className="mt-[27px]">
            <h3 className="mb-[9px] text-[12px] font-semibold tracking-[0.15px] text-[#617796]">NOTES</h3>
            <p className="rounded-[13px] bg-[#f7f9fb] px-[13px] py-[14px] text-[14px] leading-5 text-[#485c79]">{booking.notes}</p>
          </section>
          <p className="mt-[27px] font-mono text-[11px] tracking-[0.3px] text-[#8ba1c0]">Created: {booking.created}</p>
          <p className="mt-[14px] text-[11px] text-[#8ba1c0]">Preview data only. No live booking is changed.</p>
        </div>
        {toast && (
          <div role="status" className="absolute right-[25px] bottom-[39px] flex max-w-[350px] items-center gap-3 rounded-[11px] bg-[#009966] px-[15px] py-[12px] text-[12px] leading-[17px] text-white shadow-lg">
            <span className="flex-1">{toast}</span>
            <button type="button" onClick={onDismissToast} aria-label="Dismiss notification" className="shrink-0 text-white/75 hover:text-white"><X className="size-[13px]" /></button>
          </div>
        )}
      </aside>
    </div>
  );
}
