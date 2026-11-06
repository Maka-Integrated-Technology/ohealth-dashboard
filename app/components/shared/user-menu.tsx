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
  avatarVariant?: "initials" | "profile-icon";
  onViewProfile?: () => void;
  onLogout?: () => void;
}

export function UserMenu({
  name,
  role,
  initials,
  avatarSrc = "",
  verified = true,
  avatarVariant = "initials",
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
            className={
              avatarVariant === "profile-icon"
                ? "border-border hover:bg-accent flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 transition-colors"
                : "hover:bg-accent flex cursor-pointer items-center gap-3 rounded-lg p-1.5 transition-colors"
            }
          >
            {avatarVariant === "profile-icon" ? (
              <span className="border-border flex size-6 shrink-0 items-center justify-center rounded-sm border">
                <User className="text-muted-foreground size-3.5" />
              </span>
            ) : (
              <div className="relative">
                <Avatar className="size-9">
                  <AvatarImage src={avatarSrc} />
                  <AvatarFallback className="bg-blue-600 font-medium text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <span
                  className={`border-background absolute -right-0.5 -bottom-0.5 flex size-3.5 items-center justify-center rounded-full border-2 ${
                    verified ? "bg-green-500" : "bg-destructive"
                  }`}
                />
              </div>
            )}

            <div className="hidden flex-col items-start sm:flex">
              <span
                className={
                  avatarVariant === "profile-icon"
                    ? "text-foreground flex items-center gap-1 text-xs leading-none font-semibold"
                    : "text-foreground text-sm leading-none font-semibold"
                }
              >
                {name}

                {avatarVariant === "profile-icon" && verified && (
                  <span className="size-1.5 rounded-full bg-green-500" />
                )}
              </span>

              <span
                className={
                  avatarVariant === "profile-icon"
                    ? "text-muted-foreground mt-1 text-[10px] leading-none"
                    : "text-muted-foreground mt-1 text-xs leading-none"
                }
              >
                {role}
              </span>
            </div>

            <ChevronDown
              className={`text-muted-foreground ${
                avatarVariant === "profile-icon" ? "size-3.5" : "ml-1 size-4"
              }`}
            />
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
