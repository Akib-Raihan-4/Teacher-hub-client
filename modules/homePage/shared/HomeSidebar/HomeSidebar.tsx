"use client";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { useState } from "react";
import { links as defaultLinks } from "./HomeSidebar.constants";
import { BookOpen } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/lib/hooks/useAuth";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TExtendedLink } from "./HomeSidebar.helpers";
import ThemeSwitcher from "@/components/ui/theme-swticher";

export default function HomeSidebar() {
  const [open, setOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const { user, logout } = useAuth();

  const links: TExtendedLink[] = defaultLinks.map((link) =>
    link.label === "Logout"
      ? {
          ...link,
          onClick: () => setLogoutDialogOpen(true),
        }
      : link
  );

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <div className="cursor-pointer">
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
              <SidebarLink
                link={{
                  href: "#",
                  label: (
                    <div className="flex items-center gap-2 sm:text-2xl">
                      Teacher-Hub
                    </div>
                  ),
                  icon: <BookOpen className="h-7 w-7" />,
                }}
              />
              <div className="mt-8 flex flex-col gap-5">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} onClick={link.onClick} />
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <SidebarLink
                link={{
                  href: "#",
                  label: (
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                        {user?.name}
                      </span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {user?.email}
                      </span>
                    </div>
                  ),
                  icon: (
                    <Image
                      src="/avatar.svg"
                      className="h-7 w-7 shrink-0 rounded-full"
                      width={28}
                      height={28}
                      alt="Avatar"
                    />
                  ),
                }}
              />
              {open && <ThemeSwitcher />}
            </div>
          </SidebarBody>
        </Sidebar>
      </div>

      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to logout?</DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="ghost"
              className="cursor-pointer"
              onClick={() => setLogoutDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
