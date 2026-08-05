import { Plus, CalendarX2, CalendarClock, CalendarPlus } from "lucide-react";
import { cn } from "~/lib/utils/helpers";
import { HeartPlusIcon } from "~/components/ui/icons/heart-plus-icon";

// TODO: replace with real activity-log data once that endpoint exists.
const BOOKING_ACTIVITY_ITEMS = [
  {
    id: 0,
    prefix: "",
    name: "Chidi Nwosu",
    rest: " cancelled their 2:30 PM appointment today.",
    time: "12 minutes ago",
    icon: CalendarX2,
    accent: "alert" as const,
  },
  {
    id: 1,
    prefix: "",
    name: "Oluwaseun Taiwo",
    rest: " has requested to move Thursday's 2:00 PM appointment to Friday, 9 May at 10:00 AM. Review and confirm.",
    time: "52 minutes ago",
    icon: CalendarClock,
    accent: "warning" as const,
  },
  {
    id: 2,
    prefix: "New booking from ",
    name: "Ngozi Adeyemi",
    rest: " — Friday, 9 May at 11:30 AM. In-Person consultation. Payment confirmed.",
    time: "Today • 9:12 AM",
    icon: CalendarPlus,
    accent: "info" as const,
  },
];

const ACCENT_STYLES = {
  alert: {
    row: "border-l-4 border-red-400 bg-muted",
    iconWrap: "bg-red-50 text-red-500",
  },
  warning: {
    row: "border-l-4 border-orange-400 bg-muted",
    iconWrap: "bg-orange-50 text-orange-500",
  },
  info: {
    row: "border-l-4 border-transparent bg-card",
    iconWrap: "bg-blue-50 text-blue-500",
  },
};

interface ActivityFeedProps {
  verified: boolean;
}

export function ActivityFeed({ verified }: ActivityFeedProps) {
  const verificationItem = verified
    ? {
        name: "Verification is successful",
        rest: " — Congratulations! Your credentials have been successfully verified. You now have full access to the OHealth+ professional dashboard. Set up your profile and can start connecting with patients.",
        time: "Today • 9:12 AM",
      }
    : {
        name: "Awaiting Verification",
        rest: " — Your documents have been submitted successfully. Our team is reviewing your information and will notify you once your account has been approved.",
        time: "Today • 9:12 AM",
      };

  return (
    <div className="border-border bg-card rounded-2xl border shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="border-border flex items-center justify-between border-b p-4">
        <span className="text-base font-medium">ACTIVITY</span>
        <button
          type="button"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          See all
        </button>
      </div>

      <div className="flex flex-col gap-2 p-3">
        {/* Verification item — uses the heart-plus icon */}
        <div className="border-primary bg-muted flex gap-3 rounded-xl border-l-4 py-3 pr-3 pl-3">
          <div className="relative flex size-9 shrink-0 items-center justify-center">
            <HeartPlusIcon className="size-full" />
            <Plus className="absolute size-3 text-white" strokeWidth={3} />
          </div>
          <div className="space-y-1">
            <p className="text-foreground text-sm leading-snug">
              <span className="font-semibold">{verificationItem.name}</span>
              {verificationItem.rest}
            </p>
            <p className="text-muted-foreground text-xs">
              {verificationItem.time}
            </p>
          </div>
        </div>

        {/* Booking activity items — unchanged, original icons/accents */}
        {BOOKING_ACTIVITY_ITEMS.map((item) => {
          const styles = ACCENT_STYLES[item.accent];
          return (
            <div
              key={item.id}
              className={cn("flex gap-3 rounded-xl py-3 pr-3 pl-3", styles.row)}
            >
              <div
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full",
                  styles.iconWrap
                )}
              >
                <item.icon className="size-4" strokeWidth={2} />
              </div>
              <div className="space-y-1">
                <p className="text-foreground text-sm leading-snug">
                  {item.prefix}
                  <span className="font-semibold">{item.name}</span>
                  {item.rest}
                </p>
                <p className="text-muted-foreground text-xs">{item.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
