// app/routes/mp-dashboard/verify-email/page.tsx
import { VerifyEmailForm } from "~/routes/auth/verify-email/_sections/verify-email-form";
import AuthBadge from "~/components/shared/auth-badge";
import { useLocation, Navigate } from "react-router";

export default function VerifyEmailPage() {
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email;

  if (!email) return <Navigate to="/sign-up" replace />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md py-16 text-center">
        <AuthBadge />
        <VerifyEmailForm email={email} />
      </div>
    </div>
  );
}
