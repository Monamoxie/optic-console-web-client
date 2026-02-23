"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  MousePointerClick,
  Clock,
  Download,
  Filter,
} from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import styles from "./page.module.css";

// Mock data
const pageviewsData = [
  { date: "Jan 18", pageviews: 4200, sessions: 3100, users: 2800 },
  { date: "Jan 19", pageviews: 5100, sessions: 3800, users: 3200 },
  { date: "Jan 20", pageviews: 4800, sessions: 3500, users: 3000 },
  { date: "Jan 21", pageviews: 6200, sessions: 4200, users: 3600 },
  { date: "Jan 22", pageviews: 5800, sessions: 4000, users: 3400 },
  { date: "Jan 23", pageviews: 7100, sessions: 4800, users: 4100 },
  { date: "Jan 24", pageviews: 6500, sessions: 4400, users: 3800 },
];

const topPagesData = [
  { page: "/", views: 12453, avgTime: "2m 34s" },
  { page: "/products", views: 8721, avgTime: "3m 12s" },
  { page: "/pricing", views: 6543, avgTime: "1m 45s" },
  { page: "/blog", views: 5432, avgTime: "4m 21s" },
  { page: "/about", views: 3210, avgTime: "1m 23s" },
];

const deviceData = [
  { name: "Desktop", value: 62, color: "#3b82f6" },
  { name: "Mobile", value: 32, color: "#8b5cf6" },
  { name: "Tablet", value: 6, color: "#ec4899" },
];

const countryData = [
  { country: "United States", users: 8432, percentage: 42 },
  { country: "United Kingdom", users: 3210, percentage: 16 },
  { country: "Germany", users: 2543, percentage: 13 },
  { country: "France", users: 1876, percentage: 9 },
  { country: "Canada", users: 1654, percentage: 8 },
];

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ComponentType<{ className?: string }>;
}

function MetricCard({ title, value, change, icon: Icon }: MetricCardProps) {
  const isPositive = change >= 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <Icon className={styles.metricIcon} />
      </CardHeader>
      <CardContent>
        <div className={styles.metricValue}>{value}</div>
        <div className={styles.metricChange}>
          {isPositive ? (
            <TrendingUp className={styles.trendUp} />
          ) : (
            <TrendingDown className={styles.trendDown} />
          )}
          <span className={isPositive ? styles.positive : styles.negative}>
            {Math.abs(change)}%
          </span>
          <span className={styles.changeLabel}>vs last period</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function OverviewPage() {
  const [timeRange, setTimeRange] = useState("7d");

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Overview</h1>
          <p className={styles.subtitle}>Analytics dashboard for your project</p>
        </div>
        <div className={styles.headerActions}>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className={styles.timeSelect}
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Button variant="outline" className={styles.iconButton}>
            <Filter className={styles.buttonIcon} />
          </Button>
          <Button variant="outline">
            <Download className={styles.buttonIcon} />
            Export
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className={styles.metricsGrid}>
        <MetricCard
          title="Total Pageviews"
          value="39,700"
          change={12.5}
          icon={Eye}
        />
        <MetricCard
          title="Sessions"
          value="27,800"
          change={8.3}
          icon={MousePointerClick}
        />
        <MetricCard
          title="Unique Users"
          value="23,000"
          change={-2.1}
          icon={Users}
        />
        <MetricCard
          title="Avg. Session Duration"
          value="3m 24s"
          change={5.7}
          icon={Clock}
        />
      </div>

      {/* Charts Row */}
      <div className={styles.chartsGrid}>
        {/* Line Chart */}
        <Card className={styles.chartCard}>
          <CardHeader>
            <CardTitle className={styles.chartTitle}>Pageviews Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={pageviewsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
                <XAxis
                  dataKey="date"
                  stroke="var(--text-tertiary)"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="var(--text-tertiary)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card-bg)",
                    border: "1px solid var(--card-border)",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="pageviews"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="sessions"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#ec4899"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: "#3b82f6" }} />
                <span>Pageviews</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: "#8b5cf6" }} />
                <span>Sessions</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: "#ec4899" }} />
                <span>Users</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className={styles.chartTitle}>Device Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className={styles.deviceLegend}>
              {deviceData.map((device) => (
                <div key={device.name} className={styles.deviceItem}>
                  <div className={styles.deviceInfo}>
                    <span
                      className={styles.legendDot}
                      style={{ backgroundColor: device.color }}
                    />
                    <span>{device.name}</span>
                  </div>
                  <span className={styles.deviceValue}>{device.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Row */}
      <div className={styles.tablesGrid}>
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle className={styles.chartTitle}>Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.table}>
              <div className={styles.tableHeader}>
                <div className={styles.tableCell}>Page</div>
                <div className={`${styles.tableCell} ${styles.alignRight}`}>Views</div>
                <div className={`${styles.tableCell} ${styles.alignRight}`}>Avg. Time</div>
              </div>
              {topPagesData.map((page, index) => (
                <div key={index} className={styles.tableRow}>
                  <div className={styles.tableCell} title={page.page}>
                    {page.page}
                  </div>
                  <div className={`${styles.tableCell} ${styles.alignRight} ${styles.fontMedium}`}>
                    {page.views.toLocaleString()}
                  </div>
                  <div className={`${styles.tableCell} ${styles.alignRight} ${styles.textSecondary}`}>
                    {page.avgTime}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Countries */}
        <Card>
          <CardHeader>
            <CardTitle className={styles.chartTitle}>Top Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.table}>
              <div className={styles.tableHeader}>
                <div className={styles.tableCell}>Country</div>
                <div className={`${styles.tableCell} ${styles.alignRight}`}>Users</div>
                <div className={`${styles.tableCell} ${styles.alignRight}`}>%</div>
              </div>
              {countryData.map((country, index) => (
                <div key={index} className={styles.tableRow}>
                  <div className={styles.tableCell}>{country.country}</div>
                  <div className={`${styles.tableCell} ${styles.alignRight} ${styles.fontMedium}`}>
                    {country.users.toLocaleString()}
                  </div>
                  <div className={`${styles.tableCell} ${styles.alignRight} ${styles.textSecondary}`}>
                    {country.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
