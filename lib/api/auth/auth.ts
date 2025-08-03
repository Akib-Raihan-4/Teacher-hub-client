import { fetchWithAuth } from "@/lib/hooks/fetchWithAuth";
import {
  LoginCredentials,
  LoginResponse,
  ProfileResponse,
  RefreshResponse,
  RegisterCredentials,
} from "@/types/auth";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    return data;
  },

  register: async (
    credentials: RegisterCredentials
  ): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return data;
  },

  refreshToken: async (refreshToken: string): Promise<RefreshResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Token refresh failed");
    }

    return data;
  },

  getProfile: async (): Promise<ProfileResponse> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/auth/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Fetching profile failed");
    }

    return data;
  },
};
