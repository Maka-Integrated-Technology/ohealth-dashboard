import { useState, useEffect, useCallback } from "react";
import type {
  OnboardingFormValues,
  OnboardingStep,
  UploadedDocument,
  SubmissionResponse,
} from "./types.js";
import { submitProfessionalOnboarding } from "./api.js";

const STORAGE_KEY = "ohealth_professional_onboarding_state";

const initialValues: OnboardingFormValues = {
  accountType: "healthcare_professional",
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  country: "",
  specialization: "",
  licenseNumber: "",
  yearsOfExperience: "",
  consultationType: "",
  shortBio: "",
  professionalLicense: null,
  governmentId: null,
};

export function useProfessionalOnboarding() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(0);
  const [formValues, setFormValues] = useState<OnboardingFormValues>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...initialValues,
          ...parsed,
          professionalLicense: parsed.professionalLicense
            ? { ...parsed.professionalLicense, file: undefined }
            : null,
          governmentId: parsed.governmentId
            ? { ...parsed.governmentId, file: undefined }
            : null,
        };
      }
    } catch {
      // Ignore storage read errors
    }
    return initialValues;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] =
    useState<SubmissionResponse | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [showVerifiedModal, setShowVerifiedModal] = useState(false);

  // Sync textual form state to sessionStorage
  useEffect(() => {
    try {
      const stateToPersist = {
        ...formValues,
        professionalLicense: formValues.professionalLicense
          ? {
              name: formValues.professionalLicense.name,
              size: formValues.professionalLicense.size,
              type: formValues.professionalLicense.type,
            }
          : null,
        governmentId: formValues.governmentId
          ? {
              name: formValues.governmentId.name,
              size: formValues.governmentId.size,
              type: formValues.governmentId.type,
            }
          : null,
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stateToPersist));
    } catch {
      // Storage fallback
    }
  }, [formValues]);

  const updateFormValues = useCallback(
    (updates: Partial<OnboardingFormValues>) => {
      setFormValues((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const setDocument = useCallback(
    (
      field: "professionalLicense" | "governmentId",
      doc: UploadedDocument | null
    ) => {
      setFormValues((prev) => ({ ...prev, [field]: doc }));
    },
    []
  );

  const goToNextStep = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev === 0) return 1;
      if (prev === 1) return 2;
      if (prev === 2) return 3;
      return prev;
    });
  }, []);

  const goToPreviousStep = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev === 3) return 2;
      if (prev === 2) return 1;
      if (prev === 1) return 0;
      return prev;
    });
  }, []);

  const navigateTo = useCallback((step: OnboardingStep) => {
    setCurrentStep(step);
  }, []);

  const handleFinalSubmit = useCallback(async () => {
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const result = await submitProfessionalOnboarding({ values: formValues });
      setSubmissionResult(result);
      setCurrentStep("success");
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        /* empty */
      }
    } catch (err) {
      setSubmissionError(
        err instanceof Error
          ? err.message
          : "An error occurred during submission. Please retry."
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [formValues]);

  const resetOnboarding = useCallback(() => {
    setFormValues(initialValues);
    setCurrentStep(0);
    setSubmissionResult(null);
    setSubmissionError(null);
    setIsVerified(false);
    setShowVerifiedModal(false);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* empty */
    }
  }, []);

  return {
    currentStep,
    formValues,
    isSubmitting,
    submissionResult,
    submissionError,
    isVerified,
    showVerifiedModal,
    setIsVerified,
    setShowVerifiedModal,
    updateFormValues,
    setDocument,
    goToNextStep,
    goToPreviousStep,
    navigateTo,
    handleFinalSubmit,
    resetOnboarding,
  };
}
