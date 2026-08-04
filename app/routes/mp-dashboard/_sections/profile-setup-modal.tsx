import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import type {
  ProfileSetupItemKey,
  ProfileSetupStatus,
} from "~/features/profile-setup/types";

interface ChecklistItem {
  key: ProfileSetupItemKey;
  label: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  { key: "verified", label: "Verified" },
  { key: "availabilitySet", label: "Set Availability" },
  { key: "consultationPriceSet", label: "Set Consultation Price" },
  { key: "profilePhotoSet", label: "Add Profile Photo and Description" },
];

interface ProfileSetupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: ProfileSetupStatus;
}

export function ProfileSetupModal({
  open,
  onOpenChange,
  status,
}: ProfileSetupModalProps) {
  const allComplete = CHECKLIST_ITEMS.every((item) => status[item.key]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="space-y-6 p-6 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            Complete Profile Setup
          </DialogTitle>
          <DialogDescription className="text-center">
            Complete your profile start connecting with patients and growing
            your practice.
          </DialogDescription>
        </DialogHeader>

        <ul className="space-y-4">
          {CHECKLIST_ITEMS.map((item) => {
            const done = status[item.key];
            return (
              <li
                key={item.key}
                className="flex items-center justify-between text-sm"
              >
                <span className="flex items-center gap-2 text-foreground">
                  <span className="size-1.5 rounded-full bg-primary" />
                  {item.label}
                </span>
                {done ? (
                  <Check className="size-4 text-green-600" />
                ) : (
                  <button className="text-sm font-medium text-primary hover:underline">
                    Setup →
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        <Button className="w-full" disabled={!allComplete}>
          Preview Profile
        </Button>
      </DialogContent>
    </Dialog>
  );
}