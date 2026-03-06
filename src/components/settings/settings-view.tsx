"use client";

import React, { useState, useEffect } from "react";
import {
  Monitor,
  Palette,
  Bell,
  Download,
  Shield,
  Cloud,
  Globe,
  HardDrive,
  FolderOpen,
  ChevronRight,
  ExternalLink,
  Lock,
} from "lucide-react";
import { useLauncherStore } from "@/stores/launcher-store";

type SettingsSection =
  | "general"
  | "appearance"
  | "notifications"
  | "updates"
  | "storage"
  | "cloud"
  | "about";

const SECTIONS: { id: SettingsSection; label: string; icon: React.ElementType }[] = [
  { id: "general", label: "General", icon: Monitor },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "updates", label: "Updates", icon: Download },
  { id: "storage", label: "Storage", icon: HardDrive },
  { id: "cloud", label: "Cloud Sync", icon: Cloud },
  { id: "about", label: "About", icon: Globe },
];

export default function SettingsView() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("general");
  const { systemInfo, gpuInfo } = useLauncherStore();

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        overflow: "hidden",
      }}
    >
      {/* Settings sidebar */}
      <div
        style={{
          width: 220,
          borderRight: "1px solid var(--border-subtle)",
          padding: "24px 12px",
          flexShrink: 0,
          overflow: "auto",
        }}
      >
        <h2
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: "var(--text-primary)",
            padding: "0 12px",
            marginBottom: 16,
          }}
        >
          Settings
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
                  background: active ? "var(--accent-muted)" : "transparent",
                  color: active ? "var(--accent-hover)" : "var(--text-secondary)",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  transition: "all 0.15s",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = "transparent";
                }}
              >
                <Icon size={16} />
                {section.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Settings content */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "28px 32px",
        }}
      >
        {activeSection === "general" && <GeneralSettings />}
        {activeSection === "appearance" && <AppearanceSettings />}
        {activeSection === "notifications" && <NotificationSettings />}
        {activeSection === "updates" && <UpdateSettings />}
        {activeSection === "storage" && <StorageSettings />}
        {activeSection === "cloud" && <CloudSettings />}
        {activeSection === "about" && (
          <AboutSettings systemInfo={systemInfo} gpuInfo={gpuInfo} />
        )}
      </div>
    </div>
  );
}

/* ─── Setting components ───────────────────────────────── */

function SettingGroup({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{title}</h3>
      {description && (
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 14 }}>
          {description}
        </p>
      )}
      {children}
    </div>
  );
}

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
        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>
          {label}
        </div>
        {description && (
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
            {description}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      style={{
        width: 40,
        height: 22,
        borderRadius: 11,
        border: "none",
        background: enabled ? "var(--accent)" : "var(--bg-surface)",
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

/* ─── Section content ──────────────────────────────────── */

function GeneralSettings() {
  const {
    installDir, setInstallDir,
    startOnBoot, setStartOnBoot,
    minimizeToTray, setMinimizeToTray,
    confirmLaunch, setConfirmLaunch,
    projectsDir, setProjectsDir,
  } = useLauncherStore();

  const handleChangeInstallDir = async () => {
    const selected = await window.electronAPI?.openFolderDialog({
      title: "Select application install directory",
      defaultPath: installDir || undefined,
    });
    if (selected) {
      setInstallDir(selected);
    }
  };

  const handleChangeProjectsDir = async () => {
    const selected = await window.electronAPI?.openFolderDialog({
      title: "Select default projects directory",
      defaultPath: projectsDir || undefined,
    });
    if (selected) {
      setProjectsDir(selected);
    }
  };

  return (
    <div className="animate-fadeIn">
      <SettingGroup title="General" description="Basic launcher behavior">
        <SettingRow
          label="Start on system boot"
          description="Automatically launch Avosos when you log in"
        >
          <Toggle enabled={startOnBoot} onChange={() => setStartOnBoot(!startOnBoot)} />
        </SettingRow>
        <SettingRow
          label="Minimize to tray"
          description="Keep running in the system tray when closed"
        >
          <Toggle enabled={minimizeToTray} onChange={() => setMinimizeToTray(!minimizeToTray)} />
        </SettingRow>
        <SettingRow
          label="Confirm before launching"
          description="Show confirmation dialog before starting applications"
        >
          <Toggle enabled={confirmLaunch} onChange={() => setConfirmLaunch(!confirmLaunch)} />
        </SettingRow>
      </SettingGroup>

      <SettingGroup title="Default Paths">
        <SettingRow
          label="Install directory"
          description={installDir || "Not set – using default location"}
        >
          <button
            className="btn-secondary"
            style={{ padding: "5px 12px", fontSize: 12 }}
            onClick={handleChangeInstallDir}
          >
            <FolderOpen size={12} />
            Change
          </button>
        </SettingRow>
        <SettingRow
          label="Projects directory"
          description={projectsDir || "Not set – using default location"}
        >
          <button
            className="btn-secondary"
            style={{ padding: "5px 12px", fontSize: 12 }}
            onClick={handleChangeProjectsDir}
          >
            <FolderOpen size={12} />
            Change
          </button>
        </SettingRow>
      </SettingGroup>
    </div>
  );
}

function AppearanceSettings() {
  const { theme, accentColor, setTheme, setAccentColor } = useLauncherStore();

  const ACCENT_COLORS = [
    { color: "#7c5cfc", label: "Purple" },
    { color: "#3b82f6", label: "Blue" },
    { color: "#10b981", label: "Green" },
    { color: "#f59e0b", label: "Amber" },
    { color: "#ef4444", label: "Red" },
    { color: "#ec4899", label: "Pink" },
  ];

  return (
    <div className="animate-fadeIn">
      <SettingGroup title="Appearance" description="Customize the launcher look and feel">
        <SettingRow label="Theme">
          <div
            style={{
              display: "flex",
              gap: 2,
              background: "var(--bg-tertiary)",
              borderRadius: 8,
              padding: 3,
            }}
          >
            {(["dark", "grey", "light"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                style={{
                  padding: "5px 14px",
                  borderRadius: 6,
                  border: "none",
                  background: theme === t ? "var(--bg-hover)" : "transparent",
                  color: theme === t ? "var(--text-primary)" : "var(--text-muted)",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >
                {t === "grey" ? "Grey" : t}
              </button>
            ))}
          </div>
        </SettingRow>
        <SettingRow
          label="Accent color"
          description="Primary color used throughout the launcher"
        >
          <div style={{ display: "flex", gap: 6 }}>
            {ACCENT_COLORS.map(({ color }) => (
              <button
                key={color}
                onClick={() => setAccentColor(color)}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  border:
                    accentColor === color
                      ? "2px solid var(--text-primary)"
                      : "2px solid transparent",
                  background: color,
                  cursor: "pointer",
                  transition: "border-color 0.15s",
                }}
                title={color}
              />
            ))}
          </div>
        </SettingRow>
      </SettingGroup>
    </div>
  );
}

function NotificationSettings() {
  const {
    notifyOnInstall, setNotifyOnInstall,
    notifyOnUpdate, setNotifyOnUpdate,
    notifyOnLaunch, setNotifyOnLaunch,
    notifications, clearAllNotifications,
  } = useLauncherStore();

  return (
    <div className="animate-fadeIn">
      <SettingGroup title="Notifications" description="Control what notifications you receive">
        <SettingRow
          label="Install / Uninstall progress"
          description="Show Epic Games-style progress bar when installing or removing apps"
        >
          <Toggle enabled={notifyOnInstall} onChange={() => setNotifyOnInstall(!notifyOnInstall)} />
        </SettingRow>
        <SettingRow
          label="Update alerts"
          description="Notify when new app versions are available"
        >
          <Toggle enabled={notifyOnUpdate} onChange={() => setNotifyOnUpdate(!notifyOnUpdate)} />
        </SettingRow>
        <SettingRow
          label="Launch events"
          description="Show notification when an app starts or stops"
        >
          <Toggle enabled={notifyOnLaunch} onChange={() => setNotifyOnLaunch(!notifyOnLaunch)} />
        </SettingRow>
      </SettingGroup>

      <SettingGroup title="Notification History">
        <SettingRow
          label={`${notifications.length} notification${notifications.length !== 1 ? "s" : ""}`}
          description="Total notifications in the current session"
        >
          <button
            className="btn-secondary"
            style={{ padding: "5px 12px", fontSize: 12 }}
            onClick={clearAllNotifications}
            disabled={notifications.length === 0}
          >
            Clear All
          </button>
        </SettingRow>
      </SettingGroup>
    </div>
  );
}

function UpdateSettings() {
  const {
    autoCheckUpdates, setAutoCheckUpdates,
    autoInstallUpdates, setAutoInstallUpdates,
    apps,
  } = useLauncherStore();
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<string | null>(null);

  const outdatedApps = apps.filter((a) => a.installed && a.updateAvailable);

  const handleCheckNow = async () => {
    setChecking(true);
    setCheckResult(null);
    try {
      await window.electronAPI?.checkForUpdates?.();
      setCheckResult(
        outdatedApps.length > 0
          ? `${outdatedApps.length} update${outdatedApps.length > 1 ? "s" : ""} available.`
          : "All applications are up to date."
      );
    } catch {
      setCheckResult("Failed to check for updates.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <SettingGroup title="Updates" description="How updates are handled">
        <SettingRow
          label="Automatically check for updates"
          description="Periodically check if new versions are available"
        >
          <Toggle enabled={autoCheckUpdates} onChange={() => setAutoCheckUpdates(!autoCheckUpdates)} />
        </SettingRow>
        <SettingRow
          label="Auto-install updates"
          description="Automatically download and install available updates"
        >
          <Toggle enabled={autoInstallUpdates} onChange={() => setAutoInstallUpdates(!autoInstallUpdates)} />
        </SettingRow>
        <SettingRow
          label="Check for updates"
          description={checkResult ?? (outdatedApps.length > 0 ? `${outdatedApps.length} update(s) available` : "Last checked: unknown")}
        >
          <button
            className="btn-secondary"
            style={{ padding: "5px 12px", fontSize: 12 }}
            onClick={handleCheckNow}
            disabled={checking}
          >
            {checking ? "Checking…" : "Check Now"}
          </button>
        </SettingRow>
      </SettingGroup>
    </div>
  );
}

function StorageSettings() {
  const { apps } = useLauncherStore();
  const [storageInfo, setStorageInfo] = useState<{ cacheSize: number; dataSize: number } | null>(null);
  const [diskInfo, setDiskInfo] = useState<{ total: number; free: number } | null>(null);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    window.electronAPI?.getStorageInfo().then(setStorageInfo).catch(() => {});
    window.electronAPI?.getDiskInfo?.().then((d) => d && setDiskInfo(d)).catch(() => {});
  }, []);

  const handleClearCache = async () => {
    setClearing(true);
    try {
      await window.electronAPI?.clearCache();
      const updated = await window.electronAPI?.getStorageInfo();
      if (updated) setStorageInfo(updated);
    } catch { /* ignore */ }
    setClearing(false);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const installedApps = apps.filter((a) => a.installed);
  const diskUsedPct = diskInfo ? Math.round(((diskInfo.total - diskInfo.free) / diskInfo.total) * 100) : 0;

  return (
    <div className="animate-fadeIn">
      {/* Disk overview */}
      {diskInfo && (
        <SettingGroup title="Disk Overview" description="System drive usage">
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <div className="progress-bar" style={{ height: 8, borderRadius: 4 }}>
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${diskUsedPct}%`,
                    background: diskUsedPct > 90 ? "var(--error, #ef4444)" : diskUsedPct > 70 ? "var(--warning)" : "var(--accent)",
                    borderRadius: 4,
                  }}
                />
              </div>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", minWidth: 50 }}>
              {diskUsedPct}%
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)" }}>
            <span>Used: {formatSize(diskInfo.total - diskInfo.free)}</span>
            <span>Free: {formatSize(diskInfo.free)}</span>
            <span>Total: {formatSize(diskInfo.total)}</span>
          </div>
        </SettingGroup>
      )}

      <SettingGroup title="Launcher Storage" description="Manage disk space and cache">
        <SettingRow label="Cache size" description="Temporary files and download cache">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
              {storageInfo ? formatSize(storageInfo.cacheSize) : "Calculating…"}
            </span>
            <button
              className="btn-secondary"
              style={{ padding: "5px 12px", fontSize: 12 }}
              onClick={handleClearCache}
              disabled={clearing}
            >
              {clearing ? "Clearing…" : "Clear"}
            </button>
          </div>
        </SettingRow>
        <SettingRow label="Application data" description="Settings, profiles, and configuration files">
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
            {storageInfo ? formatSize(storageInfo.dataSize) : "Calculating…"}
          </span>
        </SettingRow>
      </SettingGroup>

      {/* Per-app storage */}
      {installedApps.length > 0 && (
        <SettingGroup title="Installed Applications" description="Storage per installed app">
          {installedApps.map((app) => (
            <SettingRow
              key={app.id}
              label={app.name}
              description={`v${app.version} · ${app.installPath ?? "default location"}`}
            >
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>
                {app.size ?? "—"}
              </span>
            </SettingRow>
          ))}
        </SettingGroup>
      )}
    </div>
  );
}

function CloudSettings() {
  const [serverUrl, setServerUrl] = useState("");
  const [syncSettings, setSyncSettings] = useState(true);
  const [syncProjects, setSyncProjects] = useState(false);

  return (
    <div className="animate-fadeIn">
      <SettingGroup
        title="Cloud Synchronization"
        description="Sync your settings and projects across devices (requires Avosos server)"
      >
        <SettingRow label="Server URL" description="Your Avosos sync server address">
          <input
            type="text"
            value={serverUrl}
            onChange={(e) => setServerUrl(e.target.value)}
            placeholder="https://your-server.example.com"
            style={{
              width: 240,
              padding: "6px 10px",
              borderRadius: 8,
              border: "1px solid var(--border-subtle)",
              background: "var(--bg-tertiary)",
              color: "var(--text-primary)",
              fontSize: 12,
            }}
          />
        </SettingRow>
        <SettingRow
          label="Sync settings"
          description="Synchronize launcher preferences and appearance"
        >
          <Toggle enabled={syncSettings} onChange={() => setSyncSettings(!syncSettings)} />
        </SettingRow>
        <SettingRow
          label="Sync projects"
          description="Synchronize project metadata and configuration"
        >
          <Toggle enabled={syncProjects} onChange={() => setSyncProjects(!syncProjects)} />
        </SettingRow>
        <SettingRow label="Last sync" description="Never — server not configured">
          <button
            className="btn-secondary"
            style={{ padding: "5px 12px", fontSize: 12 }}
            disabled={!serverUrl.trim()}
            onClick={() => {/* future: trigger sync */}}
          >
            Sync Now
          </button>
        </SettingRow>
      </SettingGroup>

      {!serverUrl.trim() && (
        <div
          style={{
            padding: "16px 20px",
            borderRadius: 10,
            border: "1px dashed var(--border-default)",
            background: "var(--bg-card)",
            textAlign: "center",
          }}
        >
          <Lock size={20} style={{ color: "var(--text-dim)", marginBottom: 6 }} />
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 4 }}>
            Server required
          </div>
          <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6, maxWidth: 360, margin: "0 auto" }}>
            Cloud sync requires a configured Avosos server. Enter your server URL above to enable synchronization.
          </p>
        </div>
      )}
    </div>
  );
}

function AboutSettings({
  systemInfo,
  gpuInfo,
}: {
  systemInfo: import("@/types").SystemInfo | null;
  gpuInfo: import("@/types").GpuInfo | null;
}) {
  return (
    <div className="animate-fadeIn">
      <SettingGroup title="About Avosos Launcher">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <svg width={56} height={56} viewBox="0 0 256 256" fill="none">
            <defs>
              <linearGradient id="about-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7c5cfc" />
                <stop offset="100%" stopColor="#e879f9" />
              </linearGradient>
            </defs>
            <rect width="256" height="256" rx="56" fill="url(#about-bg)" />
            <path
              d="M128 50 L70 200 L90 200 L103 165 L153 165 L166 200 L186 200 Z M128 90 L110 150 L146 150 Z"
              fill="white"
              opacity="0.95"
            />
            <ellipse
              cx="128"
              cy="128"
              rx="90"
              ry="30"
              stroke="white"
              strokeWidth="4"
              fill="none"
              opacity="0.3"
              transform="rotate(-25 128 128)"
            />
            <circle cx="205" cy="105" r="8" fill="white" opacity="0.8" />
          </svg>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>Avosos Launcher</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
              Version 0.1.0 (alpha)
            </div>
            <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>
              Universal application launcher for professional workflows
            </div>
          </div>
        </div>
      </SettingGroup>

      {systemInfo && (
        <SettingGroup title="System Information" description="Your machine details">
          <InfoTableRow label="Platform" value={systemInfo.platform} />
          <InfoTableRow label="Architecture" value={systemInfo.arch} />
          <InfoTableRow label="Hostname" value={systemInfo.hostname} />
          <InfoTableRow label="CPU" value={systemInfo.cpu} />
          <InfoTableRow label="CPU Cores" value={String(systemInfo.cpuCores)} />
          <InfoTableRow
            label="Total Memory"
            value={`${(systemInfo.totalMemory / (1024 ** 3)).toFixed(1)} GB`}
          />
          {gpuInfo && gpuInfo.name !== "Unknown" && (
            <>
              <InfoTableRow label="GPU" value={gpuInfo.name} />
              {gpuInfo.vram > 0 && (
                <InfoTableRow
                  label="VRAM"
                  value={`${(gpuInfo.vram / (1024 ** 3)).toFixed(1)} GB`}
                />
              )}
            </>
          )}
          <InfoTableRow
            label="Uptime"
            value={`${Math.floor(systemInfo.uptime / 3600)}h ${Math.floor(
              (systemInfo.uptime % 3600) / 60
            )}m`}
          />
        </SettingGroup>
      )}

      <SettingGroup title="Links">
        <button
          className="btn-ghost"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 0",
          }}
          onClick={() =>
            window.electronAPI?.openExternal("https://github.com/Avosos")
          }
        >
          <ExternalLink size={13} />
          GitHub Organization
        </button>
      </SettingGroup>
    </div>
  );
}

function ComingSoonBanner({ feature, description }: { feature: string; description: string }) {
  return (
    <div
      style={{
        padding: "20px",
        borderRadius: 10,
        border: "1px dashed var(--border-default)",
        background: "var(--bg-card)",
        textAlign: "center",
      }}
    >
      <Lock size={24} style={{ color: "var(--text-dim)", marginBottom: 8 }} />
      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 4 }}>
        {feature} — Coming Soon
      </div>
      <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6, maxWidth: 400, margin: "0 auto" }}>
        {description}
      </p>
    </div>
  );
}

function InfoTableRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "8px 0",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>
        {value}
      </span>
    </div>
  );
}
