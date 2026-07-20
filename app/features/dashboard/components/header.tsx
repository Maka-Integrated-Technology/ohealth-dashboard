import { Bell } from "lucide-react";
import { format } from "date-fns";

export function Header() {
  const now = new Date();
  const greeting =
    now.getHours() < 12
      ? "Good morning"
      : now.getHours() < 18
        ? "Good afternoon"
        : "Good evening";

  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 flex items-center justify-between border-b px-6 py-4 backdrop-blur">
      <div className="flex flex-col">
        <h1 className="text-xl font-bold tracking-tight">
          {greeting}, Dr. Jane
        </h1>
        <p className="text-muted-foreground text-sm">
          {format(now, "EEEE, do MMM, yyyy")} • {format(now, "hh:mm a")}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-sm text-orange-600">
          <Bell size={16} className="fill-orange-500 text-orange-500" />
          <span className="font-medium">
            Your next appointment is in 38 minutes with Emeka Bello
          </span>
        </div>
      </div>
    </header>
  );
}
