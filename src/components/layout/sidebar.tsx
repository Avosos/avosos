"use client";

import React from "react";
import {
  LayoutDashboard,
  Library,
  FolderKanban,
  UserCircle,
  Settings,
  Cpu,
  ChevronRight,
} from "lucide-react";
import type { NavView } from "@/types";
import { useLauncherStore } from "@/stores/launcher-store";

const NAV_ITEMS: { id: NavView; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "library", label: "Library", icon: Library },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "profiles", label: "Profiles", icon: UserCircle },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const { currentView, setView, runningApps, systemStats } =
    useLauncherStore();

  return (
    <aside
      style={{
        width: "var(--sidebar-width)",
        height: "100%",
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      {/* Navigation */}
      <nav
        style={{
          flex: 1,
          padding: "16px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            padding: "0 12px 8px",
          }}
        >
          Navigation
        </div>
        {NAV_ITEMS.map((item) => {
          const active = currentView === item.id || 
            (item.id === "library" && currentView === "app-detail");
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 8,
                border: "none",
                background: active
                  ? "var(--accent-muted)"
                  : "transparent",
                color: active
                  ? "var(--accent-hover)"
                  : "var(--text-secondary)",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: active ? 600 : 500,
                transition: "all 0.15s ease",
                textAlign: "left",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                if (!active)
                  e.currentTarget.style.background =
                    "rgba(255,255,255,0.03)";
              }}
              onMouseLeave={(e) => {
                if (!active)
                  e.currentTarget.style.background = "transparent";
              }}
            >
              {active && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 3,
                    height: 20,
                    borderRadius: 2,
                    background: "var(--accent)",
                  }}
                />
              )}
              <Icon size={18} />
              <span>{item.label}</span>
              {item.id === "library" && runningApps.size > 0 && (
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: 10,
                    fontWeight: 700,
                    background: "var(--success)",
                    color: "#000",
                    borderRadius: 10,
                    padding: "1px 7px",
                    lineHeight: "16px",
                  }}
                >
                  {runningApps.size}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* System stats mini */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 10,
          }}
        >
          <Cpu size={14} style={{ color: "var(--text-muted)" }} />
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            System
          </span>
        </div>

        {systemStats ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <MiniStat
              label="CPU"
              value={systemStats.cpuUsage}
              color="var(--accent)"
            />
            <MiniStat
              label="RAM"
              value={systemStats.memoryUsage}
              color="var(--info)"
            />
          </div>
        ) : (
          <div
            style={{ fontSize: 11, color: "var(--text-dim)" }}
          >
            Connecting…
          </div>
        )}
      </div>

      {/* Version */}
      <div
        style={{
          padding: "8px 16px 12px",
          fontSize: 10,
          color: "var(--text-dim)",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        v0.1.0
        <ChevronRight size={10} />
        <span style={{ color: "var(--text-muted)" }}>alpha</span>
      </div>
    </aside>
  );
}

function MiniStat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 4,
        }}
      >
        <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>
          {label}
        </span>
        <span style={{ fontSize: 11, fontWeight: 600, color }}>
          {value}%
        </span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{
            width: `${value}%`,
            background: color,
          }}
        />
      </div>
    </div>
  );
}
