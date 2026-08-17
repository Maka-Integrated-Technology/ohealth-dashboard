import { Link } from "react-router";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="mb-4 flex items-center gap-1 text-sm">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1">
            {item.to && !isLast ? (
              <Link
                to={item.to}
                className="text-muted-foreground hover:text-foreground hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={
                  isLast
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }
              >
                {item.label}
              </span>
            )}
            {!isLast && (
              <ChevronRight className="text-muted-foreground size-3.5" />
            )}
          </span>
        );
      })}
    </nav>
  );
}
