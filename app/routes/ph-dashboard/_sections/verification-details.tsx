import { Check } from "lucide-react";
import { Card } from "~/components/ui/card";

const VERIFICATION_DETAILS = [
  {
    title: "Pharmacy License Verified",
    detail: "State license verified on Aug 26, 2026",
  },
  {
    title: "DEA Registration Active",
    detail: "Federal authority check passed successfully",
  },
  {
    title: "Compliance Onboarding",
    detail: "Completed final activation walkthrough",
  },
] as const;

export function VerificationDetails() {
  return (
    <Card className="border-border gap-0 border px-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.025)] ring-0 sm:px-[17px]">
      <h2 className="text-foreground mb-2 text-sm font-semibold sm:text-[15px]">
        Verification Details
      </h2>
      <ul>
        {VERIFICATION_DETAILS.map((item) => (
          <li
            key={item.title}
            className="border-border flex gap-2 border-b py-2 last:border-0 last:pb-0"
          >
            <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
              <Check className="size-2.5" strokeWidth={3} />
            </span>
            <div>
              <p className="text-foreground text-xs leading-4 font-semibold sm:text-[13px]">
                {item.title}
              </p>
              <p className="text-muted-foreground mt-0.5 text-[11px] leading-4 sm:text-xs">
                {item.detail}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
