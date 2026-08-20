import React, { useRef, useState } from "react";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import type { UploadedDocument } from "~/features/professional-onboarding/types.js";

interface DocumentUploadProps {
  id: string;
  label: string;
  placeholderText: string;
  value: UploadedDocument | null;
  onChange: (doc: UploadedDocument | null) => void;
  accept?: string;
  maxSizeBytes?: number; // default 10MB
  error?: string;
  disabled?: boolean;
}

const DEFAULT_ACCEPTED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"];
const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  id,
  label,
  placeholderText,
  value,
  onChange,
  accept = ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png",
  maxSizeBytes = DEFAULT_MAX_SIZE,
  error,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const validateAndProcessFile = (file: File) => {
    setLocalError(null);

    // Format validation
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    const isValidExtension =
      DEFAULT_ACCEPTED_EXTENSIONS.includes(fileExtension);
    const isValidMime =
      file.type === "application/pdf" ||
      file.type === "image/jpeg" ||
      file.type === "image/png";

    if (!isValidExtension && !isValidMime) {
      setLocalError(
        "Invalid file format. Please upload PDF, JPG, JPEG, or PNG."
      );
      return;
    }

    // Size validation (Max 10MB)
    if (file.size > maxSizeBytes) {
      setLocalError(
        `File exceeds maximum size of ${maxSizeBytes / (1024 * 1024)}MB.`
      );
      return;
    }

    const uploadedDoc: UploadedDocument = {
      file,
      name: file.name,
      size: file.size,
      type: file.type || fileExtension,
      lastModified: file.lastModified,
      previewUrl: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined,
    };

    onChange(uploadedDoc);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      validateAndProcessFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const triggerSelect = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const displayError = error || localError;

  return (
    <div
      className="flex w-full flex-col space-y-1.5"
      id={`document-upload-group-${id}`}
    >
      <label
        htmlFor={id}
        className="block text-left text-sm font-medium text-slate-800"
        id={`label-${id}`}
      >
        {label}
      </label>

      {/* Hidden input */}
      <input
        ref={fileInputRef}
        id={id}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        disabled={disabled}
        className="hidden"
        aria-describedby={displayError ? `error-${id}` : undefined}
      />

      {/* Upload Dropzone */}
      {!value ? (
        <div
          id={`dropzone-${id}`}
          onClick={triggerSelect}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              triggerSelect();
            }
          }}
          className={`relative flex h-18 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-dashed px-4 transition-all duration-150 select-none sm:h-17 ${
            isDragOver
              ? "border-blue-500 bg-blue-50/40 ring-2 ring-blue-400/20"
              : displayError
                ? "border-red-300 bg-red-50/20 hover:border-red-400"
                : "border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50/50"
          } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
        >
          <div className="flex items-center justify-center text-slate-400">
            <Upload className="h-4 w-4 stroke-[1.75] text-slate-500" />
          </div>
          <span className="text-sm font-normal text-slate-500">
            {placeholderText}
          </span>
        </div>
      ) : (
        <div
          id={`uploaded-card-${id}`}
          className="flex w-full flex-col items-center justify-center"
        >
          <div className="flex h-13.5 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2.5 overflow-hidden pr-2">
              <FileText className="h-4 w-4 shrink-0 text-blue-600" />
              <span
                className="truncate text-sm font-medium text-slate-800"
                title={value.name}
              >
                {value.name}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 text-xs font-normal text-slate-500">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
              <span>{(value.size / (1024 * 1024)).toFixed(2)} MB</span>
            </div>
          </div>

          <button
            type="button"
            id={`btn-change-${id}`}
            onClick={triggerSelect}
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 focus:outline-none"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Change File
          </button>
        </div>
      )}

      {displayError && (
        <p
          id={`error-${id}`}
          className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600"
        >
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {displayError}
        </p>
      )}
    </div>
  );
};
