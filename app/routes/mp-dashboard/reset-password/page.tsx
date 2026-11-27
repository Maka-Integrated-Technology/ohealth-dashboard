// app/routes/mp-dashboard/reset-password/page.tsx
import { useEffect } from "react";
import { Navigate, useSearchParams } from "react-router";
import { ResetPasswordForm } from "~/routes/auth/reset-password/_sections/reset-password-form";
import AuthBadge from "~/components/shared/auth-badge";

/**
 * Keep the reset surface from leaking `?challenge_id=` via the Referer header
 * to anything this page links or navigates to. The edge/host should also send
 * `Referrer-Policy: no-referrer` for this route (documented in the PR); this
 * meta tag is the client-side guarantee for the static SPA build.
 */
function useNoReferrer() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "referrer";
    meta.content = "no-referrer";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);
}

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const challengeId = params.get("challenge_id");
  useNoReferrer();

  if (!challengeId) {
    return <Navigate to="/forgot-password" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md py-16 text-center">
        <AuthBadge />
        <ResetPasswordForm initialChallengeId={challengeId} />
      </div>
    </div>
  );
}
