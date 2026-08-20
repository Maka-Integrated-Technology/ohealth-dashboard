import type { OnboardingFormValues, SubmissionResponse } from './types.js';

export interface SubmitOnboardingParams {
  values: OnboardingFormValues;
}

export async function submitProfessionalOnboarding(
  params: SubmitOnboardingParams
): Promise<SubmissionResponse> {
  const { values } = params;

  await new Promise((resolve) => setTimeout(resolve, 1200));

  // Sanity check critical fields
  if (!values.firstName || !values.licenseNumber || !values.professionalLicense) {
    throw new Error('Incomplete onboarding payload. Please fill in all required fields.');
  }

  // Successful response
  return {
    success: true,
    applicationId: `OHP-MP-${Date.now().toString(36).toUpperCase()}`,
    submittedAt: new Date().toISOString(),
    message: 'Application submitted successfully. Under compliance review.',
  };
}

export async function uploadVerificationDocument(file: File): Promise<{
  fileUrl: string;
  documentId: string;
}> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    documentId: `DOC-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    fileUrl: URL.createObjectURL(file),
  };
}