import { Link } from "react-router";
import { LaboratoryShell } from "~/features/laboratory-dashboard/laboratory-shell";

export default function LaboratoryTestBookingsRoute() {
  return (
    <LaboratoryShell section="Test Bookings">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-2xl font-semibold text-[#202b3a]">Test Bookings</h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-[#667085]">
          The Test Bookings screen is awaiting its design screenshot. This
          placeholder deliberately contains no invented booking data, forms, or
          workflow.
        </p>
        <Link
          to="/dashboard"
          className="mt-6 inline-flex rounded-lg bg-[#155eef] px-4 py-2 text-sm font-semibold text-white"
        >
          Back to Overview
        </Link>
      </div>
    </LaboratoryShell>
  );
}
