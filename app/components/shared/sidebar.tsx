import { useState } from "react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router";
import { Menu, type LucideIcon } from "lucide-react";
import Logo from "./logo";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { cn } from "~/lib/utils/helpers";

export interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface Props {
  items: SidebarItem[];
  compact?: boolean;
  showLogo?: boolean;
  footer?: ReactNode;
}

function SidebarNav({
  items,
  pathname,
  onNavigate,
  compact = false,
}: {
  items: SidebarItem[];
  pathname: string;
  onNavigate?: () => void;
  compact?: boolean;
}) {
  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={onNavigate}
            className={cn(
              "relative flex items-center rounded-lg font-medium transition-colors",
              compact
                ? "h-[34px] gap-2.5 px-3 text-xs"
                : "gap-3 px-3 py-2.5 text-sm",
              active
                ? compact
                  ? "bg-[#eff4ff] text-[#155eef]"
                  : "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <item.icon
              className={compact ? "size-4 shrink-0" : "size-5"}
              strokeWidth={1.75}
            />
            {item.label}
            {compact && active && (
              <span className="absolute top-2 right-2 h-[18px] w-[3px] rounded-full bg-[#155eef]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export default function Sidebar({
  items,
  compact = false,
  showLogo = true,
  footer,
}: Props) {
  const { pathname } = useLocation();

  return (
    <aside
      className={cn(
        "bg-card border-border fixed inset-y-0 left-0 z-40 hidden flex-col border-r lg:flex",
        compact ? "w-[195px] px-[18px] py-[18px]" : "w-64 px-4 py-6"
      )}
    >
      {showLogo && (
        <div className="mb-8 px-2">
          <Logo size="sm" />
        </div>
      )}
      <SidebarNav items={items} pathname={pathname} compact={compact} />
      {footer && (
        <div
          className={cn("mt-auto", compact && "border-t border-slate-100 pt-3")}
        >
          {footer}
        </div>
      )}
    </aside>
  );
}

export function SidebarMobileTrigger({
  items,
  compact = false,
  showLogo = true,
}: Props) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Open menu"
          className="lg:hidden"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className={cn("py-6", compact ? "w-[255px] px-4" : "w-64 px-4")}
      >
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        {showLogo && (
          <div className="mb-8 px-2">
            <Logo size="sm" />
          </div>
        )}
        <SidebarNav
          items={items}
          pathname={pathname}
          onNavigate={() => setOpen(false)}
          compact={compact}
        />
      </SheetContent>
    </Sheet>
  );
}
