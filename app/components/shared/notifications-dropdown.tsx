import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils/helpers";
import {
  NOTIFICATION_ITEMS,
  ACCENT_STYLES,
} from "~/lib/utils/notifications-data";

interface NotificationsDropdownProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
}

export function NotificationsDropdown({
  open,
  onOpenChange,
  trigger,
}: NotificationsDropdownProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent align="end" alignOffset={-220} className="w-96 p-0 mt-5">
        <div className="border-border border-b px-4 py-3">
          <p className="text-center text-sm font-semibold tracking-wide">
            NOTIFICATIONS
          </p>
        </div>

        <ScrollArea className="max-h-96">
          <div className="flex flex-col gap-2 p-3">
            {NOTIFICATION_ITEMS.map((item) => {
              const styles = ACCENT_STYLES[item.accent];
              return (
                <div
                  key={item.id}
                  className={cn(
                    "flex gap-3 rounded-xl py-3 pr-3 pl-3",
                    styles.row
                  )}
                >
                  <div
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-full",
                      styles.iconWrap
                    )}
                  >
                    <item.icon className="size-4" strokeWidth={2} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-foreground text-sm leading-snug">
                      {item.prefix}
                      <span className="font-semibold">{item.name}</span>
                      {item.rest}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {item.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}