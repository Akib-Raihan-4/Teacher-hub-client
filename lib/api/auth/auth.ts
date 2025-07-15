import {
  LoginCredentials,
  LoginResponse,
  ProfileResponse,
  RefreshResponse,
  RegisterCredentials,
} from "@/types/auth";

export const API_BASE_URL = "http://localhost:5000/api";

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

    if (!response.ok || !data.success) {
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

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Registration failed");
    }

    return data;
  },

  refreshToken: async (token: string): Promise<RefreshResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Registration failed");
    }

    return data;
  },

  getProfile: async (token: string): Promise<ProfileResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Registration failed");
    }
    return data;
  },
};
