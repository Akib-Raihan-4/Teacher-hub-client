"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { tokenManager } from "@/lib/api/auth/token-manager";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function OAuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refetchProfile } = useAuth();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const error = searchParams.get("error");

    if (error) {
      toast.error("OAuth failed", {
        description: error,
      });
      router.push("/");
      return;
    }

    if (accessToken && refreshToken) {
      tokenManager.setAccessToken(accessToken);
      tokenManager.setRefreshToken(refreshToken);
      refetchProfile();
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  }, [searchParams, router, refetchProfile]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Processing OAuth Login...</h1>
        <p>Please wait while we authenticate your account.</p>
      </div>
    </div>
  );
}
