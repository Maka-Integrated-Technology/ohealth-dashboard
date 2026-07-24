import { Bell } from "lucide-react";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  day: "numeric",
  month: "short",
  year: "numeric",
});
const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

export function Header() {
  const now = new Date();
  const greeting =
    now.getHours() < 12
      ? "Good morning"
      : now.getHours() < 18
        ? "Good afternoon"
        : "Good evening";

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          {greeting}, Dr. Jane
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {dateFormatter.format(now)} • {timeFormatter.format(now)}
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-orange-100/50 bg-orange-50 px-4 py-2.5 text-sm text-orange-600 shadow-sm">
        <Bell size={16} className="fill-orange-500 text-orange-500" />
        <span className="font-medium">
          Your next appointment is in 38 minutes with Emeka Bello
        </span>
      </div>
    </div>
  );
}
