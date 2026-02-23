"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand";
import { Alert, Button } from "@/components/ui";
import { ApiError } from "@/lib/auth";
import { authApi } from "@/lib/api";
import styles from "./page.module.css";

type TokenStatus = "validating" | "success" | "invalid" | "missing";

interface EmailVerificationFormProps {
  token: string | null;
}

export function EmailVerificationForm({ token }: EmailVerificationFormProps) {
  const [tokenStatus, setTokenStatus] = useState<TokenStatus>(() =>
    !token || token.trim() === "" ? "missing" : "validating"
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || token.trim() === "") {
      setTokenStatus("missing");
      return;
    }
    let cancelled = false;
    authApi
      .verifyEmailToken(token)
      .then(() => {
        if (!cancelled) setTokenStatus("success");
      })
      .catch((err) => {
        if (!cancelled) {
          if (err instanceof ApiError) {
            const data = err.data as { message?: string } | null;
            setError(data?.message || "Email verification failed");
          }
          setTokenStatus("invalid");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (tokenStatus === "validating") {
    return (
      <div className={styles.container}>
        <div className={styles.branding}>
          <Logo size="md" />
        </div>
        <div className={styles.card}>
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p className={styles.description}>Verifying email...</p>
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
            This email verification link is missing or invalid.
          </Alert>
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
            <strong>Verification failed</strong>
            <br />
            {error || "This email verification link is invalid or has expired."}
          </Alert>
        </div>
      </div>
    );
  }

  if (tokenStatus === "success") {
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
            <h2 className={styles.title}>Email verified successfully</h2>
            <p className={styles.message}>
              Your account email has been successfully verified. You can now proceed to your dashboard.
            </p>
            <Link href="/dashboard">
              <Button fullWidth>Go to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
