import React from "react";

import { useProfessionalOnboarding } from "./hooks";
import { OnboardingShell } from "~/components/onboarding/onboarding-shell";
import { StepZeroAccountType } from "~/components/onboarding/step-zero-account-type";
import { StepOneAccount } from "~/components/onboarding/step-one-account";
import { StepTwoPractice } from "~/components/onboarding/step-two-practice";
import { StepThreeVerification } from "~/components/onboarding/step-three-verification";
import { SubmissionSuccess } from "~/components/onboarding/submission-success";

interface ProfessionalOnboardingPageProps {
  onDashboardRedirect?: () => void;
}

export const ProfessionalOnboardingPage: React.FC<
  ProfessionalOnboardingPageProps
> = ({ onDashboardRedirect }) => {
  const {
    currentStep,
    formValues,
    isSubmitting,
    submissionResult,
    submissionError,
    updateFormValues,
    setDocument,
    goToNextStep,
    goToPreviousStep,
    handleFinalSubmit,
  } = useProfessionalOnboarding();

  const showBack = currentStep === 1 || currentStep === 2 || currentStep === 3;

  return (
    <OnboardingShell
      showBack={showBack}
      onBack={goToPreviousStep}
      showLogo={currentStep !== "success"}
      showLogoText={currentStep === 1 || currentStep === 2 || currentStep === 3}
    >
      {currentStep === 0 && (
        <StepZeroAccountType
          selectedType={formValues.accountType}
          onSelect={(type) => updateFormValues({ accountType: type })}
          onContinue={goToNextStep}
        />
      )}

      {currentStep === 1 && (
        <StepOneAccount
          initialValues={formValues}
          onContinue={(values) => {
            updateFormValues(values);
            goToNextStep();
          }}
        />
      )}

      {currentStep === 2 && (
        <StepTwoPractice
          initialValues={formValues}
          onContinue={(values) => {
            updateFormValues(values);
            goToNextStep();
          }}
        />
      )}

      {currentStep === 3 && (
        <StepThreeVerification
          initialValues={formValues}
          isSubmitting={isSubmitting}
          submissionError={submissionError}
          onSetDocument={setDocument}
          onSubmit={handleFinalSubmit}
        />
      )}

      {currentStep === "success" && (
        <SubmissionSuccess
          applicationId={submissionResult?.applicationId}
          onGoToDashboard={() => {
            onDashboardRedirect?.();
          }}
        />
      )}
    </OnboardingShell>
  );
};
