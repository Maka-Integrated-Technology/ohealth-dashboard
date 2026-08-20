import React from 'react';
import { UserCheck, Building2, Check } from 'lucide-react';
import type { AccountType } from "~/features/professional-onboarding/types.js";

interface StepZeroAccountTypeProps {
  selectedType: AccountType;
  onSelect: (type: AccountType) => void;
  onContinue: () => void;
}

export const StepZeroAccountType: React.FC<StepZeroAccountTypeProps> = ({
  selectedType,
  onSelect,
  onContinue,
}) => {
  return (
    <div
      className="animate-in fade-in-50 flex w-full flex-col items-center duration-200"
      id="step-0-account-type"
    >
      <div className="mb-8 text-center">
        <h1 className="text-xl tracking-tight text-slate-900 sm:text-[20px]">
          Join OHealth+
        </h1>
        <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500 sm:text-[14px]">
          Select how you would like to use OHealth+ to get started.
        </p>
      </div>

      <div
        className="mb-8 grid w-full grid-cols-1 gap-3.5 sm:grid-cols-2"
        role="radiogroup"
        aria-label="Account type selection"
      >
        {/* Healthcare Professional Card */}
        <button
          type="button"
          id="account-type-professional"
          role="radio"
          aria-checked={selectedType === "healthcare_professional"}
          onClick={() => onSelect("healthcare_professional")}
          className={`group relative flex min-h-35 flex-col items-center justify-center rounded-2xl border p-5 text-center transition-all duration-150 focus:outline-none ${
            selectedType === "healthcare_professional"
              ? "border-blue-600 bg-blue-50/30 shadow-sm ring-2 ring-blue-500/20"
              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
          }`}
        >
          {selectedType === "healthcare_professional" && (
            <div className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
              <Check className="h-3 w-3 stroke-3" />
            </div>
          )}

          <div
            className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
              selectedType === "healthcare_professional"
                ? "bg-blue-100/80 text-blue-700"
                : "bg-slate-100 text-slate-600 group-hover:bg-slate-200/70"
            }`}
          >
            <UserCheck className="h-6 w-6 stroke-[1.75]" />
          </div>
          <span className="text-sm leading-snug font-medium text-slate-900 sm:text-[15px]">
            Healthcare Professional
          </span>
        </button>

        {/* Hospital / Pharmacy / Laboratory Card */}
        <button
          type="button"
          id="account-type-facility"
          role="radio"
          aria-checked={selectedType === "facility"}
          onClick={() => onSelect("facility")}
          className={`group relative flex min-h-35 flex-col items-center justify-center rounded-2xl border p-5 text-center transition-all duration-150 focus:outline-none ${
            selectedType === "facility"
              ? "border-blue-600 bg-blue-50/30 shadow-sm ring-2 ring-blue-500/20"
              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
          }`}
        >
          {selectedType === "facility" && (
            <div className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
              <Check className="h-3 w-3 stroke-3" />
            </div>
          )}

          <div
            className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
              selectedType === "facility"
                ? "bg-blue-100/80 text-blue-700"
                : "bg-slate-100 text-slate-600 group-hover:bg-slate-200/70"
            }`}
          >
            <Building2 className="h-6 w-6 stroke-[1.75]" />
          </div>
          <span className="text-sm leading-snug font-medium text-slate-900 sm:text-[15px]">
            Hospital / Pharmacy/ Laboratory
          </span>
        </button>
      </div>

      <button
        type="button"
        id="btn-continue-account-type"
        onClick={onContinue}
        className="h-12 w-full rounded-xl bg-blue-600 text-sm font-medium text-white shadow-sm shadow-blue-500/10 transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/30 focus:outline-none active:scale-[0.99] sm:text-base"
      >
        Continue
      </button>
    </div>
  );
};
