import React from "react";
import { Check } from "lucide-react";

interface SubmissionSuccessProps {
  onGoToDashboard: () => void;
  applicationId?: string;
}

export const SubmissionSuccess: React.FC<SubmissionSuccessProps> = ({
  onGoToDashboard,
}) => {
  return (
    <div
      className="animate-in fade-in-50 zoom-in-95 flex w-full flex-col items-center text-center duration-200"
      id="submission-success-view"
    >
      <div
        id="success-checkmark-badge"
        className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-md shadow-blue-500/20 sm:h-16 sm:w-16"
      >
        <Check className="h-7 w-7 stroke-[2.5] sm:h-8 sm:w-8" />
      </div>

      <h1 className="mb-2.5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
        Submitted Successfully
      </h1>

      <p className="mb-8 max-w-105 text-sm leading-relaxed text-slate-500 sm:text-[15px]">
        Your documents have been submitted successfully. Our team is reviewing
        your information and will notify you once your account has been
        approved.
      </p>

      <button
        type="button"
        id="btn-go-to-dashboard"
        onClick={onGoToDashboard}
        className="h-12 w-full rounded-xl bg-blue-600 text-sm font-medium text-white shadow-sm shadow-blue-500/10 transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/30 focus:outline-none active:scale-[0.99] sm:text-base"
      >
        Go To Dashboard
      </button>
    </div>
  );
};
