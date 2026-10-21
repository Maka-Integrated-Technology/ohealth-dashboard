import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  FileText,
  FlaskConical,
  LayoutDashboard,
  Pill,
} from "lucide-react";
import { useSearchParams } from "react-router";

type PreviewPatient = {
  id: string;
  initials: string;
  patient: string;
  detail: string;
};

type PatientTab =
  "overview" | "appointments" | "labs" | "prescriptions" | "documents";

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "appointments", label: "Appointments", icon: CalendarDays, count: 2 },
  { id: "labs", label: "Lab Requests", icon: FlaskConical, count: 1 },
  { id: "prescriptions", label: "Prescriptions", icon: Pill, count: 1 },
  { id: "documents", label: "Documents", icon: FileText },
] as const;

function EmptyPreview({ label }: { label: string }) {
  return (
    <div className="rounded-[19px] border border-[#f1f5f9] bg-white px-4 py-16 text-center sm:px-6">
      <p className="font-medium text-[#1f2a37]">
        No {label} available in this preview
      </p>
      <p className="mt-2 text-sm text-[#62748e]">
        Only the John Doe sample patient has detailed Figma preview records.
      </p>
    </div>
  );
}

export default function HospitalPatientDetails({
  patient,
  onBack,
}: {
  patient: PreviewPatient;
  onBack: () => void;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const param = searchParams.get("tab");
  const activeTab: PatientTab =
    param === "appointments" ||
    param === "labs" ||
    param === "prescriptions" ||
    param === "documents"
      ? param
      : "overview";
  const isFigmaSample = patient.patient === "John Doe";
  const [age = "", gender = ""] = patient.detail.split(" · ");
  const ageText = age.endsWith("y") ? age.slice(0, -1) + " years" : age;

  const selectTab = (tab: PatientTab) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (tab === "overview") {
        next.delete("tab");
      } else {
        next.set("tab", tab);
      }
      return next;
    });
  };

  return (
    <div className="max-w-[1088px] pb-12">
      <button
        className="mb-8 inline-flex items-center gap-2 text-[14px] font-medium text-[#62748e] hover:text-[#155eef] sm:text-[17px]"
        type="button"
        onClick={onBack}
      >
        <ArrowLeft className="size-5" />
        Back to Patients
      </button>

      <section className="rounded-[19px] border border-[#f1f5f9] bg-white p-[18px] sm:p-[29px]">
        <div className="flex flex-wrap items-start gap-6">
          <span className="flex size-[50px] shrink-0 items-center justify-center rounded-full bg-[#0891b2] text-[18px] font-semibold text-white sm:size-[67px] sm:text-[22px]">
            {patient.initials}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-[20px] leading-[27px] font-semibold text-[#0f172b] sm:text-2xl sm:leading-[34px]">
              {patient.patient}
            </h2>
            <p className="mt-1 text-[14px] leading-6 text-[#62748e] sm:text-[17px]">
              {ageText} · {gender}
              {isFigmaSample ? (
                <>
                  {" "}
                  · Blood type:{" "}
                  <span className="font-medium text-[#314158]">A+</span>
                </>
              ) : null}
            </p>
            {isFigmaSample ? (
              <p className="mt-3 inline-flex items-center gap-2 text-[13px] font-medium text-[#2970ff] sm:text-[15px]">
                <CalendarDays className="size-4" />
                Next: 2024-12-20
              </p>
            ) : null}
          </div>
          {isFigmaSample ? (
            <div className="text-right">
              <p className="text-[14px] text-[#6c737f]">Last visit</p>
              <p className="mt-1 text-[13px] font-medium text-[#1f2a37] sm:text-[15px]">
                2025-11-15
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <div className="mt-8 overflow-x-auto">
        <div className="flex w-max min-w-full items-center gap-2 rounded-[14px] bg-[#f1f5f9] p-[5px] sm:gap-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const selected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                aria-current={selected ? "page" : undefined}
                onClick={() => selectTab(tab.id)}
                className={
                  "inline-flex min-h-10 shrink-0 items-center gap-2 rounded-[10px] px-[14px] text-[14px] font-medium transition " +
                  (selected
                    ? "bg-white text-[#1d293d] shadow-sm"
                    : "text-[#62748e] hover:bg-white/70")
                }
              >
                <Icon className="size-4" />
                {tab.label}
                {"count" in tab && isFigmaSample ? (
                  <span className="rounded-full bg-[#e2e8f0] px-[7px] py-[2px] text-xs text-[#62748e]">
                    {tab.count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        {activeTab === "overview" ? (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <section className="rounded-[19px] border border-[#f1f5f9] bg-white p-4 sm:p-6">
              <h3 className="text-[14px] font-semibold text-[#1f2a37] sm:text-[17px]">
                Basic Information
              </h3>
              <dl className="mt-5 space-y-3.5">
                {[
                  ["Full Name", patient.patient],
                  ["Age", ageText || "Not available"],
                  ["Gender", gender || "Not available"],
                  ["Blood Type", isFigmaSample ? "A+" : "Not available"],
                  [
                    "Phone",
                    isFigmaSample ? "+1 (555) 234-5678" : "Not available",
                  ],
                  [
                    "Email",
                    isFigmaSample ? "john.doe@email.com" : "Not available",
                  ],
                ].map(([label, value]) => (
                  <div
                    className="flex flex-wrap items-baseline justify-between gap-3"
                    key={label}
                  >
                    <dt className="text-[14px] leading-6 text-[#6c737f] sm:text-[17px]">
                      {label}
                    </dt>
                    <dd className="text-right text-[14px] leading-6 font-medium text-[#1f2a37] sm:text-[17px]">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
            <section className="rounded-[19px] border border-[#f1f5f9] bg-white p-4 sm:p-6">
              <h3 className="text-[14px] font-semibold text-[#314158] sm:text-[17px]">
                Appointment Summary
              </h3>
              <div className="mt-5 grid grid-cols-2 gap-[14px]">
                {[
                  ["Total Visits", isFigmaSample ? "2" : "—"],
                  ["Completed", isFigmaSample ? "0" : "—"],
                  ["Upcoming", isFigmaSample ? "2" : "—"],
                  ["Cancelled", isFigmaSample ? "0" : "—"],
                ].map(([label, value]) => (
                  <div
                    className="rounded-[14px] bg-[#f8fafc] p-[14px] text-center"
                    key={label}
                  >
                    <p className="text-[20px] leading-[27px] font-bold text-[#1d293d] sm:text-2xl sm:leading-[34px]">
                      {value}
                    </p>
                    <p className="mt-1 text-[13px] text-[#62748e]">{label}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : !isFigmaSample ? (
          <EmptyPreview
            label={
              tabs.find((tab) => tab.id === activeTab)?.label.toLowerCase() ??
              "records"
            }
          />
        ) : activeTab === "appointments" ? (
          <div className="space-y-4">
            {[
              [
                "Consultation · Cardiology",
                "Dr. Sarah Chen",
                "2024-12-20 · 09:00 AM",
              ],
              [
                "Follow-up · Cardiology",
                "Dr. Sarah Chen",
                "2024-12-21 · 09:30 AM",
              ],
            ].map(([title, doctor, date]) => (
              <article
                className="flex flex-wrap items-center justify-between gap-4 rounded-[19px] border border-[#f1f5f9] bg-white p-4 sm:p-6"
                key={title}
              >
                <div>
                  <h3 className="font-semibold text-[#1f2a37]">{title}</h3>
                  <p className="mt-2 text-sm text-[#62748e]">{doctor}</p>
                  <p className="mt-1 text-sm text-[#62748e]">{date}</p>
                </div>
                <span className="rounded-full bg-[#ecfdf3] px-3 py-1 text-sm font-medium text-[#027a48]">
                  confirmed
                </span>
              </article>
            ))}
          </div>
        ) : activeTab === "labs" ? (
          <article className="flex flex-wrap items-center justify-between gap-4 rounded-[19px] border border-[#f1f5f9] bg-white p-4 sm:p-6">
            <div>
              <h3 className="font-semibold text-[#1f2a37]">
                Thyroid Panel, Vitamin D
              </h3>
              <p className="mt-2 text-sm text-[#62748e]">
                Requested by Dr. Emily Rodriguez
              </p>
              <p className="mt-1 text-sm text-[#62748e]">2024-12-17</p>
            </div>
            <span className="rounded-full bg-[#fffaeb] px-3 py-1 text-sm font-medium text-[#b54708]">
              Processing
            </span>
          </article>
        ) : activeTab === "prescriptions" ? (
          <article className="flex flex-wrap items-center justify-between gap-4 rounded-[19px] border border-[#f1f5f9] bg-white p-4 sm:p-6">
            <div>
              <h3 className="font-semibold text-[#1f2a37]">Levothyroxine</h3>
              <p className="mt-2 text-sm text-[#62748e]">
                Prescribed by Dr. Emily Rodriguez · 2024-12-10
              </p>
            </div>
            <span className="rounded-full bg-[#ecfdf3] px-3 py-1 text-sm font-medium text-[#027a48]">
              active
            </span>
          </article>
        ) : (
          <div className="rounded-[19px] border border-[#f1f5f9] bg-white px-4 py-16 text-center sm:px-6">
            <ClipboardList className="mx-auto size-9 text-[#90a1b9]" />
            <h3 className="mt-3 font-semibold text-[#1f2a37]">
              No documents uploaded
            </h3>
            <p className="mt-2 text-sm text-[#62748e]">
              Medical documents shared by the patient will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
