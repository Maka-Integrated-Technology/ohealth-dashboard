import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "~/hooks/use-online-status";

export default function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-[65px] right-0 left-0 z-50 flex items-center justify-center gap-2 bg-red-600 px-4 py-2 text-sm font-medium text-white"
    >
      <WifiOff className="size-4 shrink-0" />
      No internet connection — some features may be unavailable
    </div>
  );
}
