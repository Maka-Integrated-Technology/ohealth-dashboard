import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { labListParams, labParam } from "./laboratory-list-state";
import { FileText, Info, Search, X } from "lucide-react";
import { LaboratoryShell } from "./laboratory-shell";

type Source = "External Upload" | "OHealth+ Lab";

type ExternalResult = {
  patient: string;
  patientId: string;
  laboratory: string;
  source: Source;
  test: string;
  testDate: string;
  uploadDate: string;
  accessGranted: boolean;
  phone: string | null;
  reportFile: string | null;
};

// Exact example records and their permission states from the supplied design.
// No report document or real patient permission is connected to this preview.
const EXTERNAL_RESULTS: ExternalResult[] = [
  {
    patient: "Adaeze Okonkwo",
    patientId: "PT-10042",
    laboratory: "MedPoint Diagnostics, Ikeja",
    source: "External Upload",
    test: "Comprehensive Metabolic Panel",
    testDate: "01 Sept 2025",
    uploadDate: "05 Sept 2025",
    accessGranted: true,
    phone: "+234 812 345 6789",
    reportFile: "cmp_adaeze_okonkwo.pdf",
  },
  {
    patient: "Chidi Okeke",
    patientId: "PT-10045",
    laboratory: "OHealth+ Apapa Branch",
    source: "OHealth+ Lab",
    test: "Haemoglobin Electrophoresis",
    testDate: "28 Aug 2025",
    uploadDate: "29 Aug 2025",
    accessGranted: true,
    phone: null,
    reportFile: null,
  },
  {
    patient: "Ngozi Adeyemi",
    patientId: "PT-10046",
    laboratory: "Central Labs Nigeria, Abuja",
    source: "External Upload",
    test: "Full Blood Count + ESR",
    testDate: "08 Sept 2025",
    uploadDate: "09 Sept 2025",
    accessGranted: false,
    phone: "+234 808 111 2222",
    reportFile: null,
  },
];

function SourceBadge({ source }: { source: Source }) {
  return (
    <span
      className={
        "inline-flex shrink-0 items-center rounded-[8px] px-[8px] py-[4px] text-[10px] leading-[14px] font-medium sm:text-[11px] " +
        (source === "OHealth+ Lab"
          ? "bg-[#edf4ff] text-[#155eef]"
          : "bg-[#f1f3f6] text-[#475b78]")
      }
    >
      {source}
    </span>
  );
}

function AccessBadge({ granted }: { granted: boolean }) {
  return (
    <span
      className={
        "inline-flex shrink-0 items-center gap-[6px] rounded-full px-[9px] py-[5px] text-[10px] leading-[14px] font-medium sm:text-[11px] " +
        (granted
          ? "bg-[#e8faf1] text-[#008a62]"
          : "bg-[#fff0f1] text-[#de1825]")
      }
    >
      <span
        aria-hidden="true"
        className={
          "size-[6px] rounded-full " +
          (granted ? "bg-[#07b37d]" : "bg-[#ed2939]")
        }
      />
      {granted ? "Access Granted" : "Access Not Granted"}
    </span>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-h-[64px] min-w-0 flex-col justify-center rounded-[13px] bg-[#f7f9fb] px-[13px] py-[11px] sm:min-h-[65px]">
      <span className="text-[11px] leading-[17px] text-[#91a5c2] sm:text-[13px] sm:leading-[19px]">
        {label}
      </span>
      <span className="mt-[2px] text-[13px] leading-[19px] font-medium break-words text-[#1a2941] sm:text-[15px] sm:leading-[21px]">
        {value}
      </span>
    </div>
  );
}

function ExternalResultDetail({
  result,
  onClose,
}: {
  result: ExternalResult;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [downloadNotice, setDownloadNotice] = useState(false);

  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex justify-end bg-[#101828]/10 backdrop-blur-[5px]"
      onMouseDown={onClose}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="external-result-detail-heading"
        onMouseDown={(event) => event.stopPropagation()}
        className="flex h-full w-full max-w-[531px] flex-col bg-white shadow-[-12px_0_35px_rgba(16,24,40,0.08)]"
      >
        <div className="flex min-h-[61px] shrink-0 items-center justify-between border-b border-[#e9edf3] px-[15px] sm:px-[25px]">
          <h2
            id="external-result-detail-heading"
            className="text-[15px] font-semibold text-[#152037] sm:text-[17px]"
          >
            External Result Detail
          </h2>
          <button
            ref={closeRef}
            type="button"
            aria-label="Close external result detail"
            onClick={onClose}
            className="rounded-[6px] p-1 text-[#8da4c2] hover:bg-[#f4f7fb] hover:text-[#405775]"
          >
            <X className="size-[19px]" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-[15px] pt-[22px] pb-[55px] sm:px-[25px] sm:pt-[25px]">
          <div className="flex flex-wrap items-center gap-[9px]">
            <span
              className={
                "inline-flex items-center rounded-[8px] px-[11px] py-[5px] text-[11px] font-medium sm:text-[12px] " +
                (result.source === "External Upload"
                  ? "bg-[#f1f3f6] text-[#4a5b77]"
                  : "bg-[#edf4ff] text-[#155eef]")
              }
            >
              {result.source === "External Upload"
                ? "📤 External Patient Upload"
                : "OHealth+ Lab"}
            </span>
            <span
              className={
                "inline-flex items-center gap-[7px] rounded-[8px] px-[9px] py-[5px] text-[11px] font-medium sm:text-[12px] " +
                (result.accessGranted
                  ? "bg-[#e8faf1] text-[#008c62]"
                  : "bg-[#fff0f1] text-[#de1723]")
              }
            >
              <span
                className={
                  "size-[6px] rounded-full " +
                  (result.accessGranted ? "bg-[#0bb985]" : "bg-[#ed2939]")
                }
              />
              {result.accessGranted ? "Access Granted" : "Access Restricted"}
            </span>
          </div>

          {!result.accessGranted && (
            <div className="mt-[20px] rounded-[16px] border border-[#ffd87b] bg-[#fffae9] px-[16px] py-[15px] text-[#b34803]">
              <h3 className="text-[13px] font-semibold sm:text-[14px]">
                Access Restricted
              </h3>
              <p className="mt-[7px] text-[12px] leading-[20px] sm:text-[14px] sm:leading-[22px]">
                The patient has not granted access to this result. To view or
                download, the patient must share access from their OHealth+
                account.
              </p>
            </div>
          )}

          <section className="mt-[22px]">
            <h3 className="mb-[13px] text-[12px] font-semibold tracking-[0.1px] text-[#607796] sm:text-[13px]">
              PATIENT INFORMATION
            </h3>
            <div className="grid grid-cols-2 gap-[11px] sm:gap-[13px]">
              <DetailField label="Name" value={result.patient} />
              <DetailField label="Patient ID" value={result.patientId} />
              {result.phone && (
                <DetailField label="Phone" value={result.phone} />
              )}
            </div>
          </section>

          <section className="mt-[22px]">
            <h3 className="mb-[13px] text-[12px] font-semibold tracking-[0.1px] text-[#607796] sm:text-[13px]">
              RESULT DETAILS
            </h3>
            <div className="grid grid-cols-2 gap-[11px] sm:gap-[13px]">
              <DetailField label="Laboratory" value={result.laboratory} />
              <DetailField label="Test Type" value={result.test} />
              <DetailField label="Test Date" value={result.testDate} />
              <DetailField label="Upload Date" value={result.uploadDate} />
            </div>
          </section>

          {result.accessGranted && (
            <section className="mt-[23px]">
              <h3 className="mb-[12px] text-[12px] font-semibold tracking-[0.1px] text-[#607796] sm:text-[13px]">
                REPORT
              </h3>
              {result.reportFile ? (
                <div className="flex min-h-[56px] items-center gap-[11px] rounded-[12px] border border-[#a5efd1] bg-[#ebfcf3] px-[12px] py-[10px] sm:px-[14px]">
                  <FileText
                    className="size-[17px] shrink-0 text-[#7b9c92]"
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1 text-[12px] font-medium break-all text-[#00815e] sm:text-[14px]">
                    {result.reportFile}
                  </span>
                  <button
                    type="button"
                    onClick={() => setDownloadNotice(true)}
                    className="shrink-0 rounded-full bg-[#f1f3f7] px-[13px] py-[7px] text-[12px] font-medium text-[#364963] hover:bg-[#e1eaf3] sm:text-[13px]"
                  >
                    Download
                  </button>
                </div>
              ) : (
                <p className="rounded-[12px] bg-[#f7f9fb] px-[13px] py-[14px] text-[12px] text-[#788da9]">
                  No report filename is supplied for this sample record.
                </p>
              )}
              {downloadNotice && (
                <p
                  role="status"
                  className="mt-[11px] rounded-[10px] border border-[#bed6ff] bg-[#eff5ff] px-[12px] py-[10px] text-[12px] leading-[19px] text-[#155eef]"
                >
                  Preview only: the referenced PDF is not connected, so no
                  patient report can be downloaded here.
                </p>
              )}
            </section>
          )}
          <p className="mt-[25px] text-[11px] leading-[17px] text-[#91a2ba]">
            Design preview only. Access labels are example data, not a live
            permission check.
          </p>
        </div>
      </aside>
    </div>
  );
}

export default function LaboratoryExternalResults() {
  const [params, setParams] = useSearchParams();
  const query = labParam(params, "q");
  const setQuery = (value: string) =>
    setParams((current) => labListParams(current, "q", value), {
      replace: true,
    });
  const headerSearch = query;
  const setHeaderSearch = setQuery;
  const sourceFilter = labParam(params, "source", [
    "External Upload",
    "OHealth+ Lab",
  ]) as Source | "";
  const setSourceFilter = (value: Source | null) =>
    setParams((current) => labListParams(current, "source", value ?? ""));
  const [selected, setSelected] = useState<ExternalResult | null>(null);

  const visibleResults = useMemo(() => {
    const local = query.trim().toLowerCase();
    const global = headerSearch.trim().toLowerCase();
    return EXTERNAL_RESULTS.filter((result) => {
      const fields = [
        result.patient,
        result.patientId,
        result.laboratory,
        result.source,
        result.test,
        result.testDate,
        result.uploadDate,
        result.accessGranted ? "Access Granted" : "Access Not Granted",
      ]
        .join(" ")
        .toLowerCase();
      return (
        (!sourceFilter || sourceFilter === result.source) &&
        fields.includes(local) &&
        fields.includes(global)
      );
    });
  }, [query, headerSearch, sourceFilter]);

  return (
    <LaboratoryShell
      section="External Results"
      search={headerSearch}
      onSearchChange={setHeaderSearch}
    >
      <div className="mx-auto w-full max-w-[1500px] px-[15px] pt-[24px] pb-[70px] sm:px-[25px] sm:pt-[45px] sm:pb-[80px]">
        <h1 className="text-[22px] leading-[30px] font-semibold tracking-[-0.4px] text-[#202b3a] sm:text-[29px] sm:leading-[38px]">
          External Results
        </h1>
        <p className="mt-[1px] text-[13px] leading-[20px] text-[#566371] sm:text-[17px] sm:leading-[25px]">
          Results uploaded externally by patients or shared from other
          facilities
        </p>

        <div className="mt-[28px] flex items-start gap-[12px] rounded-[14px] border border-[#bbd9ff] bg-[#eff5ff] px-[14px] py-[14px] sm:mt-[42px] sm:px-[17px] sm:py-[13px]">
          <Info
            className="mt-[2px] size-[17px] shrink-0 text-[#6c91ae]"
            aria-hidden="true"
          />
          <p className="text-[12px] leading-[19px] text-[#155eef] sm:text-[14px] sm:leading-[22px]">
            External results are uploaded directly by patients from outside the
            OHealth+ network. They are clearly distinguished from results
            generated internally by this laboratory. Access is only available
            when the patient has explicitly granted permission.
          </p>
        </div>

        <section className="mt-[24px] overflow-hidden rounded-[15px] border border-[#e8edf5] bg-white sm:mt-[35px] sm:rounded-[17px]">
          <div className="flex flex-wrap items-center justify-between gap-[12px] px-[12px] py-[12px] sm:px-[19px] sm:py-[12px]">
            <div className="relative w-full sm:w-[282px]">
              <Search
                className="pointer-events-none absolute top-[11px] left-[13px] size-[15px] text-[#a1afc1]"
                aria-hidden="true"
              />
              <input
                type="search"
                aria-label="Search external results by patient, lab or test"
                placeholder="Search by patient, lab, test..."
                value={query}
                onChange={(event) => setQuery(event.currentTarget.value)}
                className="h-[36px] w-full rounded-[10px] border border-[#e0e7f1] bg-white pr-[10px] pl-[36px] text-[12px] text-[#3f526f] outline-none placeholder:text-[#8fa4c0] focus:border-[#155eef] focus:ring-2 focus:ring-[#e5eeff] sm:text-[13px]"
              />
            </div>
            <div className="flex items-center gap-[7px]">
              {(["OHealth+ Lab", "External Upload"] as const).map((source) => (
                <button
                  type="button"
                  key={source}
                  aria-pressed={sourceFilter === source}
                  title={
                    sourceFilter === source
                      ? "Show all sources"
                      : "Filter by " + source
                  }
                  onClick={() =>
                    setSourceFilter(sourceFilter === source ? null : source)
                  }
                  className={
                    "rounded-[8px] px-[9px] py-[5px] text-[10px] leading-[14px] font-medium transition-all sm:text-[11px] " +
                    (source === "OHealth+ Lab"
                      ? "bg-[#edf4ff] text-[#155eef]"
                      : "bg-[#f1f3f6] text-[#4b5d78]") +
                    (sourceFilter === source
                      ? " ring-2 ring-[#155eef] ring-offset-1"
                      : "")
                  }
                >
                  {source}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[955px] border-collapse text-left">
              <thead>
                <tr className="h-[40px] border-y border-[#e9edf4] bg-[#f7f9fc] text-[11px] font-semibold tracking-[0.15px] text-[#647995]">
                  <th scope="col" className="w-[13%] px-[15px]">
                    PATIENT
                  </th>
                  <th scope="col" className="w-[29%] px-[15px]">
                    LAB / SOURCE
                  </th>
                  <th scope="col" className="w-[22%] px-[15px]">
                    TEST TYPE
                  </th>
                  <th scope="col" className="w-[11%] px-[15px]">
                    TEST DATE
                  </th>
                  <th scope="col" className="w-[11%] px-[15px]">
                    UPLOADED
                  </th>
                  <th scope="col" className="w-[14%] px-[15px]">
                    ACCESS STATUS
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleResults.map((result) => (
                  <tr
                    key={result.patientId}
                    role="button"
                    tabIndex={0}
                    aria-label={"Open external result for " + result.patient}
                    onClick={() => setSelected(result)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelected(result);
                      }
                    }}
                    className="h-[59px] cursor-pointer border-b border-[#edf1f6] bg-white last:border-b-0 hover:bg-[#f8fbff] focus-visible:bg-[#edf4ff] focus-visible:outline-2 focus-visible:outline-[#155eef]"
                  >
                    <td className="px-[15px] py-[9px]">
                      <span className="block text-[12px] leading-[17px] font-medium text-[#24334d] sm:text-[14px] sm:leading-[19px]">
                        {result.patient}
                      </span>
                      <span className="block font-mono text-[11px] leading-[15px] text-[#8da3c1]">
                        {result.patientId}
                      </span>
                    </td>
                    <td className="px-[15px] py-[9px]">
                      <div className="flex items-center gap-[8px]">
                        <span className="text-[12px] leading-[19px] text-[#3e516d] sm:text-[14px]">
                          {result.laboratory}
                        </span>
                        <SourceBadge source={result.source} />
                      </div>
                    </td>
                    <td className="px-[15px] py-[9px] text-[12px] leading-[18px] text-[#3e516d] sm:text-[14px]">
                      {result.test}
                    </td>
                    <td className="px-[15px] py-[9px] font-mono text-[11px] whitespace-nowrap text-[#7388a8] sm:text-[12px]">
                      {result.testDate}
                    </td>
                    <td className="px-[15px] py-[9px] font-mono text-[11px] whitespace-nowrap text-[#7388a8] sm:text-[12px]">
                      {result.uploadDate}
                    </td>
                    <td className="px-[15px] py-[9px]">
                      <AccessBadge granted={result.accessGranted} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {visibleResults.length === 0 && (
              <div className="px-4 py-12 text-center text-[13px] text-[#7187a5]">
                No external results match your current filters.
                <button
                  type="button"
                  className="ml-2 font-medium text-[#155eef] hover:underline"
                  onClick={() => {
                    setQuery("");
                    setHeaderSearch("");
                    setSourceFilter(null);
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>
        <p className="mt-[14px] text-[11px] leading-[17px] text-[#95a7bd]">
          Example patient results only; access statuses do not represent actual
          sharing permissions.
        </p>
      </div>
      {selected && (
        <ExternalResultDetail
          key={selected.patientId}
          result={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </LaboratoryShell>
  );
}
