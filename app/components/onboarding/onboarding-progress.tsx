import React from "react";

interface OnboardingProgressProps {
  currentStep: number; // 1, 2, or 3
  totalSteps?: number;
}

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  currentStep,
  totalSteps = 3,
}) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div
      className="my-6 flex items-center justify-center sm:my-8"
      id="onboarding-progress-indicator"
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
    >
      <div className="flex items-center">
        {steps.map((stepNumber, index) => {
          const isCurrent = currentStep === stepNumber;
          const isCompleted = currentStep > stepNumber;
          const isActiveOrDone = isCurrent || isCompleted;

          return (
            <React.Fragment key={stepNumber}>
              {/* Step Circle */}
              <div
                id={`progress-step-circle-${stepNumber}`}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-all duration-200 sm:h-10 sm:w-10 ${
                  isActiveOrDone
                    ? "bg-blue-600 text-white shadow-sm ring-4 ring-blue-50"
                    : "border border-slate-200 bg-slate-100 text-slate-400"
                }`}
              >
                {stepNumber}
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  id={`progress-line-${stepNumber}-to-${stepNumber + 1}`}
                  className={`mx-1 h-0.5 w-12 transition-colors duration-200 sm:mx-2 sm:w-20 ${
                    currentStep > stepNumber ? "bg-blue-600" : "bg-slate-200"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
