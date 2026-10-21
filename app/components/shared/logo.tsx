import { Link } from "react-router";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "auth";
  variant?: "default" | "light";
}

export default function Logo({
  size = "md",
  variant = "default",
}: LogoProps) {
  const linkClass =
    size === "auth"
      ? "flex items-center gap-1"
      : size === "sm"
        ? "flex items-center gap-2"
        : "flex items-center gap-2.5";
  const textClass =
    size === "auth"
      ? `text-[18px] font-semibold tracking-[-0.8px] ${variant === "light" ? "text-[#f5f7f7]" : "text-slate-900"}`
      : size === "sm"
        ? `text-base font-bold tracking-tight ${variant === "light" ? "text-white" : "text-slate-900"}`
        : `text-xl font-bold tracking-tight ${variant === "light" ? "text-white" : "text-slate-900"}`;
  const svgSize = size === "sm" ? 24 : size === "auth" ? 30 : 32;

  return (
    <Link to="/" className={linkClass}>
      <svg
        width={svgSize}
        height={svgSize}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {size === "auth" ? (
          <circle cx="16" cy="16" r="14" fill="#155dfc" />
        ) : (
          <path
            d="M16 28.5S3 20.5 3 11.5C3 7.36 6.36 4 10.5 4c2.55 0 4.8 1.27 5.5 3.22C16.7 5.27 18.95 4 21.5 4 25.64 4 29 7.36 29 11.5c0 9-13 17-13 17z"
            fill="#1D4ED8"
          />
        )}
        <path
          d="M16 9.5v8M12 13.5h8"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      <span className={textClass}>
        OHealth
        <span className={variant === "light" ? "text-[#f5f7f7]" : "text-blue-600"}>
          +
        </span>
      </span>
    </Link>
  );
}
