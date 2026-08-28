import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, Check, Search } from "lucide-react";

interface CountrySelectProps {
  id: string;
  label?: string;
  value: string;
  onChange: (val: string) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
}

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Nigeria",
  "Canada",
  "Australia",
  "Germany",
  "Ghana",
  "Kenya",
  "India",
  "South Africa",
  "France",
  "United Arab Emirates",
  "Ireland",
  "New Zealand",
  "Singapore",
  "Netherlands",
];

export const CountrySelect: React.FC<CountrySelectProps> = ({
  id,
  label = "Country of Residence",
  value,
  onChange,
  onBlur,
  error,
  placeholder = "Select Country",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        if (isOpen) {
          setIsOpen(false);
          setSearchTerm("");
          onBlur?.();
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onBlur]);

  const filteredCountries = COUNTRIES.filter((c) =>
    c.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (country: string) => {
    onChange(country);
    setIsOpen(false);
    setSearchTerm("");
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
            className="animate-in fade-in-50 absolute z-30 mt-1.5 flex max-h-60 w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg duration-100"
          >
            <div className="border-b border-slate-100 p-2">
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-500">
                <Search className="h-3.5 w-3.5" />
                <input
                  type="text"
                  placeholder="Search country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border-none bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400"
                  autoFocus
                />
              </div>
            </div>

            <div className="max-h-48 overflow-y-auto py-1">
              {filteredCountries.length === 0 ? (
                <div className="px-4 py-3 text-center text-xs text-slate-400">
                  No countries found
                </div>
              ) : (
                filteredCountries.map((country) => {
                  const isSelected = value === country;
                  return (
                    <button
                      key={country}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      id={`country-opt-${country.toLowerCase().replace(/\s+/g, "-")}`}
                      onClick={() => handleSelect(country)}
                      className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors ${
                        isSelected
                          ? "bg-blue-50/60 font-medium text-blue-700"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span>{country}</span>
                      {isSelected && (
                        <Check className="h-4 w-4 shrink-0 text-blue-600" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
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
