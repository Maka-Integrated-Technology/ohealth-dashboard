import type { ReactNode } from "react";
import Logo from "../logo";
import { NavbarThemeToggle } from "../navbar-theme-toggle";
import { cn } from "~/lib/utils/helpers";

interface Props {
  portal?: string;
  showLogo?: boolean;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  hasSidebar?: boolean;
}

export default function MainNavbar({
  portal,
  showLogo = true,
  leftSlot,
  rightSlot,
  hasSidebar = false,
}: Props) {
  return (
    <>
      <nav
        className={cn(
          "bg-background/80 border-border fixed top-0 right-0 left-0 z-30 border-b backdrop-blur-md",
          hasSidebar && "lg:left-64"
        )}
      >
        <div className="max-w-content mx-auto flex h-16.25 items-center gap-3 px-4 sm:px-6">
          {leftSlot}
          {showLogo && <Logo />}

          {portal && (
            <div className="flex items-center gap-3 lg:ml-2">
              <span className="text-foreground text-lg font-semibold tracking-tight">
                {portal}
              </span>
            </div>
          )}

          <div className="ml-auto flex items-center gap-4">
            <NavbarThemeToggle />
            {rightSlot && (
              <>
                <div className="bg-border hidden h-6 w-px sm:block"></div>{" "}
                {rightSlot}
              </>
            )}
          </div>
        </div>
      </nav>
      {/* Spacer */}
      <div className="h-16.25" />
    </>
  );
}
