import type { ReactNode } from "react";
import Logo from "../logo";
import { NavbarThemeToggle } from "../navbar-theme-toggle";

interface Props {
  portal?: string;
  showLogo?: boolean;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
}

export default function MainNavbar({
  portal,
  showLogo = true,
  leftSlot,
  rightSlot,
}: Props) {
  return (
    <>
      <nav className="bg-background/80 border-border fixed top-0 right-0 left-0 z-30 border-b backdrop-blur-md">
        <div className="max-w-content mx-auto flex h-16.25 items-center gap-3 px-4 sm:px-6">
          {leftSlot}
          {showLogo && <Logo />}

          {/* Render "Dashboard" text independently of the logo logic */}
          {portal && (
            <div className="flex items-center gap-3 lg:ml-2">
              <span className="text-lg font-semibold tracking-tight text-gray-900">
                {portal}
              </span>
            </div>
          )}

          <div className="ml-auto flex items-center gap-4">
            {/* Kept the theme toggle and added rightSlot next to it */}
            <NavbarThemeToggle />
            {rightSlot && (
              <>
                <div className="hidden h-6 w-px bg-gray-200 sm:block"></div>{" "}
                {/* Subtle divider */}
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
