// Onboarding is a preview: blank fields can be explored without creating accounts.
export type PreviewAdministrator = {
  password: string;
  confirmPassword: string;
};

export function validatePreviewAdministrator(
  values: PreviewAdministrator
): string | null {
  if (values.password && values.password.length < 8)
    return "Use at least 8 characters for the password.";
  if (
    (values.password || values.confirmPassword) &&
    values.password !== values.confirmPassword
  )
    return "The passwords do not match. Please try again.";
  return null;
}

export function nextRegistrationStep(step: 1 | 2 | 3): 2 | 3 | "review" {
  return step === 1 ? 2 : step === 2 ? 3 : "review";
}
