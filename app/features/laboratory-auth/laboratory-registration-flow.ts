export type LabAdministratorPassword = { password: string; confirmPassword: string };
export function labAdministratorPasswordError(form: LabAdministratorPassword): string | null {
  if (form.password && form.password.length < 8)
    return "Use at least 8 characters for the password.";
  if (
    (form.password || form.confirmPassword) &&
    form.password !== form.confirmPassword
  )
    return "The passwords do not match. Please try again.";
  return null;
}
export function nextLabRegistrationStep(step: 1 | 2 | 3): 2 | 3 | "review" {
  return step === 1 ? 2 : step === 2 ? 3 : "review";
}
