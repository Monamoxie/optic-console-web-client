"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand";
import { Button, Input, Label } from "@/components/ui";
import { useAuth, ApiError } from "@/lib/auth";
import styles from "./page.module.css";

export default function SignupPage() {
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    setIsLoading(true);

    try {
      await signup({ email, password });
    } catch (err) {
      if (err instanceof ApiError) {
        const data = err.data as { message?: string } | null;
        setError(data?.message || "An error occurred. Please try again.");
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
        <p className={styles.tagline}>Get started with privacy-first analytics</p>
      </div>

      <div className={styles.card}>
        <h2 className={styles.title}>Create your account</h2>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <Label htmlFor="email">Email</Label>
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
              autoComplete="new-password"
              disabled={isLoading}
            />
            <p className={styles.hint}>Must be at least 8 characters</p>
          </div>

          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className={styles.switch}>
          Already have an account?{" "}
          <Link href="/auth/login" className={styles.switchLink}>
            Sign in
          </Link>
        </p>
      </div>
      
      <p className={styles.footer}>
        By creating an account, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
}
