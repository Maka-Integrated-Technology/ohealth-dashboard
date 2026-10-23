import { Activity, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { StepProgress } from "~/features/laboratory-auth/laboratory-auth-fields";

const primaryButtonClassName =
  "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50";


export function LaboratoryAuthCompletion({
  screen,
  activeStep,
  selectedModules,
  onToggleModule,
  onOpenScreen,
  onOpenDashboard,
}: {
  screen: string;
  activeStep: number;
  selectedModules: string[];
  onToggleModule: (key: string) => void;
  onOpenScreen: (next: "approved" | "setup-complete" | "ready" | "sign-in") => void;
  onOpenDashboard: () => void;
}) {
  return (
    <>
      {screen === "review" ? (
            <div className="space-y-6">
              <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
                <div className="flex size-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  <ShieldCheck className="size-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  Documents submitted
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  The next step is for OHealth to review the laboratory details
                  and supporting documents. In a live service, status updates
                  would be sent to the administrator email.
                </p>
              </div>
              <StepProgress activeStep={activeStep} />
              <ol className="space-y-4">
                {[
                  ["Documents received", "Registration details collected"],
                  ["Under review", "Compliance team review"],
                  ["Approved", "Verification complete"],
                ].map((item, index) => (
                  <li className="flex items-start gap-3" key={item[0]}>
                    <span
                      className={
                        "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full " +
                        (index === 0
                          ? "bg-emerald-100 text-emerald-700"
                          : index === 1
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-400")
                      }
                    >
                      {index === 0 ? (
                        <CheckCircle2 className="size-4" />
                      ) : index === 1 ? (
                        <Activity className="size-4" />
                      ) : (
                        <ShieldCheck className="size-4" />
                      )}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {item[0]}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">{item[1]}</p>
                    </div>
                    {index === 1 ? (
                      <span className="ml-auto rounded-full bg-blue-100 px-2 py-1 text-[10px] font-semibold text-blue-700">
                        Current state
                      </span>
                    ) : null}
                  </li>
                ))}
              </ol>
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3 text-xs leading-5 text-amber-900">
                Demo state only: no registration was saved and no compliance
                review has taken place.
              </div>
              <button
                className={primaryButtonClassName}
                type="button"
                onClick={() => onOpenScreen("approved")}
              >
                Preview approved state <ArrowRight className="size-4" />
              </button>
              <button
                className="w-full py-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
                type="button"
                onClick={() => onOpenScreen("sign-in")}
              >
                Return to sign in
              </button>
            </div>
          ) : null}

          {screen === "approved" ? (
            <div className="space-y-5">
              <StepProgress activeStep={activeStep} />
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="size-7" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  Laboratory verified
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  This is a preview of the approved state. A real approval would
                  be granted only after the OHealth compliance process.
                </p>
              </div>
              <button
                className={primaryButtonClassName}
                type="button"
                onClick={() => onOpenScreen("setup-complete")}
              >
                Continue to setup <ArrowRight className="size-4" />
              </button>
              <button
                className="w-full py-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
                type="button"
                onClick={() => onOpenScreen("sign-in")}
              >
                Return to sign in
              </button>
            </div>
          ) : null}

          {screen === "setup-complete" ? (
            <div className="space-y-5">
              <StepProgress activeStep={5} />
              <div>
                <h3 className="font-semibold text-slate-900">
                  Choose your first workflows
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  These are preview selections for the intended workspace setup.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  ["appointments", "Appointments", "Requests and schedules"],
                  [
                    "patients",
                    "Patient records",
                    "Test results and patient records",
                  ],
                  [
                    "laboratory",
                    "Test processing",
                    "Track lab tests and results",
                  ],
                  [
                    "prescriptions",
                    "Results sharing",
                    "Clinician communication",
                  ],
                ].map(([key, label, description]) => {
                  const checked = selectedModules.includes(key);
                  return (
                    <button
                      aria-pressed={checked}
                      className={
                        "flex w-full items-center gap-3 rounded-xl border p-4 text-left transition " +
                        (checked
                          ? "border-blue-200 bg-blue-50/60"
                          : "border-slate-200 bg-white hover:bg-slate-50")
                      }
                      key={key}
                      type="button"
                      onClick={() => onToggleModule(key)}
                    >
                      <span
                        className={
                          "flex size-5 shrink-0 items-center justify-center rounded border " +
                          (checked
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-slate-300 bg-white")
                        }
                      >
                        {checked ? <CheckCircle2 className="size-3.5" /> : null}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-slate-800">
                          {label}
                        </span>
                        <span className="mt-1 block text-xs text-slate-500">
                          {description}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <button
                className={primaryButtonClassName}
                type="button"
                onClick={() => onOpenScreen("ready")}
              >
                Finish setup preview <ArrowRight className="size-4" />
              </button>
              <div className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs leading-5 text-blue-800">
                The laboratory dashboard will be implemented after this
                authentication preview and the Cloudflare setup are reviewed.
              </div>
              <button
                className="w-full py-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
                type="button"
                onClick={() => onOpenScreen("sign-in")}
              >
                Return to sign in
              </button>
            </div>
          ) : null}

          {screen === "ready" ? (
            <div className="space-y-5">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="size-7" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  Authentication preview complete
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Sign-in, registration, document selection, review, approval,
                  and workspace setup states are ready for visual review. No
                  real account or verification was created.
                </p>
              </div>
              <button
                className={primaryButtonClassName}
                type="button"
                onClick={() => onOpenScreen("sign-in")}
              >
                Return to lab sign in <ArrowRight className="size-4" />
              </button>
              <button
                className="w-full py-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
                type="button"
                onClick={() => onOpenScreen("sign-in")}
              >
                Return to sign in
              </button>
            </div>
          ) : null}
    </>
  );
}
