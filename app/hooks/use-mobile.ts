import { useEffect, useState } from "react";
import { BREAKPOINT_1024 } from "~/lib/utils/constants";

export function useIsMobile(breakpoint: number = BREAKPOINT_1024) {
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth < breakpoint
  );

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const onChange = () => setIsMobile(window.innerWidth < breakpoint);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [breakpoint]);

  return isMobile;
}
