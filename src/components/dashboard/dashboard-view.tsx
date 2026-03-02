"use client";

import React from "react";
import {
  Play,
  Download,
  Clock,
  TrendingUp,
  ArrowRight,
  Zap,
  Activity,
  HardDrive,
  Cpu,
  MemoryStick,
  MonitorSpeaker,
} from "lucide-react";
import { useLauncherStore } from "@/stores/launcher-store";
import { CATEGORY_META } from "@/lib/app-registry";
import AppIcon from "@/components/icons/app-icon";

export default function DashboardView() {
  const {
    apps,
    projects,
    profiles,
    activeProfileId,
    systemInfo,
    gpuInfo,
    systemStats,
    selectApp,
    launchApp,
    installApp,
    setView,
  } = useLauncherStore();

  const activeProfile = profiles.find((p) => p.id === activeProfileId);
  const recentApps = [...apps]
    .filter((a) => a.lastLaunched)
    .sort((a, b) => (b.lastLaunched ?? 0) - (a.lastLaunched ?? 0))
    .slice(0, 4);

  const runningApps = apps.filter((a) => a.isRunning);

  return (
    <div
      style={{
        padding: "28px 32px",
        height: "100%",
        overflow: "auto",
      }}
    >
      {/* Welcome & Profile Banner */}
      <div
        className="animate-fadeIn"
        style={{
          background: "var(--accent-gradient-subtle)",
          border: "1px solid var(--border-subtle)",
          borderRadius: 16,
          padding: "28px 32px",
          marginBottom: 24,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative glow */}
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "radial-gradient(circle, var(--accent-glow), transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 700,
                marginBottom: 6,
                color: "var(--text-primary)",
              }}
            >
              Welcome back
            </h1>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 480 }}>
              {activeProfile ? (
                <>
                  Active profile:{" "}
                  <span style={{ color: activeProfile.color, fontWeight: 600 }}>
                    {activeProfile.name}
                  </span>
                  {" — "}
                  {activeProfile.description}
                </>
              ) : (
                "Your professional workspace is ready. Launch apps, manage projects, and orchestrate your workflow."
              )}
            </p>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn-primary"
              onClick={() => setView("library")}
            >
              <Zap size={14} />
              Quick Launch
            </button>
          </div>
        </div>

        {/* Quick stats row */}
        <div
          style={{
            display: "flex",
            gap: 24,
            marginTop: 20,
            paddingTop: 16,
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <QuickStat label="Installed Apps" value={apps.filter((a) => a.installed).length} />
          <QuickStat label="Running" value={runningApps.length} color="var(--success)" />
          <QuickStat label="Projects" value={projects.length} />
          <QuickStat label="Profiles" value={profiles.length} />
        </div>
      </div>

      {/* Grid layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: 20,
        }}
      >
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Installed Applications */}
          <DashboardSection
            title="Applications"
            subtitle="All registered applications"
            action={{ label: "View Library", onClick: () => setView("library") }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 12,
              }}
            >
              {apps.map((app) => (
                <AppQuickCard
                  key={app.id}
                  app={app}
                  onLaunch={() => app.installed ? launchApp(app.id) : installApp(app.id)}
                  onDetails={() => selectApp(app.id)}
                />
              ))}

              {/* Placeholder for more apps */}
              <div
                onClick={() => setView("library")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: 8,
                  padding: 24,
                  borderRadius: 12,
                  border: "2px dashed var(--border-default)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  minHeight: 100,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.background = "var(--accent-muted)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-default)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <span style={{ fontSize: 24, color: "var(--text-muted)" }}>+</span>
                <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>
                  Add Application
                </span>
              </div>
            </div>
          </DashboardSection>

          {/* Recent activity */}
          {recentApps.length > 0 && (
            <DashboardSection title="Recent Activity" subtitle="Recently used tools">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {recentApps.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => selectApp(app.id)}
                    className="card"
                    style={{
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      cursor: "pointer",
                    }}
                  >
                    <AppIcon icon={app.icon} size={28} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{app.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        Last used {formatRelativeTime(app.lastLaunched!)}
                      </div>
                    </div>
                    <Clock size={14} style={{ color: "var(--text-muted)" }} />
                  </div>
                ))}
              </div>
            </DashboardSection>
          )}
        </div>

        {/* Right column — System & Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* System Monitor */}
          <div
            className="card"
            style={{
              padding: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <Activity size={15} style={{ color: "var(--accent)" }} />
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                System Monitor
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* CPU */}
              <SystemStatBar
                icon={<Cpu size={14} />}
                label="CPU"
                value={systemStats?.cpuUsage ?? 0}
                detail={systemInfo?.cpu ?? "—"}
                color="var(--accent)"
              />

              {/* RAM */}
              <SystemStatBar
                icon={<MemoryStick size={14} />}
                label="Memory"
                value={systemStats?.memoryUsage ?? 0}
                detail={
                  systemInfo
                    ? `${formatBytes(systemStats?.usedMemory ?? 0)} / ${formatBytes(
                        systemInfo.totalMemory
                      )}`
                    : "—"
                }
                color="var(--info)"
              />

              {/* GPU */}
              <SystemStatBar
                icon={<MonitorSpeaker size={14} />}
                label="GPU"
                value={0}
                detail={gpuInfo?.name ?? "detecting…"}
                color="var(--warning)"
              />

              {/* Disk */}
              <SystemStatBar
                icon={<HardDrive size={14} />}
                label="Disk"
                value={0}
                detail="—"
                color="var(--success)"
              />
            </div>
          </div>

          {/* Active Profile */}
          {activeProfile && (
            <div
              className="card"
              style={{ padding: "20px" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: activeProfile.color,
                    boxShadow: `0 0 8px ${activeProfile.color}50`,
                  }}
                />
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  Active Profile
                </span>
              </div>

              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                {activeProfile.name}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  marginBottom: 12,
                }}
              >
                {activeProfile.description}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                {activeProfile.apps.length} app(s) configured
              </div>

              <button
                className="btn-ghost"
                style={{ marginTop: 8, fontSize: 12, padding: "6px 0" }}
                onClick={() => setView("profiles")}
              >
                Manage Profiles <ArrowRight size={12} />
              </button>
            </div>
          )}

          {/* Updates */}
          <div
            className="card"
            style={{ padding: "20px" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <TrendingUp size={15} style={{ color: "var(--success)" }} />
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                Updates
              </span>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              All applications are up to date.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ───────────────────────────────────── */

function DashboardSection({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: { label: string; onClick: () => void };
  children: React.ReactNode;
}) {
  return (
    <section className="animate-fadeIn">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <div>
          <h2
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: 2,
            }}
          >
            {title}
          </h2>
          {subtitle && (
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {subtitle}
            </p>
          )}
        </div>
        {action && (
          <button
            className="btn-ghost"
            onClick={action.onClick}
            style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}
          >
            {action.label}
            <ArrowRight size={12} />
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function AppQuickCard({
  app,
  onLaunch,
  onDetails,
}: {
  app: import("@/types").AppDefinition;
  onLaunch: () => void;
  onDetails: () => void;
}) {
  const catMeta = CATEGORY_META[app.category];

  return (
    <div
      className="card"
      style={{
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        position: "relative",
        cursor: "pointer",
      }}
      onClick={onDetails}
    >
      {/* App running indicator */}
      {app.isRunning && (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "var(--success)",
            boxShadow: "0 0 8px var(--success)",
          }}
        />
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <AppIcon icon={app.icon} size={40} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: 2,
            }}
          >
            {app.name}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span
              className="badge"
              style={{
                background: catMeta?.color + "18",
                color: catMeta?.color,
              }}
            >
              {catMeta?.label}
            </span>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
              v{app.version}
            </span>
          </div>
        </div>
      </div>

      <p
        style={{
          fontSize: 12,
          color: "var(--text-secondary)",
          lineHeight: 1.5,
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {app.description}
      </p>

      <button
        className="btn-primary"
        style={{
          width: "100%",
          justifyContent: "center",
          opacity: app.installing ? 0.7 : 1,
          cursor: app.installing ? "wait" : "pointer",
        }}
        disabled={app.installing}
        onClick={(e) => {
          e.stopPropagation();
          onLaunch();
        }}
      >
        {app.installing ? (
          <><Download size={13} /> Installing…</>
        ) : !app.installed ? (
          <><Download size={13} /> Install</>
        ) : (
          <><Play size={13} fill="white" /> {app.isRunning ? "Running" : "Launch"}</>
        )}
      </button>
    </div>
  );
}

function SystemStatBar({
  icon,
  label,
  value,
  detail,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  detail: string;
  color: string;
}) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "var(--text-secondary)",
          }}
        >
          <span style={{ color }}>{icon}</span>
          <span style={{ fontSize: 12, fontWeight: 600 }}>{label}</span>
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>
          {value > 0 ? `${value}%` : "—"}
        </span>
      </div>
      <div className="progress-bar" style={{ marginBottom: 4 }}>
        <div
          className="progress-bar-fill"
          style={{
            width: `${value}%`,
            background: color,
          }}
        />
      </div>
      <div
        style={{
          fontSize: 10,
          color: "var(--text-dim)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {detail}
      </div>
    </div>
  );
}

function QuickStat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 800,
          color: color ?? "var(--text-primary)",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
        {label}
      </div>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
