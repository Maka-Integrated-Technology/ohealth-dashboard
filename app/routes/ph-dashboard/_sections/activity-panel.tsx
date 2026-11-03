import { Card } from "~/components/ui/card";

const ACTIVITIES = [
  {
    title: "Verification is successful",
    description:
      "Congratulations! Your credentials have been successfully verified. You now have full access to the OHealth+ professional dashboard. Set up your profile and start connecting with patients.",
    time: "Today · 9:12 AM",
    highlighted: true,
  },
  {
    title: "Awaiting Verification",
    description:
      "Your documents have been submitted successfully. Our team is reviewing your information and will notify you once your account has been approved.",
    time: "Today · 9:12 AM",
    highlighted: false,
  },
] as const;

/*
 * ORIGINAL ActivityHeartIcon
 * Kept for reference in case you want to restore it.
 *
function ActivityHeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="mt-0.5 size-4 shrink-0"
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
*/

export function ActivityPanel() {
  return (
    <Card className="border-border gap-0 border py-0 shadow-none ring-0">
      <div className="border-border flex items-center justify-between border-b px-3 py-3">
        <h2 className="text-foreground text-xs font-semibold">ACTIVITY</h2>

        {/*
          ORIGINAL BUTTON
          Restore this when an activity-history action is implemented.

          <button
            type="button"
            className="text-primary text-xs font-semibold hover:underline"
          >
            See all
          </button>
        */}

        <span className="text-primary text-xs font-semibold">See all</span>
      </div>

      <div className="space-y-2 p-2">
        {ACTIVITIES.map((activity) => (
          <article
            key={activity.title}
            className={`flex gap-2 rounded-md px-2 py-3 ${
              activity.highlighted
                ? "border-primary bg-muted/40 border-l-2"
                : ""
            }`}
          >
            <img
              src="/icons/ohealth-plus-mark.svg"
              alt=""
              className="mt-0.5 size-4 shrink-0"
            />

            <div className="min-w-0 flex-1">
              <p className="text-foreground text-[10px] leading-[1.5]">
                <span className="font-semibold">{activity.title} —</span>{" "}
                {activity.description}
              </p>

              <p className="text-muted-foreground mt-2 text-[9px]">
                {activity.time}
              </p>
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}
