import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";

interface ChecklistItem {
  key: string;
  label: string;
  required: boolean;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  { key: "notes", label: "Save consultation notes", required: true },
  { key: "prescription", label: "Issue prescription", required: false },
  { key: "labTests", label: "Request lab tests", required: false },
  { key: "followUp", label: "Schedule follow-up", required: false },
  { key: "referral", label: "Refer to hospital", required: false },
];

interface EndConsultationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMarkCompleted: () => void;
  isSubmitting: boolean;
}

export function EndConsultationDialog({
  open,
  onOpenChange,
  onMarkCompleted,
  isSubmitting,
}: EndConsultationDialogProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const requiredMet = CHECKLIST_ITEMS.filter((item) => item.required).every(
    (item) => checked[item.key]
  );

  function toggle(key: string) {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>End Consultation</DialogTitle>
          <DialogDescription>
            Complete the checklist before closing this session.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {CHECKLIST_ITEMS.map((item) => (
            <label
              key={item.key}
              className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={Boolean(checked[item.key])}
                  onCheckedChange={() => toggle(item.key)}
                />
                <span className="text-sm text-foreground">{item.label}</span>
              </div>
              <span
                className={`text-xs font-medium ${item.required ? "text-destructive" : "text-muted-foreground"}`}
              >
                {item.required ? "Required" : "Optional"}
              </span>
            </label>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Back
          </Button>
          <Button
            className="flex-1"
            disabled={!requiredMet}
            isLoading={isSubmitting}
            onClick={onMarkCompleted}
          >
            Mark Completed
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}