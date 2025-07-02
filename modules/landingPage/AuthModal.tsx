"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import LoginForm from "./auth/login/LoginForm";
import { DialogTitle } from "@radix-ui/react-dialog";
import SignUpForm from "./auth/signup/SignUpForm";

export default function AuthModal({
  buttonText,
  spanClassName,
  buttonClassname,
  icon,
}: {
  buttonText: string;
  spanClassName?: string;
  buttonClassname?: string;
  icon?: React.ReactNode;
}) {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setAuthMode("login");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className={`cursor-pointer bg-blue-600 hover:bg-blue-700 dark:bg-yellow-600 dark:hover:bg-yellow-700 px-2 sm:px-6 ${buttonClassname}`}
        >
          <span className={spanClassName || "dark:text-white"}>
            {buttonText}
          </span>
          {icon}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle></DialogTitle>
        {authMode === "login" ? (
          <LoginForm switchToRegister={() => setAuthMode("register")} />
        ) : (
          <SignUpForm switchToLogin={() => setAuthMode("login")} />
        )}
      </DialogContent>
    </Dialog>
  );
}
