import { delay, http, HttpResponse } from "msw";
import type { ProfileSetupStatus } from "~/features/profile-setup/types";

// Simulates a newly onboarded doctor: verified, nothing else done yet.
// Matches the 1/4 complete state shown in the design.
const profileSetupStatus: ProfileSetupStatus = {
  verified: true,
  availabilitySet: false,
  consultationPriceSet: false,
  profilePhotoSet: false,
};

const MOCK_NETWORK_DELAY_MS = 500;

export const profileSetupHandlers = [
  http.get("/api/profile-setup/status", async () => {
    await delay(MOCK_NETWORK_DELAY_MS);
    return HttpResponse.json(profileSetupStatus);
  }),
];
