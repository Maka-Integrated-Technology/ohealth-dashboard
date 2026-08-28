import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import type { ConsultationType } from "~/features/professional-onboarding/types";

interface ConsultationTypeSelectProps {
  id: string;
  label?: string;
  value: ConsultationType | "";
  onChange: (val: ConsultationType) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
}

const CONSULTATION_TYPES: ConsultationType[] = [
  "Chat Consultation",
  "Video Consultation",
  "Both",
];

export const ConsultationTypeSelect: React.FC<ConsultationTypeSelectProps> = ({
  id,
  label = "Consultation Type",
  value,
  onChange,
  onBlur,
  error,
  placeholder = "Select consultation type..",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        if (isOpen) {
          setIsOpen(false);
          onBlur?.();
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onBlur]);

  const handleSelect = (type: ConsultationType) => {
    onChange(type);
    setIsOpen(false);
    onBlur?.();
  };

  return (
    <div
      className="flex w-full flex-col space-y-1.5 text-left"
      ref={dropdownRef}
      id={`group-${id}`}
    >
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-800"
          id={`label-${id}`}
        >
          {label}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          id={id}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          className={`flex h-12 w-full items-center justify-between rounded-xl border bg-white px-4 text-left transition-colors duration-150 focus:ring-2 focus:ring-blue-500/20 focus:outline-none ${
            error
              ? "border-red-400 focus:border-red-500"
              : isOpen
                ? "border-blue-500 ring-2 ring-blue-500/10"
                : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <span
            className={`truncate text-sm ${
              value ? "font-normal text-slate-900" : "text-slate-400"
            }`}
          >
            {value || placeholder}
          </span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 shrink-0 stroke-2 text-slate-400" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0 stroke-2 text-slate-400" />
          )}
        </button>

        {isOpen && (
          <div
            id={`${id}-listbox`}
            role="listbox"
            className="animate-in fade-in-50 absolute z-30 mt-1.5 max-h-60 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg duration-100"
          >
            {CONSULTATION_TYPES.map((type) => {
              const isSelected = value === type;
              return (
                <button
                  key={type}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  id={`consult-opt-${type.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => handleSelect(type)}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                    isSelected
                      ? "bg-blue-50/60 font-medium text-blue-700"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{type}</span>
                  {isSelected && (
                    <Check className="h-4 w-4 shrink-0 text-blue-600" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-xs font-medium text-red-600" id={`error-${id}`}>
          {error}
        </p>
      )}
    </div>
  );
};
