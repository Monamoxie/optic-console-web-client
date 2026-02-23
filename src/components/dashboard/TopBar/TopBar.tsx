"use client";

import { useState } from "react";
import { Search, Bell } from "lucide-react";
import { ThemeToggle } from "@/components/ui";
import styles from "./TopBar.module.css";

export function TopBar() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className={styles.topBar}>
      {/* Search */}
      <div className={styles.searchWrapper}>
        <Search className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search events, pages, users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <ThemeToggle />
        <button className={styles.notificationButton}>
          <Bell className={styles.notificationIcon} />
          <span className={styles.notificationBadge} />
        </button>
      </div>
    </header>
  );
}
