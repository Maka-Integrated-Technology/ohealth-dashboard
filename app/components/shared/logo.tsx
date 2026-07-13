import { Link } from "react-router";
import { cn } from "~/lib/utils/helpers";
import { Layers } from "lucide-react";

const logoSizes = {
  sm: { icon: "size-5", text: "text-lg" },
  default: { icon: "size-6", text: "text-xl" },
  lg: { icon: "size-8", text: "text-2xl" },
} as const;

type LogoSize = keyof typeof logoSizes;

interface Props {
  containerClassName?: string;
  size?: LogoSize;
  disabled?: boolean;
  iconOnly?: boolean;
  label?: string;
}

function LogoContent({
  size,
  iconOnly,
  label,
}: {
  size: LogoSize;
  iconOnly?: boolean;
  label: string;
}) {
  const s = logoSizes[size];
  return (
    <div className="flex items-center gap-2">
      <Layers className={cn(s.icon, "text-primary")} strokeWidth={1.5} />
      {!iconOnly && (
        <span className={cn("font-bold tracking-tight", s.text)}>
          <span className="text-primary">{label}</span>
        </span>
      )}
    </div>
  );
}

export default function Logo({
  containerClassName,
  size = "default",
  disabled = false,
  iconOnly = false,
  label = "OHealth",
}: Props) {
  const containerClass = cn("flex w-fit items-center", containerClassName);

  if (disabled) {
    return (
      <div className={containerClass} aria-label={label}>
        <LogoContent size={size} iconOnly={iconOnly} label={label} />
      </div>
    );
  }

  return (
    <Link
      to="/"
      className={containerClass}
      aria-label={`${label} — Go to homepage`}
    >
      <LogoContent size={size} iconOnly={iconOnly} label={label} />
    </Link>
  );
}
