import { Search } from "lucide-react";
import { useMemo, useState } from "react";

export type HospitalPatientRecord = {
  id: string;
  initials: string;
  patient: string;
  detail: string;
  lastAppointment: string;
  doctor: string;
  department: string;
  nextAppointment: string;
};

// Figma preview data only. These are not live patient records.
export const hospitalPatientRecords: HospitalPatientRecord[] = [
  {
    id: "john-doe",
    initials: "JD",
    patient: "John Doe",
    detail: "45y · Male",
    lastAppointment: "2024-11-15",
    doctor: "Dr. Sarah Chen",
    department: "Cardiology",
    nextAppointment: "2024-12-20",
  },
  {
    id: "maria-santos",
    initials: "MS",
    patient: "Maria Santos",
    detail: "32y · Female",
    lastAppointment: "2024-12-01",
    doctor: "Dr. Emily Rodriguez",
    department: "Pediatrics",
    nextAppointment: "2024-12-20",
  },
  {
    id: "david-lee",
    initials: "DL",
    patient: "David Lee",
    detail: "67y · Male",
    lastAppointment: "2024-11-28",
    doctor: "Dr. Michael Patel",
    department: "Orthopedics",
    nextAppointment: "2024-12-21",
  },
  {
    id: "sarah-johnson",
    initials: "SJ",
    patient: "Sarah Johnson",
    detail: "28y · Female",
    lastAppointment: "2024-12-10",
    doctor: "Dr. Robert Kim",
    department: "General Medicine",
    nextAppointment: "None",
  },
  {
    id: "ahmed-hassan",
    initials: "AH",
    patient: "Ahmed Hassan",
    detail: "54y · Male",
    lastAppointment: "2024-12-05",
    doctor: "Dr. Sarah Chen",
    department: "Cardiology",
    nextAppointment: "2024-12-22",
  },
  {
    id: "emma-williams",
    initials: "EW",
    patient: "Emma Williams",
    detail: "39y · Female",
    lastAppointment: "2024-11-20",
    doctor: "Dr. Sarah Chen",
    department: "Cardiology",
    nextAppointment: "2024-12-20",
  },
  {
    id: "carlos-martinez",
    initials: "CM",
    patient: "Carlos Martinez",
    detail: "71y · Male",
    lastAppointment: "2024-12-08",
    doctor: "Dr. Emily Rodriguez",
    department: "Pediatrics",
    nextAppointment: "2024-12-23",
  },
  {
    id: "priya-sharma",
    initials: "PS",
    patient: "Priya Sharma",
    detail: "23y · Female",
    lastAppointment: "2024-12-12",
    doctor: "Dr. Aisha Thompson",
    department: "Dermatology",
    nextAppointment: "2024-12-20",
  },
];

export default function HospitalPatientsList({
  onView,
}: {
  onView: (id: string) => void;
}) {
  const [filter, setFilter] = useState("");
  const visiblePatients = useMemo(() => {
    const term = filter.trim().toLowerCase();
    if (!term) return hospitalPatientRecords;
    return hospitalPatientRecords.filter((record) =>
      [record.patient, record.detail, record.doctor, record.department].some(
        (value) => value.toLowerCase().includes(term)
      )
    );
  }, [filter]);

  return (
    <div className="max-w-[1143px] pb-12">
      <div className="mb-10">
        <h2 className="text-[21px] leading-8 font-semibold text-[#1f2a37]">
          Patients
        </h2>
        <p className="mt-1 text-[18px] leading-[26px] font-medium text-[#4d5761]">
          Only patients who have booked appointments with your hospital are
          shown.
        </p>
      </div>

      <div className="mb-5 rounded-[21px] border border-[#f1f5f9] bg-white p-[21px]">
        <label className="flex w-full max-w-[560px] items-center gap-[10px] rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 text-[#62748e]">
          <Search className="size-[18px] shrink-0" />
          <input
            type="search"
            aria-label="Search hospital patients"
            value={filter}
            placeholder="Search patients..."
            onChange={(event) => setFilter(event.currentTarget.value)}
            className="min-w-0 flex-1 bg-transparent text-[18px] text-[#1f2a37] outline-none placeholder:text-[#90a1b9]"
          />
        </label>
      </div>

      <div className="overflow-x-auto rounded-[20px] border border-[#f1f5f9] bg-white">
        <table className="w-full min-w-[990px] border-collapse text-left">
          <thead className="border-b border-[#f1f5f9] bg-[#f8fafc] text-[14px] font-semibold tracking-[0.65px] text-[#90a1b9] uppercase">
            <tr>
              <th className="px-6 py-[15px]">Patient</th>
              <th className="px-4 py-[15px]">Last Appointment</th>
              <th className="px-4 py-[15px]">Assigned Doctor</th>
              <th className="px-4 py-[15px]">Department</th>
              <th className="px-4 py-[15px]">Next Appointment</th>
              <th className="px-6 py-[15px] text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f5f9]">
            {visiblePatients.map((patient) => (
              <tr key={patient.id} className="text-[15px] hover:bg-[#fbfdff]">
                <td className="px-6 py-[17px]">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#0891b2] text-[15px] font-semibold text-white">
                      {patient.initials}
                    </span>
                    <span>
                      <span className="block font-medium text-[#1f2a37]">
                        {patient.patient}
                      </span>
                      <span className="block text-[14px] text-[#90a1b9]">
                        {patient.detail}
                      </span>
                    </span>
                  </div>
                </td>
                <td className="px-4 py-[17px] font-mono text-[#62748e]">
                  {patient.lastAppointment}
                </td>
                <td className="px-4 py-[17px] text-[#45556c]">
                  {patient.doctor}
                </td>
                <td className="px-4 py-[17px] text-[#45556c]">
                  {patient.department}
                </td>
                <td className="px-4 py-[17px] font-mono text-[#62748e]">
                  {patient.nextAppointment}
                </td>
                <td className="px-6 py-[17px] text-right">
                  <button
                    type="button"
                    onClick={() => onView(patient.id)}
                    className="rounded-lg border border-[#d7e0ec] px-4 py-2 text-[14px] font-medium text-[#2970ff] hover:bg-[#eff4ff]"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
            {visiblePatients.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-sm text-[#62748e]"
                >
                  No patients match your search.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
