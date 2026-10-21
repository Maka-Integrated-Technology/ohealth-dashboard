import { useState } from "react";
import { Check, Search, X } from "lucide-react";
import { LaboratoryShell } from "./laboratory-shell";
import {
  INITIAL_LAB_RESULTS,
  RESULTS_TABS,
  resultStatusStyles,
  type LaboratoryResult,
  type ResultsTab,
} from "./laboratory-results-data";
import {
  LaboratoryResultDrawer,
  PublishResultDialog,
} from "./laboratory-result-drawer";

export default function LaboratoryResults() {
  const [results, setResults] =
    useState<LaboratoryResult[]>(INITIAL_LAB_RESULTS);
  const [activeTab, setActiveTab] = useState<ResultsTab>("All");
  const [search, setSearch] = useState("");
  const [headerSearch, setHeaderSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmPublish, setConfirmPublish] = useState(false);
  const [notice, setNotice] = useState("");

  const selected = results.find((item) => item.id === selectedId) ?? null;

  const visibleResults = results.filter((result) => {
    const fields = [
      result.patient,
      result.patientId,
      result.test,
      result.date,
      result.status,
      result.fileName ?? "",
      result.reviewedBy,
      result.id,
    ]
      .join(" ")
      .toLowerCase();
    return (
      (activeTab === "All" || result.status === activeTab) &&
      fields.includes(search.trim().toLowerCase()) &&
      fields.includes(headerSearch.trim().toLowerCase())
    );
  });

  const openResult = (id: string) => {
    setSelectedId(id);
    setConfirmPublish(false);
    setNotice("");
  };

  const chooseUploadResult = () => {
    const pending = results.find((result) => result.status === "Pending");
    if (pending) {
      openResult(pending.id);
    } else {
      const underReview = results.find(
        (result) => result.status === "Under Review"
      );
      if (underReview) openResult(underReview.id);
      else
        setNotice(
          "There are no pending or reviewable results in this preview."
        );
    }
  };

  const recordFile = (id: string, filename: string) => {
    setResults((current) =>
      current.map((result) =>
        result.id === id
          ? {
              ...result,
              status: "Under Review",
              approved: false,
              reviewedBy: "Pending review",
              fileName: filename,
              history: [
                {
                  stamp: "Preview session",
                  action: "Result file selected locally: " + filename,
                  actor: "Lab Administrator",
                },
                ...result.history,
              ],
            }
          : result
      )
    );
  };

  const approveResult = (id: string) => {
    setResults((current) =>
      current.map((result) =>
        result.id === id &&
        result.status === "Under Review" &&
        !!result.fileName
          ? {
              ...result,
              approved: true,
              reviewedBy: "Dr. Chiamaka Eze",
              history: [
                {
                  stamp: "Preview session",
                  action: "Result reviewed and approved (preview only)",
                  actor: "Dr. Chiamaka Eze",
                },
                ...result.history,
              ],
            }
          : result
      )
    );
  };

  const publishResult = () => {
    if (
      !selected ||
      selected.status !== "Under Review" ||
      !selected.approved ||
      !selected.fileName
    ) {
      setConfirmPublish(false);
      return;
    }
    const id = selected.id;
    setResults((current) =>
      current.map((result) =>
        result.id === id
          ? {
              ...result,
              status: "Published",
              newlyPublished: true,
              history: [
                {
                  stamp: "Preview session",
                  action: "Result published locally (no notifications sent)",
                  actor: "Lab Administrator",
                },
                ...result.history,
              ],
            }
          : result
      )
    );
    setConfirmPublish(false);
  };

  return (
    <LaboratoryShell
      section="Results"
      search={headerSearch}
      onSearchChange={setHeaderSearch}
    >
      <div className="mx-auto w-full max-w-[1500px] px-[15px] pt-[24px] pb-[65px] sm:px-[30px] sm:pt-[45px] sm:pb-[74px]">
        <div className="flex flex-wrap items-start justify-between gap-[16px]">
          <div>
            <h1 className="text-[22px] leading-[30px] font-semibold tracking-[-0.4px] text-[#202b3a] sm:text-[29px] sm:leading-[37px] sm:tracking-[-0.5px]">
              Results
            </h1>
            <p className="mt-[1px] text-[13px] leading-[20px] text-[#566371] sm:text-[17px] sm:leading-[25px]">
              Manage test results — upload, review, and publish
            </p>
          </div>
          <button
            type="button"
            onClick={chooseUploadResult}
            className="inline-flex min-h-[35px] shrink-0 items-center justify-center gap-[3px] rounded-[12px] bg-[#155eef] px-[13px] text-[12px] font-medium text-white shadow-sm hover:bg-[#084bd4] sm:min-h-[36px] sm:px-[15px] sm:text-[13px]"
          >
            <span aria-hidden="true">📤</span> Upload Result
          </button>
        </div>

        {notice && (
          <div
            role="status"
            className="mt-4 flex items-center justify-between gap-3 rounded-[11px] border border-[#d1dfff] bg-[#f0f6ff] px-4 py-3 text-[12px] text-[#245acb]"
          >
            <span>{notice}</span>
            <button
              type="button"
              aria-label="Dismiss message"
              onClick={() => setNotice("")}
            >
              <X className="size-[14px]" />
            </button>
          </div>
        )}

        <section className="mt-[29px] overflow-hidden rounded-[14px] border border-[#e7edf5] bg-white sm:mt-[61px] sm:rounded-[17px]">
          <div className="px-[12px] pt-[12px] sm:px-[19px] sm:pt-[15px]">
            <div className="relative w-full sm:max-w-[281px]">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-[11px] left-[13px] size-[15px] text-[#95a6bd]"
              />
              <input
                aria-label="Search results by patient, test or result ID"
                type="search"
                placeholder="Search by patient, test, result ID..."
                value={search}
                onChange={(event) => setSearch(event.currentTarget.value)}
                className="h-[35px] w-full rounded-[11px] border border-[#dfe7f1] bg-white pr-[10px] pl-[36px] text-[12px] text-[#314561] outline-none placeholder:text-[#8fa5c3] focus:border-[#155eef] focus:ring-2 focus:ring-[#e6efff] sm:h-[37px] sm:text-[13px]"
              />
            </div>
            <div
              role="tablist"
              aria-label="Result status filters"
              className="mt-[14px] flex items-center gap-[7px] overflow-x-auto border-b border-[#dfe7f0] sm:mt-[16px] sm:gap-[12px]"
            >
              {RESULTS_TABS.map((tab) => {
                const isActive = activeTab === tab;
                const count = results.filter(
                  (result) => tab === "All" || result.status === tab
                ).length;
                return (
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={
                      "flex min-h-[37px] shrink-0 items-center gap-[7px] border-b-[2px] px-[10px] text-[12px] font-medium transition-colors sm:min-h-[42px] sm:px-[15px] sm:text-[13px] " +
                      (isActive
                        ? "border-[#155eef] text-[#155eef]"
                        : "border-transparent text-[#637a9a] hover:text-[#155eef]")
                    }
                  >
                    {tab}
                    <span
                      className={
                        "inline-flex min-w-[17px] justify-center rounded-full px-[5px] py-[2px] text-[10px] leading-[13px] " +
                        (isActive
                          ? "bg-[#e4edff] text-[#155eef]"
                          : "bg-[#eef2f7] text-[#7187a5]")
                      }
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[920px] border-collapse text-left">
              <thead>
                <tr className="h-[40px] border-b border-[#e5ebf3] bg-[#f7f9fc] text-[11px] font-semibold tracking-[0.15px] text-[#60738f]">
                  <th scope="col" className="w-[12%] px-[15px]">
                    PATIENT
                  </th>
                  <th scope="col" className="w-[22%] px-[15px]">
                    TEST
                  </th>
                  <th scope="col" className="w-[11%] px-[15px]">
                    TEST DATE
                  </th>
                  <th scope="col" className="w-[13%] px-[15px]">
                    STATUS
                  </th>
                  <th scope="col" className="w-[20%] px-[15px]">
                    REPORT FILE
                  </th>
                  <th scope="col" className="w-[13%] px-[15px]">
                    REVIEWED BY
                  </th>
                  <th scope="col" className="w-[13%] px-[15px]">
                    RESULT ID
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleResults.map((result) => (
                  <tr
                    key={result.id}
                    role="button"
                    tabIndex={0}
                    aria-label={
                      "View result " + result.id + " for " + result.patient
                    }
                    onClick={() => openResult(result.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openResult(result.id);
                      }
                    }}
                    className="h-[55px] cursor-pointer border-b border-[#edf1f6] bg-white transition-colors last:border-b-0 hover:bg-[#f8fbff] focus-visible:bg-[#edf4ff] focus-visible:outline-2 focus-visible:outline-[#155eef] sm:h-[60px]"
                  >
                    <td className="px-[15px] py-[9px]">
                      <span className="block text-[12px] leading-[17px] font-medium text-[#24334e] sm:text-[14px] sm:leading-[19px]">
                        {result.patient}
                      </span>
                      <span className="block font-mono text-[11px] leading-[15px] text-[#8da2c0]">
                        {result.patientId}
                      </span>
                    </td>
                    <td className="px-[15px] py-[9px] text-[12px] leading-[17px] text-[#394b68] sm:text-[14px] sm:leading-[19px]">
                      {result.test}
                    </td>
                    <td className="px-[15px] py-[9px] font-mono text-[11px] text-[#7187a7] sm:text-[12px]">
                      {result.date}
                    </td>
                    <td className="px-[15px] py-[9px]">
                      <span
                        className={
                          "inline-flex items-center rounded-[9px] px-[9px] py-[3px] text-[11px] leading-[16px] font-medium sm:text-[12px] " +
                          resultStatusStyles(result.status)
                        }
                      >
                        {result.status}
                      </span>
                    </td>
                    <td className="px-[15px] py-[9px] text-[11px] leading-[17px]">
                      {result.fileName ? (
                        <span className="inline-flex items-center gap-[4px] text-[#00a66a]">
                          <Check className="size-[11px] shrink-0" />
                          <span className="break-all">{result.fileName}</span>
                        </span>
                      ) : (
                        <span className="text-[#91a6c3]">No file</span>
                      )}
                    </td>
                    <td className="px-[15px] py-[9px] text-[11px] leading-[17px] text-[#6d82a3] sm:text-[12px]">
                      {result.reviewedBy}
                    </td>
                    <td className="px-[15px] py-[9px] font-mono text-[11px] leading-[17px] text-[#8da2c0]">
                      {result.id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {visibleResults.length === 0 && (
              <div className="px-4 py-12 text-center text-[13px] text-[#6e83a0]">
                No results match your current filters.{" "}
                <button
                  type="button"
                  className="font-semibold text-[#155eef] hover:underline"
                  onClick={() => {
                    setSearch("");
                    setHeaderSearch("");
                    setActiveTab("All");
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          <div className="flex min-h-[47px] items-center border-t border-[#edf1f6] px-[19px] text-[12px] text-[#8fa5c1] sm:min-h-[49px]">
            {visibleResults.length}{" "}
            {visibleResults.length === 1 ? "result" : "results"}
          </div>
        </section>
        <p className="mt-[13px] text-[11px] text-[#96a4b5]">
          Preview-only records. Selected files, reviews and publications stay in
          this browser session and are never sent to patients.
        </p>
      </div>

      {selected && !confirmPublish && (
        <LaboratoryResultDrawer
          key={selected.id}
          result={selected}
          onClose={() => setSelectedId(null)}
          onFileUpload={recordFile}
          onApprove={approveResult}
          onPublishRequest={() => setConfirmPublish(true)}
        />
      )}
      {selected && confirmPublish && (
        <PublishResultDialog
          result={selected}
          onCancel={() => setConfirmPublish(false)}
          onConfirm={publishResult}
        />
      )}
    </LaboratoryShell>
  );
}
