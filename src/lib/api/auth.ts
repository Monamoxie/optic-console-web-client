import { apiClient, ApiError } from "./client";

// Types
export interface User {
  id: string;
  email: string;
  fullName: string;
  organizationId?: string;
  organizationName?: string;
  role?: string;
  createdAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  expiresIn: number;
  user: User;
}

export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
  organizationName: string;
}

export interface SignupResponse {
  token: string;
  user: User;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

// API Functions
export const authApi = {
  /**
   * Login with email and password
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>("/api/v1/auth/login", data);
  },

  /**
   * Create a new account
   */
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    return apiClient.post<SignupResponse>("/api/v1/auth/signup", data);
  },

  /**
   * Request password reset email
   */
  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    return apiClient.post("/api/v1/auth/forgot-password", data);
  },

  /**
   * Reset password with token
   */
  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    return apiClient.post("/api/v1/auth/reset-password", data);
  },

  /**
   * Get current user profile
   */
  getMe: async (): Promise<User> => {
    return apiClient.get<User>("/api/v1/auth/me");
  },

  /**
   * Refresh auth token
   */
  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>("/api/v1/auth/refresh", { refreshToken });
  },

  /**
   * Logout (invalidate token on server)
   */
  logout: async (): Promise<void> => {
    return apiClient.post("/api/v1/auth/logout");
  },
};

export { ApiError };
