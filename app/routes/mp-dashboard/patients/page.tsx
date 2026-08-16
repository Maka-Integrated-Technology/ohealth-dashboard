import { useCallback } from "react";
import { useSearchParams } from "react-router";
import { useCustomSearchParams } from "~/hooks/use-custom-search-params";
import { useDebouncedCallback } from "~/hooks/use-debounce";
import { usePatients } from "~/features/patients/hooks";
import { Breadcrumb } from "~/components/shared/breadcrumb";
import { PatientsHeader } from "./_sections/patients-header";
import { PatientsTable } from "./_sections/patients-table";
import { Pagination } from "./_sections/pagination";

const PAGE_SIZE = 9;

function parsePage(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export default function PatientsPage() {
  const [, setSearchParams] = useSearchParams();

  const { search: rawSearch, page: rawPage } = useCustomSearchParams<{
    search: string;
    page: string;
  }>(["search", "page"]);

  const search = rawSearch;
  const page = parsePage(rawPage);

  const { data, isLoading, isError } = usePatients({
    search,
    page,
    pageSize: PAGE_SIZE,
  });

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value.trim()) {
        next.set("search", value.trim());
      } else {
        next.delete("search");
      }
      next.delete("page");
      return next;
    });
  }, 300);

  const handleSearchChange = useCallback(
    (value: string) => {
      debouncedSetSearch(value);
    },
    [debouncedSetSearch]
  );

  const handlePageChange = useCallback(
    (nextPage: number) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (nextPage === 1) {
          next.delete("page");
        } else {
          next.set("page", String(nextPage));
        }
        return next;
      });
    },
    [setSearchParams]
  );

  const patients = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="p-6">
      <Breadcrumb
        items={[{ label: "Dashboard", to: "/" }, { label: "Patients" }]}
      />

      <div className="mb-6">
        <h1 className="text-foreground text-2xl font-bold">
          Patients&apos; Records
        </h1>
        <p className="text-muted-foreground text-sm">
          View and manage your patients&apos; information
        </p>
      </div>

      <PatientsHeader search={search} onSearchChange={handleSearchChange} />

      <div className="border-border bg-card overflow-hidden rounded-lg border">
        <PatientsTable
          patients={patients}
          isLoading={isLoading}
          isError={isError}
        />
      </div>

      {!isLoading && (
        <>
          <p className="text-muted-foreground mt-3 text-xs">
            Showing {patients.length} out of {total} patients
          </p>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}