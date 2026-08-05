import { LayoutGrid, List } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { DateRangePicker } from "./date-range-picker";
import type { AppointmentStatus } from "~/features/appointments/types";
import { FilterSearchIcon } from "~/components/ui/filter-search-icon";

type ViewMode = "calendar" | "list";
type StatusFilter = AppointmentStatus | "all";

interface AppointmentsHeaderProps {
  from: Date;
  to: Date;
  onDateRangeChange: (range: { from: Date; to: Date }) => void;
  status: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function AppointmentsHeader({
  from,
  to,
  onDateRangeChange,
  status,
  onStatusChange,
  view,
  onViewChange,
}: AppointmentsHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4">
      <div>
        <h1 className="text-foreground text-2xl font-semibold">Appointments</h1>
        <p className="text-muted-foreground text-sm">
          Manage and review your scheduled consultations
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DateRangePicker from={from} to={to} onChange={onDateRangeChange} />

          <Select
            value={status}
            onValueChange={(value) => onStatusChange(value as StatusFilter)}
          >
            <SelectTrigger className="w-40">
              <FilterSearchIcon className="text-muted-foreground size-4" />
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border-border flex items-center gap-1 rounded-lg border p-1">
          <Button
            size="sm"
            variant="ghost"
            className={
              view === "calendar"
                ? "bg-foreground text-background hover:bg-foreground/90"
                : ""
            }
            onClick={() => onViewChange("calendar")}
          >
            <LayoutGrid className="size-4" />
            Calender View
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className={
              view === "list"
                ? "bg-foreground text-background hover:bg-foreground/90"
                : ""
            }
            onClick={() => onViewChange("list")}
          >
            <List className="size-4" />
            List View
          </Button>
        </div>
      </div>
    </div>
  );
}
