import { User } from "@/types/auth";

export const tokenManager = {
  getAccessToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  },

  setAccessToken: (token: string): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", token);
    }
  },

  removeAccessToken: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
    }
  },

  getRefreshToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("refresh_token");
  },

  setRefreshToken: (token: string): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem("refresh_token", token);
    }
  },

  removeRefreshToken: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("refresh_token");
    }
  },

  getUserFromToken: (token: string): Partial<User> | null => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        id: payload.userId,
        email: payload.email,
      };
    } catch {
      return null;
    }
  },

  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  },

  clearTokens: (): void => {
    tokenManager.removeAccessToken();
    tokenManager.removeRefreshToken();
  },
};
