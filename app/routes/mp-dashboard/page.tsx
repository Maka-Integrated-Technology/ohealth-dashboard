import { ActivityFeed } from "./_sections/activity-feed";
import { AppointmentRequests } from "./_sections/appointment-requests";
import { Header } from "./_sections/header";
import { NextAppointment } from "./_sections/next-appointment";
import { StatsCards } from "./_sections/stats-cards";
import { TodaysAppointments } from "./_sections/todays-appointments";

export default function MpDashboardPage() {
  return (
    <div className="bg-background min-h-screen p-6 lg:p-8">
      <div className="mx-auto w-full max-w-350">
        <Header />

        <div className="mt-8 flex flex-col gap-6 lg:flex-row">
          <div className="flex-1 space-y-6">
            <StatsCards />
            <TodaysAppointments />
            <AppointmentRequests />
          </div>

          <div className="w-full shrink-0 space-y-6 lg:w-96">
            <NextAppointment />
            <ActivityFeed />
          </div>
        </div>
      </div>
    </div>
  );
}
