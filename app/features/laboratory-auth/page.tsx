import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { nextLabRegistrationStep, labAdministratorPasswordError } from "~/features/laboratory-auth/laboratory-registration-flow";
import LaboratoryAuthHero from "~/features/laboratory-auth/laboratory-auth-hero";
import { Field, StepProgress, inputClassName } from "~/features/laboratory-auth/laboratory-auth-fields";

type AuthScreen =
  | "sign-in"
  | "register"
  | "forgot-password"
  | "review"
  | "approved"
  | "setup-complete"
  | "ready";
type RegistrationStep = 1 | 2 | 3;
type DocumentKey = "license" | "registration" | "accreditation";

type LaboratoryDetails = {
  name: string;
  registrationNumber: string;
  licenseNumber: string;
  address: string;
  state: string;
  phone: string;
  email: string;
};

type AdministratorDetails = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

const DOCUMENTS: {
  key: DocumentKey;
  label: string;
  description: string;
}[] = [
  {
    key: "license",
    label: "Laboratory License",
    description: "Issued by NAFDAC / State Ministry of Health.",
  },
  {
    key: "registration",
    label: "CAC Registration Certificate",
    description: "Corporate Affairs Commission.",
  },
  {
    key: "accreditation",
    label: "Accreditation Certificate",
    description: "Medical Laboratory Science Council of Nigeria.",
  },
];

const primaryButtonClassName =
  "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50";

const secondaryButtonClassName =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";

export default function LaboratoryAuthPage() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<AuthScreen>("sign-in");
  const [registrationStep, setRegistrationStep] = useState<RegistrationStep>(1);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [adminError, setAdminError] = useState("");
  const [documentError, setDocumentError] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const loginForm = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({ email: Yup.string().email("Enter a valid email address.") }),
    onSubmit: () => navigate("/dashboard"),
  });
  const resetForm = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({ email: Yup.string().email("Enter a valid email address.") }),
    onSubmit: () => setFeedback("Password-reset is a preview state only. No reset email was sent."),
  });
  const labForm = useFormik<LaboratoryDetails>({
    initialValues: {
      name: "", registrationNumber: "", licenseNumber: "", address: "", state: "", phone: "", email: "",
    },
    validationSchema: Yup.object({ email: Yup.string().email("Enter a valid laboratory email.") }),
    onSubmit: () => {
      setFeedback("");
      setRegistrationStep(nextLabRegistrationStep(1) as RegistrationStep);
    },
  });
  const adminForm = useFormik<AdministratorDetails>({
    initialValues: {
      fullName: "", email: "", phone: "", password: "", confirmPassword: "",
    },
    validationSchema: Yup.object({ email: Yup.string().email("Enter a valid administrator email.") }),
    onSubmit: (values) => {
      const error = labAdministratorPasswordError(values);
      if (error) {
        setAdminError(error);
        return;
      }
      setAdminError("");
      setRegistrationStep(nextLabRegistrationStep(2) as RegistrationStep);
    },
  });
  const laboratory = labForm.values;
  const administrator = adminForm.values;
  const [documents, setDocuments] = useState<Record<DocumentKey, File | null>>({
    license: null,
    registration: null,
    accreditation: null,
  });
  const [selectedModules, setSelectedModules] = useState([
    "appointments",
    "patients",
    "laboratory",
    "prescriptions",
  ]);

  const updateLaboratory = (key: keyof LaboratoryDetails, value: string) => {
    void labForm.setFieldValue(key, value);
  };
  const updateAdministrator = (key: keyof AdministratorDetails, value: string) => {
    void adminForm.setFieldValue(key, value);
  };

  const openScreen = (nextScreen: AuthScreen) => {
    setFeedback("");
    setScreen(nextScreen);
  };

  const startRegistration = () => {
    setRegistrationStep(1);
    setAdminError("");
    setDocumentError("");
    openScreen("register");
  };

  const handleDocumentChange = (
    key: DocumentKey,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.currentTarget.files?.[0] ?? null;
    if (file && file.size > 10 * 1024 * 1024) {
      setDocumentError("Each document must be 10 MB or smaller.");
      event.currentTarget.value = "";
      return;
    }

    setDocumentError("");
    setDocuments((current) => ({ ...current, [key]: file }));
  };

  const handleDocumentSubmission = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // File selection is optional while previewing the journey.
    setDocumentError("");
    openScreen("review");
  };

  const activeStep =
    screen === "review" || screen === "approved"
      ? 4
      : screen === "setup-complete" || screen === "ready"
        ? 5
        : registrationStep;

  return (
    <div className="min-h-screen bg-[#fcfcfc] lg:grid lg:grid-cols-[minmax(350px,0.99fr)_minmax(500px,1.01fr)]">
      <LaboratoryAuthHero />      <main className="flex min-h-[70vh] items-center justify-center px-5 py-10 sm:px-8 lg:min-h-screen lg:px-12 xl:px-16">
        <div className="w-full max-w-xl">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-blue-700 uppercase">
                OHealth+ · Laboratory portal
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                {screen === "sign-in"
                  ? "Sign in"
                  : screen === "forgot-password"
                    ? "Reset your password"
                    : screen === "register"
                      ? "Register your laboratory"
                      : screen === "review"
                        ? "Application submitted"
                        : screen === "approved"
                          ? "Verified & approved"
                          : screen === "ready"
                            ? "Preview complete"
                            : "Set up your workspace"}
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500">
                {screen === "sign-in"
                  ? "Sign in to your laboratory dashboard"
                  : screen === "forgot-password"
                    ? "Enter your laboratory administrator email address."
                    : screen === "register"
                      ? "Tell us about your facility so we can prepare your workspace."
                      : screen === "review"
                        ? "Your registration journey has reached the verification stage."
                        : screen === "approved"
                          ? "Preview the next step after a laboratory has been verified."
                          : screen === "ready"
                            ? "You have reached the end of the authentication and onboarding preview."
                            : "Choose the laboratory workflows your team will use first."}
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
              Preview
            </span>
          </div>

          {screen === "sign-in" ? (
            <form className="space-y-5" onSubmit={loginForm.handleSubmit}>
              <Field
                label="Email address"
                value={loginForm.values.email}
                onChange={(value) => void loginForm.setFieldValue("email", value)}
                type="email"
                autoComplete="email"
                placeholder="admin@laboratory.ng"
              />
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-3">
                  <label
                    className="text-sm font-medium text-slate-700"
                    htmlFor="laboratory-login-password"
                  >
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <button
                    className="text-xs font-semibold text-blue-700 hover:text-blue-800"
                    type="button"
                    onClick={() => openScreen("forgot-password")}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="laboratory-login-password"
                    className={inputClassName + " pr-12"}
                    type={showLoginPassword ? "text" : "password"}
                    value={loginForm.values.password}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    onChange={(event) =>
                      void loginForm.setFieldValue("password", event.currentTarget.value)
                    }
                  />
                  <button
                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 hover:text-slate-700"
                    type="button"
                    aria-label={
                      showLoginPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowLoginPassword((shown) => !shown)}
                  >
                    {showLoginPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {feedback ? (
                <p
                  className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-sm leading-5 text-blue-800"
                  role="status"
                >
                  {feedback}
                </p>
              ) : null}

              <button className={primaryButtonClassName} type="submit">
                Sign in <ArrowRight className="size-4" />
              </button>
              <div className="flex items-center gap-3 py-1">
                <span className="h-px flex-1 bg-slate-200" />
                <span className="text-xs text-slate-400">New to OHealth+?</span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>
              <button
                className={secondaryButtonClassName + " w-full"}
                type="button"
                onClick={startRegistration}
              >
                Register your laboratory
              </button>
            </form>
          ) : null}

          {screen === "forgot-password" ? (
            <form className="space-y-5" onSubmit={resetForm.handleSubmit}>
              <Field
                label="Email address"
                value={resetForm.values.email}
                onChange={(value) => void resetForm.setFieldValue("email", value)}
                type="email"
                autoComplete="email"
                placeholder="admin@laboratory.ng"
              />
              {feedback ? (
                <p
                  className="rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-sm leading-5 text-blue-800"
                  role="status"
                >
                  {feedback}
                </p>
              ) : null}
              <button className={primaryButtonClassName} type="submit">
                Preview reset request <ArrowRight className="size-4" />
              </button>
              <button
                className={secondaryButtonClassName + " w-full"}
                type="button"
                onClick={() => openScreen("sign-in")}
              >
                <ChevronLeft className="size-4" /> Back to sign in
              </button>
            </form>
          ) : null}

          {screen === "register" ? (
            <>
              <p className="mb-4 rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-2.5 text-xs leading-5 text-blue-800">
                Preview mode: leave fields blank to move through the steps.
                Entered email addresses and selected file sizes are still
                checked.
              </p>
              <StepProgress activeStep={activeStep} />

              {registrationStep === 1 ? (
                <form className="space-y-4" onSubmit={labForm.handleSubmit}>
                  <div className="mb-1">
                    <h3 className="font-semibold text-slate-900">
                      Laboratory details
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Tell us about your facility.
                    </p>
                  </div>
                  <Field
                    label="Laboratory name"
                    value={laboratory.name}
                    onChange={(value) => updateLaboratory("name", value)}
                    placeholder="e.g. MedCore Diagnostics"
                    autoComplete="organization"
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Registration number"
                      value={laboratory.registrationNumber}
                      onChange={(value) =>
                        updateLaboratory("registrationNumber", value)
                      }
                      placeholder="e.g. RC-000000"
                    />
                    <Field
                      label="Laboratory licence number"
                      value={laboratory.licenseNumber}
                      onChange={(value) =>
                        updateLaboratory("licenseNumber", value)
                      }
                      placeholder="e.g. LAB-LG-0000-2025"
                    />
                  </div>
                  <Field
                    label="Laboratory address"
                    value={laboratory.address}
                    onChange={(value) => updateLaboratory("address", value)}
                    placeholder="Street address, city"
                    autoComplete="street-address"
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="State / region"
                      value={laboratory.state}
                      onChange={(value) => updateLaboratory("state", value)}
                      placeholder="e.g. Lagos"
                      autoComplete="address-level1"
                    />
                    <Field
                      label="Phone number"
                      value={laboratory.phone}
                      onChange={(value) => updateLaboratory("phone", value)}
                      type="tel"
                      placeholder="+234 800 000 0000"
                      autoComplete="tel"
                    />
                  </div>
                  <Field
                    label="Contact email"
                    value={laboratory.email}
                    onChange={(value) => updateLaboratory("email", value)}
                    type="email"
                    placeholder="info@laboratory.ng"
                    autoComplete="email"
                  />
                  <button className={primaryButtonClassName} type="submit">
                    Continue <ChevronRight className="size-4" />
                  </button>
                </form>
              ) : null}

              {registrationStep === 2 ? (
                <form
                  className="space-y-4"
                  onSubmit={adminForm.handleSubmit}
                >
                  <div className="mb-1">
                    <h3 className="font-semibold text-slate-900">
                      Administrator account
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      This person will manage the laboratory workspace.
                    </p>
                  </div>
                  <Field
                    label="Full name"
                    value={administrator.fullName}
                    onChange={(value) => updateAdministrator("fullName", value)}
                    placeholder="e.g. Dr. Chiamaka Eze"
                    autoComplete="name"
                  />
                  <Field
                    label="Administrator email"
                    value={administrator.email}
                    onChange={(value) => updateAdministrator("email", value)}
                    type="email"
                    placeholder="admin@laboratory.ng"
                    autoComplete="email"
                  />
                  <Field
                    label="Phone number"
                    value={administrator.phone}
                    onChange={(value) => updateAdministrator("phone", value)}
                    type="tel"
                    placeholder="+234 800 000 0000"
                    autoComplete="tel"
                  />
                  <Field
                    label="Create password"
                    value={administrator.password}
                    onChange={(value) => updateAdministrator("password", value)}
                    type="password"
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    hint="Use at least 8 characters."
                  />
                  <div className="space-y-1.5">
                    <label
                      className="block text-sm font-medium text-slate-700"
                      htmlFor="laboratory-confirm-password"
                    >
                      Confirm password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="laboratory-confirm-password"
                        className={inputClassName}
                        type={showAdminPassword ? "text" : "password"}
                        value={administrator.confirmPassword}
                        autoComplete="new-password"
                        placeholder="Re-enter password"
                        onChange={(event) =>
                          updateAdministrator(
                            "confirmPassword",
                            event.currentTarget.value
                          )
                        }
                      />
                    </div>
                    <button
                      className="text-xs font-medium text-blue-700 hover:text-blue-800"
                      type="button"
                      onClick={() => setShowAdminPassword((shown) => !shown)}
                    >
                      {showAdminPassword ? "Hide password" : "Show password"}
                    </button>
                  </div>
                  {adminError ? (
                    <p className="text-sm text-rose-600" role="alert">
                      {adminError}
                    </p>
                  ) : null}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      className={secondaryButtonClassName}
                      type="button"
                      onClick={() => {
                        setAdminError("");
                        setRegistrationStep(1);
                      }}
                    >
                      <ChevronLeft className="size-4" /> Back
                    </button>
                    <button className={primaryButtonClassName} type="submit">
                      Continue <ChevronRight className="size-4" />
                    </button>
                  </div>
                </form>
              ) : null}

              {registrationStep === 3 ? (
                <form className="space-y-4" onSubmit={handleDocumentSubmission}>
                  <div className="mb-1">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-slate-900">
                        Verification documents
                      </h3>
                      <span className="text-xs font-medium text-slate-500">
                        {Object.values(documents).filter(Boolean).length} / 3
                        selected
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      Upload clear, legible copies of your laboratory documents.
                    </p>
                  </div>

                  {DOCUMENTS.map((document) => {
                    const file = documents[document.key];
                    const inputId = "laboratory-document-" + document.key;

                    return (
                      <div
                        className="rounded-xl border border-slate-200 bg-white p-4"
                        key={document.key}
                      >
                        <div className="flex gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                            {file ? (
                              <CheckCircle2 className="size-5" />
                            ) : (
                              <FileText className="size-5" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <label
                              className="block cursor-pointer text-sm font-semibold text-slate-800"
                              htmlFor={inputId}
                            >
                              {document.label}
                            </label>
                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              {file ? file.name : document.description}
                            </p>
                            <p className="mt-1 text-[11px] text-slate-400">
                              PDF, JPG or PNG · Maximum 10 MB
                            </p>
                          </div>
                          <label
                            className="shrink-0 cursor-pointer self-center rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                            htmlFor={inputId}
                          >
                            {file ? "Replace" : "Browse"}
                          </label>
                        </div>
                        <input
                          id={inputId}
                          className="sr-only"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                          onChange={(event) =>
                            handleDocumentChange(document.key, event)
                          }
                        />
                      </div>
                    );
                  })}

                  {documentError ? (
                    <p className="text-sm text-rose-600" role="alert">
                      {documentError}
                    </p>
                  ) : null}

                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      className={secondaryButtonClassName}
                      type="button"
                      onClick={() => setRegistrationStep(2)}
                    >
                      <ChevronLeft className="size-4" /> Back
                    </button>
                    <button className={primaryButtonClassName} type="submit">
                      Submit for review <ArrowRight className="size-4" />
                    </button>
                  </div>
                  <p className="text-xs leading-5 text-slate-500">
                    This preview does not upload documents or submit a real
                    registration application.
                  </p>
                </form>
              ) : null}
            </>
          ) : null}

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
                onClick={() => openScreen("approved")}
              >
                Preview approved state <ArrowRight className="size-4" />
              </button>
              <button
                className="w-full py-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
                type="button"
                onClick={() => openScreen("sign-in")}
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
                onClick={() => openScreen("setup-complete")}
              >
                Continue to setup <ArrowRight className="size-4" />
              </button>
              <button
                className="w-full py-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
                type="button"
                onClick={() => openScreen("sign-in")}
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
                      onClick={() =>
                        setSelectedModules((current) =>
                          current.includes(key)
                            ? current.filter((item) => item !== key)
                            : [...current, key]
                        )
                      }
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
                onClick={() => openScreen("ready")}
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
                onClick={() => openScreen("sign-in")}
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
                onClick={() => openScreen("sign-in")}
              >
                Return to lab sign in <ArrowRight className="size-4" />
              </button>
              <button
                className="w-full py-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
                type="button"
                onClick={() => openScreen("sign-in")}
              >
                Return to sign in
              </button>
            </div>
          ) : null}

          <div className="mt-8 border-t border-slate-200 pt-4">
            <p className="text-center text-[11px] leading-5 text-slate-400">
              Prototype only · Authentication, password reset, file upload,
              verification, and account creation are not connected to live
              services. Form data is kept only in this page session.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
