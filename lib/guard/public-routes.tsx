"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthContext } from "../providers/auth-provider";
import Loader from "@/components/shared/loader/Loader";

interface PublicRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PublicRoute = ({ children, fallback }: PublicRouteProps) => {
  const { isAuthenticated, isInitialized } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      const timeout = setTimeout(() => {
        router.push("/home");
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [isAuthenticated, isInitialized, router]);

  if (isAuthenticated && isInitialized) {
    return fallback || <Loader />;
  }

  return <>{children}</>;
};
