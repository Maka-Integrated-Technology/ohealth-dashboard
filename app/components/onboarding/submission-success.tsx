import React from 'react';
import { Check } from 'lucide-react';

interface SubmissionSuccessProps {
  onGoToDashboard: () => void;
  applicationId?: string;
}

export const SubmissionSuccess: React.FC<SubmissionSuccessProps> = ({
  onGoToDashboard,
}) => {
  return (
    <div
      className="w-full flex flex-col items-center text-center animate-in fade-in-50 zoom-in-95 duration-200"
      id="submission-success-view"
    >
      <div
        id="success-checkmark-badge"
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 mb-6"
      >
        <Check className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.5]" />
      </div>

      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2.5">
        Submitted Successfully
      </h1>

      <p className="text-sm sm:text-[15px] text-slate-500 max-w-105 leading-relaxed mb-8">
        Your documents have been submitted successfully. Our team is reviewing your information and will notify you once your account has been approved.
      </p>

      <button
        type="button"
        id="btn-go-to-dashboard"
        onClick={onGoToDashboard}
        className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm sm:text-base shadow-sm shadow-blue-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30 active:scale-[0.99]"
      >
        Go To Dashboard
      </button>
    </div>
  );
};
