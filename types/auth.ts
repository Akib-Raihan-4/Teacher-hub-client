export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  phone: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface RefreshResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}
