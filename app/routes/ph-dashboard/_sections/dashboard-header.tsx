export function DashboardHeader() {
  return (
    <header className="mb-5">
      <h1 className="text-foreground text-[clamp(24px,2.2vw,34px)] leading-tight font-bold tracking-[-0.035em]">
        Welcome back, MedPlus Pharmacy
      </h1>
      <p className="text-muted-foreground mt-1 text-[13px] leading-5 sm:text-sm">
        Today is Monday, August 31, 2026
      </p>
    </header>
  );
}
