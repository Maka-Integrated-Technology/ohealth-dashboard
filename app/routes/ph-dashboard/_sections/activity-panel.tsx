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

export function ActivityPanel() {
  return (
    <Card className="border-border gap-0 border py-0 shadow-none ring-0">
      <div className="border-border flex items-center justify-between border-b px-3 py-3">
        <h2 className="text-foreground text-xs font-semibold">ACTIVITY</h2>

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
