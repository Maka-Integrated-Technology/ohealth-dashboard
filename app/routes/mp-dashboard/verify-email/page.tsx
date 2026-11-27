// app/routes/mp-dashboard/verify-email/page.tsx
import { VerifyEmailForm } from "~/routes/auth/verify-email/_sections/verify-email-form";
import AuthBadge from "~/components/shared/auth-badge";
import { useLocation, Navigate } from "react-router";
import type { VerifyEmailState } from "~/features/auth/challenge-nav";

export default function VerifyEmailPage() {
  const location = useLocation();
  const state = location.state as Partial<VerifyEmailState> | null;

  // No challenge handle (e.g. a direct visit or reload) — restart the flow.
  if (!state?.challengeId) {
    return <Navigate to="/sign-up" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md py-16 text-center">
        <AuthBadge />
        <VerifyEmailForm
          state={{
            challengeId: state.challengeId,
            email: state.email,
            resendAfterSeconds: state.resendAfterSeconds ?? 0,
            deliveryTarget: state.deliveryTarget,
          }}
        />
      </div>
    </div>
  );
}
