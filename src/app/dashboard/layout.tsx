"use client";

import { ProtectedRoute } from "@/components/auth";
import { Sidebar, TopBar } from "@/components/dashboard";
import styles from "./layout.module.css";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ProtectedRoute>
      <div className={styles.layout}>
        <Sidebar />
        <div className={styles.main}>
          <TopBar />
          <main className={styles.content}>{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
