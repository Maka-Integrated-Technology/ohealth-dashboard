import { ActivityFeed } from "./_sections/activity-feed";
import { AppointmentRequests } from "./_sections/appointment-requests";
import { Header } from "./_sections/header";
import { NextAppointment } from "./_sections/next-appointment";
import { StatsCards } from "./_sections/stats-cards";
import { TodaysAppointments } from "./_sections/todays-appointments";
import { ProfileSetupBanner } from "./_sections/profile-setup-banner";
import { ReviewsCard } from "./_sections/reviews-card";
import { useProfileSetupStatus } from "~/features/profile-setup/hooks";
import { useMe } from "~/features/auth/hooks";
import { useProfessionalDashboard } from "~/features/professional-dashboard/hooks";
import {
  toAppointmentRequest,
  toNextAppointment,
  toTodayAppointment,
} from "~/features/professional-dashboard/mappers";

function toLocalDateParam(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDisplayName(
  user?: { first_name?: string | null; last_name?: string | null } | null
) {
  const fullName = [user?.first_name, user?.last_name]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(" ");

  return fullName || undefined;
}

export default function MpDashboardPage() {
  const dashboardDate = toLocalDateParam(new Date());
  const { data: user } = useMe();
  const { data: profileSetupStatus } = useProfileSetupStatus();
  const {
    data: dashboard,
    isLoading: dashboardLoading,
    isError: dashboardError,
  } = useProfessionalDashboard(dashboardDate);
  const verified =
    dashboard?.setup.verified ?? profileSetupStatus?.verified ?? false;
  const displayName = formatDisplayName(user);
  const todaysAppointments =
    dashboard?.todays_appointments.map(toTodayAppointment);
  const appointmentRequests =
    dashboard?.appointment_requests.map(toAppointmentRequest);
  const nextAppointment = dashboard?.next_appointment
    ? toNextAppointment(dashboard.next_appointment)
    : null;

  return (
    <div className="bg-background min-h-screen p-6 lg:p-8">
      <div className="mx-auto w-full max-w-350">
        <Header
          verified={verified}
          displayName={displayName}
          nextAppointment={dashboard?.next_appointment}
        />

        {profileSetupStatus && (
          <div className="mt-4">
            <ProfileSetupBanner status={profileSetupStatus} />
          </div>
        )}

        <div className="mt-8 flex flex-col gap-6 lg:flex-row">
          <div className="flex-1 space-y-6">
            <StatsCards
              stats={dashboard?.stats}
              isLoading={dashboardLoading}
              isError={dashboardError}
            />
            <TodaysAppointments
              appointments={todaysAppointments}
              isLoading={dashboardLoading}
              isError={dashboardError}
            />
            <AppointmentRequests
              requests={appointmentRequests}
              total={dashboard?.stats.pending_appointments}
              isLoading={dashboardLoading}
              isError={dashboardError}
            />
            <ReviewsCard professionalId={dashboard?.profile.id} />
          </div>

          <div className="w-full shrink-0 space-y-6 lg:w-96">
            <NextAppointment
              appointment={nextAppointment}
              isLoading={dashboardLoading}
              isError={dashboardError}
            />
            <ActivityFeed
              verified={verified}
              activities={dashboard?.activities}
              isLoading={dashboardLoading}
              isError={dashboardError}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
