import { BadgeCheck, Bell, ChevronDown, LogOut, UserRound } from "lucide-react";

import { Button } from "~/components/ui/button";

export function PharmacyNavbarActions() {
  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Notifications"
        className="relative size-[34px]"
      >
        <Bell className="size-[17px]" strokeWidth={1.8} />
        <span
          aria-hidden="true"
          className="bg-destructive absolute top-[5px] right-[5px] size-1.5 rounded-full"
        />
      </Button>
      <Button
        type="button"
        variant="outline"
        aria-label="Jane Doe, Medical Doctor"
        className="h-[34px] min-w-[151px] justify-start gap-2 px-2 text-left"
      >
        <UserRound className="text-muted-foreground size-4" />
        <span className="flex min-w-0 flex-1 flex-col leading-[14px]">
          <span className="text-foreground flex items-center gap-1 text-[11px] font-medium">
            Jane Doe
            <BadgeCheck className="size-3 fill-emerald-500 text-white" />
          </span>
          <span className="text-muted-foreground text-[10px]">
            Medical Doctor
          </span>
        </span>
        <ChevronDown
          className="text-muted-foreground size-[15px]"
          strokeWidth={1.8}
        />
      </Button>
    </div>
  );
}

export function PharmacySidebarFooter() {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-primary/10 text-primary flex size-[32px] shrink-0 items-center justify-center rounded-full text-[11px] font-semibold">
        SJ
      </div>
      <div className="min-w-0 flex-1 leading-[15px]">
        <p className="text-foreground truncate text-[11px] font-semibold">
          Dr. Sarah Jenkins
        </p>
        <p className="text-muted-foreground truncate text-[10px]">
          Chief Pharmacist
        </p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label="Sign out"
        className="text-muted-foreground"
      >
        <LogOut className="size-4" />
      </Button>
    </div>
  );
}
