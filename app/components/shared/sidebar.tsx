import { useState } from "react";
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
}

function SidebarNav({
  items,
  pathname,
  onNavigate,
}: {
  items: SidebarItem[];
  pathname: string;
  onNavigate?: () => void;
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
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <item.icon className="size-5" strokeWidth={1.75} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function Sidebar({ items }: Props) {
  const { pathname } = useLocation();

  return (
    <aside className="bg-card border-border fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r px-4 py-6 lg:flex">
      <div className="mb-8 px-2">
        <Logo size="sm" />
      </div>
      <SidebarNav items={items} pathname={pathname} />
    </aside>
  );
}

export function SidebarMobileTrigger({ items }: Props) {
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
      <SheetContent side="left" className="w-64 px-4 py-6">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <div className="mb-8 px-2">
          <Logo size="sm" />
        </div>
        <SidebarNav
          items={items}
          pathname={pathname}
          onNavigate={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
