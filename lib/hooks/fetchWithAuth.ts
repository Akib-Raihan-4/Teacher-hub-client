import { authAPI } from "../api/auth/auth";
import { tokenManager } from "../api/auth/token-manager";

export const fetchWithAuth = async (
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> => {
  let accessToken = tokenManager.getAccessToken();

  if (!accessToken || tokenManager.isTokenExpired(accessToken)) {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token found");
    }

    try {
      const res = await authAPI.refreshToken(refreshToken);
      if (res.success) {
        accessToken = res.data.accessToken;
        tokenManager.setAccessToken(accessToken);
        tokenManager.setRefreshToken(res.data.refreshToken);
      } else {
        throw new Error("Failed to refresh token");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      tokenManager.clearTokens();
      throw new Error("Session expired. Please login again.");
    }
  }

  return fetch(input, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
};
