import React from 'react';
import { ArrowLeft } from "lucide-react";

interface OnboardingShellProps {
  children: React.ReactNode;
  onBack?: () => void;
  showBack?: boolean;
  showLogo?: boolean;
  showLogoText?: boolean;
}

export const OnboardingShell: React.FC<OnboardingShellProps> = ({
  children,
  onBack,
  showBack = false,
  showLogo = true,
  showLogoText = false,
}) => {
  return (
    <div
      className="flex min-h-screen w-full flex-col justify-between bg-[#FAFCFF] text-slate-900 selection:bg-blue-100 selection:text-blue-900"
      id="onboarding-page-shell"
    >
      {/* Top Header Bar */}
      <header className="mx-auto flex min-h-12 w-full max-w-2xl items-center justify-between px-4 pt-6 sm:px-6">
        {showBack && onBack ? (
          <button
            type="button"
            id="btn-onboarding-back"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100/80 hover:text-slate-900 focus:outline-none"
            aria-label="Go back to previous step"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
        ) : (
          <div />
        )}
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-10">
        <div className="flex w-full max-w-125 flex-col items-center text-center">
          {showLogo && (
            <div
              className="mb-1 flex flex-col items-center"
              id="onboarding-brand-logo"
            >
              {/* OHealth+ brand mark */}
              <svg
                width="42"
                height="42"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="OHealth+"
                className={showLogoText ? "mb-1" : ""}
              >
                <path
                  d="M18 31.2C17.5 30.9 3 21.8 3 12.1C3 7.3 6.5 4 10.9 4C14.1 4 16.7 5.6 18 8C19.3 5.6 21.9 4 25.1 4C29.5 4 33 7.3 33 12.1C33 21.8 18.5 30.9 18 31.2Z"
                  fill="#0060EE"
                />

                <path
                  d="M18 12.5V19.5M14.5 16H21.5"
                  stroke="white"
                  strokeWidth="1.35"
                  strokeLinecap="round"
                />
              </svg>

              {showLogoText && (
                <span className="text-sm font-semibold tracking-tight text-slate-800">
                  OHealth+
                </span>
              )}
            </div>
          )}

          <div className="mt-2 w-full" id="onboarding-step-body">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
