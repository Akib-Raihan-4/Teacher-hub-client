"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { User, LoginCredentials, RegisterCredentials } from "@/types/auth";
import { tokenManager } from "../auth/token-manager";
import { authAPI } from "../auth/auth";
import { toast } from "sonner";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const hasValidToken = () => {
    const token = tokenManager.getToken();
    return Boolean(token && !tokenManager.isTokenExpired(token));
  };

  const {
    data: profileData,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const token = tokenManager.getToken();
      if (!token) throw new Error("No token");
      return authAPI.getProfile(token);
    },
    enabled: hasValidToken(),
    retry: false,
  });

  useEffect(() => {
    if (hasValidToken()) {
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
  }, [profileData, isProfileError]);

  const { data: refreshData } = useQuery({
    queryKey: ["refresh-token"],
    queryFn: async () => {
      const token = tokenManager.getToken();
      if (!token) throw new Error("No token");
      return authAPI.refreshToken(token);
    },
    enabled: hasValidToken(),
    refetchInterval: 5 * 60 * 1000,
    retry: false,
  });

  useEffect(() => {
    if (refreshData?.success) {
      tokenManager.setToken(refreshData.data.token);
    }
  }, [refreshData]);

  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      if (data.success) {
        tokenManager.setToken(data.data.token);
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

  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: (data) => {
      if (data.success) {
        tokenManager.setToken(data.data.token);
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
    tokenManager.removeToken();
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
    hasValidToken,
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
