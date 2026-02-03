"use client";

import { ThemeToggle } from "@/components/ui";
import styles from "./layout.module.css";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={styles.page}>
      <div className={styles.themeToggle}>
        <ThemeToggle />
      </div>
      
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
