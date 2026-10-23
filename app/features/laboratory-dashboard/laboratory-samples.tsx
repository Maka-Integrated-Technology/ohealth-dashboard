import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { labListParams, labParam } from "./laboratory-list-state";
import { ChevronDown, Search, X } from "lucide-react";
import { LaboratoryShell } from "./laboratory-shell";

type SampleStatus =
  | "Awaiting Collection"
  | "Collected"
  | "Under Analysis"
  | "Review Pending"
  | "Completed";

type Sample = {
  id: string;
  patient: string;
  test: string;
  sampleType: string;
  collectedAt: string;
  technician: string;
  status: SampleStatus;
};

const SAMPLES: Sample[] = [
  {
    id: "SP-2025-0441",
    patient: "Fatima Al-Hassan",
    test: "Thyroid Function Test (TFT)",
    sampleType: "Venous Blood (5mL)",
    collectedAt: "13 Sept 2025",
    technician: "Mr. Babatunde Adisa",
    status: "Under Analysis",
  },
  {
    id: "SP-2025-0442",
    patient: "Chidi Okeke",
    test: "Urinalysis",
    sampleType: "Mid-stream Urine (30mL)",
    collectedAt: "13 Sept 2025",
    technician: "Mr. Babatunde Adisa",
    status: "Review Pending",
  },
  {
    id: "SP-2025-0440",
    patient: "Adaeze Okonkwo",
    test: "Complete Blood Count (CBC)",
    sampleType: "EDTA Blood (3mL)",
    collectedAt: "—",
    technician: "Unassigned",
    status: "Awaiting Collection",
  },
  {
    id: "SP-2025-0439",
    patient: "Amina Sule",
    test: "Malaria Parasite Test",
    sampleType: "Capillary Blood",
    collectedAt: "12 Sept 2025",
    technician: "Dr. Chiamaka Eze",
    status: "Completed",
  },
];

const STATUS_ORDER: SampleStatus[] = [
  "Awaiting Collection",
  "Collected",
  "Under Analysis",
  "Review Pending",
  "Completed",
];

const STATUS_COLOR: Record<SampleStatus, { pill: string; dot: string }> = {
  "Awaiting Collection": {
    pill: "bg-[#f0f3f8] text-[#405574]",
    dot: "bg-[#92a5bf]",
  },
  Collected: {
    pill: "bg-[#eaf7ff] text-[#0076ba]",
    dot: "bg-[#0e9ce0]",
  },
  "Under Analysis": {
    pill: "bg-[#f4efff] text-[#7430f5]",
    dot: "bg-[#923eff]",
  },
  "Review Pending": {
    pill: "bg-[#fff6e5] text-[#c45105]",
    dot: "bg-[#ff9900]",
  },
  Completed: {
    pill: "bg-[#e7f9f2] text-[#008968]",
    dot: "bg-[#05ad78]",
  },
};

function StatusPill({
  status,
  showDot = false,
}: {
  status: SampleStatus;
  showDot?: boolean;
}) {
  const colors = STATUS_COLOR[status];
  return (
    <span
      className={
        "inline-flex w-fit items-center gap-[6px] rounded-[9px] px-[9px] py-[3px] text-[11px] leading-[16px] font-medium whitespace-nowrap sm:text-[12px] " +
        colors.pill
      }
    >
      {showDot && (
        <span
          aria-hidden="true"
          className={"size-[6px] shrink-0 rounded-full " + colors.dot}
        />
      )}
      {status}
    </span>
  );
}

export default function LaboratorySamplesAndTests() {
  const [params, setParams] = useSearchParams();
  const search = labParam(params, "q");
  const setSearch = (value: string) => setParams((current) => labListParams(current, "q", value), { replace: true });
  const headerSearch = search;
  const setHeaderSearch = setSearch;
  const filter = labParam(params, "status", STATUS_ORDER) as SampleStatus | "";
  const setFilter = (next: SampleStatus | "" | ((previous: SampleStatus | "") => SampleStatus | "")) =>
    setParams((current) => {
      const previous = labParam(current, "status", STATUS_ORDER) as SampleStatus | "";
      return labListParams(current, "status", typeof next === "function" ? next(previous) : next);
    });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const visibleSamples = useMemo(() => {
    const localQuery = search.trim().toLowerCase();
    const globalQuery = headerSearch.trim().toLowerCase();
    return SAMPLES.filter((sample) => {
      const fields = [
        sample.patient,
        sample.id,
        sample.test,
        sample.sampleType,
        sample.collectedAt,
        sample.technician,
        sample.status,
      ]
        .join(" ")
        .toLowerCase();
      return (
        (!filter || sample.status === filter) &&
        fields.includes(localQuery) &&
        fields.includes(globalQuery)
      );
    });
  }, [search, headerSearch, filter]);

  const selected = SAMPLES.find((sample) => sample.id === selectedId) ?? null;

  return (
    <LaboratoryShell
      section="Samples & Tests"
      search={headerSearch}
      onSearchChange={setHeaderSearch}
    >
      <div className="mx-auto w-full max-w-[1500px] px-[15px] pt-[24px] pb-[54px] sm:px-[30px] sm:pt-[45px] sm:pb-[74px]">
        <h1 className="text-[22px] leading-[30px] font-semibold tracking-[-0.4px] text-[#202b3a] sm:text-[29px] sm:leading-[37px] sm:tracking-[-0.5px]">
          Samples &amp; Tests
        </h1>
        <p className="mt-[1px] text-[13px] leading-[20px] text-[#566371] sm:text-[17px] sm:leading-[25px]">
          Track and manage samples collection and laboratory analysis
        </p>

        <div className="mt-[34px] grid grid-cols-2 gap-[10px] sm:mt-[68px] sm:gap-[12px] lg:grid-cols-5">
          {STATUS_ORDER.map((status) => {
            const count = SAMPLES.filter(
              (sample) => sample.status === status
            ).length;
            return (
              <button
                type="button"
                key={status}
                aria-pressed={filter === status}
                onClick={() =>
                  setFilter((previous) => (previous === status ? "" : status))
                }
                className={
                  "flex min-h-[76px] flex-col items-start justify-center gap-[4px] rounded-[14px] border bg-white px-[13px] py-[12px] text-left transition-colors hover:border-[#b5cdf8] focus-visible:outline-2 focus-visible:outline-[#155eef] sm:min-h-[89px] sm:rounded-[16px] sm:px-[16px] sm:py-[15px] " +
                  (filter === status
                    ? "border-[#a8c4ff] ring-1 ring-[#e5efff]"
                    : "border-[#e8edf5]")
                }
              >
                <span className="text-[20px] leading-[25px] font-semibold text-[#111b30] sm:text-[23px] sm:leading-[27px]">
                  {count}
                </span>
                <StatusPill status={status} />
              </button>
            );
          })}
        </div>

        <section className="mt-[29px] overflow-hidden rounded-[14px] border border-[#e5ebf3] bg-white sm:mt-[49px] sm:rounded-[17px]">
          <div className="flex flex-wrap items-center gap-[10px] px-[12px] pt-[12px] pb-[12px] sm:gap-[13px] sm:px-[19px] sm:pt-[12px] sm:pb-[12px]">
            <div className="relative min-w-[170px] flex-1 sm:max-w-[281px]">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-[10px] left-[13px] size-[16px] text-[#9da7b5]"
                strokeWidth={1.8}
              />
              <input
                type="search"
                aria-label="Search by patient, sample ID or test"
                placeholder="Search by patient, sample ID, test..."
                value={search}
                onChange={(event) => setSearch(event.currentTarget.value)}
                className="h-[35px] w-full rounded-[9px] border border-[#dce4f0] bg-white pr-3 pl-[36px] text-[12px] text-[#344660] outline-none placeholder:text-[#90a4bf] focus:border-[#155eef] focus:ring-2 focus:ring-[#dce8ff] sm:h-[37px] sm:rounded-[11px] sm:text-[13px]"
              />
            </div>
            <div className="relative w-full sm:w-[203px]">
              <select
                aria-label="Filter samples by status"
                value={filter}
                onChange={(event) =>
                  setFilter(event.currentTarget.value as SampleStatus | "")
                }
                className="h-[35px] w-full appearance-none rounded-[9px] border border-[#dce4f0] bg-white px-[13px] pr-[35px] text-[12px] text-[#34435a] outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#dce8ff] sm:h-[37px] sm:rounded-[11px] sm:px-[16px] sm:pr-[35px] sm:text-[13px]"
              >
                <option value="">All Statuses</option>
                {STATUS_ORDER.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute top-[10px] right-[13px] size-[15px] text-[#263650]"
              />
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-left">
              <thead>
                <tr className="h-[42px] border-y border-[#e3e9f2] bg-[#f7f9fc] text-[11px] font-semibold tracking-[0.15px] text-[#60738f]">
                  <th scope="col" className="w-[15%] px-[16px]">
                    PATIENT
                  </th>
                  <th scope="col" className="w-[22%] px-[16px]">
                    TEST TYPE
                  </th>
                  <th scope="col" className="w-[17%] px-[16px]">
                    SAMPLE TYPE
                  </th>
                  <th scope="col" className="w-[15%] px-[16px]">
                    COLLECTION DATE
                  </th>
                  <th scope="col" className="w-[15%] px-[16px]">
                    TECHNICIAN
                  </th>
                  <th scope="col" className="w-[16%] px-[16px]">
                    STATUS
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleSamples.map((sample) => (
                  <tr
                    key={sample.id}
                    tabIndex={0}
                    role="button"
                    aria-label={
                      "View sample " + sample.id + " for " + sample.patient
                    }
                    onClick={() => setSelectedId(sample.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedId(sample.id);
                      }
                    }}
                    className="h-[56px] cursor-pointer border-b border-[#eef2f7] bg-white transition-colors last:border-b-0 hover:bg-[#f8fbff] focus-visible:bg-[#edf4ff] focus-visible:outline-2 focus-visible:outline-[#155eef] sm:h-[60px]"
                  >
                    <td className="px-[16px] py-[9px]">
                      <span className="block text-[12px] leading-[17px] font-medium text-[#24334e] sm:text-[14px] sm:leading-[19px]">
                        {sample.patient}
                      </span>
                      <span className="block font-mono text-[11px] leading-[15px] text-[#8da2c0]">
                        {sample.id}
                      </span>
                    </td>
                    <td className="px-[16px] py-[9px] text-[12px] leading-[17px] text-[#394b68] sm:text-[14px] sm:leading-[19px]">
                      {sample.test}
                    </td>
                    <td className="px-[16px] py-[9px] text-[11px] leading-[17px] text-[#6f84a3] sm:text-[12px]">
                      {sample.sampleType}
                    </td>
                    <td className="px-[16px] py-[9px] font-mono text-[11px] leading-[17px] text-[#7187a7] sm:text-[12px]">
                      {sample.collectedAt}
                    </td>
                    <td
                      className={
                        "px-[16px] py-[9px] text-[11px] leading-[17px] sm:text-[12px] " +
                        (sample.technician === "Unassigned"
                          ? "text-[#e56800]"
                          : "text-[#6d82a3]")
                      }
                    >
                      {sample.technician}
                    </td>
                    <td className="px-[16px] py-[9px]">
                      <StatusPill status={sample.status} showDot />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {visibleSamples.length === 0 && (
              <div className="px-4 py-12 text-center text-[13px] text-[#6e83a0]">
                No samples match your search or status filter.{" "}
                <button
                  type="button"
                  className="font-semibold text-[#155eef] hover:underline"
                  onClick={() => {
                    setSearch("");
                    setHeaderSearch("");
                    setFilter("");
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
          <div className="flex min-h-[47px] items-center border-t border-[#eef2f7] px-[19px] text-[12px] text-[#8fa5c1] sm:min-h-[51px]">
            {visibleSamples.length}{" "}
            {visibleSamples.length === 1 ? "sample" : "samples"}
          </div>
        </section>
        <p className="mt-4 text-[11px] text-[#96a4b5]">
          Screenshot-based preview data only. No laboratory records are accessed
          or changed.
        </p>
      </div>
      {selected && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-[#0f172a]/10 backdrop-blur-[4px]"
          role="presentation"
          onMouseDown={() => setSelectedId(null)}
        >
          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="sample-details-heading"
            onMouseDown={(event) => event.stopPropagation()}
            className="flex h-full w-full max-w-[540px] flex-col overflow-y-auto bg-white shadow-[-10px_0_36px_rgba(16,24,40,0.08)]"
          >
            <header className="flex min-h-[62px] items-center justify-between border-b border-[#e5eaf2] px-[16px] sm:px-[26px]">
              <h2
                id="sample-details-heading"
                className="text-[15px] font-semibold text-[#151d32] sm:text-[17px]"
              >
                Sample {selected.id}
              </h2>
              <button
                type="button"
                aria-label="Close sample details"
                onClick={() => setSelectedId(null)}
                className="text-[#91a3bf] hover:text-[#35465c]"
              >
                <X className="size-[19px]" />
              </button>
            </header>
            <div className="grid grid-cols-2 gap-[9px] p-[15px] sm:gap-[12px] sm:p-[26px]">
              {[
                ["Patient", selected.patient],
                ["Sample ID", selected.id],
                ["Test Type", selected.test],
                ["Sample Type", selected.sampleType],
                ["Collection Date", selected.collectedAt],
                ["Technician", selected.technician],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="min-w-0 rounded-[12px] bg-[#f7f9fb] px-[12px] py-[12px]"
                >
                  <p className="text-[11px] text-[#8da2c0] sm:text-[13px]">
                    {label}
                  </p>
                  <p className="mt-[4px] text-[13px] font-medium break-words text-[#1c2a40] sm:text-[15px]">
                    {value}
                  </p>
                </div>
              ))}
              <div className="col-span-2 mt-[7px]">
                <p className="mb-[9px] text-[12px] font-semibold text-[#617796]">
                  STATUS
                </p>
                <StatusPill status={selected.status} showDot />
              </div>
              <p className="col-span-2 mt-[13px] text-[12px] leading-5 text-[#8ba1c0]">
                Read-only preview. The supplied images do not reveal additional
                sample details or available status transitions.
              </p>
            </div>
          </aside>
        </div>
      )}
    </LaboratoryShell>
  );
}
