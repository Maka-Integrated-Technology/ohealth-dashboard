export type AccountType = "healthcare_professional" | "facility";

export type Specialization =
  | "General Doctor"
  | "Nurse"
  | "Nutritionist"
  | "Counsellor";

export type ConsultationType =
  | "Chat Consultation"
  | "Video Consultation"
  | "Both";

export interface UploadedDocument {
  file?: File;
  name: string;
  size: number;
  type: string;
  lastModified?: number;
  previewUrl?: string;
}

export interface OnboardingFormValues {
  // Step 0: Account Type
  accountType: AccountType;

  // Step 1: Account Information
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  country: string;

  // Step 2: Practice Information
  specialization: Specialization | "";
  licenseNumber: string;
  yearsOfExperience: string;
  consultationType: ConsultationType | "";
  shortBio: string;

  // Step 3: Professional Verification
  professionalLicense: UploadedDocument | null;
  governmentId: UploadedDocument | null;
}

export type OnboardingStep = 0 | 1 | 2 | 3 | "success" | "dashboard";

export interface SubmissionResponse {
  success: boolean;
  applicationId: string;
  submittedAt: string;
  message?: string;
}

export interface VerificationState {
  status: "pending" | "verified" | "rejected";
  verifiedAt?: string;
}
