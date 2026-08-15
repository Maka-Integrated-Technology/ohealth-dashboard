import { ChevronRight } from "lucide-react";
import { cn } from "~/lib/utils/helpers";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(page: number, totalPages: number): (number | "…")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (page <= 4) {
    return [1, 2, 3, 4, 5, "…", totalPages];
  }

  if (page >= totalPages - 3) {
    return [
      1,
      "…",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [1, "…", page - 1, page, page + 1, "…", totalPages];
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(page, totalPages);

  return (
    <div className="mt-4 flex items-center justify-center gap-1">
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="text-muted-foreground px-2 text-sm">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              "flex size-8 items-center justify-center rounded-lg text-sm font-medium transition-colors",
              p === page
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-muted"
            )}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(Math.min(page + 1, totalPages))}
        disabled={page === totalPages}
        className="text-primary ml-2 flex items-center gap-1 text-sm font-medium disabled:opacity-40"
      >
        Next
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}