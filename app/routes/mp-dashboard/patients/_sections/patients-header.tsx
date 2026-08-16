import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "~/components/ui/button";

interface PatientsHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function PatientsHeader({
  search,
  onSearchChange,
}: PatientsHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <div className="border-input bg-input-background flex flex-1 items-center gap-2 rounded-lg border px-3 py-2.5">
        <Search className="text-muted-foreground size-4 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search patients by name, ID, condition, etc"
          className="text-foreground placeholder:text-muted-foreground w-full bg-transparent text-sm focus:outline-none"
        />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button variant="outline" size="sm" className="gap-1.5">
          <SlidersHorizontal className="size-4" />
          Filter
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5">
          <ArrowUpDown className="size-4" />
          Sort
        </Button>
      </div>
    </div>
  );
}
