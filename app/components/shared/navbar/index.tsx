import type { ReactNode } from "react";
import type { AppShellVariant } from "../app-shell-variant";
import Logo from "../logo";
import { NavbarThemeToggle } from "../navbar-theme-toggle";
import { cn } from "~/lib/utils/helpers";

interface Props {
  portal?: string;
  showLogo?: boolean;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  hasSidebar?: boolean;
  variant?: AppShellVariant;
}

export default function MainNavbar({
  portal,
  showLogo = true,
  leftSlot,
  rightSlot,
  hasSidebar = false,
  variant = "default",
}: Props) {
  const isCompact = variant === "compact";

  return (
    <>
      <nav
        className={cn(
          "bg-background/80 border-border fixed top-0 right-0 left-0 z-30 border-b backdrop-blur-md",
          hasSidebar && (isCompact ? "lg:left-[195px]" : "lg:left-64")
        )}
      >
        <div
          className={cn(
            "max-w-content mx-auto flex items-center gap-3",
            isCompact ? "h-[68px] px-[18px]" : "h-16.25 px-4 sm:px-6"
          )}
        >
          {leftSlot}
          {showLogo && <Logo />}

          {portal && (
            <div
              className={cn(
                "flex items-center gap-3",
                isCompact ? "ml-0" : "lg:ml-2"
              )}
            >
              <span
                className={cn(
                  "text-foreground font-semibold tracking-tight",
                  isCompact ? "text-xs" : "text-lg"
                )}
              >
                {portal}
              </span>
            </div>
          )}

          <div className="ml-auto flex items-center gap-3">
            {!isCompact && <NavbarThemeToggle />}
            {rightSlot && (
              <>
                {!isCompact && (
                  <div className="bg-border hidden h-6 w-px sm:block" />
                )}
                {rightSlot}
              </>
            )}
          </div>
        </div>
      </nav>
      {/* Spacer */}
      <div className={isCompact ? "h-[68px]" : "h-16.25"} />
    </>
  );
}
