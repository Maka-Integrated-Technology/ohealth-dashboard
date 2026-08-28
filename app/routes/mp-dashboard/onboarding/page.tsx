import { useNavigate } from "react-router";
import { ProfessionalOnboardingPage } from "~/features/professional-onboarding/page";

export default function OnboardingPage() {
  const navigate = useNavigate();

  return (
    <ProfessionalOnboardingPage
      onDashboardRedirect={() => navigate("/", { replace: true })}
    />
  );
}
