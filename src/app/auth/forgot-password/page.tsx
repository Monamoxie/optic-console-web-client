"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand";
import { Button, Input, Label } from "@/components/ui";
import { useAuth, ApiError } from "@/lib/auth";
import styles from "./page.module.css";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await forgotPassword({ email });
      setSubmitted(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setSubmitted(true);
      } else {
        setError("Unable to connect to server. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={styles.container}>
        {/* Branding */}
        <div className={styles.branding}>
          <Logo size="md" />
        </div>

        {/* Card */}
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
            <h2 className={styles.title}>Check your email</h2>
            <p className={styles.message}>
              If an account exists for <strong>{email}</strong>, you will receive
              a password reset link shortly.
            </p>
            <Link href="/auth/login">
              <Button variant="outline" fullWidth>
                Back to login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Branding */}
      <div className={styles.branding}>
        <Logo size="md" />
      </div>

      {/* Card */}
      <div className={styles.card}>
        <h2 className={styles.title}>Reset your password</h2>
        <p className={styles.description}>
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              autoComplete="email"
              disabled={isLoading}
            />
          </div>

          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? "Sending..." : "Send reset link"}
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
