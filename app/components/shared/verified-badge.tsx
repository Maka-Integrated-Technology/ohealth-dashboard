import { X } from "lucide-react";
import { CheckIcon } from "~/components/ui/icons/check-icon";

interface VerifiedBadgeProps {
  verified: boolean;
}

export function VerifiedBadge({ verified }: VerifiedBadgeProps) {
  if (verified) {
    return (
      <span className="flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
        <CheckIcon className="size-3.5" />
        Verified Account
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1 rounded-full border border-destructive/20 bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">
      <X className="size-3.5" />
      Unverified Account
    </span>
  );
}