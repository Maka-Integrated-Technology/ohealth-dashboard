import { formatCurrentMonthYear } from "./_primitives";

export function EarningsHeader() {
  return (
    <div className="mb-6 flex flex-col gap-1">
      <h1 className="text-foreground text-2xl font-semibold">Earnings</h1>
      <p className="text-muted-foreground text-sm">
        Financial summary · {formatCurrentMonthYear()}
      </p>
    </div>
  );
}
