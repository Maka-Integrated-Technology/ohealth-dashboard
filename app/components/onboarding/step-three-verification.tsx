import React, { useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { OnboardingProgress } from './onboarding-progress';
import { DocumentUpload } from "~/components/onboarding/document-upload";
import type {
  OnboardingFormValues,
  UploadedDocument,
} from "~/features/professional-onboarding/types";

interface StepThreeVerificationProps {
  initialValues: OnboardingFormValues;
  isSubmitting: boolean;
  submissionError: string | null;
  onSetDocument: (field: 'professionalLicense' | 'governmentId', doc: UploadedDocument | null) => void;
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
      ? 'Please upload your professional medical license'
      : undefined;

  const idError =
    attemptedSubmit && !initialValues.governmentId
      ? 'Please upload your valid government-issued ID'
      : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAttemptedSubmit(true);

    if (initialValues.professionalLicense && initialValues.governmentId) {
      onSubmit();
    }
  };

  const isReadyToSubmit = Boolean(initialValues.professionalLicense && initialValues.governmentId);

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in-50 duration-200" id="step-3-identity-verification">
      <OnboardingProgress currentStep={3} />

      <div className="mb-6 text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Verify Your Professional Identity
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
          To maintain a trusted healthcare ecosystem, we require all professionals to submit valid credentials for verification.
        </p>
      </div>

      {submissionError && (
        <div
          id="submission-error-banner"
          className="w-full mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 text-left"
        >
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{submissionError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full space-y-4 text-left" noValidate>
        <DocumentUpload
          id="professionalLicense"
          label="Professional License"
          placeholderText="Upload professional license"
          value={initialValues.professionalLicense}
          onChange={(doc) => onSetDocument('professionalLicense', doc)}
          error={licenseError}
          disabled={isSubmitting}
        />

        <DocumentUpload
          id="governmentId"
          label="Government-issued ID"
          placeholderText="Upload government-issued ID"
          value={initialValues.governmentId}
          onChange={(doc) => onSetDocument('governmentId', doc)}
          error={idError}
          disabled={isSubmitting}
        />

        <p className="text-xs text-slate-500 font-normal text-left pt-0.5">
          Supported formats: PDF, JPG, JPEG, PNG (Max. 10MB)
        </p>

        <div className="pt-2">
          <button
            type="submit"
            id="btn-submit-verification"
            disabled={isSubmitting}
            className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium text-sm sm:text-base shadow-sm shadow-blue-500/10 transition-all duration-150 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30 active:scale-[0.99]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
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
