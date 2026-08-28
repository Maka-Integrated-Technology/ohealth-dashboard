import React, { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { OnboardingProgress } from "./onboarding-progress";
import { DocumentUpload } from "~/components/onboarding/document-upload";
import type {
  OnboardingFormValues,
  UploadedDocument,
} from "~/features/professional-onboarding/types";

interface StepThreeVerificationProps {
  initialValues: OnboardingFormValues;
  isSubmitting: boolean;
  submissionError: string | null;
  onSetDocument: (
    field: "professionalLicense" | "governmentId",
    doc: UploadedDocument | null
  ) => void;
  onSubmit: () => void;
}

export const StepThreeVerification: React.FC<StepThreeVerificationProps> = ({
  initialValues,
  isSubmitting,
  submissionError,
  onSetDocument,
  onSubmit,
}) => {
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const licenseError =
    attemptedSubmit && !initialValues.professionalLicense
      ? "Please upload your professional medical license"
      : undefined;

  const idError =
    attemptedSubmit && !initialValues.governmentId
      ? "Please upload your valid government-issued ID"
      : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAttemptedSubmit(true);

    if (initialValues.professionalLicense && initialValues.governmentId) {
      onSubmit();
    }
  };

  const isReadyToSubmit = Boolean(
    initialValues.professionalLicense && initialValues.governmentId
  );

  return (
    <div
      className="animate-in fade-in-50 flex w-full flex-col items-center duration-200"
      id="step-3-identity-verification"
    >
      <OnboardingProgress currentStep={3} />

      <div className="mb-6 text-center">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Verify Your Professional Identity
        </h1>
        <p className="mx-auto mt-1.5 max-w-sm text-xs text-slate-500 sm:text-sm">
          To maintain a trusted healthcare ecosystem, we require all
          professionals to submit valid credentials for verification.
        </p>
      </div>

      {submissionError && (
        <div
          id="submission-error-banner"
          className="mb-4 flex w-full items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-left text-xs text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
          <span>{submissionError}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full space-y-4 text-left"
        noValidate
      >
        <DocumentUpload
          id="professionalLicense"
          label="Professional License"
          placeholderText="Upload professional license"
          value={initialValues.professionalLicense}
          onChange={(doc) => onSetDocument("professionalLicense", doc)}
          error={licenseError}
          disabled={isSubmitting}
        />

        <DocumentUpload
          id="governmentId"
          label="Government-issued ID"
          placeholderText="Upload government-issued ID"
          value={initialValues.governmentId}
          onChange={(doc) => onSetDocument("governmentId", doc)}
          error={idError}
          disabled={isSubmitting}
        />

        <p className="pt-0.5 text-left text-xs font-normal text-slate-500">
          Supported formats: PDF, JPG, JPEG, PNG (Max. 10MB)
        </p>

        <div className="pt-2">
          <button
            type="submit"
            id="btn-submit-verification"
            disabled={isSubmitting}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-medium text-white shadow-sm shadow-blue-500/10 transition-all duration-150 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/30 focus:outline-none active:scale-[0.99] disabled:bg-blue-400 sm:text-base"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Submitting documents...</span>
              </>
            ) : isReadyToSubmit ? (
              <span>Submit</span>
            ) : (
              <span>Continue</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
