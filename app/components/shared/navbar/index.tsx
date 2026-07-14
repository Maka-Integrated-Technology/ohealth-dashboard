import Logo from "../logo";
import { NavbarThemeToggle } from "../navbar-theme-toggle";
import { Separator } from "~/components/ui/separator";

interface Props {
  /** Human-readable name of the active portal, e.g. "Medical Professional". */
  portal?: string;
}

export default function MainNavbar({ portal }: Props) {
  return (
    <>
      <nav className="bg-background/80 border-border fixed top-0 right-0 left-0 z-40 border-b backdrop-blur-md">
        <div className="max-w-content mx-auto flex h-[65px] items-center gap-3 px-4 sm:px-6">
          {/* Logo */}
          <Logo size="sm" />

          {/* Active portal label */}
          {portal && (
            <div className="flex items-center gap-3">
              <Separator orientation="vertical" className="!h-5" aria-hidden />
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
      <div className="h-[65px]" />
    </>
  );
}
