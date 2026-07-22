import type { ReactNode } from "react";
import Logo from "../logo";
import { NavbarThemeToggle } from "../navbar-theme-toggle";
import { Separator } from "~/components/ui/separator";

interface Props {
  /** Human-readable name of the active portal, e.g. "Medical Professional". */
  portal?: string;
  /** Hide the logo — used when a sidebar (which has its own logo) is present. */
  showLogo?: boolean;
  /** Rendered before the logo/portal label — used for the mobile sidebar's hamburger trigger. */
  leftSlot?: ReactNode;
}

export default function MainNavbar({
  portal,
  showLogo = true,
  leftSlot,
}: Props) {
  return (
    <>
      <nav className="bg-background/80 border-border fixed top-0 right-0 left-0 z-30 border-b backdrop-blur-md">
        <div className="max-w-content mx-auto flex h-16.25 items-center gap-3 px-4 sm:px-6">
          {leftSlot}
          {showLogo && <Logo size="sm" />}

          {/* Active portal label */}
          {portal && (
            <div className="flex items-center gap-3">
              {showLogo && (
                <Separator
                  orientation="vertical"
                  className="h-5!"
                  aria-hidden
                />
              )}
              <span className="text-muted-foreground text-sm font-medium">
                {portal}
              </span>
            </div>
          )}

          <div className="ml-auto flex items-center gap-2">
            <NavbarThemeToggle />
          </div>
        </div>
      </nav>
      {/* Spacer */}
      <div className="h-16.25" />
    </>
  );
}
