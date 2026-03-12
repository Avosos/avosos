"use client";

import React, { useState, useEffect } from "react";
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
  Square,
  Loader,
} from "lucide-react";
import { useLauncherStore } from "@/stores/launcher-store";
import { getTranslations } from "@/lib/i18n";
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
    stopApp,
    setView,
    language,
  } = useLauncherStore();
  const t = getTranslations(language);

  const activeProfile = profiles.find((p) => p.id === activeProfileId);
  const recentApps = [...apps]
    .filter((a) => a.lastLaunched)
    .sort((a, b) => (b.lastLaunched ?? 0) - (a.lastLaunched ?? 0))
    .slice(0, 4);

  const runningApps = apps.filter((a) => a.isRunning);

  // Real disk info
  const [diskInfo, setDiskInfo] = useState<{ total: number; free: number } | null>(null);
  useEffect(() => {
    window.electronAPI?.getDiskInfo?.().then((d) => d && setDiskInfo(d)).catch(() => {});
  }, []);

  const diskUsedPct = diskInfo ? Math.round(((diskInfo.total - diskInfo.free) / diskInfo.total) * 100) : 0;
  const diskDetail = diskInfo
    ? `${formatBytes(diskInfo.total - diskInfo.free)} / ${formatBytes(diskInfo.total)}`
    : t.dashboard.detecting;

  // Update status – derive from apps instead of hardcoded
  const outdatedApps = apps.filter((a) => a.installed && a.updateAvailable);
  const updateText =
    outdatedApps.length === 0
      ? t.dashboard.allUpToDate
      : t.dashboard.updatesAvailable.replace("{n}", String(outdatedApps.length));

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
            >              {t.dashboard.welcome}
            </h1>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 480 }}>
              {activeProfile ? (
                <>
                  {t.dashboard.activeProfile}{" "}
                  <span style={{ color: activeProfile.color, fontWeight: 600 }}>
                    {activeProfile.name}
                  </span>
                  {" — "}
                  {activeProfile.description}
                </>
              ) : (
                t.dashboard.subtitle
              )}
            </p>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn-primary"
              onClick={() => setView("library")}
            >
              <Zap size={14} />
              {t.dashboard.quickLaunch}
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
          <QuickStat label={t.dashboard.installedApps} value={apps.filter((a) => a.installed).length} />
          <QuickStat label={t.dashboard.running} value={runningApps.length} color="var(--success)" />
          <QuickStat label={t.dashboard.projects} value={projects.length} />
          <QuickStat label={t.dashboard.profiles} value={profiles.length} />
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
            title={t.dashboard.applications}
            subtitle={t.dashboard.allRegistered}
            action={{ label: t.dashboard.viewLibrary, onClick: () => setView("library") }}
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
                  onStop={() => stopApp(app.id)}
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
                  {t.dashboard.addApplication}
                </span>
              </div>
            </div>
          </DashboardSection>

          {/* Recent activity */}
          {recentApps.length > 0 && (
            <DashboardSection title={t.dashboard.recentActivity} subtitle={t.dashboard.recentlyUsedTools}>
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
                        {t.dashboard.lastUsed.replace("{time}", formatRelativeTime(app.lastLaunched!, t))}
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
                {t.dashboard.systemMonitor}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* CPU */}
              <SystemStatBar
                icon={<Cpu size={14} />}
                label={t.dashboard.cpuLabel}
                value={systemStats?.cpuUsage ?? 0}
                detail={systemInfo?.cpu ?? "—"}
                color="var(--accent)"
              />

              {/* RAM */}
              <SystemStatBar
                icon={<MemoryStick size={14} />}
                label={t.dashboard.memoryLabel}
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
                label={t.dashboard.gpuLabel}
                value={0}
                detail={gpuInfo?.name ?? t.dashboard.na}
                color="var(--warning)"
              />

              {/* Disk */}
              <SystemStatBar
                icon={<HardDrive size={14} />}
                label={t.dashboard.diskLabel}
                value={diskUsedPct}
                detail={diskDetail}
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
                  {t.dashboard.activeProfileSection}
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
                {t.dashboard.appsConfigured.replace("{n}", String(activeProfile.apps.length))}
              </div>

              <button
                className="btn-ghost"
                style={{ marginTop: 8, fontSize: 12, padding: "6px 0" }}
                onClick={() => setView("store")}
              >
                {t.dashboard.manageStore} <ArrowRight size={12} />
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
                {t.dashboard.updates}
              </span>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              {updateText}
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
  onStop,
  onDetails,
}: {
  app: import("@/types").AppDefinition;
  onLaunch: () => void;
  onStop: () => void;
  onDetails: () => void;
}) {
  const language = useLauncherStore(s => s.language);
  const t = getTranslations(language);
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

      {app.installing && (
        <div style={{ width: "100%", marginBottom: -4 }}>
          <div className="progress-bar" style={{ height: 4, marginBottom: 4 }}>
            <div className="progress-bar-fill" style={{ width: `${app.installProgressPercent ?? 0}%`, background: "var(--accent)", transition: "width 0.3s ease" }} />
          </div>
        </div>
      )}

      {app.isRunning ? (
        <button
          className="btn-primary"
          style={{
            width: "100%",
            justifyContent: "center",
            background: "var(--error, #ef4444)",
          }}
          onClick={(e) => {
            e.stopPropagation();
            onStop();
          }}
        >
          <Square size={13} fill="white" /> {t.dashboard.stop}
        </button>
      ) : (
        <button
          className="btn-primary"
          style={{
            width: "100%",
            justifyContent: "center",
            opacity: app.installing || app.isLaunching || app.uninstalling ? 0.7 : 1,
            cursor: app.installing || app.isLaunching || app.uninstalling ? "wait" : "pointer",
          }}
          disabled={app.installing || app.isLaunching || app.uninstalling}
          onClick={(e) => {
            e.stopPropagation();
            onLaunch();
          }}
        >
          {app.installing ? (
            <><Download size={13} /> {t.dashboard.installing}</>
          ) : app.isLaunching ? (
            <><Loader size={13} style={{ animation: "spin 1s linear infinite" }} /> {t.dashboard.starting}</>
          ) : app.uninstalling ? (
            <><Loader size={13} style={{ animation: "spin 1s linear infinite" }} /> {t.dashboard.removing}</>
          ) : !app.installed ? (
            <><Download size={13} /> {t.dashboard.install}</>
          ) : (
            <><Play size={13} fill="white" /> {t.dashboard.launch}</>
          )}
        </button>
      )}
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

function formatRelativeTime(timestamp: number, t?: ReturnType<typeof getTranslations>): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  const nt = t?.notifications;
  if (mins < 1) return nt?.justNow ?? "just now";
  if (mins < 60) return nt?.minutesAgo.replace("{n}", String(mins)) ?? `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return nt?.hoursAgo.replace("{n}", String(hrs)) ?? `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return nt?.daysAgo.replace("{n}", String(days)) ?? `${days}d ago`;
}
