import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Eye,
  EyeOff,
  FileCheck2,
  FileText,
  FlaskConical,
  LockKeyhole,
  Mail,
  ShieldCheck,
  TestTubes,
  UploadCloud,
  X,
} from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import Logo from "~/components/shared/logo";

type Mode = "sign-in" | "register" | "forgot-password";
type LabField = "name" | "registration" | "license" | "address" | "region" | "phone" | "contactEmail";
type AdminField = "name" | "email" | "password" | "confirmPassword";
type DocumentField = "license" | "accreditation" | "cac";

const steps = ["Lab Details", "Administrator", "Documents", "Verification", "Setup"] as const;

const documents: { id: DocumentField; title: string; issuer: string }[] = [
  { id: "license", title: "Laboratory License", issuer: "Issued by NAFDAC / State Ministry of Health" },
  { id: "accreditation", title: "Accreditation Certificate", issuer: "Medical Laboratory Science Council of Nigeria" },
  { id: "cac", title: "CAC Registration Certificate", issuer: "Corporate Affairs Commission" },
];

const regions = [
  "Abuja (FCT)", "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi",
  "Bayelsa", "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo",
  "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
  "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

const fieldClass =
  "mt-2 block h-[51px] w-full rounded-xl border border-[#d9e1ef] bg-white px-4 text-[15px] text-[#1f2a37] outline-none placeholder:text-[#98a2b3] focus:border-[#2970ff] focus:ring-2 focus:ring-[#2970ff]/10";
const primaryButton =
  "inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#155eef] px-5 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-[#004eeb] disabled:cursor-not-allowed disabled:opacity-55";

function FormField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  required = true,
  autoComplete,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block text-[14px] font-medium text-[#344054]">
      {label} {required ? <span className="text-[#f04438]">*</span> : null}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        autoComplete={autoComplete}
        className={fieldClass}
      />
    </label>
  );
}

function PasswordField({
  label,
  placeholder,
  value,
  onChange,
  autoComplete,
  minLength,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  minLength?: number;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <label className="block text-[14px] font-medium text-[#344054]">
      {label} <span className="text-[#f04438]">*</span>
      <span className="relative mt-2 block">
        <input
          required
          type={visible ? "text" : "password"}
          value={value}
          minLength={minLength}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="block h-[51px] w-full rounded-xl border border-[#d9e1ef] bg-white px-4 pr-12 text-[15px] text-[#1f2a37] outline-none placeholder:text-[#98a2b3] focus:border-[#2970ff] focus:ring-2 focus:ring-[#2970ff]/10"
        />
        <button
          type="button"
          aria-label={visible ? "Hide password" : "Show password"}
          onClick={() => setVisible((previous) => !previous)}
          className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#667085] hover:text-[#155eef]"
        >
          {visible ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
        </button>
      </span>
    </label>
  );
}

function LabBrandPanel() {
  return (
    <div className="relative hidden min-h-[100vh] flex-col overflow-hidden bg-[linear-gradient(155deg,#062c56_0%,#084b84_54%,#0a718e_100%)] px-12 py-12 text-white lg:flex lg:w-[49.6%] lg:shrink-0 lg:justify-between xl:px-16">
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 -left-44 size-[460px] rounded-full border border-white/10 bg-[#0994bb]/10" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 bottom-24 size-[500px] rounded-full border border-white/10 bg-white/5" />
      <div className="relative flex items-center gap-2.5">
        <span className="flex size-11 items-center justify-center rounded-xl bg-white/15"><TestTubes className="size-7" /></span>
        <span className="text-[27px] font-bold tracking-[-1px]">OHealth<span className="text-[#7fe7f3]">+</span></span>
      </div>
      <div className="relative max-w-[540px] py-12">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-[#c4effa]">
          <FlaskConical className="size-4" /> Laboratory Partner Portal
        </div>
        <h2 className="max-w-[500px] text-[clamp(38px,4vw,58px)] leading-[1.15] font-bold tracking-[-1.6px]">
          Your laboratory, connected.
        </h2>
        <p className="mt-6 max-w-[470px] text-[18px] leading-8 text-[#c8e6f1]">
          Manage diagnostic operations, track test results, and connect with healthcare professionals on OHealth+.
        </p>
        <div className="mt-12 grid grid-cols-2 gap-4">
          {[
            ["12,400+", "Tests processed monthly"],
            ["340+", "Partner laboratories"],
            ["99.8%", "Result accuracy rate"],
            ["< 4h", "Average turnaround time"],
          ].map(([value, caption]) => (
            <div key={caption} className="rounded-[18px] border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-[29px] font-semibold tracking-tight text-white">{value}</p>
              <p className="mt-2 text-[13px] leading-5 text-[#c8e6f1]">{caption}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="relative text-xs text-[#afcedc]">OHealth+ Laboratory Workspace · Preview</p>
    </div>
  );
}

export default function LaboratoryAuthentication() {
  const [mode, setMode] = useState<Mode>("sign-in");
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [notice, setNotice] = useState("");
  const [lab, setLab] = useState({
    name: "",
    registration: "",
    license: "",
    address: "",
    region: "",
    phone: "",
    contactEmail: "",
  });
  const [admin, setAdmin] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [files, setFiles] = useState<Partial<Record<DocumentField, File>>>({});
  const [accepted, setAccepted] = useState(false);

  const changeLab = (field: LabField, value: string) => setLab((current) => ({ ...current, [field]: value }));
  const changeAdmin = (field: AdminField, value: string) => setAdmin((current) => ({ ...current, [field]: value }));
  const changeMode = (next: Mode) => {
    setMode(next);
    setNotice("");
  };
  const submitLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password) return;
    setNotice("Lab sign-in is a visual preview only. No credentials were sent or verified. Authentication will be connected before launch.");
    setPassword("");
  };
  const submitReset = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice("Password recovery is not connected yet. No reset email was sent.");
  };
  const submitLabDetails = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice("");
    setStep(1);
  };
  const submitAdmin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (admin.password !== admin.confirmPassword) {
      setNotice("The administrator passwords do not match.");
      return;
    }
    setNotice("");
    setStep(2);
  };
  const handleFile = (id: DocumentField, event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!selected) return;
    const allowed = ["application/pdf", "image/jpeg", "image/png"];
    const validExtension = /\.(pdf|jpe?g|png)$/i.test(selected.name);
    if (selected.size > 10 * 1024 * 1024 || (!allowed.includes(selected.type) && !validExtension)) {
      event.target.value = "";
      setNotice("Choose a PDF, JPG or PNG file no larger than 10 MB.");
      return;
    }
    setFiles((current) => ({ ...current, [id]: selected }));
    setNotice("");
  };
  const submitDocuments = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!documents.every(({ id }) => Boolean(files[id]))) {
      setNotice("Select all three documents to continue with the preview.");
      return;
    }
    setNotice("");
    setStep(3);
  };
  const register = () => {
    setStep(0);
    setNotice("");
    changeMode("register");
  };

  const isRegister = mode === "register";
  const title = mode === "sign-in" ? "Sign in" : mode === "forgot-password" ? "Reset your password" : step === 0 ? "Laboratory Details" : step === 1 ? "Administrator Account" : step === 2 ? "Verification Documents" : step === 3 ? "Identity Verification" : "Laboratory Setup";
  const description = mode === "sign-in"
    ? "Sign in to your laboratory dashboard"
    : mode === "forgot-password"
      ? "Enter your email address to request a password reset."
      : step === 0
        ? "Tell us about your laboratory so we can set up your workspace."
        : step === 1
          ? "This account will have full administrative access to your laboratory."
          : step === 2
            ? "Upload clear, legible copies of the following documents."
            : step === 3
              ? "Review the sample verification process before going live."
              : "Your laboratory workspace preview is ready.";

  return (
    <div className="min-h-screen bg-white text-[#1f2a37] lg:flex">
      <LabBrandPanel />
      <main className="flex min-h-screen w-full flex-1 flex-col items-center justify-center px-6 py-12 sm:px-10 lg:min-h-[1024px] lg:px-12">
        <div className="w-full max-w-[576px]">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Logo />
            <span className="text-xs font-semibold text-[#62748e]">Laboratory</span>
          </div>
          {isRegister && (
            <div className="mb-9" aria-label={`Registration step ${step + 1} of ${steps.length}`}>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <button type="button" onClick={() => step === 0 ? changeMode("sign-in") : setStep((current) => current - 1)} className="inline-flex items-center gap-2 text-sm font-semibold text-[#155eef] hover:underline">
                  <ArrowLeft className="size-4" />{step === 0 ? "Back to sign in" : "Back"}
                </button>
                <span className="text-[13px] font-medium text-[#62748e]">Step {step + 1} of {steps.length}</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {steps.map((label, index) => (
                  <div key={label} className="min-w-0">
                    <div className={`flex h-2 rounded-full ${index <= step ? "bg-[#2970ff]" : "bg-[#e2e8f0]"}`} />
                    <span className={`mt-2 block truncate text-[10px] sm:text-[11px] ${index === step ? "font-semibold text-[#155eef]" : "text-[#90a1b9]"}`}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="mb-8">
            <h1 className="text-[32px] leading-[1.2] font-bold tracking-[-0.7px] text-[#101828]">{title}</h1>
            <p className="mt-3 text-[16px] leading-7 text-[#667085]">{description}</p>
          </div>
          {notice && (
            <div role="status" className="mb-6 rounded-xl border border-[#bfdbfe] bg-[#eff6ff] px-4 py-3 text-sm leading-6 text-[#155eef]">{notice}</div>
          )}
          {mode === "sign-in" && (
            <>
              <form onSubmit={submitLogin} className="space-y-6">
                <FormField label="Email address" type="email" autoComplete="email" value={email} onChange={setEmail} placeholder="chiamaka.eze@ohealthplus.ng" />
                <div>
                  <PasswordField label="Password" placeholder="Your password" value={password} onChange={setPassword} autoComplete="current-password" />
                  <button type="button" className="mt-3 block w-full text-right text-sm font-semibold text-[#155eef] hover:underline" onClick={() => changeMode("forgot-password")}>Forgot password?</button>
                </div>
                <button type="submit" className={primaryButton}>Sign In <ArrowRight className="size-5" /></button>
              </form>
              <p className="mt-8 text-center text-[15px] text-[#667085]">New to OHealth+?{" "}
                <button type="button" onClick={register} className="font-semibold text-[#155eef] hover:underline">Register your laboratory</button>
              </p>
              <p className="mt-7 text-center text-xs leading-6 text-[#98a2b3]">By signing in you agree to the OHealth+ Terms of Service and Privacy Policy.</p>
              <p className="mt-4 text-center text-xs text-[#667085]">Preview only — this page does not authenticate users.</p>
            </>
          )}
          {mode === "forgot-password" && (
            <form onSubmit={submitReset} className="space-y-6">
              <FormField label="Email address" placeholder="you@laboratory.ng" type="email" autoComplete="email" value={resetEmail} onChange={setResetEmail} />
              <button type="submit" className={primaryButton}>Request reset link <ArrowRight className="size-5" /></button>
              <button type="button" onClick={() => changeMode("sign-in")} className="inline-flex items-center gap-2 text-sm font-semibold text-[#155eef] hover:underline"><ArrowLeft className="size-4" />Back to sign in</button>
            </form>
          )}
          {isRegister && step === 0 && (
            <form onSubmit={submitLabDetails} className="space-y-5">
              <FormField label="Laboratory Name" placeholder="e.g. MedCore Diagnostics" value={lab.name} onChange={(value) => changeLab("name", value)} />
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label="Registration Number" placeholder="RC-000000" value={lab.registration} onChange={(value) => changeLab("registration", value)} />
                <FormField label="Laboratory License Number" placeholder="LAB-LG-0000-2025" value={lab.license} onChange={(value) => changeLab("license", value)} />
              </div>
              <FormField label="Laboratory Address" placeholder="Street address, city" value={lab.address} onChange={(value) => changeLab("address", value)} />
              <label className="block text-[14px] font-medium text-[#344054]">State / Region <span className="text-[#f04438]">*</span>
                <select required value={lab.region} onChange={(event) => changeLab("region", event.target.value)} className={fieldClass}>
                  <option value="">Select state…</option>
                  {regions.map((region) => <option key={region} value={region}>{region}</option>)}
                </select>
              </label>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label="Phone Number" placeholder="+234 800 000 0000" type="tel" value={lab.phone} onChange={(value) => changeLab("phone", value)} />
                <FormField label="Contact Email" placeholder="info@laboratory.ng" type="email" value={lab.contactEmail} onChange={(value) => changeLab("contactEmail", value)} />
              </div>
              <button className={primaryButton} type="submit">Continue <ArrowRight className="size-5" /></button>
            </form>
          )}
          {isRegister && step === 1 && (
            <form onSubmit={submitAdmin} className="space-y-5">
              <FormField label="Full Name" placeholder="e.g. Dr. Chiamaka Eze" value={admin.name} onChange={(value) => changeAdmin("name", value)} autoComplete="name" />
              <FormField label="Email Address" type="email" placeholder="admin@laboratory.ng" value={admin.email} onChange={(value) => changeAdmin("email", value)} autoComplete="email" />
              <PasswordField label="Password" minLength={8} placeholder="Minimum 8 characters" value={admin.password} onChange={(value) => changeAdmin("password", value)} autoComplete="new-password" />
              <PasswordField label="Confirm Password" minLength={8} placeholder="Repeat your password" value={admin.confirmPassword} onChange={(value) => changeAdmin("confirmPassword", value)} autoComplete="new-password" />
              <button className={primaryButton} type="submit">Continue <ArrowRight className="size-5" /></button>
            </form>
          )}
          {isRegister && step === 2 && (
            <form onSubmit={submitDocuments} className="space-y-4">
              {documents.map(({ id, title: documentTitle, issuer }) => {
                const file = files[id];
                return (
                  <label key={id} className="block rounded-2xl border border-[#e2e8f0] bg-[#fbfcfe] px-5 py-4">
                    <span className="flex items-center gap-2 text-[16px] font-semibold text-[#344054]">
                      <FileText className="size-5 text-[#155eef]" />{documentTitle}
                    </span>
                    <span className="mt-1 block text-[13px] text-[#667085]">{issuer}</span>
                    <span className={`mt-4 flex min-h-20 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-3 text-center ${file ? "border-[#a6f4c5] bg-[#ecfdf3]" : "border-[#cbd5e1] bg-white"}`}>
                      {file ? <><FileCheck2 className="size-6 text-[#039855]" /><span className="mt-1 max-w-full break-all text-sm font-medium text-[#067647]">{file.name}</span><span className="text-xs text-[#667085]">{Math.round(file.size / 1024)} KB · Choose to replace</span></> : <><UploadCloud className="size-6 text-[#155eef]" /><span className="mt-1 text-sm font-medium text-[#344054]">Drop file here or browse</span><span className="mt-1 text-xs text-[#98a2b3]">PDF, JPG, PNG — max 10 MB</span></>}
                    </span>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" className="sr-only" onChange={(event) => handleFile(id, event)} />
                  </label>
                );
              })}
              <div className="flex items-center justify-between text-sm text-[#667085]"><span>{documents.filter(({ id }) => Boolean(files[id])).length} / 3 selected</span><span>No file is uploaded in this preview.</span></div>
              <button type="submit" className={primaryButton}>Submit for Review <ArrowRight className="size-5" /></button>
              <p className="text-center text-xs leading-5 text-[#667085]">Preview only: selecting documents does not upload or submit them to OHealth+.</p>
            </form>
          )}
          {isRegister && step === 3 && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-[#d1fadf] bg-[#ecfdf3] p-6">
                <ShieldCheck className="mb-4 size-9 text-[#039855]" />
                <h2 className="text-[21px] font-semibold text-[#101828]">Documents Selected</h2>
                <p className="mt-2 text-[15px] leading-7 text-[#475467]">Your preview registration details are ready for review. In the live experience, OHealth+ will verify submitted laboratory credentials.</p>
              </div>
              <div className="rounded-2xl border border-[#e2e8f0] p-5">
                {[
                  ["Submitted", "Documents received"],
                  ["Under Review", "Team reviewing"],
                  ["Approved", "Verification complete"],
                ].map(([label, caption], index) => (
                  <div key={label} className="flex gap-4 py-3">
                    <span className={`flex size-9 shrink-0 items-center justify-center rounded-full ${index === 0 ? "bg-[#eff4ff] text-[#155eef]" : "bg-[#f2f4f7] text-[#98a2b3]"}`}>
                      {index === 0 ? <Check className="size-5" /> : index + 1}
                    </span>
                    <div><p className="font-semibold text-[#344054]">{label}</p><p className="mt-1 text-sm text-[#667085]">{caption}</p></div>
                  </div>
                ))}
              </div>
              <p className="text-[14px] leading-6 text-[#667085]">No documents or application have been submitted. No verification or approval has occurred, and no email notification will be sent.</p>
              <button type="button" onClick={() => setStep(4)} className={primaryButton}>Continue to Setup <ArrowRight className="size-5" /></button>
            </div>
          )}
          {isRegister && step === 4 && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-7 text-center">
                <ClipboardCheck className="mx-auto mb-4 size-11 text-[#155eef]" />
                <h2 className="text-[22px] font-semibold text-[#101828]">Registration Preview Complete</h2>
                <p className="mt-3 text-[15px] leading-7 text-[#667085]">You have previewed the registration steps for {lab.name || "your laboratory"}. Actual setup can begin after the OHealth+ backend and verification workflow are connected.</p>
              </div>
              <label className="flex items-start gap-3 text-[14px] leading-6 text-[#475467]">
                <input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="mt-1 size-4 accent-[#155eef]" />
                I understand this is a UI preview and I have not created or verified a real laboratory account.
              </label>
              <button type="button" disabled={!accepted} onClick={() => { setStep(0); changeMode("sign-in"); setNotice("Lab onboarding preview completed. Sign-in is not connected to a backend yet."); }} className={primaryButton}>
                Return to Sign In <ArrowRight className="size-5" />
              </button>
            </div>
          )}
          {isRegister && <p className="mt-6 text-center text-xs leading-6 text-[#98a2b3]">Laboratory onboarding is a non-persistent preview. No backend changes, file uploads, or emails occur.</p>}
        </div>
      </main>
    </div>
  );
}
