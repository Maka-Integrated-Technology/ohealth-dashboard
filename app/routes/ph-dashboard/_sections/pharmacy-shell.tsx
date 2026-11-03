import { useState } from "react";
import { Bell } from "lucide-react";

import { UserMenu } from "~/components/shared/user-menu";
import { NotificationsDropdown } from "~/components/shared/notifications-dropdown";

export function PharmacyNavbarActions() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <NotificationsDropdown
        open={notificationsOpen}
        onOpenChange={setNotificationsOpen}
        trigger={
          <button
            type="button"
            aria-label="Open notifications"
            className="text-muted-foreground hover:bg-accent relative rounded-full p-2 transition-colors"
          >
            <Bell className="size-4" />

            <span className="border-background absolute top-2 right-2 size-2 rounded-full border-2 bg-red-500" />
          </button>
        }
      />

      <UserMenu
        name="Jane Doe"
        role="Medical Doctor"
        initials="JD"
        verified={true}
        avatarVariant="profile-icon"
        onViewProfile={() => {
          // Profile navigation can be connected when the route is implemented.
        }}
      />
    </div>
  );
}
