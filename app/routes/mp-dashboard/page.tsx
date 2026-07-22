import { Header } from "./_sections/header";
import { StatsCards } from "./_sections/stats-cards";
import { TodaysAppointments } from "./_sections/todays-appointments";
import { AppointmentRequests } from "./_sections/appointment-requests";
import { NextAppointment } from "./_sections/next-appointment";
import { ActivityFeed } from "./_sections/activity-feed";

export default function MpDashboardPage() {
  return (
    <div className="max-w-content mx-auto w-full">
      <Header />

      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 space-y-6">
          <StatsCards />
          <TodaysAppointments />
          <AppointmentRequests />
        </div>

        <div className="w-full shrink-0 space-y-6 lg:w-85">
          <NextAppointment />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
