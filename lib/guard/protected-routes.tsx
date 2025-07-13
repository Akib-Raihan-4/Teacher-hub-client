"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Loader from "@/components/shared/loader/Loader";
import { useAuthContext } from "@/components/shared/providers/auth-provider";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedRoute = ({ children, fallback }: ProtectedRouteProps) => {
  const { isAuthenticated, isInitialized } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      const timeout = setTimeout(() => {
        router.push("/");
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [isAuthenticated, isInitialized, router]);

  if (!isAuthenticated && isInitialized) {
    return fallback || <Loader />;
  }

  return <>{children}</>;
};
