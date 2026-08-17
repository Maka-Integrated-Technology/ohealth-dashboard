type EarningsHeaderProps = {
  periodLabel: string;
};

export function EarningsHeader({ periodLabel }: EarningsHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-1">
      <h1 className="text-foreground text-[20px] leading-6 font-bold">
        Earnings
      </h1>
      <p className="text-muted-foreground text-[18px]">
        Financial summary · {periodLabel}
      </p>
    </div>
  );
}
