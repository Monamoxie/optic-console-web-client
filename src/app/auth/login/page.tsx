"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand";
import { Button, Input, Label, Checkbox } from "@/components/ui";
import { useAuth, ApiError } from "@/lib/auth";
import styles from "./page.module.css";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login({ email, password, rememberMe });
      // Redirect handled by AuthContext
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError("Invalid email or password");
        } else if (err.status === 429) {
          setError("Too many attempts. Please try again later.");
        } else {
          setError("An error occurred. Please try again.");
        }
      } else {
        setError("Unable to connect to server. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Branding */}
      <div className={styles.branding}>
        <Logo size="md" />
        <p className={styles.tagline}>Privacy-first analytics platform</p>
      </div>

      {/* Card */}
      <div className={styles.card}>
        <h2 className={styles.title}>Sign in to your account</h2>

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

          <div className={styles.field}>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              disabled={isLoading}
            />
          </div>

          <div className={styles.options}>
            <Checkbox
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              label="Remember me"
              disabled={isLoading}
            />
            <Link href="/auth/forgot-password" className={styles.link}>
              Forgot password?
            </Link>
          </div>

          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className={styles.switch}>
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className={styles.switchLink}>
            Sign up
          </Link>
        </p>
      </div>

      {/* Footer */}
      <p className={styles.footer}>
        By signing in, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
}
