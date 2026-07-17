"use client";

import {
  AlertTriangle,
  BarChart3,
  Home,
  LayoutDashboard,
  Waves,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

type NavigationId = "dashboard" | "alerts" | "monitoring" | "pools";

const items: Array<{
  id: NavigationId;
  label: string;
  href: string;
  icon: LucideIcon;
}> = [
  { id: "dashboard", label: "综合驾驶舱", href: "/main", icon: LayoutDashboard },
  { id: "alerts", label: "异常预警中心", href: "/main/alerts", icon: AlertTriangle },
  { id: "monitoring", label: "投放后监测", href: "/main/monitoring", icon: BarChart3 },
  { id: "pools", label: "育苗池管理", href: "/main/pools", icon: Waves },
];

export function SystemNavigation({
  active,
  activeAlertCount = 0,
  alertTone = "warning",
}: {
  active: NavigationId;
  activeAlertCount?: number;
  alertTone?: "warning" | "abnormal";
}) {
  return (
    <div className="system-nav-wrap mx-auto max-w-6xl">
      <nav className="system-nav" aria-label="系统功能导航">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === active;
          const hasAlertBadge = item.id === "alerts" && activeAlertCount > 0;

          return (
            <Link
              key={item.id}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`system-nav-item ${isActive ? "is-active" : ""}`}
            >
              <Icon aria-hidden="true" size={17} strokeWidth={1.8} />
              <span>{item.label}</span>
              {hasAlertBadge && (
                <span
                  className={`system-alert-badge ${
                    alertTone === "abnormal" ? "is-abnormal" : ""
                  }`}
                >
                  {activeAlertCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function SystemHomeLink() {
  return (
    <Link className="system-home-link" href="/">
      <Home aria-hidden="true" size={15} strokeWidth={1.8} />
      <span>返回首页</span>
    </Link>
  );
}
