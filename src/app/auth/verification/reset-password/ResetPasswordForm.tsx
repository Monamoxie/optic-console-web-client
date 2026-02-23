"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand";
import { Alert, Button, Input, Label } from "@/components/ui";
import { useAuth, ApiError } from "@/lib/auth";
import { authApi } from "@/lib/api";
import styles from "./page.module.css";

type TokenStatus = "validating" | "valid" | "invalid" | "missing";

interface ResetPasswordFormProps {
  token: string | null;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const { resetPassword } = useAuth();

  const [tokenStatus, setTokenStatus] = useState<TokenStatus>(() =>
    !token || token.trim() === "" ? "missing" : "validating"
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || token.trim() === "") {
      setTokenStatus("missing");
      return;
    }
    let cancelled = false;
    authApi
      .verifyResetPasswordToken(token)
      .then(() => {
        if (!cancelled) setTokenStatus("valid");
      })
      .catch(() => {
        if (!cancelled) setTokenStatus("invalid");
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) return;

    setIsLoading(true);

    try {
      await resetPassword({
        token,
        newPassword: password,
        newPasswordConfirmation: confirmPassword,
      });
      setSuccess(true);
    } catch (err) {
      if (err instanceof ApiError) {
        const data = err.data as { message?: string; data?: Record<string, string> } | null;
        if (data?.data && Object.keys(data.data).length > 0) {
          const validationErrors = Object.values(data.data).join(" ");
          setError(validationErrors);
        } else {
          setError(data?.message || "An error occurred. Please try again.");
        }
      } else {
        setError("Unable to connect to server. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.branding}>
          <Logo size="md" />
        </div>
        <div className={styles.card}>
          <div className={styles.successContent}>
            <div className={styles.successIcon}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h2 className={styles.title}>Password reset successful</h2>
            <p className={styles.message}>
              Your password has been updated. You can now sign in with your new password.
            </p>
            <Link href="/auth/login">
              <Button fullWidth>
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (tokenStatus === "validating") {
    return (
      <div className={styles.container}>
        <div className={styles.branding}>
          <Logo size="md" />
        </div>
        <div className={styles.card}>
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p className={styles.description}>Verifying link...</p>
          </div>
        </div>
      </div>
    );
  }

  if (tokenStatus === "missing") {
    return (
      <div className={styles.container}>
        <div className={styles.branding}>
          <Logo size="md" />
        </div>
        <div className={styles.card}>
          <Alert variant="error">
            <strong>Invalid link</strong>
            <br />
            This password reset link is missing or invalid. Please request a new one from the login page.
          </Alert>
          <Link href="/auth/forgot-password">
            <Button fullWidth>Request new link</Button>
          </Link>
          <Link href="/auth/login" className={styles.backLink}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.backIcon}>
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  if (tokenStatus === "invalid") {
    return (
      <div className={styles.container}>
        <div className={styles.branding}>
          <Logo size="md" />
        </div>
        <div className={styles.card}>
          <Alert variant="error">
            <strong>Link expired or invalid</strong>
            <br />
            This password reset link is invalid or has expired. Please request a new one.
          </Alert>
          <Link href="/auth/forgot-password">
            <Button fullWidth>Request new link</Button>
          </Link>
          <Link href="/auth/login" className={styles.backLink}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.backIcon}>
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.branding}>
        <Logo size="md" />
      </div>
      <div className={styles.card}>
        <h2 className={styles.title}>Set new password</h2>
        <p className={styles.description}>
          Enter your new password below.
        </p>

        {error && <Alert variant="error">{error}</Alert>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="new-password"
              disabled={isLoading}
            />
            <p className={styles.hint}>
              Must be 8-100 characters with at least one digit, one lowercase, one uppercase letter, and one special character
            </p>
          </div>

          <div className={styles.field}>
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="new-password"
              disabled={isLoading}
            />
          </div>

          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset password"}
          </Button>
        </form>

        <Link href="/auth/login" className={styles.backLink}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.backIcon}
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to login
        </Link>
      </div>
    </div>
  );
}
