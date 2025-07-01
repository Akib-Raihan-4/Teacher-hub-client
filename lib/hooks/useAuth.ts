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

  useEffect(() => {
    const token = tokenManager.getToken();
    if (token && !tokenManager.isTokenExpired(token)) {
      setIsInitialized(true);
    } else {
      setIsInitialized(true);
    }
  }, []);

  const { data: profileData, isLoading: isProfileLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const token = tokenManager.getToken();
      if (!token) throw new Error("No token");
      return authAPI.getProfile(token);
    },
    enabled:
      !!tokenManager.getToken() &&
      !tokenManager.isTokenExpired(tokenManager.getToken()!),
    retry: false,
  });

  useEffect(() => {
    if (profileData?.success) {
      setUser(profileData.data.user);
    }
  }, [profileData]);

  const { data: refreshData } = useQuery({
    queryKey: ["refresh-token"],
    queryFn: async () => {
      const token = tokenManager.getToken();
      if (!token) throw new Error("No token");
      return authAPI.refreshToken(token);
    },
    enabled:
      !!tokenManager.getToken() &&
      !tokenManager.isTokenExpired(tokenManager.getToken()!),
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
    router.push("/login");
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
