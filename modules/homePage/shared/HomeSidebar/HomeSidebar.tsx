"use client";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { useState } from "react";
import { links as defaultLinks } from "./HomeSidebar.constants";
import { BookOpen, Sparkles } from "lucide-react";
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
          onClick: () => {
            setLogoutDialogOpen(true);
            setOpen(false);
          },
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
          <SidebarBody className="justify-between gap-10 bg-gradient-to-b dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 from-blue-50 via-white to-blue-100 border-r dark:border-yellow-500/20 border-blue-200/50">
            <div className="flex flex-1 flex-col">
              <div className={`relative ${open ? "" : "flex justify-center"}`}>
                <div className="absolute inset-0 "></div>
                <SidebarLink
                  link={{
                    href: "#",
                    label: (
                      <div className="flex items-center gap-3 relative z-10">
                        <div className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r dark:from-yellow-400 dark:to-yellow-600 from-blue-600 to-blue-800 bg-clip-text text-transparent">
                          Teacher-Hub
                        </div>
                        <Sparkles className="h-4 w-4 dark:text-yellow-500 text-blue-500 animate-pulse" />
                      </div>
                    ),
                    icon: open ? (
                      <div className="relative">
                        <div className="absolute inset-0 dark:bg-yellow-500/20 bg-blue-500/20 rounded-lg animate-pulse"></div>
                        <BookOpen className="h-7 w-7 dark:text-yellow-500 text-blue-600 relative z-10" />
                      </div>
                    ) : (
                      <BookOpen className="h-6 w-6 dark:text-yellow-500 text-blue-600 relative z-10" />
                    ),
                  }}
                />
              </div>

              <div className="mt-8 flex flex-col gap-5">
                {links.map((link, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-lg hover:bg-gradient-to-r dark:hover:from-yellow-500/10 dark:hover:to-transparent hover:from-blue-500/10 hover:to-transparent transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r dark:from-transparent dark:via-yellow-500/5 dark:to-transparent from-transparent via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                    <SidebarLink
                      link={{
                        ...link,
                        icon: (
                          <div className="relative">
                            {link.icon}
                            <div className="absolute inset-0 dark:bg-yellow-500/0 bg-blue-500/0 dark:group-hover:bg-yellow-500/10 group-hover:bg-blue-500/10 rounded transition-all duration-300"></div>
                          </div>
                        ),
                      }}
                      onClick={link.onClick}
                      className="relative z-10 dark:text-gray-300 text-gray-700 dark:hover:text-yellow-400 hover:text-blue-600 transition-colors duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced User Profile Section */}
            <div className="border-t dark:border-yellow-500/20 border-blue-200/50 pt-4">
              <div className="flex justify-between items-center">
                <div className="relative group flex-1">
                  <div className="absolute inset-0 bg-gradient-to-r dark:from-yellow-500/5 dark:to-transparent from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                  <SidebarLink
                    link={{
                      href: "#",
                      label: (
                        <div className="flex flex-col relative z-10">
                          <span className="text-sm font-semibold dark:text-yellow-400 text-blue-600">
                            {user?.name}
                          </span>
                          <span className="text-xs dark:text-gray-400 text-gray-600">
                            {user?.email}
                          </span>
                        </div>
                      ),
                      icon: (
                        <Image
                          src="/avatar.svg"
                          className="h-7 w-7 shrink-0 rounded-full relative z-10 border-2 dark:border-yellow-500/30 border-blue-500/30"
                          width={28}
                          height={28}
                          alt="Avatar"
                        />
                      ),
                    }}
                  />
                </div>

                {open && (
                  <div
                    className={`ml-3 p-2 rounded-lg dark:hover:bg-yellow-500/10 hover:bg-blue-500/10 transition-all duration-1000 ${
                      open ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <ThemeSwitcher />
                  </div>
                )}
              </div>
            </div>
          </SidebarBody>
        </Sidebar>
      </div>

      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 from-blue-50 to-blue-100 border dark:border-yellow-500/20 border-blue-200">
          <DialogHeader>
            <DialogTitle className="dark:text-yellow-400 text-blue-600 text-lg">
              Are you sure you want to logout?
            </DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-3">
            <Button
              variant="ghost"
              className="cursor-pointer border dark:border-gray-600 border-gray-300 dark:text-gray-300 text-gray-700 dark:hover:bg-gray-700 hover:bg-gray-100 dark:hover:text-white hover:text-gray-900 transition-all duration-300"
              onClick={() => setLogoutDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="cursor-pointer bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold shadow-lg hover:shadow-red-500/25 transition-all duration-300"
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
