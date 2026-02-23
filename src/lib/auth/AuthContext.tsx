"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  authApi,
  ApiError,
  User,
  LoginRequest,
  SignupRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "@/lib/api";

// Storage keys
const TOKEN_KEY = "optic-auth-token";
const REFRESH_TOKEN_KEY = "optic-refresh-token";
const USER_KEY = "optic-user";
const REMEMBER_KEY = "optic-remember";

// Types
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (data: ForgotPasswordRequest) => Promise<void>;
  resetPassword: (data: ResetPasswordRequest) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Helper functions for storage
function getStorage(remember: boolean): Storage | null {
  if (typeof window === "undefined") return null;
  return remember ? localStorage : sessionStorage;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
}

function clearAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(REMEMBER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize auth state from storage
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      const storedUser = getStoredUser();

      if (token && storedUser) {
        // Validate token by fetching current user
        try {
          const user = await authApi.getMe();
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          // Token invalid, clear storage
          clearAuth();
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    const response = await authApi.login(data);
    const remember = data.rememberMe ?? false;
    const storage = getStorage(remember);

    if (storage) {
      storage.setItem(TOKEN_KEY, response.token);
      if (response.refreshToken) {
        storage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
      }
      storage.setItem(USER_KEY, JSON.stringify(response.user));
      if (remember) {
        localStorage.setItem(REMEMBER_KEY, "true");
      }
    }

    setState({
      user: response.user,
      isAuthenticated: true,
      isLoading: false,
    });

    window.location.href = "/dashboard";
  }, []);

  const signup = useCallback(async (data: SignupRequest) => {
    const response = await authApi.signup(data);
    const storage = localStorage; // Default to persistent storage for new users

    storage.setItem(TOKEN_KEY, response.token);
    storage.setItem(USER_KEY, JSON.stringify(response.user));

    setState({
      user: response.user,
      isAuthenticated: true,
      isLoading: false,
    });

    window.location.href = "/dashboard";
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout API errors
    } finally {
      clearAuth();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      window.location.href = "/auth/login";
    }
  }, []);

  const forgotPassword = useCallback(async (data: ForgotPasswordRequest) => {
    await authApi.forgotPassword(data);
  }, []);

  const resetPassword = useCallback(async (data: ResetPasswordRequest) => {
    await authApi.resetPassword(data);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      signup,
      logout,
      forgotPassword,
      resetPassword,
    }),
    [state, login, signup, logout, forgotPassword, resetPassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { ApiError };
