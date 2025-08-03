"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import type { User, LoginCredentials, RegisterCredentials } from "@/types/auth";
import { tokenManager } from "../api/auth/token-manager";
import { authAPI } from "../api/auth/auth";
import { toast } from "sonner";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const accessToken = tokenManager.getAccessToken();

  const hasValidAccessToken = useCallback(() => {
    return Boolean(accessToken && !tokenManager.isTokenExpired(accessToken));
  }, [accessToken]);
  // ----------------------- GET PROFILE -----------------------
  const {
    data: profileData,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => authAPI.getProfile(),
    enabled: !!tokenManager.getRefreshToken(), // only try if refreshToken exists
    retry: false,
  });

  useEffect(() => {
    if (hasValidAccessToken()) {
      if (profileData?.success) {
        setUser(profileData.data.user);
        setIsInitialized(true);
      } else if (isProfileError) {
        setUser(null);
        setIsInitialized(true);
      }
    } else {
      setUser(null);
      setIsInitialized(true);
    }
  }, [profileData, isProfileError, hasValidAccessToken]);

  // ----------------------- LOGIN -----------------------
  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      if (data.success) {
        tokenManager.setAccessToken(data.data.accessToken);
        tokenManager.setRefreshToken(data.data.refreshToken);
        setUser(data.data.user);
        queryClient.invalidateQueries({ queryKey: ["refresh-token"] });
        queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      }
    },
    onError: (error: Error) => {
      toast.error("Login failed", {
        description: error.message,
      });
    },
  });

  // ----------------------- REGISTER -----------------------
  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: (data) => {
      if (data.success) {
        tokenManager.setAccessToken(data.data.accessToken);
        tokenManager.setRefreshToken(data.data.refreshToken);
        setUser(data.data.user);
        queryClient.invalidateQueries({ queryKey: ["refresh-token"] });
        queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      }
    },
    onError: (error: Error) => {
      toast.error("Registration failed", {
        description: error.message,
      });
    },
  });

  const logout = () => {
    tokenManager.clearTokens();
    setUser(null);
    queryClient.clear();
    toast.success("Logged out successfully");
    router.refresh();
  };

  const login = (credentials: LoginCredentials) => {
    return loginMutation.mutateAsync(credentials);
  };

  const register = (credentials: RegisterCredentials) => {
    return registerMutation.mutateAsync(credentials);
  };

  const refetchProfile = () => {
    queryClient.invalidateQueries({ queryKey: ["user-profile"] });
  };

  return {
    user,
    hasValidAccessToken,
    isAuthenticated: !!user,
    isInitialized,
    login,
    register,
    logout,
    refetchProfile,
    isLoading:
      loginMutation.isPending || registerMutation.isPending || isProfileLoading,
    error: loginMutation.error || registerMutation.error,
  };
};
