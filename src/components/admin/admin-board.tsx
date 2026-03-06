"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Shield,
  Activity,
  Package,
  Terminal,
  Wrench,
  FileJson,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  FolderOpen,
  GitBranch,
  GitCommit,
  AlertTriangle,
  Check,
  ChevronRight,
  Copy,
  Search,
  HardDrive,
  Zap,
  Eye,
  EyeOff,
  Clock,
  ArrowUp,
  ArrowDown,
  Circle,
  Server,
  Play,
  Square,
  Users,
  UserPlus,
  UserMinus,
  RotateCcw,
  Power,
  MessageSquare,
} from "lucide-react";
import { useLauncherStore } from "@/stores/launcher-store";
import AppIcon from "@/components/icons/app-icon";
import type { RuntimeInfo, LauncherLogEntry } from "@/types";

/* ─── Section types ──────────────────────────────────────── */
type AdminSection =
  | "overview"
  | "apps"
  | "users"
  | "devtools"
  | "maintenance"
  | "security";

const SECTIONS: {
  id: AdminSection;
  label: string;
  icon: React.ElementType;
}[] = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "apps", label: "App Management", icon: Package },
  { id: "users", label: "User Management", icon: Users },
  { id: "devtools", label: "Developer Tools", icon: Terminal },
  { id: "maintenance", label: "Maintenance", icon: Wrench },
  { id: "security", label: "Access & Security", icon: Shield },
];

/* ═══════════════════════════════════════════════════════════ */
/* ─── Main Admin Board ─────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════ */

export default function AdminBoard() {
  const [activeSection, setActiveSection] =
    useState<AdminSection>("overview");

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: 220,
          borderRight: "1px solid var(--border-subtle)",
          padding: "24px 12px",
          flexShrink: 0,
          overflow: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "0 12px",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background:
                "linear-gradient(135deg, #f97316, #ef4444)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Shield size={16} color="white" />
          </div>
          <div>
            <h2
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: "var(--text-primary)",
                lineHeight: 1.2,
              }}
            >
              Admin
            </h2>
            <div
              style={{
                fontSize: 10,
                color: "var(--text-muted)",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Control Panel
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {SECTIONS.map((section) => {
            const active = activeSection === section.id;
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 12px",
                  borderRadius: 8,
                  border: "none",
                  background: active
                    ? "rgba(249, 115, 22, 0.12)"
                    : "transparent",
                  color: active
                    ? "#f97316"
                    : "var(--text-secondary)",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  transition: "all 0.15s",
                  textAlign: "left",
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
                <Icon size={16} />
                {section.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "28px 32px",
        }}
      >
        {activeSection === "overview" && <OverviewSection />}
        {activeSection === "apps" && <AppManagementSection />}
        {activeSection === "users" && <UserManagementSection />}
        {activeSection === "devtools" && <DevToolsSection />}
        {activeSection === "maintenance" && <MaintenanceSection />}
        {activeSection === "security" && <SecuritySection />}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/* ─── Reusable building blocks ─────────────────────────── */
/* ═══════════════════════════════════════════════════════════ */

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2
        style={{
          fontSize: 20,
          fontWeight: 800,
          color: "var(--text-primary)",
          marginBottom: 4,
        }}
      >
        {title}
      </h2>
      {description && (
        <p
          style={{
            fontSize: 13,
            color: "var(--text-muted)",
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  sub,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  sub?: string;
}) {
  return (
    <div
      className="card"
      style={{
        padding: 18,
        flex: 1,
        minWidth: 160,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: `${color}18`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          {label}
        </span>
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 800,
          color: "var(--text-primary)",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {sub && (
        <div
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            marginTop: 4,
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

function AdminCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="card"
      style={{
        padding: 20,
        marginBottom: 16,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/* ─── 1. Overview Section ──────────────────────────────── */
/* ═══════════════════════════════════════════════════════════ */

function OverviewSection() {
  const { apps, runningApps, systemStats, systemInfo, profiles, projects } =
    useLauncherStore();

  const installedCount = apps.filter((a) => a.installed).length;
  const withSource = apps.filter((a) => a.sourcePath).length;

  return (
    <div className="animate-fadeIn">
      <SectionHeader
        title="Admin Overview"
        description="System health, registered applications, and launcher status at a glance."
      />

      {/* Quick stats */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <StatCard
          label="Registered Apps"
          value={apps.length}
          icon={Package}
          color="var(--accent)"
          sub={`${installedCount} installed, ${withSource} with source`}
        />
        <StatCard
          label="Running"
          value={runningApps.size}
          icon={Play}
          color="var(--success)"
          sub={
            runningApps.size > 0
              ? Array.from(runningApps)
                  .map(
                    (id) =>
                      apps.find((a) => a.id === id)?.name ?? id
                  )
                  .join(", ")
              : "No apps running"
          }
        />
        <StatCard
          label="CPU"
          value={`${systemStats?.cpuUsage ?? 0}%`}
          icon={Server}
          color="var(--accent)"
        />
        <StatCard
          label="Memory"
          value={`${systemStats?.memoryUsage ?? 0}%`}
          icon={HardDrive}
          color="var(--info)"
        />
      </div>

      {/* Registered apps table */}
      <AdminCard>
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Package size={15} />
          Registered Applications
        </h3>

        <div style={{ overflow: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 12,
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--border-subtle)",
                }}
              >
                {["App", "Version", "Category", "Source", "Status"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "8px 12px",
                        fontWeight: 600,
                        color: "var(--text-muted)",
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {apps.map((app) => (
                <tr
                  key={app.id}
                  style={{
                    borderBottom:
                      "1px solid var(--border-subtle)",
                  }}
                >
                  <td
                    style={{
                      padding: "10px 12px",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <AppIcon icon={app.icon} size={22} />
                    <span style={{ fontWeight: 600 }}>
                      {app.name}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      fontFamily: "monospace",
                      fontSize: 11,
                    }}
                  >
                    v{app.version}
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {app.category}
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      color: "var(--text-muted)",
                      fontSize: 11,
                      fontFamily: "monospace",
                      maxWidth: 200,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {app.sourcePath ?? "—"}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    {runningApps.has(app.id) ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          color: "var(--success)",
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        <Circle
                          size={7}
                          fill="var(--success)"
                          stroke="none"
                        />
                        Running
                      </span>
                    ) : app.installed ? (
                      <span
                        style={{
                          color: "var(--text-muted)",
                          fontSize: 11,
                        }}
                      >
                        Installed
                      </span>
                    ) : (
                      <span
                        style={{
                          color: "var(--text-dim)",
                          fontSize: 11,
                        }}
                      >
                        Not installed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>

      {/* Quick info */}
      <div style={{ display: "flex", gap: 12 }}>
        <AdminCard style={{ flex: 1 }}>
          <h3
            style={{
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            Profiles
          </h3>
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "var(--text-primary)",
            }}
          >
            {profiles.length}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              marginTop: 4,
            }}
          >
            environment profiles configured
          </div>
        </AdminCard>

        <AdminCard style={{ flex: 1 }}>
          <h3
            style={{
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            Projects
          </h3>
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "var(--text-primary)",
            }}
          >
            {projects.length}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              marginTop: 4,
            }}
          >
            projects tracked
          </div>
        </AdminCard>

        <AdminCard style={{ flex: 1 }}>
          <h3
            style={{
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            Platform
          </h3>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--text-primary)",
              marginTop: 6,
            }}
          >
            {systemInfo?.platform ?? "—"} / {systemInfo?.arch ?? "—"}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              marginTop: 4,
            }}
          >
            {systemInfo?.cpu ?? "Unknown CPU"}
          </div>
        </AdminCard>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/* ─── 2. App Management Section ────────────────────────── */
/* ═══════════════════════════════════════════════════════════ */

function AppManagementSection() {
  const { apps, runningApps, selectApp, setView, bumpAppVersion, refreshAppMeta, deployVersion, rollbackVersion, setMaintenanceMode } =
    useLauncherStore();
  const [scanning, setScanning] = useState(false);
  const [scanResults, setScanResults] = useState<
    { name: string; path: string; type: string }[] | null
  >(null);
  const [bulkBumping, setBulkBumping] = useState(false);
  const [gitStatuses, setGitStatuses] = useState<
    Record<
      string,
      {
        branch: string | null;
        dirty: boolean;
        lastCommit: string | null;
        ahead: number;
        behind: number;
      }
    >
  >({});

  // Load git statuses for all apps with source paths
  const refreshGitStatuses = useCallback(async () => {
    const statuses: typeof gitStatuses = {};
    for (const app of apps) {
      if (app.sourcePath) {
        try {
          const status =
            await window.electronAPI?.getAppGitStatus(
              app.sourcePath
            );
          if (status) statuses[app.id] = status;
        } catch {
          /* skip */
        }
      }
    }
    setGitStatuses(statuses);
  }, [apps]);

  useEffect(() => {
    refreshGitStatuses();
  }, [refreshGitStatuses]);

  const handleScan = async () => {
    setScanning(true);
    try {
      const dir =
        await window.electronAPI?.openFolderDialog({
          title: "Select directory to scan for projects",
        });
      if (dir) {
        const results =
          await window.electronAPI?.scanDirectory(dir);
        setScanResults(results ?? []);
      }
    } finally {
      setScanning(false);
    }
  };

  const handleBulkAutoBump = async () => {
    setBulkBumping(true);
    try {
      for (const app of apps) {
        if (app.sourcePath) {
          await bumpAppVersion(app.id, "auto");
        }
      }
    } finally {
      setBulkBumping(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <SectionHeader
        title="App Management"
        description="Manage registered applications, scan for new projects, and perform bulk operations."
      />

      {/* Action bar */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <button
          className="btn-secondary"
          style={{ padding: "8px 16px", fontSize: 12 }}
          onClick={handleScan}
          disabled={scanning}
        >
          <Search size={13} />
          {scanning ? "Scanning..." : "Scan for Projects"}
        </button>
        <button
          className="btn-secondary"
          style={{ padding: "8px 16px", fontSize: 12 }}
          onClick={handleBulkAutoBump}
          disabled={bulkBumping}
        >
          <Zap size={13} />
          {bulkBumping ? "Bumping all..." : "Auto-Bump All"}
        </button>
        <button
          className="btn-secondary"
          style={{ padding: "8px 16px", fontSize: 12 }}
          onClick={() => {
            refreshAppMeta();
            refreshGitStatuses();
          }}
        >
          <RefreshCw size={13} />
          Refresh All Metadata
        </button>
      </div>

      {/* Scan results */}
      {scanResults && (
        <AdminCard>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <h3
              style={{
                fontSize: 14,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <FolderOpen size={15} />
              Scan Results ({scanResults.length} found)
            </h3>
            <button
              className="btn-ghost"
              style={{ fontSize: 11 }}
              onClick={() => setScanResults(null)}
            >
              Dismiss
            </button>
          </div>
          {scanResults.length === 0 ? (
            <p
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
              }}
            >
              No projects found in the selected directory.
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {scanResults.map((r) => (
                <div
                  key={r.path}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "8px 12px",
                    borderRadius: 8,
                    background: "var(--bg-tertiary)",
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 4,
                      background:
                        r.type === "rust"
                          ? "rgba(249,115,22,0.15)"
                          : "rgba(74,222,128,0.15)",
                      color:
                        r.type === "rust"
                          ? "#f97316"
                          : "var(--success)",
                      textTransform: "uppercase",
                    }}
                  >
                    {r.type}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      {r.name}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--text-muted)",
                        fontFamily: "monospace",
                      }}
                    >
                      {r.path}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      )}

      {/* Apps with git info */}
      {apps.map((app) => {
        const git = gitStatuses[app.id];
        return (
          <AdminCard key={app.id}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <AppIcon icon={app.icon} size={36} />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                    }}
                  >
                    {app.name}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontFamily: "monospace",
                      color: "var(--text-muted)",
                    }}
                  >
                    v{app.version}
                  </span>
                  {runningApps.has(app.id) && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 4,
                        background:
                          "rgba(74,222,128,0.15)",
                        color: "var(--success)",
                      }}
                    >
                      RUNNING
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    marginTop: 2,
                  }}
                >
                  {app.sourcePath ?? "No source path configured"}
                </div>
              </div>

              <button
                className="btn-ghost"
                style={{ fontSize: 11 }}
                onClick={() => {
                  selectApp(app.id);
                  setView("app-detail");
                }}
              >
                Details
                <ChevronRight size={12} />
              </button>
            </div>

            {/* Git status bar */}
            {git && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginTop: 12,
                  paddingTop: 12,
                  borderTop:
                    "1px solid var(--border-subtle)",
                  fontSize: 11,
                  color: "var(--text-secondary)",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <GitBranch size={12} color="var(--accent)" />
                  <strong>{git.branch ?? "—"}</strong>
                </span>

                {git.dirty && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      color: "var(--warning)",
                    }}
                  >
                    <AlertTriangle size={11} />
                    Uncommitted changes
                  </span>
                )}

                {!git.dirty && git.branch && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      color: "var(--success)",
                    }}
                  >
                    <Check size={11} />
                    Clean
                  </span>
                )}

                {git.ahead > 0 && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    <ArrowUp size={11} color="var(--info)" />
                    {git.ahead} ahead
                  </span>
                )}

                {git.behind > 0 && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    <ArrowDown size={11} color="var(--warning)" />
                    {git.behind} behind
                  </span>
                )}

                {git.lastCommit && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      color: "var(--text-muted)",
                      marginLeft: "auto",
                    }}
                  >
                    <GitCommit size={11} />
                    {git.lastCommit}
                  </span>
                )}
              </div>
            )}

            {/* Version deployment & maintenance controls */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 12,
                paddingTop: 12,
                borderTop: "1px solid var(--border-subtle)",
                flexWrap: "wrap",
              }}
            >
              {/* Deploy version */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>Deploy:</span>
                <select
                  style={{
                    appearance: "none",
                    padding: "4px 24px 4px 8px",
                    borderRadius: 6,
                    border: "1px solid var(--border-default)",
                    background: "var(--bg-tertiary)",
                    color: "var(--text-primary)",
                    fontSize: 11,
                    cursor: "pointer",
                  }}
                  value={app.deployedVersion ?? app.version}
                  onChange={(e) => deployVersion(app.id, e.target.value)}
                >
                  {(app.availableVersions?.length ? app.availableVersions : [app.version]).map((v) => (
                    <option key={v} value={v}>v{v}</option>
                  ))}
                </select>
                {app.deployedVersion && app.deployedVersion !== app.version && (
                  <button
                    className="btn-ghost"
                    style={{ fontSize: 10, padding: "3px 8px", display: "flex", alignItems: "center", gap: 4 }}
                    onClick={() => rollbackVersion(app.id)}
                    title="Rollback to current version"
                  >
                    <RotateCcw size={10} /> Rollback
                  </button>
                )}
              </div>

              {/* Maintenance toggle */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
                <Power size={12} style={{ color: app.maintenanceMode ? "var(--warning)" : "var(--text-muted)" }} />
                <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>Maintenance</span>
                <Toggle
                  enabled={!!app.maintenanceMode}
                  onChange={() => setMaintenanceMode(app.id, !app.maintenanceMode, app.maintenanceMessage ?? "")}
                />
              </div>
            </div>

            {app.maintenanceMode && (
              <div style={{ marginTop: 8 }}>
                <input
                  type="text"
                  placeholder="Maintenance message (optional)"
                  value={app.maintenanceMessage ?? ""}
                  onChange={(e) => setMaintenanceMode(app.id, true, e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: "1px solid var(--border-subtle)",
                    background: "var(--bg-tertiary)",
                    color: "var(--text-primary)",
                    fontSize: 11,
                  }}
                />
              </div>
            )}
          </AdminCard>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/* ─── User Management Section ──────────────────────────── */
/* ═══════════════════════════════════════════════════════════ */

function UserManagementSection() {
  const { users, loadUsers, addUser, removeUser, updateUserRole } = useLauncherStore();
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "user">("user");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleAdd = async () => {
    if (!newUsername.trim() || !newEmail.trim()) return;
    setAdding(true);
    try {
      await addUser(newUsername.trim(), newEmail.trim(), newRole);
      setNewUsername("");
      setNewEmail("");
      setNewRole("user");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <SectionHeader
        title="User Management"
        description="Manage launcher users, assign roles, and control access levels."
      />

      {/* Add user form */}
      <AdminCard>
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <UserPlus size={15} />
          Add User
        </h3>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 160 }}>
            <label style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: 4 }}>
              Username
            </label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="johndoe"
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-tertiary)",
                color: "var(--text-primary)",
                fontSize: 12,
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: 4 }}>
              Email
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="john@example.com"
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-tertiary)",
                color: "var(--text-primary)",
                fontSize: 12,
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: 4 }}>
              Role
            </label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as "admin" | "user")}
              style={{
                padding: "8px 24px 8px 12px",
                borderRadius: 8,
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-tertiary)",
                color: "var(--text-primary)",
                fontSize: 12,
                appearance: "none",
              }}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            className="btn-primary"
            style={{ padding: "8px 20px", fontSize: 12 }}
            onClick={handleAdd}
            disabled={adding || !newUsername.trim() || !newEmail.trim()}
          >
            <UserPlus size={13} /> Add
          </button>
        </div>
      </AdminCard>

      {/* Users list */}
      <AdminCard>
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Users size={15} />
          Registered Users ({users.length})
        </h3>

        {users.length === 0 ? (
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
            No users registered yet. Add a user above.
          </p>
        ) : (
          <div style={{ overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  {["Username", "Email", "Role", "Last Login", "Status", "Actions"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "8px 12px",
                        fontWeight: 600,
                        color: "var(--text-muted)",
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <td style={{ padding: "10px 12px", fontWeight: 600 }}>{user.username}</td>
                    <td style={{ padding: "10px 12px", color: "var(--text-secondary)" }}>{user.email}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 4,
                          background: user.role === "admin" ? "rgba(249,115,22,0.15)" : "var(--bg-tertiary)",
                          color: user.role === "admin" ? "#f97316" : "var(--text-muted)",
                          textTransform: "uppercase",
                        }}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: "10px 12px", fontSize: 11, color: "var(--text-muted)" }}>
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 11,
                          fontWeight: 600,
                          color: user.isActive ? "var(--success)" : "var(--text-dim)",
                        }}
                      >
                        <Circle size={7} fill={user.isActive ? "var(--success)" : "var(--text-dim)"} stroke="none" />
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button
                          className="btn-ghost"
                          style={{ fontSize: 10, padding: "3px 8px" }}
                          onClick={() => updateUserRole(user.id, user.role === "admin" ? "user" : "admin")}
                          title={`Switch to ${user.role === "admin" ? "user" : "admin"}`}
                        >
                          <Shield size={11} />
                          {user.role === "admin" ? "Demote" : "Promote"}
                        </button>
                        <button
                          className="btn-ghost"
                          style={{ fontSize: 10, padding: "3px 8px", color: "var(--error)" }}
                          onClick={() => {
                            if (confirm(`Remove user ${user.username}?`)) {
                              removeUser(user.id);
                            }
                          }}
                          title="Remove user"
                        >
                          <UserMinus size={11} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/* ─── 3. Developer Tools Section ───────────────────────── */
/* ═══════════════════════════════════════════════════════════ */

function DevToolsSection() {
  const [runtimes, setRuntimes] = useState<RuntimeInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [envSearch, setEnvSearch] = useState("");
  const [showEnv, setShowEnv] = useState(false);

  // Collect relevant env vars from Electron
  const [envVars, setEnvVars] = useState<{ key: string; value: string }[]>([]);
  // We'll load runtimes from Electron

  useEffect(() => {
    (async () => {
      try {
        const result = await window.electronAPI?.getRuntimes();
        setRuntimes(result ?? []);
      } catch {
        /* browser mode */
      } finally {
        setLoading(false);
      }
    })();
    // Load env vars
    window.electronAPI?.getEnvVars().then((vars) => {
      if (vars) setEnvVars(vars);
    }).catch(() => {});
  }, []);

  return (
    <div className="animate-fadeIn">
      <SectionHeader
        title="Developer Tools"
        description="Runtime detection, environment diagnostics, and development utilities."
      />

      {/* Detected runtimes */}
      <AdminCard>
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Terminal size={15} />
          Detected Runtimes
        </h3>
        {loading ? (
          <p
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
            }}
          >
            Detecting installed runtimes...
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 10,
            }}
          >
            {runtimes.map((rt) => (
              <div
                key={rt.name}
                style={{
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: "1px solid var(--border-subtle)",
                  background: rt.version
                    ? "var(--bg-tertiary)"
                    : "transparent",
                  opacity: rt.version ? 1 : 0.5,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      textTransform: "capitalize",
                    }}
                  >
                    {rt.name}
                  </span>
                  {rt.version ? (
                    <Check
                      size={14}
                      color="var(--success)"
                    />
                  ) : (
                    <AlertTriangle
                      size={14}
                      color="var(--text-dim)"
                    />
                  )}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontFamily: "monospace",
                    color: rt.version
                      ? "var(--text-secondary)"
                      : "var(--text-dim)",
                  }}
                >
                  {rt.version ?? "Not installed"}
                </div>
                {rt.path && (
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--text-muted)",
                      marginTop: 4,
                      fontFamily: "monospace",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={rt.path}
                  >
                    {rt.path}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </AdminCard>

      {/* Environment variables viewer */}
      <AdminCard>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <h3
            style={{
              fontSize: 14,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <FileJson size={15} />
            Environment Variables
          </h3>
          <button
            className="btn-ghost"
            style={{
              fontSize: 11,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
            onClick={() => setShowEnv(!showEnv)}
          >
            {showEnv ? (
              <EyeOff size={12} />
            ) : (
              <Eye size={12} />
            )}
            {showEnv ? "Hide" : "Show"}
          </button>
        </div>

        {showEnv && (
          <>
            <div style={{ marginBottom: 12 }}>
              <input
                type="text"
                value={envSearch}
                onChange={(e) => setEnvSearch(e.target.value)}
                placeholder="Filter variables..."
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid var(--border-subtle)",
                  background: "var(--bg-tertiary)",
                  color: "var(--text-primary)",
                  fontSize: 12,
                  outline: "none",
                }}
              />
            </div>
            <div
              style={{
                maxHeight: 300,
                overflow: "auto",
                fontSize: 11,
                fontFamily: "monospace",
              }}
            >
              {envVars
                .filter((v) =>
                  !envSearch || v.key.toLowerCase().includes(envSearch.toLowerCase()) || v.value.toLowerCase().includes(envSearch.toLowerCase())
                )
                .map((v) => (
                  <div
                    key={v.key}
                    style={{
                      display: "flex",
                      gap: 8,
                      padding: "4px 0",
                      borderBottom: "1px solid var(--border-subtle)",
                    }}
                  >
                    <span style={{ color: "var(--accent)", fontWeight: 600, minWidth: 160, flexShrink: 0 }}>
                      {v.key}
                    </span>
                    <span
                      style={{
                        color: "var(--text-secondary)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={v.value}
                    >
                      {v.value}
                    </span>
                  </div>
                ))}
              {envVars.length === 0 && (
                <p style={{ color: "var(--text-muted)", fontSize: 11, padding: "8px 0" }}>
                  No environment variables available.
                </p>
              )}
            </div>
          </>
        )}
      </AdminCard>

      {/* Quick actions */}
      <AdminCard>
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Zap size={15} />
          Quick Actions
        </h3>
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <button
            className="btn-secondary"
            style={{ padding: "8px 16px", fontSize: 12 }}
            onClick={async () => {
              const dataDir = await window.electronAPI?.getDataDir();
              if (dataDir) window.electronAPI?.openPath(dataDir);
            }}
          >
            <FolderOpen size={13} />
            Open Data Directory
          </button>
          <button
            className="btn-secondary"
            style={{ padding: "8px 16px", fontSize: 12 }}
            onClick={() => {
              window.electronAPI?.openExternal(
                "https://github.com/Avosos"
              );
            }}
          >
            <GitBranch size={13} />
            Open GitHub
          </button>
        </div>
      </AdminCard>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/* ─── 4. Maintenance Section ───────────────────────────── */
/* ═══════════════════════════════════════════════════════════ */

function MaintenanceSection() {
  const [clearing, setClearing] = useState(false);
  const [clearResult, setClearResult] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);
  const [logs, setLogs] = useState<LauncherLogEntry[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  const handleClearCache = async () => {
    setClearing(true);
    setClearResult(null);
    try {
      const result = await window.electronAPI?.clearCache();
      setClearResult(
        `Cleared ${result?.cleared ?? 0} cached files.`
      );
    } catch {
      setClearResult("Failed to clear cache.");
    } finally {
      setClearing(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const json = await window.electronAPI?.exportConfig();
      if (json) {
        // Copy to clipboard
        await navigator.clipboard.writeText(json);
        setClearResult("Configuration copied to clipboard!");
      }
    } catch {
      setClearResult("Failed to export configuration.");
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async () => {
    setImporting(true);
    setImportResult(null);
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        const ok =
          await window.electronAPI?.importConfig(text);
        setImportResult(
          ok
            ? "Configuration imported successfully! Restart to apply."
            : "Invalid configuration format."
        );
      }
    } catch {
      setImportResult("Failed to read from clipboard.");
    } finally {
      setImporting(false);
    }
  };

  const handleLoadLogs = async () => {
    setShowLogs(!showLogs);
    if (!showLogs) {
      try {
        const result =
          await window.electronAPI?.getLauncherLogs();
        setLogs(result ?? []);
      } catch {
        /* ignore */
      }
    }
  };

  return (
    <div className="animate-fadeIn">
      <SectionHeader
        title="Maintenance"
        description="Cache management, configuration backup, and launcher diagnostics."
      />

      {/* Cache */}
      <AdminCard>
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            marginBottom: 6,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Trash2 size={15} />
          Cache Management
        </h3>
        <p
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
            marginBottom: 14,
          }}
        >
          Clear temporary files, download cache, and code
          cache to free up disk space.
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <button
            className="btn-secondary"
            style={{
              padding: "8px 16px",
              fontSize: 12,
              borderColor: "var(--error)",
              color: "var(--error)",
            }}
            onClick={handleClearCache}
            disabled={clearing}
          >
            <Trash2 size={13} />
            {clearing ? "Clearing..." : "Clear All Caches"}
          </button>
          {clearResult && (
            <span
              style={{
                fontSize: 12,
                color: "var(--success)",
              }}
            >
              <Check
                size={12}
                style={{
                  verticalAlign: "middle",
                  marginRight: 4,
                }}
              />
              {clearResult}
            </span>
          )}
        </div>
      </AdminCard>

      {/* Config backup */}
      <AdminCard>
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            marginBottom: 6,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <FileJson size={15} />
          Configuration Backup
        </h3>
        <p
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
            marginBottom: 14,
          }}
        >
          Export your launcher configuration to clipboard or
          import from clipboard.
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <button
            className="btn-secondary"
            style={{ padding: "8px 16px", fontSize: 12 }}
            onClick={handleExport}
            disabled={exporting}
          >
            <Download size={13} />
            {exporting
              ? "Exporting..."
              : "Export to Clipboard"}
          </button>
          <button
            className="btn-secondary"
            style={{ padding: "8px 16px", fontSize: 12 }}
            onClick={handleImport}
            disabled={importing}
          >
            <Upload size={13} />
            {importing
              ? "Importing..."
              : "Import from Clipboard"}
          </button>
        </div>
        {importResult && (
          <p
            style={{
              fontSize: 12,
              color: importResult.includes("success")
                ? "var(--success)"
                : "var(--warning)",
              marginTop: 10,
            }}
          >
            {importResult}
          </p>
        )}
      </AdminCard>

      {/* Logs */}
      <AdminCard>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: showLogs ? 14 : 0,
          }}
        >
          <h3
            style={{
              fontSize: 14,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Activity size={15} />
            Launcher Logs
          </h3>
          <button
            className="btn-ghost"
            style={{ fontSize: 11 }}
            onClick={handleLoadLogs}
          >
            {showLogs ? "Hide" : "Show Logs"}
          </button>
        </div>

        {showLogs && (
          <div
            style={{
              maxHeight: 350,
              overflow: "auto",
              borderRadius: 8,
              background: "var(--bg-tertiary)",
              padding: 12,
            }}
          >
            {logs.length === 0 ? (
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                }}
              >
                No logs recorded yet. Logs are captured
                while the launcher is running.
              </p>
            ) : (
              logs.map((log, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 10,
                    padding: "4px 0",
                    fontSize: 11,
                    fontFamily: "monospace",
                    borderBottom:
                      i < logs.length - 1
                        ? "1px solid rgba(255,255,255,0.04)"
                        : "none",
                  }}
                >
                  <span
                    style={{
                      color: "var(--text-dim)",
                      minWidth: 70,
                      flexShrink: 0,
                    }}
                  >
                    {new Date(
                      log.timestamp
                    ).toLocaleTimeString()}
                  </span>
                  <span
                    style={{
                      fontWeight: 700,
                      minWidth: 40,
                      color:
                        log.level === "error"
                          ? "var(--error)"
                          : log.level === "warn"
                          ? "var(--warning)"
                          : "var(--text-muted)",
                    }}
                  >
                    {log.level.toUpperCase()}
                  </span>
                  <span
                    style={{
                      color: "var(--text-secondary)",
                    }}
                  >
                    {log.message}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </AdminCard>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/* ─── 5. Access & Security Section ─────────────────────── */
/* ═══════════════════════════════════════════════════════════ */

function SecuritySection() {
  const [adminLock, setAdminLockLocal] = useState(false);
  const [confirmDestructive, setConfirmDestructiveLocal] = useState(false);
  const [restrictPaths, setRestrictPathsLocal] = useState(false);
  const [allowedPaths, setAllowedPathsLocal] = useState<string[]>([]);
  const [devMode, setDevModeLocal] = useState(true);

  // Hydrate from persisted settings on mount
  useEffect(() => {
    (async () => {
      const s = await window.electronAPI?.readSettings();
      if (s) {
        if (s.adminLock !== undefined) setAdminLockLocal(s.adminLock);
        if (s.adminConfirmDestructive !== undefined) setConfirmDestructiveLocal(s.adminConfirmDestructive);
        if (s.adminRestrictPaths !== undefined) setRestrictPathsLocal(s.adminRestrictPaths);
        if (s.adminAllowedPaths !== undefined) setAllowedPathsLocal(s.adminAllowedPaths);
        if (s.adminDevMode !== undefined) setDevModeLocal(s.adminDevMode);
      }
    })();
  }, []);

  const persist = (patch: Record<string, unknown>) =>
    window.electronAPI?.writeSettings(patch);

  const setAdminLock = (v: boolean) => {
    setAdminLockLocal(v);
    persist({ adminLock: v });
  };
  const setConfirmDestructive = (v: boolean) => {
    setConfirmDestructiveLocal(v);
    persist({ adminConfirmDestructive: v });
  };
  const setDevMode = (v: boolean) => {
    setDevModeLocal(v);
    persist({ adminDevMode: v });
  };
  const setRestrictPaths = (v: boolean) => {
    setRestrictPathsLocal(v);
    persist({ adminRestrictPaths: v });
  };
  const setAllowedPaths = (paths: string[]) => {
    setAllowedPathsLocal(paths);
    persist({ adminAllowedPaths: paths });
  };

  const handleAddPath = async () => {
    const dir =
      await window.electronAPI?.openFolderDialog({
        title: "Select allowed directory",
      });
    if (dir && !allowedPaths.includes(dir)) {
      setAllowedPaths([...allowedPaths, dir]);
    }
  };

  return (
    <div className="animate-fadeIn">
      <SectionHeader
        title="Access & Security"
        description="Control who can access admin features and restrict launcher behavior."
      />

      {/* Admin lock */}
      <AdminCard>
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Shield size={15} />
          Admin Protection
        </h3>

        <SettingRow
          label="Lock admin panel"
          description="Require confirmation before accessing admin settings"
        >
          <Toggle
            enabled={adminLock}
            onChange={() => setAdminLock(!adminLock)}
          />
        </SettingRow>

        <SettingRow
          label="Confirm destructive actions"
          description="Show a confirmation dialog before clearing caches or importing configs"
        >
          <Toggle
            enabled={confirmDestructive}
            onChange={() =>
              setConfirmDestructive(!confirmDestructive)
            }
          />
        </SettingRow>

        <SettingRow
          label="Developer mode"
          description="Enable developer features like version bumping, git status, and project scanning"
        >
          <Toggle
            enabled={devMode}
            onChange={() => setDevMode(!devMode)}
          />
        </SettingRow>
      </AdminCard>

      {/* Path restrictions */}
      <AdminCard>
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            marginBottom: 6,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <FolderOpen size={15} />
          Path Restrictions
        </h3>
        <p
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
            marginBottom: 14,
          }}
        >
          Restrict which directories the launcher can access
          for scanning and launching applications.
        </p>

        <SettingRow
          label="Enable path restrictions"
          description="Only allow apps from specified directories"
        >
          <Toggle
            enabled={restrictPaths}
            onChange={() =>
              setRestrictPaths(!restrictPaths)
            }
          />
        </SettingRow>

        {restrictPaths && (
          <div style={{ marginTop: 14 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                }}
              >
                Allowed Directories
              </span>
              <button
                className="btn-secondary"
                style={{
                  padding: "4px 12px",
                  fontSize: 11,
                }}
                onClick={handleAddPath}
              >
                + Add
              </button>
            </div>

            {allowedPaths.length === 0 ? (
              <p
                style={{
                  fontSize: 11,
                  color: "var(--text-dim)",
                  padding: "8px 0",
                }}
              >
                No paths added — all directories are
                currently blocked.
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                {allowedPaths.map((p, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "6px 10px",
                      borderRadius: 6,
                      background: "var(--bg-tertiary)",
                      fontSize: 11,
                      fontFamily: "monospace",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {p}
                    <button
                      className="btn-ghost"
                      style={{
                        padding: 2,
                        color: "var(--error)",
                      }}
                      onClick={() =>
                        setAllowedPaths(
                          allowedPaths.filter(
                            (_, idx) => idx !== i
                          )
                        )
                      }
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </AdminCard>

      {/* Danger zone */}
      <AdminCard
        style={{
          borderColor: "rgba(248, 113, 113, 0.25)",
        }}
      >
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            marginBottom: 6,
            color: "var(--error)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <AlertTriangle size={15} />
          Danger Zone
        </h3>
        <p
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
            marginBottom: 14,
          }}
        >
          Irreversible actions that affect your entire
          launcher state. Proceed with caution.
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn-secondary"
            style={{
              padding: "8px 16px",
              fontSize: 12,
              borderColor: "var(--error)",
              color: "var(--error)",
            }}
            onClick={async () => {
              if (
                confirm(
                  "Reset all launcher settings to defaults? This cannot be undone."
                )
              ) {
                await window.electronAPI?.resetLauncher();
                // Reload the app to pick up fresh state
                window.location.reload();
              }
            }}
          >
            <RefreshCw size={13} />
            Reset Launcher
          </button>
        </div>
      </AdminCard>
    </div>
  );
}

/* ─── Reusable setting components (mirrored from SettingsView) */

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 0",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "var(--text-primary)",
          }}
        >
          {label}
        </div>
        {description && (
          <div
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              marginTop: 2,
            }}
          >
            {description}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      style={{
        width: 40,
        height: 22,
        borderRadius: 11,
        border: "none",
        background: enabled
          ? "#f97316"
          : "var(--bg-surface)",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "white",
          position: "absolute",
          top: 3,
          left: enabled ? 21 : 3,
          transition: "left 0.2s",
        }}
      />
    </button>
  );
}
