import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "~/components/ui/switch";
import { cn } from "~/lib/utils/helpers";

export function NavbarThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className="flex items-center gap-2"
      title={isDark ? "Dark theme" : "Light theme"}
    >
      <Sun
        aria-hidden
        className={cn(
          "size-4 shrink-0 transition-opacity",
          isDark ? "text-muted-foreground/50" : "text-foreground"
        )}
      />
      <Switch
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        size="sm"
      />
      <Moon
        aria-hidden
        className={cn(
          "size-4 shrink-0 transition-opacity",
          isDark ? "text-foreground" : "text-muted-foreground/50"
        )}
      />
    </div>
  );
}
