import { tokenManager } from "../auth/token-manager";


export const createAuthenticatedFetch = () => {
  return async (url: string, options: RequestInit = {}) => {
    const token = tokenManager.getToken();

    const headers = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    } as Record<string, string>;

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      tokenManager.removeToken();
      window.location.href = "/login";
      throw new Error("Token expired");
    }

    return response;
  };
};

export const authFetch = createAuthenticatedFetch();
