import { CheckCircle2 } from "lucide-react";
import { useId } from "react";
type InputKind = "text" | "email" | "tel" | "password";
const WIZARD_STEPS = [
  "Laboratory details",
  "Administrator",
  "Documents",
  "Verification",
  "Setup",
];

export const inputClassName =
  "h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

export function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  required = true,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: InputKind;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  hint?: string;
}) {
  const id = useId();

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700" htmlFor={id}>
        {label}
        {required ? <span className="ml-1 text-rose-500">*</span> : null}
      </label>
      <input
        id={id}
        className={inputClassName}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        // Preview mode keeps this optional so every screen can be explored.
        // Native input types (such as email) still validate values when supplied.
        onChange={(event) => onChange(event.currentTarget.value)}
      />
      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

export function StepProgress({ activeStep }: { activeStep: number }) {
  return (
    <ol
      className="mb-7 grid grid-cols-5 gap-1.5"
      aria-label="Registration progress"
    >
      {WIZARD_STEPS.map((label, index) => {
        const stepNumber = index + 1;
        const isComplete = stepNumber < activeStep;
        const isActive = stepNumber === activeStep;

        return (
          <li className="min-w-0 text-center" key={label}>
            <div
              className={
                "mx-auto mb-2 flex size-7 items-center justify-center rounded-full text-xs font-semibold " +
                (isComplete || isActive
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-500")
              }
              aria-current={isActive ? "step" : undefined}
            >
              {isComplete ? <CheckCircle2 className="size-4" /> : stepNumber}
            </div>
            <span
              className={
                "block text-[10px] leading-tight sm:text-xs " +
                (isActive ? "font-semibold text-blue-700" : "text-slate-500")
              }
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
