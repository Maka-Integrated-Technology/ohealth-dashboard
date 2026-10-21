import {
  Check,
  ChevronDown,
  ChevronRight,
  FilePlus2,
  Pill,
  Plus,
  Search,
  ShieldAlert,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Medication = {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
};

type PrescriptionRecord = {
  id: string;
  initials: string;
  patient: string;
  doctor: string;
  medications: Medication[];
  date: string;
  status: "active" | "completed";
  updated: string;
};

const examplePrescriptions: PrescriptionRecord[] = [
  {
    id: "RX-101",
    initials: "JD",
    patient: "John Doe",
    doctor: "Dr. Sarah Chen",
    date: "2024-12-15",
    status: "active",
    updated: "2024-12-15",
    medications: [
      {
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        duration: "3 months",
        instructions: "Take in the morning with water",
      },
      {
        name: "Atorvastatin",
        dosage: "20mg",
        frequency: "Once daily at bedtime",
        duration: "3 months",
        instructions: "Avoid grapefruit juice",
      },
    ],
  },
  {
    id: "RX-102",
    initials: "MS",
    patient: "Maria Santos",
    doctor: "Dr. Emily Rodriguez",
    date: "2024-12-10",
    status: "active",
    updated: "2024-12-10",
    medications: [
      {
        name: "Levothyroxine",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ],
  },
  {
    id: "RX-103",
    initials: "DL",
    patient: "David Lee",
    doctor: "Dr. James Wilson",
    date: "2024-12-08",
    status: "active",
    updated: "2024-12-08",
    medications: [
      {
        name: "Sumatriptan",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
      {
        name: "Propranolol",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ],
  },
  {
    id: "RX-104",
    initials: "SJ",
    patient: "Sarah Johnson",
    doctor: "Dr. Robert Kim",
    date: "2024-11-28",
    status: "completed",
    updated: "2024-12-08",
    medications: [
      {
        name: "Amoxicillin",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ],
  },
  {
    id: "RX-105",
    initials: "AH",
    patient: "Ahmed Hassan",
    doctor: "Dr. Sarah Chen",
    date: "2024-12-05",
    status: "active",
    updated: "2024-12-05",
    medications: [
      {
        name: "Metformin",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
      {
        name: "Aspirin",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ],
  },
];

const initialMedication = (): Medication => ({
  name: "",
  dosage: "",
  frequency: "",
  duration: "",
  instructions: "",
});

function PrescriptionReviewItem({
  medication,
  index,
}: {
  medication: Medication;
  index: number;
}) {
  return (
    <div className="rounded-2xl border border-[#e5e7eb] p-4">
      <p className="mb-4 text-[17px] font-semibold text-[#1f2a37]">
        {medication.name || `Medication ${index + 1}`}
      </p>
      <dl className="grid gap-3 text-[15px] sm:grid-cols-2">
        {[
          ["Dosage", medication.dosage],
          ["Frequency", medication.frequency],
          ["Duration", medication.duration],
          ["Instructions", medication.instructions],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="text-[#6c737f]">{label}</dt>
            <dd className="mt-1 text-[#1f2a37]">{value || "Not specified"}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function CreatePrescription({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: (
    patient: string,
    doctor: string,
    medications: Medication[]
  ) => void;
}) {
  const [patient, setPatient] = useState("");
  const [doctor, setDoctor] = useState("");
  const [medications, setMedications] = useState<Medication[]>([
    initialMedication(),
  ]);
  const [reviewing, setReviewing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = before;
      document.removeEventListener("keydown", handler);
    };
  }, [onClose]);

  const changeMedication = (
    index: number,
    key: keyof Medication,
    value: string
  ) =>
    setMedications((current) =>
      current.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  const goToReview = () => {
    if (
      !patient ||
      !doctor ||
      medications.some(
        (item) =>
          !item.name.trim() ||
          !item.dosage.trim() ||
          !item.frequency.trim() ||
          !item.duration.trim()
      )
    ) {
      setError(
        "Select a patient and doctor and complete each medication’s name, dosage, frequency and duration."
      );
      return;
    }
    setError("");
    setReviewing(true);
  };
  const textField = (
    index: number,
    key: keyof Medication,
    label: string,
    placeholder: string,
    required = false
  ) => (
    <label className="block text-[14px] font-medium text-[#4d5761]">
      {label}
      <input
        value={medications[index][key]}
        onChange={(event) => changeMedication(index, key, event.target.value)}
        placeholder={placeholder}
        required={required}
        className="mt-2 block min-h-12 w-full rounded-xl border border-[#d2d6db] bg-white px-4 text-[15px] text-[#1f2a37] outline-none focus:border-[#155eef]"
      />
    </label>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close new prescription"
        onClick={onClose}
        className="absolute inset-0 bg-[#101828]/50"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={reviewing ? "Review Prescription" : "New Prescription"}
        className="relative flex max-h-[94vh] w-full max-w-[785px] flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#f1f5f9] px-6 py-5 sm:px-8">
          <h2 className="text-[23px] font-semibold text-[#1f2a37]">
            {reviewing ? "Review Prescription" : "New Prescription"}
          </h2>
          <button
            aria-label="Close prescription form"
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[#6c737f] hover:bg-[#f8fafc]"
          >
            <X className="size-6" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-6 sm:px-8">
          {reviewing ? (
            <>
              <dl className="mb-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-[#6c737f]">Patient</dt>
                  <dd className="mt-1 font-semibold text-[#1f2a37]">
                    {patient}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-[#6c737f]">Prescribing Doctor</dt>
                  <dd className="mt-1 font-semibold text-[#1f2a37]">
                    {doctor}
                  </dd>
                </div>
              </dl>
              <div className="space-y-4">
                {medications.map((medication, index) => (
                  <PrescriptionReviewItem
                    key={index}
                    medication={medication}
                    index={index}
                  />
                ))}
              </div>
              <p className="mt-6 text-sm text-[#6c737f]">
                Confirmation adds this prescription to preview data only. No
                prescription is sent or issued.
              </p>
            </>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-[15px] font-medium text-[#4d5761]">
                  Patient
                  <select
                    aria-label="Select patient"
                    value={patient}
                    onChange={(event) => setPatient(event.target.value)}
                    className="mt-2 block min-h-12 w-full rounded-xl border border-[#d2d6db] bg-white px-4 text-[#1f2a37]"
                  >
                    <option value="">Select patient</option>
                    {[
                      "John Doe",
                      "Maria Santos",
                      "David Lee",
                      "Sarah Johnson",
                      "Ahmed Hassan",
                    ].map((name) => (
                      <option key={name}>{name}</option>
                    ))}
                  </select>
                </label>
                <label className="text-[15px] font-medium text-[#4d5761]">
                  Prescribing Doctor
                  <select
                    aria-label="Select doctor"
                    value={doctor}
                    onChange={(event) => setDoctor(event.target.value)}
                    className="mt-2 block min-h-12 w-full rounded-xl border border-[#d2d6db] bg-white px-4 text-[#1f2a37]"
                  >
                    <option value="">Select doctor</option>
                    {[
                      "Dr. Sarah Chen",
                      "Dr. Emily Rodriguez",
                      "Dr. James Wilson",
                      "Dr. Robert Kim",
                    ].map((name) => (
                      <option key={name}>{name}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="mt-7 flex items-center justify-between gap-3">
                <h3 className="text-[19px] font-semibold text-[#1f2a37]">
                  Medications
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    setMedications((current) => [
                      ...current,
                      initialMedication(),
                    ])
                  }
                  className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#155eef]"
                >
                  <Plus className="size-4" />
                  Add Medication
                </button>
              </div>
              <div className="mt-5 space-y-5">
                {medications.map((medication, index) => (
                  <section
                    key={index}
                    className="rounded-[20px] border border-[#e5e7eb] p-5"
                  >
                    <div className="mb-5 flex items-center justify-between">
                      <h4 className="font-semibold text-[#1f2a37]">
                        Medication {index + 1}
                      </h4>
                      {medications.length > 1 ? (
                        <button
                          type="button"
                          aria-label={`Remove medication ${index + 1}`}
                          onClick={() =>
                            setMedications((items) =>
                              items.filter((_, i) => i !== index)
                            )
                          }
                          className="rounded-lg p-2 text-[#d92d20]"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      ) : null}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {textField(
                        index,
                        "name",
                        "Medication Name",
                        "Search medication...",
                        true
                      )}
                      {textField(index, "dosage", "Dosage", "e.g. 10mg", true)}
                      {textField(
                        index,
                        "frequency",
                        "Frequency",
                        "e.g. Twice daily",
                        true
                      )}
                      {textField(
                        index,
                        "duration",
                        "Duration",
                        "e.g. 30 days",
                        true
                      )}
                      <div className="sm:col-span-2">
                        {textField(
                          index,
                          "instructions",
                          "Special Instructions",
                          "e.g. Take with food"
                        )}
                      </div>
                    </div>
                  </section>
                ))}
              </div>
              <p className="mt-4 text-sm text-[#6c737f]">
                Preview form only. These fields do not validate clinical
                prescribing appropriateness.
              </p>
            </>
          )}
          {error ? (
            <p
              role="alert"
              className="mt-5 rounded-xl bg-[#fef3f2] px-4 py-3 text-sm text-[#b42318]"
            >
              {error}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[#f1f5f9] bg-white px-6 py-5 sm:px-8">
          <button
            type="button"
            onClick={() => (reviewing ? setReviewing(false) : onClose())}
            className="rounded-xl border border-[#d2d6db] px-5 py-3 font-medium text-[#4d5761]"
          >
            {reviewing ? "Edit" : "Cancel"}
          </button>
          {reviewing ? (
            <button
              type="button"
              onClick={() => onConfirm(patient, doctor, medications)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#155eef] px-5 py-3 font-medium text-white"
            >
              <Check className="size-5" />
              Confirm Prescription
            </button>
          ) : (
            <button
              type="button"
              onClick={goToReview}
              className="inline-flex items-center gap-2 rounded-xl bg-[#155eef] px-5 py-3 font-medium text-white"
            >
              Review Prescription <ChevronRight className="size-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HospitalPrescriptions() {
  const [records, setRecords] =
    useState<PrescriptionRecord[]>(examplePrescriptions);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [notice, setNotice] = useState("");
  const activeCount = records.filter((item) => item.status === "active").length;
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return records.filter((record) =>
      [
        record.patient,
        record.doctor,
        record.status,
        ...record.medications.map((med) => med.name),
      ].some((term) => term.toLowerCase().includes(q))
    );
  }, [records, query]);

  const confirmPreview = (
    patient: string,
    doctor: string,
    medications: Medication[]
  ) => {
    const initials = patient
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
    const date = new Date().toISOString().slice(0, 10);
    setRecords((current) => [
      {
        id: `RX-PREVIEW-${current.length + 1}`,
        initials,
        patient,
        doctor,
        date,
        updated: date,
        status: "active",
        medications,
      },
      ...current,
    ]);
    setCreating(false);
    setNotice(
      "Prescription added to this local preview only. Nothing has been issued to a patient or pharmacy."
    );
  };

  return (
    <div className="mx-auto max-w-[1155px] pb-12">
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
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-[24px] font-semibold text-[#1f2a37]">
            Prescriptions
          </h2>
          <p className="mt-2 text-[17px] text-[#6c737f]">
            {activeCount} active prescriptions
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#155eef] px-5 py-3 font-semibold text-white hover:bg-[#004eeb]"
        >
          <Plus className="size-5" />
          Create Prescription
        </button>
      </div>
      <div className="mb-8 rounded-[20px] border border-[#f1f5f9] bg-white p-5">
        <label className="flex min-h-12 items-center gap-3 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-4 text-[#62748e]">
          <Search className="size-5 shrink-0" />
          <input
            aria-label="Search patients or medications"
            type="search"
            placeholder="Search patients or medications..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full min-w-0 bg-transparent text-[16px] text-[#1f2a37] outline-none placeholder:text-[#90a1b9]"
          />
        </label>
      </div>
      {notice ? (
        <p
          role="status"
          className="mb-5 rounded-xl bg-[#eff4ff] px-5 py-4 text-sm text-[#155eef]"
        >
          {notice}
        </p>
      ) : null}
      <div className="overflow-hidden rounded-[19px] border border-[#f1f5f9] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[930px] border-collapse text-left">
            <thead className="border-b border-[#e5e7eb] bg-[#f8fafc] text-[14px] font-semibold text-[#62748e]">
              <tr>
                <th className="px-6 py-4">Patient</th>
                <th className="px-4 py-4">Doctor</th>
                <th className="px-4 py-4">Medications</th>
                <th className="px-4 py-4">Date</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-6 py-4">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {visible.map((record) => (
                <tr key={record.id}>
                  <td colSpan={6} className="p-0">
                    <button
                      type="button"
                      aria-expanded={expanded === record.id}
                      aria-label={`View medications for ${record.patient}`}
                      onClick={() =>
                        setExpanded(expanded === record.id ? null : record.id)
                      }
                      className="grid w-full min-w-[930px] grid-cols-[1.15fr_1.2fr_1.5fr_0.8fr_0.75fr_0.8fr] items-center gap-4 px-6 py-[17px] text-left text-[15px] hover:bg-[#fbfdff]"
                    >
                      <span className="inline-flex items-center gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#0891b2] font-semibold text-white">
                          {record.initials}
                        </span>
                        <span className="font-medium text-[#1f2a37]">
                          {record.patient}
                        </span>
                      </span>
                      <span className="text-[#4d5761]">{record.doctor}</span>
                      <span className="flex items-center gap-2 text-[#4d5761]">
                        <ChevronDown
                          className={`size-4 shrink-0 text-[#155eef] transition-transform ${expanded === record.id ? "rotate-180" : ""}`}
                        />
                        {record.medications.map((med) => med.name).join(", ")}
                      </span>
                      <span className="text-[#4d5761]">{record.date}</span>
                      <span>
                        <span
                          className={`rounded-full px-3 py-1.5 text-sm font-medium capitalize ${record.status === "active" ? "bg-[#ecfdf3] text-[#067647]" : "bg-[#f1f5f9] text-[#475467]"}`}
                        >
                          {record.status}
                        </span>
                      </span>
                      <span className="text-[#4d5761]">{record.updated}</span>
                    </button>
                    {expanded === record.id ? (
                      <div className="border-t border-[#f1f5f9] bg-[#fbfcfe] px-6 py-5">
                        <div className="grid gap-4 md:grid-cols-2">
                          {record.medications.map((medication, index) => (
                            <PrescriptionReviewItem
                              key={index}
                              medication={medication}
                              index={index}
                            />
                          ))}
                        </div>
                        {record.patient !== "John Doe" &&
                        !record.id.startsWith("RX-PREVIEW") ? (
                          <p className="mt-4 text-xs text-[#6c737f]">
                            Dosage details were not provided for this Figma
                            sample record.
                          </p>
                        ) : null}
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))}
              {visible.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-[#6c737f]"
                  >
                    No prescriptions match your search.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
      <p className="mt-4 flex items-center gap-2 text-xs text-[#90a1b9]">
        <Pill className="size-4" />
        Figma sample prescriptions only; no real prescription records are
        connected.
      </p>
      {creating ? (
        <CreatePrescription
          onClose={() => setCreating(false)}
          onConfirm={confirmPreview}
        />
      ) : null}
    </div>
  );
}
