export interface ProfileSetupStatus {
  verified: boolean;
  availabilitySet: boolean;
  consultationPriceSet: boolean;
  profilePhotoSet: boolean;
}

export type ProfileSetupItemKey = keyof ProfileSetupStatus;