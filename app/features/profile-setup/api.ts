import axiosInstance from "~/lib/config/axios";
import { unwrapApiData, type ApiEnvelope } from "~/lib/utils/api-response";
import type { ProfileSetupStatus } from "./types";

interface IProfessionalMeSetup {
  verified: boolean;
  set_availability: boolean;
  add_profile_photo: boolean;
  add_description: boolean;
  completed: boolean;
}

interface IProfessionalMeProfile {
  consultation_fee: number;
}

interface IProfessionalMeResponse {
  profile: IProfessionalMeProfile | null;
  setup: IProfessionalMeSetup;
}

export const profileSetupApi = {
  getStatus: async (): Promise<ProfileSetupStatus> => {
    const { data } = await axiosInstance.get<
      ApiEnvelope<IProfessionalMeResponse>
    >("/api/professionals/me");
    const { profile, setup } = unwrapApiData(data);

    return {
      verified: setup.verified,
      availabilitySet: setup.set_availability,
      // The onboarding setup checklist doesn't track this directly; a fee
      // above the server's zero default is the closest available signal.
      consultationPriceSet: (profile?.consultation_fee ?? 0) > 0,
      profilePhotoSet: setup.add_profile_photo,
    };
  },
};
