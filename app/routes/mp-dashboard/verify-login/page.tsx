// app/routes/mp-dashboard/verify-login/page.tsx
import { VerifyLoginForm } from "~/routes/auth/verify-login/_sections/verify-login-form";
import AuthBadge from "~/components/shared/auth-badge";
import { useLocation, Navigate } from "react-router";

export default function VerifyLoginPage() {
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email;

  if (!email) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-87.5 text-center">
        <AuthBadge />
        <VerifyLoginForm email={email} />
      </div>
    </div>
  );
}
