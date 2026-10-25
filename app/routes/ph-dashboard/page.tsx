import {
  Accessibility,
  CalendarDays,
  CalendarCheck,
  CalendarClock,
  CalendarOff,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

type Stat = {
  label: string;
  icon: LucideIcon;
  iconColor: string;
  iconBackground: string;
  hint: string;
};

const STATS: Stat[] = [
  {
    label: "New Orders",
    icon: Accessibility,
    iconColor: "text-blue-600",
    iconBackground: "bg-blue-50",
    hint: "↑ 0% in the last 30 days",
  },
  {
    label: "Total Medicines",
    icon: CalendarCheck,
    iconColor: "text-emerald-600",
    iconBackground: "bg-emerald-50",
    hint: "No appointments today",
  },
  {
    label: "Prescriptions Fulfilled",
    icon: CalendarDays,
    iconColor: "text-orange-600",
    iconBackground: "bg-orange-50",
    hint: "No pending appointments",
  },
  {
    label: "Pending Orders",
    icon: CalendarClock,
    iconColor: "text-orange-600",
    iconBackground: "bg-orange-50",
    hint: "No pending appointments",
  },
];

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[380px] flex-col items-center justify-center rounded-xl bg-gray-50 px-6 py-10 text-center dark:bg-gray-900">
      <div className="mb-6 flex size-14 items-center justify-center rounded-full bg-blue-600 text-white">
        <CalendarOff className="size-7" strokeWidth={1.8} />
      </div>

      <h3 className="text-xl leading-tight font-semibold text-gray-800 dark:text-gray-100">
        {title}
      </h3>

      <p className="mt-3 max-w-[480px] text-base leading-[1.4] text-gray-700 dark:text-gray-300">
        {description}
      </p>
    </div>
  );
}

/* Blue heart with a centered white plus. */
function ActivityHeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="mt-0.5 size-6 shrink-0"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 21s-9-5.7-9-12.1A5.1 5.1 0 0 1 12 5.7a5.1 5.1 0 0 1 9 3.2C21 15.3 12 21 12 21Z"
        fill="#2563EB"
      />
      <path
        d="M12 8.5v6M9 11.5h6"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ActivityItem({
  title,
  description,
  time,
  highlighted = false,
}: {
  title: string;
  description: string;
  time: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`flex gap-3 px-4 py-3 ${
        highlighted
          ? "border-l-[3px] border-blue-600 bg-gray-50 dark:bg-gray-800"
          : ""
      }`}
    >
      <ActivityHeartIcon />

      <div className="min-w-0 flex-1">
        <p className="text-sm leading-[1.4] text-gray-800 dark:text-gray-100">
          <span className="font-semibold">{title}</span> {description}
        </p>

        <p className="mt-2 text-xs leading-[1.5] text-gray-500 dark:text-gray-400">
          {time}
        </p>
      </div>
    </div>
  );
}

export default function PharmacyDashboard() {
  const now = new Date();
  const hour = now.getHours();

  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const dateLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(now);

  const timeLabel = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="bg-background min-h-full w-full px-4 py-5 sm:px-6 lg:px-7">
      <div className="mx-auto w-full max-w-[1200px]">
        <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-foreground text-lg font-bold tracking-tight sm:text-xl">
              {greeting}, MedPlus Pharmacy
            </h1>

            <p className="text-muted-foreground mt-1 text-[10px]">
              {dateLabel} · {timeLabel}
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-2 text-[10px] font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <CheckCircle2 className="size-3.5" />
            Verified Account
          </div>
        </header>

        <section
          aria-label="Pharmacy statistics"
          className="grid grid-cols-2 gap-3 xl:grid-cols-4"
        >
          {STATS.map((stat) => {
            const Icon = stat.icon;

            return (
              <Card
                key={stat.label}
                className="min-h-[148px] min-w-0 gap-3 rounded-2xl border border-gray-200 bg-white py-4 shadow-none dark:border-gray-700 dark:bg-gray-900"
              >
                <CardHeader className="px-3">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle
                      className={`text-muted-foreground text-[9px] font-medium sm:text-[10px] ${
                        stat.label === "New Orders"
                          ? "normal-case"
                          : "uppercase"
                      }`}
                    >
                      {stat.label}
                    </CardTitle>

                    <div
                      className={`flex size-6 shrink-0 items-center justify-center rounded ${stat.iconBackground}`}
                    >
                      <Icon className={`size-3.5 ${stat.iconColor}`} />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="px-3">
                  <p className="text-lg leading-tight font-semibold text-gray-900 dark:text-gray-100">
                    —
                  </p>

                  <p className="text-muted-foreground mt-2 text-[9px] leading-4">
                    {stat.hint}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="mt-3 grid grid-cols-1 items-start gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(245px,0.36fr)]">
          <div className="space-y-6">
            <section aria-labelledby="inventory-heading">
              <h2
                id="inventory-heading"
                className="text-foreground mb-4 px-1 text-sm font-medium"
              >
                INVENTORY
              </h2>

              <EmptyState
                title="No Available Medicines"
                description="You don't have any medicines today yet. Once you add medicines to your inventory, they'll appear here in chronological order."
              />
            </section>

            <section aria-labelledby="orders-heading">
              <h2
                id="orders-heading"
                className="text-foreground mb-4 px-1 text-sm font-medium"
              >
                ORDERS
              </h2>

              <EmptyState
                title="No Orders yet"
                description="You don't have any order requests yet. Once patients place orders, they will appear here."
              />
            </section>
          </div>

          <Card className="gap-0 rounded-lg border border-gray-200 bg-white py-0 dark:border-gray-700 dark:bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-700">
              <CardTitle className="text-sm font-medium text-gray-800 dark:text-gray-100">
                ACTIVITY
              </CardTitle>

              <button
                type="button"
                className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                See all
              </button>
            </CardHeader>

            <CardContent className="p-4">
              <ActivityItem
                title="Verification is successful —"
                description="Congratulations! Your credentials have been successfully verified. You now have full access to the OHealth+ professional dashboard. Set up your profile and can start connecting with patients."
                time="Today · 9:12 AM"
                highlighted
              />

              <div className="mt-1 border-t border-gray-200 pt-1 dark:border-gray-700">
                <ActivityItem
                  title="Awaiting Verification —"
                  description="Your documents have been submitted successfully. Our team is reviewing your information and will notify you once your account has been approved."
                  time="Today · 9:12 AM"
                />
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
