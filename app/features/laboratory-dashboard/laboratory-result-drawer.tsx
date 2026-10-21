import { useState, type ChangeEvent, type DragEvent } from "react";
import { Check, Upload, X } from "lucide-react";
import {
  resultStatusStyles,
  type LaboratoryResult,
} from "./laboratory-results-data";

type DrawerProps = {
  result: LaboratoryResult;
  onClose: () => void;
  onFileUpload: (id: string, filename: string) => void;
  onApprove: (id: string) => void;
  onPublishRequest: () => void;
};

function StatusBadge({ status }: { status: LaboratoryResult["status"] }) {
  return (
    <span
      className={
        "inline-flex items-center gap-[7px] rounded-[9px] px-[9px] py-[4px] text-[12px] font-medium " +
        resultStatusStyles(status)
      }
    >
      <span
        className={
          "size-[6px] shrink-0 rounded-full " +
          (status === "Pending"
            ? "bg-[#f59e0b]"
            : status === "Under Review"
              ? "bg-[#2763ff]"
              : "bg-[#10a67c]")
        }
      />
      {status}
    </span>
  );
}

function ResultInformation({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-h-[62px] min-w-0 flex-col justify-center rounded-[13px] bg-[#f7f9fb] px-[12px] py-[10px] sm:min-h-[66px]">
      <span className="text-[11px] leading-[17px] text-[#91a5c3] sm:text-[13px] sm:leading-[19px]">
        {label}
      </span>
      <span className="mt-[2px] break-words text-[13px] leading-[19px] font-medium text-[#1c2b43] sm:text-[15px] sm:leading-[21px]">
        {value}
      </span>
    </div>
  );
}

export function LaboratoryResultDrawer({
  result,
  onClose,
  onFileUpload,
  onApprove,
  onPublishRequest,
}: DrawerProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [notice, setNotice] = useState("");
  const pending = result.status === "Pending";
  const published = result.status === "Published";
  const fileLabel = pending ? "UPLOAD RESULT FILE" : "REPLACE RESULT FILE";

  const chooseFile = (file: File | undefined) => {
    if (!file) return;
    const extension = /\.(pdf|jpg|jpeg|png)$/i.test(file.name);
    const mime = ["application/pdf", "image/jpeg", "image/png"].includes(file.type);
    if (!extension || (file.type && !mime) || file.size > 10 * 1024 * 1024) {
      setSelectedFile(null);
      setFileError("Select a PDF, JPG or PNG file of 10 MB or less.");
      return;
    }
    setSelectedFile(file);
    setFileError("");
    setNotice("");
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    chooseFile(event.currentTarget.files?.[0]);
    event.currentTarget.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    chooseFile(event.dataTransfer.files[0]);
  };

  const uploadLocally = () => {
    if (!selectedFile) return;
    onFileUpload(result.id, selectedFile.name);
    setSelectedFile(null);
    setNotice("Preview only: the file name was recorded locally. No file was uploaded.");
    setFileError("");
  };

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex justify-end bg-[#0f172a]/10 backdrop-blur-[5px]"
      onMouseDown={onClose}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="lab-result-heading"
        onMouseDown={(event) => event.stopPropagation()}
        className="flex h-full w-full max-w-[625px] flex-col bg-white shadow-[-10px_0_36px_rgba(16,24,40,0.08)]"
      >
        <div className="flex min-h-[62px] shrink-0 items-center justify-between border-b border-[#e7ebf2] px-[16px] sm:px-[26px]">
          <h2
            id="lab-result-heading"
            className="text-[15px] font-semibold tracking-[-0.2px] text-[#161e32] sm:text-[17px]"
          >
            Result {result.id}
          </h2>
          <button
            type="button"
            aria-label="Close result details"
            onClick={onClose}
            className="text-[#91a3bf] hover:text-[#35465c]"
          >
            <X className="size-[19px]" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-[15px] pt-[24px] pb-[60px] sm:px-[26px]">
          {published ? (
            <>
              <div className="rounded-[13px] border border-[#a8f1d1] bg-[#eafcf3] px-[15px] py-[16px] text-[12px] leading-[20px] text-[#007955]">
                <p className="flex items-center gap-[8px] font-semibold">
                  <Check className="size-[14px]" />
                  {result.newlyPublished
                    ? "Result Published (Preview)"
                    : "Result Published (Sample Data)"}
                </p>
                <p className="mt-[7px] pl-[23px]">
                  In a connected portal, this result could become available to the patient and authorized professionals.
                  No SMS, email, or patient record update occurs in this preview.
                </p>
              </div>
              <p className="mt-[12px] text-[11px] text-[#91a4c0]">
                {result.newlyPublished
                  ? "Published in this preview session"
                  : "Published in the reference design"}
              </p>
              <button
                type="button"
                className="mt-[13px] rounded-[10px] bg-[#f0f3f7] px-[14px] py-[9px] text-[12px] font-medium text-[#40516b] hover:bg-[#e5eaf2]"
                onClick={() => setNotice("Preview only: no result was shared with a doctor.")}
              >
                Share With Doctor
              </button>
            </>
          ) : (
            <>
              <StatusBadge status={result.status} />
              <div className="mt-[24px]">
                {pending ? (
                  <p className="text-[13px] text-[#657d9d]">
                    Upload a result file below to proceed.
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (result.approved) {
                        onPublishRequest();
                      } else {
                        onApprove(result.id);
                        setNotice("Result approved in this preview only. No clinical approval was recorded.");
                      }
                    }}
                    className={
                      "rounded-[12px] px-[17px] py-[10px] text-[13px] font-medium text-white shadow-sm " +
                      (result.approved
                        ? "bg-[#009965] hover:bg-[#008354]"
                        : "bg-[#155eef] hover:bg-[#084cd7]")
                    }
                  >
                    {result.approved ? "Publish Result" : "Review & Approve"}
                  </button>
                )}
              </div>

              <div className="mt-[24px]">
                <h3 className="text-[12px] font-semibold tracking-[0.15px] text-[#62799a]">
                  {fileLabel}
                </h3>
                {result.fileName && (
                  <div className="mt-[9px] flex min-h-[38px] items-center gap-[9px] rounded-[11px] border border-[#a7f0d3] bg-[#e9fcf4] px-[12px] text-[12px] text-[#007e5c]">
                    <Check className="size-[13px] shrink-0" />
                    <span className="min-w-0 flex-1 break-all">{result.fileName}</span>
                    <span className="text-[10px] text-[#247c68]">Preview</span>
                  </div>
                )}
                {selectedFile ? (
                  <div className="mt-[9px] flex min-h-[85px] flex-wrap items-center justify-center gap-[9px] rounded-[15px] border border-dashed border-[#22c98e] bg-[#edfcf5] px-3 text-[13px] text-[#007b52]">
                    <Check className="size-[17px]" />
                    <span className="max-w-[240px] break-all">{selectedFile.name}</span>
                    <button
                      type="button"
                      className="ml-2 text-[11px] font-medium text-[#df3042] hover:underline"
                      onClick={() => setSelectedFile(null)}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={handleDrop}
                    className="mt-[9px] flex min-h-[136px] cursor-pointer flex-col items-center justify-center rounded-[16px] border border-dashed border-[#b6cce6] bg-[#f8fafc] px-[12px] text-center hover:border-[#155eef]"
                  >
                    <Upload className="size-[26px] text-[#8da3bf]" fill="currentColor" strokeWidth={1.2} />
                    <span className="mt-[13px] text-[13px] text-[#3a4e6c]">
                      Drop file here or click to upload
                    </span>
                    <span className="mt-[4px] text-[11px] text-[#91a6c2]">
                      PDF, JPG, PNG accepted
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                      aria-label="Select result file"
                      onChange={handleInput}
                      className="sr-only"
                    />
                  </label>
                )}
                {fileError && <p role="alert" className="mt-2 text-[12px] text-[#ce2845]">{fileError}</p>}
                {selectedFile && (
                  <button
                    type="button"
                    className="mt-[16px] rounded-[11px] bg-[#155eef] px-[17px] py-[10px] text-[13px] font-medium text-white hover:bg-[#084cd7]"
                    onClick={uploadLocally}
                  >
                    {pending ? "Upload" : "Replace File"}
                  </button>
                )}
              </div>
            </>
          )}

          {notice && (
            <p role="status" className="mt-[14px] rounded-[11px] border border-[#bfdbfe] bg-[#eff6ff] px-[12px] py-[10px] text-[12px] leading-5 text-[#245acb]">
              {notice}
            </p>
          )}

          <section className="mt-[27px]">
            <h3 className="mb-[12px] text-[12px] font-semibold tracking-[0.1px] text-[#617796]">
              PATIENT &amp; TEST
            </h3>
            <div className="grid grid-cols-2 gap-[9px] sm:gap-[12px]">
              <ResultInformation label="Patient" value={result.patient} />
              <ResultInformation label="Patient ID" value={result.patientId} />
              <ResultInformation label="Test" value={result.test} />
              <ResultInformation label="Test Date" value={result.date} />
              <ResultInformation
                label="Reviewed By"
                value={result.reviewedBy === "—" ? "Pending review" : result.reviewedBy}
              />
              <ResultInformation label="Result ID" value={result.id} />
            </div>
          </section>

          <section className="mt-[29px]">
            <h3 className="mb-[13px] text-[12px] font-semibold tracking-[0.1px] text-[#617796]">
              ACTIVITY HISTORY
            </h3>
            <div className="space-y-[10px]">
              {result.history.map((entry, index) => (
                <div
                  key={entry.stamp + entry.action + index}
                  className="flex flex-wrap items-start gap-x-[12px] gap-y-[4px] text-[11px] leading-[17px] text-[#4d6080]"
                >
                  <span className="shrink-0 font-mono text-[#93a8c5]">{entry.stamp}</span>
                  <span className="min-w-[165px] flex-1">{entry.action}</span>
                  <span className="text-[#91a6c2]">{entry.actor}</span>
                </div>
              ))}
            </div>
          </section>
          <p className="mt-[27px] text-[11px] text-[#9aabc1]">
            This is an interactive, local-only design preview. No file or result is transmitted.
          </p>
        </div>
      </aside>
    </div>
  );
}

export function PublishResultDialog({
  result,
  onCancel,
  onConfirm,
}: {
  result: LaboratoryResult;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      role="presentation"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0f172a]/15 p-[14px] backdrop-blur-[5px]"
      onMouseDown={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="lab-publish-heading"
        aria-describedby="lab-publish-description"
        className="w-full max-w-[444px] overflow-hidden rounded-[19px] bg-white shadow-[0_18px_44px_rgba(15,23,42,0.16)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex min-h-[65px] items-center justify-between border-b border-[#f0f2f5] px-[22px]">
          <h2 id="lab-publish-heading" className="text-[17px] font-semibold text-[#172039]">
            Publish Result
          </h2>
          <button type="button" aria-label="Close publication dialog" onClick={onCancel}>
            <X className="size-[18px] text-[#8ba0bd]" />
          </button>
        </div>
        <div className="px-[22px] pt-[20px] pb-[26px]">
          <p id="lab-publish-description" className="text-[15px] leading-[22px] text-[#425976]">
            You are about to publish the result for{" "}
            <strong>{result.patient}</strong> ({result.test}).
          </p>
          <div className="mt-[15px] rounded-[13px] border border-[#bdd4ff] bg-[#eff5ff] px-[14px] py-[14px] text-[13px] leading-[21px] text-[#155eef]">
            In the connected portal, publishing would:
            <ul className="mt-[4px] list-disc pl-[17px]">
              <li>Notify the patient by SMS and email</li>
              <li>Make the result available in their OHealth+ health record</li>
              <li>Allow authorized professionals to access the result</li>
            </ul>
          </div>
          <p className="mt-[14px] text-[14px] leading-[22px] text-[#405672]">
            Confirm you are satisfied with the accuracy of this result before publishing.
          </p>
          <p className="mt-[10px] text-[11px] leading-5 text-[#7d8fa7]">
            Preview only — confirming does not actually notify anyone or publish medical data.
          </p>
        </div>
        <div className="flex justify-end gap-[9px] border-t border-[#f0f2f5] bg-[#f8fafc] px-[22px] py-[18px]">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-[42px] rounded-[13px] border border-[#cad6e6] bg-white px-[17px] text-[14px] text-[#31445e] hover:bg-[#f5f7fa]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="min-h-[42px] rounded-[13px] bg-[#009966] px-[17px] text-[14px] font-medium text-white hover:bg-[#007e56]"
          >
            Publish Result
          </button>
        </div>
      </div>
    </div>
  );
}
