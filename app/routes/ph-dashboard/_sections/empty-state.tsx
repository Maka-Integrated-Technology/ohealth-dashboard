import { CalendarOff } from "lucide-react";
interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="bg-muted/30 flex min-h-[170px] flex-col items-center justify-center rounded-xl px-5 py-8 text-center sm:min-h-[190px]">
      <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-blue-600 text-white">
        <CalendarOff className="size-5" strokeWidth={1.8} />
      </div>

      <h3 className="text-foreground text-sm font-semibold">{title}</h3>

      <p className="text-muted-foreground mt-2 max-w-[300px] text-[11px] leading-[1.5]">
        {description}
      </p>
    </div>
  );
}
