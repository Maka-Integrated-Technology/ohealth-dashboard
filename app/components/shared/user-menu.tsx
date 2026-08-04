import { useState } from "react";
import { ChevronDown, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { notifyInfo } from "~/lib/utils/toast";

interface UserMenuProps {
  name: string;
  role: string;
  initials: string;
  avatarSrc?: string;
  verified?: boolean;
  onViewProfile?: () => void;
  onLogout?: () => void;
}

export function UserMenu({
  name,
  role,
  initials,
  avatarSrc = "",
  verified = true,
  onViewProfile,
  onLogout,
}: UserMenuProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleConfirmLogout() {
    setConfirmOpen(false);
    if (onLogout) {
      onLogout();
      return;
    }
    // Replace with a real logout call once auth is linked up.
    notifyInfo({ message: "Logged out" });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="hover:bg-accent flex cursor-pointer items-center gap-3 rounded-lg p-1.5 transition-colors"
          >
            <div className="relative">
              <Avatar className="size-9">
                <AvatarImage src={avatarSrc} />
                <AvatarFallback className="bg-blue-600 font-medium text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span
                className={`absolute -right-0.5 -bottom-0.5 flex size-3.5 items-center justify-center rounded-full border-2 border-background ${
                  verified ? "bg-green-500" : "bg-destructive"
                }`}
              />
            </div>
            <div className="hidden flex-col sm:flex">
              <span className="text-foreground text-sm leading-none font-semibold">
                {name}
              </span>
              <span className="text-muted-foreground mt-1 text-xs leading-none">
                {role}
              </span>
            </div>
            <ChevronDown className="text-muted-foreground ml-1 size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onClick={() => onViewProfile?.()}>
            <User />
            Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setConfirmOpen(true)}
          >
            <LogOut />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Log out?</DialogTitle>
            <DialogDescription>
              You&apos;ll need to sign back in to access your dashboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Stay signed in
            </Button>
            <Button variant="destructive" onClick={handleConfirmLogout}>
              Log out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
