import { VerifyEmailForm } from "../../../auth/verify-email/_sections/verify-email-form";

export default function VerifyEmailPreviewPage() {
  // Provide a sample email so the form can render directly for previewing.
  return <VerifyEmailForm email="test@example.com" />;
}
