"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Zap,
  Activity,
  TrendingUp,
  Users,
  Settings,
  CreditCard,
  ChevronDown,
  Building2,
  User,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/brand";
import { useAuth } from "@/lib/auth";
import styles from "./Sidebar.module.css";

interface NavItem {
  id: string;
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { id: string; name: string; href: string }[];
}

const navigation: NavItem[] = [
  { id: "overview", name: "Overview", href: "/dashboard", icon: Home },
  { id: "realtime", name: "Realtime", href: "/dashboard/realtime", icon: Zap },
  { id: "events", name: "Events", href: "/dashboard/events", icon: Activity },
  {
    id: "reports",
    name: "Reports",
    href: "/dashboard/reports",
    icon: TrendingUp,
    children: [
      { id: "traffic", name: "Traffic", href: "/dashboard/reports/traffic" },
      { id: "funnels", name: "Funnels", href: "/dashboard/reports/funnels" },
      { id: "retention", name: "Retention", href: "/dashboard/reports/retention" },
    ],
  },
  { id: "team", name: "Team", href: "/dashboard/team", icon: Users },
  { id: "settings", name: "Settings", href: "/dashboard/settings", icon: Settings },
  { id: "billing", name: "Billing", href: "/dashboard/billing", icon: CreditCard },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>(["reports"]);
  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logoSection}>
        <Logo size="sm" />
      </div>

      {/* Project Selector */}
      <div className={styles.projectSection}>
        <button
          className={styles.projectButton}
          onClick={() => setShowProjectMenu(!showProjectMenu)}
        >
          <Building2 className={styles.projectIcon} />
          <span className={styles.projectName}>Production Website</span>
          <ChevronDown className={styles.chevron} />
        </button>
        {showProjectMenu && (
          <div className={styles.projectMenu}>
            <div className={styles.menuLabel}>Projects</div>
            <button className={styles.menuItem}>Production Website</button>
            <button className={styles.menuItem}>Mobile App</button>
            <button className={styles.menuItem}>Staging Environment</button>
            <div className={styles.menuDivider} />
            <button className={styles.menuItem}>+ Create new project</button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {navigation.map((item) => (
            <li key={item.id}>
              {item.children ? (
                <div className={styles.navGroup}>
                  <button
                    className={styles.navGroupHeader}
                    onClick={() => toggleExpanded(item.id)}
                  >
                    <item.icon className={styles.navIcon} />
                    <span>{item.name}</span>
                    <ChevronDown
                      className={`${styles.chevronSmall} ${
                        expandedItems.includes(item.id) ? styles.expanded : ""
                      }`}
                    />
                  </button>
                  {expandedItems.includes(item.id) && (
                    <ul className={styles.navSubList}>
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <Link
                            href={child.href}
                            className={`${styles.navSubItem} ${
                              isActive(child.href) ? styles.active : ""
                            }`}
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`${styles.navItem} ${
                    isActive(item.href) ? styles.active : ""
                  }`}
                >
                  <item.icon className={styles.navIcon} />
                  <span>{item.name}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* User Section */}
      <div className={styles.userSection}>
        <button
          className={styles.userButton}
          onClick={() => setShowUserMenu(!showUserMenu)}
        >
          <div className={styles.avatar}>
            <User className={styles.avatarIcon} />
          </div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user?.fullName || "User"}</p>
            <p className={styles.userEmail}>{user?.email || "user@example.com"}</p>
          </div>
          <ChevronDown className={styles.chevron} />
        </button>
        {showUserMenu && (
          <div className={styles.userMenu}>
            <div className={styles.menuLabel}>My Account</div>
            <Link href="/dashboard/profile" className={styles.menuItem}>
              Profile
            </Link>
            <Link href="/dashboard/preferences" className={styles.menuItem}>
              Preferences
            </Link>
            <div className={styles.menuDivider} />
            <button className={styles.menuItem} onClick={logout}>
              <LogOut className={styles.menuItemIcon} />
              Sign out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
