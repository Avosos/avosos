"use client";

import React, { useState } from "react";
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
  const [startOnBoot, setStartOnBoot] = useState(false);
  const [minimizeToTray, setMinimizeToTray] = useState(true);
  const [confirmLaunch, setConfirmLaunch] = useState(false);
  const { installDir, setInstallDir } = useLauncherStore();

  const handleChangeInstallDir = async () => {
    const selected = await window.electronAPI?.openFolderDialog({
      title: "Select application install directory",
      defaultPath: installDir || undefined,
    });
    if (selected) {
      setInstallDir(selected);
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
        <SettingRow label="Projects directory" description="Default location for new projects">
          <button className="btn-secondary" style={{ padding: "5px 12px", fontSize: 12 }}>
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
            {(["dark", "light"] as const).map((t) => (
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
                {t}
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
  const [updateNotifs, setUpdateNotifs] = useState(true);
  const [appNotifs, setAppNotifs] = useState(true);

  return (
    <div className="animate-fadeIn">
      <SettingGroup title="Notifications" description="Control what notifications you receive">
        <SettingRow
          label="Update available"
          description="Notify when application updates are ready"
        >
          <Toggle enabled={updateNotifs} onChange={() => setUpdateNotifs(!updateNotifs)} />
        </SettingRow>
        <SettingRow
          label="Application events"
          description="Notify when apps finish launching or encounter errors"
        >
          <Toggle enabled={appNotifs} onChange={() => setAppNotifs(!appNotifs)} />
        </SettingRow>
      </SettingGroup>
    </div>
  );
}

function UpdateSettings() {
  const [autoCheck, setAutoCheck] = useState(true);
  const [autoInstall, setAutoInstall] = useState(false);
  const [bgUpdates, setBgUpdates] = useState(true);

  return (
    <div className="animate-fadeIn">
      <SettingGroup title="Updates" description="How updates are handled">
        <SettingRow
          label="Check for updates automatically"
          description="Periodically check for new versions"
        >
          <Toggle enabled={autoCheck} onChange={() => setAutoCheck(!autoCheck)} />
        </SettingRow>
        <SettingRow
          label="Install updates automatically"
          description="Download and install minor updates without prompting"
        >
          <Toggle enabled={autoInstall} onChange={() => setAutoInstall(!autoInstall)} />
        </SettingRow>
        <SettingRow
          label="Background updates"
          description="Update applications in the background without interruption"
        >
          <Toggle enabled={bgUpdates} onChange={() => setBgUpdates(!bgUpdates)} />
        </SettingRow>
      </SettingGroup>
    </div>
  );
}

function StorageSettings() {
  return (
    <div className="animate-fadeIn">
      <SettingGroup title="Storage" description="Manage disk space and cache">
        <SettingRow label="Cache size" description="Temporary files and download cache">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
              142 MB
            </span>
            <button className="btn-secondary" style={{ padding: "5px 12px", fontSize: 12 }}>
              Clear
            </button>
          </div>
        </SettingRow>
        <SettingRow label="Application data" description="Settings, plugins, and configuration files">
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
            28 MB
          </span>
        </SettingRow>
      </SettingGroup>
    </div>
  );
}

function CloudSettings() {
  const [syncSettings, setSyncSettings] = useState(false);
  const [syncPlugins, setSyncPlugins] = useState(false);

  return (
    <div className="animate-fadeIn">
      <SettingGroup
        title="Cloud Synchronization"
        description="Sync your settings, profiles, and plugins across devices"
      >
        <SettingRow
          label="Sync settings"
          description="Keep launcher settings synchronized"
        >
          <Toggle enabled={syncSettings} onChange={() => setSyncSettings(!syncSettings)} />
        </SettingRow>
        <SettingRow
          label="Sync plugins"
          description="Synchronize installed plugin lists"
        >
          <Toggle enabled={syncPlugins} onChange={() => setSyncPlugins(!syncPlugins)} />
        </SettingRow>
      </SettingGroup>

      <div
        style={{
          padding: "16px",
          borderRadius: 10,
          border: "1px solid var(--border-subtle)",
          background: "var(--bg-card)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <Cloud size={16} style={{ color: "var(--text-muted)" }} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>Cloud Status</span>
        </div>
        <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>
          Cloud synchronization is not yet connected. Sign in to enable cross-device
          syncing of your workspace, profiles, and settings.
        </p>
        <button className="btn-primary" style={{ marginTop: 10, padding: "6px 16px" }}>
          Connect Account
        </button>
      </div>
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
