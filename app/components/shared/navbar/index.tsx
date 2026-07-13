import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import Logo from "../logo";
import { NavbarThemeToggle } from "../navbar-theme-toggle";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils/helpers";
import { useIsMobile } from "~/hooks/use-mobile";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Medical", path: "/mp-dashboard" },
  { label: "Pharmacy", path: "/ph-dashboard" },
  { label: "Laboratory", path: "/lb-dashboard" },
];

export default function MainNavbar() {
  const pathname = useLocation().pathname;
  const isMobile = useIsMobile(768);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="bg-background/80 border-border fixed top-0 right-0 left-0 z-40 border-b backdrop-blur-md">
        <div className="max-w-content mx-auto flex h-[65px] items-center gap-4 px-4 sm:px-6">
          {/* Logo */}
          <Logo size="sm" />

          {/* Desktop nav links */}
          {!isMobile && (
            <div className="flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive =
                  link.path === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          )}

          <div className="ml-auto flex items-center gap-2">
            {!isMobile && <NavbarThemeToggle />}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen((o) => !o)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <X className="size-5" />
                ) : (
                  <Menu className="size-5" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMobile && mobileOpen && (
          <div className="bg-background border-border border-t px-4 pb-4">
            <div className="mt-3 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    pathname === link.path ||
                      (link.path !== "/" && pathname.startsWith(link.path))
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 flex justify-center">
                <NavbarThemeToggle />
              </div>
            </div>
          </div>
        )}
      </nav>
      {/* Spacer */}
      <div className="h-[65px]" />
    </>
  );
}
