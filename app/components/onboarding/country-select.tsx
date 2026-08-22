import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Check, Search } from 'lucide-react';

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
  'United States',
  'United Kingdom',
  'Nigeria',
  'Canada',
  'Australia',
  'Germany',
  'Ghana',
  'Kenya',
  'India',
  'South Africa',
  'France',
  'United Arab Emirates',
  'Ireland',
  'New Zealand',
  'Singapore',
  'Netherlands',
];

export const CountrySelect: React.FC<CountrySelectProps> = ({
  id,
  label = 'Country of Residence',
  value,
  onChange,
  onBlur,
  error,
  placeholder = 'Select Country',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isOpen) {
          setIsOpen(false);
          setSearchTerm('');
          onBlur?.();
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onBlur]);

  const filteredCountries = COUNTRIES.filter((c) =>
    c.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (country: string) => {
    onChange(country);
    setIsOpen(false);
    setSearchTerm('');
    onBlur?.();
  };

  return (
    <div className="w-full flex flex-col space-y-1.5 text-left" ref={dropdownRef} id={`group-${id}`}>
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
          className={`w-full h-12 px-4 bg-white border rounded-xl flex items-center justify-between text-left transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
            error
              ? 'border-red-400 focus:border-red-500'
              : isOpen
              ? 'border-blue-500 ring-2 ring-blue-500/10'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <span
            className={`text-sm truncate ${
              value ? 'text-slate-900 font-normal' : 'text-slate-400'
            }`}
          >
            {value || placeholder}
          </span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400 shrink-0 stroke-2" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 stroke-2" />
          )}
        </button>

        {isOpen && (
          <div
            id={`${id}-listbox`}
            role="listbox"
            className="absolute z-30 w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg py-1 max-h-60 overflow-hidden flex flex-col animate-in fade-in-50 duration-100"
          >
            <div className="p-2 border-b border-slate-100">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg text-slate-500 text-xs">
                <Search className="w-3.5 h-3.5" />
                <input
                  type="text"
                  placeholder="Search country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-slate-800 placeholder:text-slate-400 text-xs"
                  autoFocus
                />
              </div>
            </div>

            <div className="overflow-y-auto max-h-48 py-1">
              {filteredCountries.length === 0 ? (
                <div className="px-4 py-3 text-xs text-slate-400 text-center">
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
                      id={`country-opt-${country.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => handleSelect(country)}
                      className={`w-full px-4 py-2 text-sm text-left flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-blue-50/60 text-blue-700 font-medium'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{country}</span>
                      {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-600 font-medium mt-1" id={`error-${id}`}>
          {error}
        </p>
      )}
    </div>
  );
};
