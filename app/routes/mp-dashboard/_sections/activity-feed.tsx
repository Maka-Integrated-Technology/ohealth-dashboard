import { Plus } from "lucide-react";
import { format, isToday } from "date-fns";
import { HeartPlusIcon } from "~/components/ui/icons/heart-plus-icon";
import { Skeleton } from "~/components/ui/skeleton";
import type { ProfessionalDashboardActivity } from "~/features/professional-dashboard/types";

interface ActivityFeedProps {
  verified: boolean;
  activities?: ProfessionalDashboardActivity[];
  isLoading?: boolean;
  isError?: boolean;
}

function formatActivityTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return isToday(date)
    ? `Today • ${format(date, "h:mm a")}`
    : format(date, "PPp");
}

export function ActivityFeed({
  verified,
  activities,
  isLoading,
  isError,
}: ActivityFeedProps) {
  const fallbackActivity: ProfessionalDashboardActivity = verified
    ? {
        title: "Verification is successful",
        message:
          "Congratulations! Your credentials have been successfully verified. You now have full access to the OHealth+ professional dashboard.",
        occurred_at: new Date().toISOString(),
      }
    : {
        title: "Awaiting Verification",
        message:
          "Your documents have been submitted successfully. Our team is reviewing your information and will notify you once your account has been approved.",
        occurred_at: new Date().toISOString(),
      };
  const items =
    activities && activities.length > 0 ? activities : [fallbackActivity];

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
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex gap-3 rounded-xl py-3 pr-3 pl-3">
              <Skeleton className="size-9 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))
        ) : isError ? (
          <p className="text-muted-foreground p-2 text-sm">
            Could not load activity.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={`${item.title}-${item.occurred_at}`}
              className="border-primary bg-muted flex gap-3 rounded-xl border-l-4 py-3 pr-3 pl-3"
            >
              <div className="relative flex size-9 shrink-0 items-center justify-center">
                <HeartPlusIcon className="size-full" />
                <Plus className="absolute size-3 text-white" strokeWidth={3} />
              </div>
              <div className="space-y-1">
                <p className="text-foreground text-sm leading-snug">
                  <span className="font-semibold">{item.title}</span>
                  {item.message ? ` — ${item.message}` : ""}
                </p>
                <p className="text-muted-foreground text-xs">
                  {formatActivityTime(item.occurred_at)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
