import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FlaskConical,
  Search,
  ShieldAlert,
  TestTubeDiagonal,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { hospitalFilterParams } from "~/features/hospital-dashboard/hospital-preview-state";

type LabStatus =
  | "Requested"
  | "Scheduled"
  | "Sample Collected"
  | "Processing"
  | "Completed"
  | "Uploaded";
type LabPriority = "routine" | "urgent" | "stat";

type LabRecord = {
  id: string;
  initials: string;
  patient: string;
  doctor: string;
  date: string;
  tests: string[];
  priority: LabPriority;
  status: LabStatus;
  note?: string;
};

const initialLabRecords: LabRecord[] = [
  {
    id: "L1",
    initials: "JD",
    patient: "John Doe",
    doctor: "Dr. Sarah Chen",
    date: "2024-12-19",
    tests: ["Complete Blood Count", "Lipid Panel", "HbA1c"],
    priority: "routine",
    status: "Scheduled",
    note: "Fasting required.",
  },
  {
    id: "L2",
    initials: "DL",
    patient: "David Lee",
    doctor: "Dr. James Wilson",
    date: "2024-12-20",
    tests: ["MRI Brain", "EEG"],
    priority: "urgent",
    status: "Requested",
  },
  {
    id: "L3",
    initials: "AH",
    patient: "Ahmed Hassan",
    doctor: "Dr. Michael Patel",
    date: "2024-12-18",
    tests: ["X-Ray Knee", "Bone Density"],
    priority: "routine",
    status: "Sample Collected",
  },
  {
    id: "L4",
    initials: "MS",
    patient: "Maria Santos",
    doctor: "Dr. Emily Rodriguez",
    date: "2024-12-17",
    tests: ["Thyroid Panel", "Vitamin D"],
    priority: "routine",
    status: "Processing",
  },
  {
    id: "L5",
    initials: "EW",
    patient: "Emma Williams",
    doctor: "Dr. Sarah Chen",
    date: "2024-12-15",
    tests: ["ECG", "Troponin", "Cardiac Panel"],
    priority: "stat",
    status: "Completed",
  },
  {
    id: "L6",
    initials: "CM",
    patient: "Carlos Martinez",
    doctor: "Dr. Robert Kim",
    date: "2024-12-14",
    tests: ["Comprehensive Metabolic Panel", "Urinalysis"],
    priority: "routine",
    status: "Uploaded",
  },
];

const stages: LabStatus[] = [
  "Requested",
  "Scheduled",
  "Sample Collected",
  "Processing",
  "Completed",
  "Uploaded",
];
const stageTitles = [
  "Request Received",
  "Test Scheduled",
  "Sample Collected",
  "Processing",
  "Results Completed",
  "Results Uploaded",
];
const nextActions = [
  "Accept and schedule test",
  "Mark Sample Collected",
  "Mark as processing",
  "Mark as completed",
  "Mark result uploaded",
  "Share with attending doctor",
];

const statusStyles: Record<LabStatus, string> = {
  Requested: "bg-[#eff4ff] text-[#155eef]",
  Scheduled: "bg-[#e0f2fe] text-[#0369a1]",
  "Sample Collected": "bg-[#fff7ed] text-[#c2410c]",
  Processing: "bg-[#faf5ff] text-[#7e22ce]",
  Completed: "bg-[#ecfdf3] text-[#067647]",
  Uploaded: "bg-[#ecfdf3] text-[#087443]",
};

function PreviewBanner() {
  return (
    <div className="mb-8 flex max-w-[883px] items-start gap-3 rounded-xl border border-[#fef0c7] bg-[#fffaeb] px-4 py-3">
      <ShieldAlert className="mt-0.5 size-5 shrink-0 text-[#b54708]" />
      <div>
        <p className="text-sm font-semibold text-[#92400e]">Under Review</p>
        <p className="text-xs leading-5 text-[#b54708]">
          OHealth is currently reviewing your submitted documents — Figma
          preview status only.
        </p>
      </div>
    </div>
  );
}

function LabStatusBadge({ status }: { status: LabStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

function LabPriorityBadge({ priority }: { priority: LabPriority }) {
  const style =
    priority === "stat"
      ? "bg-[#fef3f2] text-[#b42318]"
      : priority === "urgent"
        ? "bg-[#fff7ed] text-[#c2410c]"
        : "bg-[#f1f5f9] text-[#475467]";
  return (
    <span
      className={`rounded-full px-3 py-1.5 text-sm font-medium capitalize ${style}`}
    >
      {priority}
    </span>
  );
}

function LabDetails({
  record,
  onBack,
  onUpdate,
}: {
  record: LabRecord;
  onBack: () => void;
  onUpdate: (updated: LabRecord) => void;
}) {
  const [notice, setNotice] = useState("");
  const currentStage = stages.indexOf(record.status);
  const handleAction = () => {
    if (currentStage < stages.length - 1) {
      const updated = { ...record, status: stages[currentStage + 1] };
      onUpdate(updated);
      setNotice(
        `Request moved to ${updated.status} in this local preview. No lab result was recorded or uploaded.`
      );
    } else {
      setNotice("Preview only — nothing was sent to the attending doctor.");
    }
  };
  return (
    <div className="mx-auto max-w-[1090px] pb-12">
      <button
        type="button"
        onClick={onBack}
        className="mb-9 inline-flex items-center gap-2 text-[13px] font-semibold text-[#155eef] hover:underline sm:text-[16px]"
      >
        <ArrowLeft className="size-5" />
        Back to Laboratory
      </button>
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-[21px] font-semibold text-[#1f2a37] sm:text-[27px]">
            Lab Request #{record.id}
          </h2>
          <p className="mt-2 text-[#6c737f]">Requested {record.date}</p>
        </div>
        <div className="flex items-center gap-3">
          <LabPriorityBadge priority={record.priority} />
          <LabStatusBadge status={record.status} />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.85fr)]">
        <div className="space-y-6">
          <section className="rounded-[23px] border border-[#f1f5f9] bg-white p-4 sm:p-7">
            <h3 className="mb-6 text-[16px] font-semibold text-[#1f2a37] sm:text-[20px]">
              Patient
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-full bg-[#0891b2] font-semibold text-white">
                {record.initials}
              </div>
              <p className="text-[15px] font-semibold text-[#1f2a37] sm:text-lg">
                {record.patient}
              </p>
            </div>
            <p className="mt-6 text-sm text-[#6c737f]">Requesting Doctor</p>
            <p className="mt-1 text-[14px] font-medium text-[#1f2a37] sm:text-[18px]">
              {record.doctor}
            </p>
          </section>
          <section className="rounded-[23px] border border-[#f1f5f9] bg-white p-4 sm:p-7">
            <h3 className="mb-5 text-[16px] font-semibold text-[#1f2a37] sm:text-[20px]">
              Requested Tests
            </h3>
            <ul className="space-y-4">
              {record.tests.map((test) => (
                <li
                  key={test}
                  className="flex items-center gap-3 rounded-xl border border-[#f1f5f9] bg-[#fcfcfc] px-4 py-3 text-[#1f2a37]"
                >
                  <TestTubeDiagonal className="size-5 text-[#155eef]" />
                  {test}
                </li>
              ))}
            </ul>
            {record.note ? (
              <p className="mt-5 text-[13px] text-[#6c737f] sm:text-[15px]">
                {record.note}
              </p>
            ) : null}
          </section>
        </div>
        <div className="space-y-6">
          <section className="rounded-[23px] border border-[#f1f5f9] bg-white p-4 sm:p-7">
            <h3 className="mb-6 text-[16px] font-semibold text-[#1f2a37] sm:text-[20px]">
              Status Timeline
            </h3>
            <ol className="space-y-0">
              {stageTitles.map((title, index) => {
                const reached = index <= currentStage;
                return (
                  <li key={title} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={`flex size-[29px] shrink-0 items-center justify-center rounded-full ${reached ? "bg-[#155eef] text-white" : "bg-[#eef2f6] text-[#9da4ae]"}`}
                      >
                        {reached ? (
                          <CheckCircle2 className="size-4" />
                        ) : (
                          <Clock3 className="size-4" />
                        )}
                      </span>
                      {index < stageTitles.length - 1 ? (
                        <span
                          className={`h-8 w-0.5 ${index < currentStage ? "bg-[#155eef]" : "bg-[#e5e7eb]"}`}
                        />
                      ) : null}
                    </div>
                    <span
                      className={`pt-1 text-[13px] sm:text-[15px] ${reached ? "font-medium text-[#1f2a37]" : "text-[#9da4ae]"}`}
                    >
                      {title}
                    </span>
                  </li>
                );
              })}
            </ol>
          </section>
          <section className="rounded-[23px] border border-[#f1f5f9] bg-white p-4 sm:p-7">
            <h3 className="mb-5 text-[16px] font-semibold text-[#1f2a37] sm:text-[20px]">
              Actions
            </h3>
            <button
              type="button"
              onClick={handleAction}
              className="w-full rounded-xl bg-[#155eef] px-4 py-3 text-[13px] font-semibold text-white hover:bg-[#004eeb] sm:text-[15px]"
            >
              {nextActions[currentStage]}
            </button>
            <p className="mt-4 text-xs leading-5 text-[#6c737f]">
              Actions are simulated. This preview does not process samples,
              upload results, or notify clinicians.
            </p>
            {notice ? (
              <p
                role="status"
                className="mt-4 rounded-xl bg-[#eff4ff] p-3 text-sm text-[#155eef]"
              >
                {notice}
              </p>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}

export default function HospitalLaboratory() {
  const [records, setRecords] = useState<LabRecord[]>(initialLabRecords);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const selectedStatus =
    stages.find((status) => status === searchParams.get("status")) ?? "All";
  const setSelectedStatus = (value: LabStatus | "All") =>
    setSearchParams((current) =>
      hospitalFilterParams(current, "status", value, "All")
    );
  const setQuery = (value: string) =>
    setSearchParams((current) => hospitalFilterParams(current, "q", value), {
      replace: true,
    });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = records.find((record) => record.id === selectedId);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return records.filter((record) => {
      const matches = [
        record.id,
        record.patient,
        record.doctor,
        ...record.tests,
        record.priority,
        record.status,
      ].some((field) => field.toLowerCase().includes(q));
      return (
        matches &&
        (selectedStatus === "All" || record.status === selectedStatus)
      );
    });
  }, [query, records, selectedStatus]);

  return selected ? (
    <LabDetails
      key={selected.id}
      record={selected}
      onBack={() => setSelectedId(null)}
      onUpdate={(updated) =>
        setRecords((current) =>
          current.map((item) => (item.id === updated.id ? updated : item))
        )
      }
    />
  ) : (
    <div className="mx-auto max-w-[1155px] pb-12">
      <PreviewBanner />
      <div className="mb-7">
        <h2 className="text-[19px] font-semibold text-[#1f2a37] sm:text-[24px]">
          Laboratory
        </h2>
      </div>
      <div className="mb-8 rounded-[20px] border border-[#f1f5f9] bg-white p-5">
        <label className="flex min-h-12 items-center gap-3 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-4 text-[#62748e]">
          <Search className="size-5 shrink-0" />
          <input
            aria-label="Search patients or tests"
            type="search"
            placeholder="Search patients or tests..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full min-w-0 bg-transparent text-[13px] text-[#1f2a37] outline-none placeholder:text-[#90a1b9] sm:text-[16px]"
          />
        </label>
      </div>
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stages.map((status) => {
          const count = records.filter((item) => item.status === status).length;
          return (
            <button
              key={status}
              type="button"
              aria-pressed={selectedStatus === status}
              onClick={() =>
                setSelectedStatus(selectedStatus === status ? "All" : status)
              }
              className={`rounded-2xl border bg-white px-4 py-5 text-left transition-colors hover:border-[#155eef] ${selectedStatus === status ? "border-[#155eef] ring-2 ring-[#155eef]/10" : "border-[#f1f5f9]"}`}
            >
              <span className="block text-[23px] font-semibold text-[#1f2a37] sm:text-[30px]">
                {count}
              </span>
              <span className="mt-2 block text-[14px] text-[#6c737f]">
                {status}
              </span>
            </button>
          );
        })}
      </div>
      {selectedStatus !== "All" ? (
        <button
          type="button"
          onClick={() => setSelectedStatus("All")}
          className="mb-4 text-sm font-medium text-[#155eef] hover:underline"
        >
          Clear status filter
        </button>
      ) : null}
      <div className="overflow-hidden rounded-[19px] border border-[#f1f5f9] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[940px] border-collapse text-left">
            <thead className="border-b border-[#e5e7eb] bg-[#f8fafc] text-[14px] font-semibold text-[#62748e]">
              <tr>
                <th className="px-4 py-4 sm:px-6">Patient</th>
                <th className="px-4 py-4">Tests</th>
                <th className="px-4 py-4">Doctor</th>
                <th className="px-4 py-4">Date</th>
                <th className="px-4 py-4">Priority</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4 text-right sm:px-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {visible.map((record) => (
                <tr
                  key={record.id}
                  className="text-[13px] hover:bg-[#fbfdff] sm:text-[15px]"
                >
                  <td className="px-4 py-[17px] sm:px-6">
                    <span className="inline-flex items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#0891b2] font-semibold text-white">
                        {record.initials}
                      </span>
                      <span className="font-medium text-[#1f2a37]">
                        {record.patient}
                      </span>
                    </span>
                  </td>
                  <td className="max-w-[255px] px-4 py-[17px] text-[#4d5761]">
                    {record.tests.slice(0, 2).join(", ")}
                    {record.tests.length > 2
                      ? ` +${record.tests.length - 2}`
                      : ""}
                  </td>
                  <td className="px-4 py-[17px] text-[#4d5761]">
                    {record.doctor}
                  </td>
                  <td className="px-4 py-[17px] text-[#4d5761]">
                    {record.date}
                  </td>
                  <td className="px-4 py-[17px]">
                    <LabPriorityBadge priority={record.priority} />
                  </td>
                  <td className="px-4 py-[17px]">
                    <LabStatusBadge status={record.status} />
                  </td>
                  <td className="px-4 py-[17px] text-right sm:px-6">
                    <button
                      type="button"
                      onClick={() => setSelectedId(record.id)}
                      className="inline-flex items-center gap-1 font-medium text-[#2970ff] hover:underline"
                    >
                      View <ChevronRight className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {visible.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-[#6c737f] sm:px-6"
                  >
                    No laboratory requests match your search.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
      <p className="mt-4 flex items-center gap-2 text-xs text-[#90a1b9]">
        <FlaskConical className="size-4" />
        All six records are Figma examples. No real test results or records are
        connected.
      </p>
    </div>
  );
}
