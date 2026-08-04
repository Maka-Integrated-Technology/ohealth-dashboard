import { useState } from "react";
import type { ProfileSetupStatus } from "~/features/profile-setup/types";
import { ProfileSetupModal } from "./profile-setup-modal";

function countCompleted(status: ProfileSetupStatus) {
  return Object.values(status).filter(Boolean).length;
}

interface ProfileSetupBannerProps {
  status: ProfileSetupStatus;
}

export function ProfileSetupBanner({ status }: ProfileSetupBannerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const completed = countCompleted(status);
  const total = 4;

  if (completed === total) {
    return null;
  }

  return (
    <>
      <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-2 text-sm">
        <p className="text-foreground">
          <span className="font-semibold text-primary">
            {completed}/{total}
          </span>{" "}
          Complete your profile setup to start receiving patient bookings and
          consultations.
        </p>
        <button
          onClick={() => setModalOpen(true)}
          className="font-medium text-primary hover:underline"
        >
          Complete Setup →
        </button>
      </div>

      <ProfileSetupModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        status={status}
      />
    </>
  );
}