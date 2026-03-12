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
import { getTranslations, LANGUAGES } from "@/lib/i18n";

type SettingsSection =
  | "general"
  | "appearance"
  | "notifications"
  | "updates"
  | "storage"
  | "cloud"
  | "about";

const SECTION_ICONS: { id: SettingsSection; icon: React.ElementType }[] = [
  { id: "general", icon: Monitor },
  { id: "appearance", icon: Palette },
  { id: "notifications", icon: Bell },
  { id: "updates", icon: Download },
  { id: "storage", icon: HardDrive },
  { id: "cloud", icon: Cloud },
  { id: "about", icon: Globe },
];

export default function SettingsView() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("general");
  const { systemInfo, gpuInfo, language } = useLauncherStore();
  const t = getTranslations(language);

  const sectionLabels: Record<SettingsSection, string> = {
    general: t.settings.general,
    appearance: t.settings.appearance,
    notifications: t.settings.notificationsTab,
    updates: t.settings.updatesTab,
    storage: t.settings.storage,
    cloud: t.settings.cloudSync,
    about: t.settings.aboutTab,
  };

  const SECTIONS = SECTION_ICONS.map((s) => ({ ...s, label: sectionLabels[s.id] }));

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
          {t.sidebar.settings}
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
    language, setLanguage,
  } = useLauncherStore();
  const t = getTranslations(language);

  const handleChangeInstallDir = async () => {
    const selected = await window.electronAPI?.openFolderDialog({
      title: t.settings.installDir,
      defaultPath: installDir || undefined,
    });
    if (selected) {
      setInstallDir(selected);
    }
  };

  const handleChangeProjectsDir = async () => {
    const selected = await window.electronAPI?.openFolderDialog({
      title: t.settings.projectsDir,
      defaultPath: projectsDir || undefined,
    });
    if (selected) {
      setProjectsDir(selected);
    }
  };

  return (
    <div className="animate-fadeIn">
      <SettingGroup title={t.settings.generalTitle} description={t.settings.generalDesc}>
        <SettingRow
          label={t.settings.startOnBoot}
          description={t.settings.startOnBootDesc}
        >
          <Toggle enabled={startOnBoot} onChange={() => setStartOnBoot(!startOnBoot)} />
        </SettingRow>
        <SettingRow
          label={t.settings.minimizeToTray}
          description={t.settings.minimizeToTrayDesc}
        >
          <Toggle enabled={minimizeToTray} onChange={() => setMinimizeToTray(!minimizeToTray)} />
        </SettingRow>
        <SettingRow
          label={t.settings.confirmLaunch}
          description={t.settings.confirmLaunchDesc}
        >
          <Toggle enabled={confirmLaunch} onChange={() => setConfirmLaunch(!confirmLaunch)} />
        </SettingRow>
        <SettingRow
          label={t.settings.language}
          description={t.settings.languageDesc}
        >
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as import("@/lib/i18n").Language)}
            style={{
              appearance: "none",
              background: "var(--bg-tertiary)",
              border: "1px solid var(--border-default)",
              borderRadius: 8,
              padding: "6px 28px 6px 10px",
              color: "var(--text-primary)",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </SettingRow>
      </SettingGroup>

      <SettingGroup title={t.settings.defaultPaths}>
        <SettingRow
          label={t.settings.installDir}
          description={installDir || t.settings.installDirDefault}
        >
          <button
            className="btn-secondary"
            style={{ padding: "5px 12px", fontSize: 12 }}
            onClick={handleChangeInstallDir}
          >
            <FolderOpen size={12} />
            {t.settings.change}
          </button>
        </SettingRow>
        <SettingRow
          label={t.settings.projectsDir}
          description={projectsDir || t.settings.projectsDirDefault}
        >
          <button
            className="btn-secondary"
            style={{ padding: "5px 12px", fontSize: 12 }}
            onClick={handleChangeProjectsDir}
          >
            <FolderOpen size={12} />
            {t.settings.change}
          </button>
        </SettingRow>
      </SettingGroup>
    </div>
  );
}

function AppearanceSettings() {
  const { theme, accentColor, setTheme, setAccentColor, language } = useLauncherStore();
  const t = getTranslations(language);

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
      <SettingGroup title={t.settings.appearanceTitle} description={t.settings.appearanceDesc}>
        <SettingRow label={t.settings.theme}>
          <div
            style={{
              display: "flex",
              gap: 2,
              background: "var(--bg-tertiary)",
              borderRadius: 8,
              padding: 3,
            }}
          >
            {(["dark", "grey", "light"] as const).map((th) => (
              <button
                key={th}
                onClick={() => setTheme(th)}
                style={{
                  padding: "5px 14px",
                  borderRadius: 6,
                  border: "none",
                  background: theme === th ? "var(--bg-hover)" : "transparent",
                  color: theme === th ? "var(--text-primary)" : "var(--text-muted)",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >
                {th === "dark" ? t.settings.dark : th === "grey" ? t.settings.grey : t.settings.light}
              </button>
            ))}
          </div>
        </SettingRow>
        <SettingRow
          label={t.settings.accentColor}
          description={t.settings.accentColorDesc}
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
    language,
  } = useLauncherStore();
  const t = getTranslations(language);

  return (
    <div className="animate-fadeIn">
      <SettingGroup title={t.settings.notificationsTitle} description={t.settings.notificationsDesc}>
        <SettingRow
          label={t.settings.installProgress}
          description={t.settings.installProgressDesc}
        >
          <Toggle enabled={notifyOnInstall} onChange={() => setNotifyOnInstall(!notifyOnInstall)} />
        </SettingRow>
        <SettingRow
          label={t.settings.updateAlerts}
          description={t.settings.updateAlertsDesc}
        >
          <Toggle enabled={notifyOnUpdate} onChange={() => setNotifyOnUpdate(!notifyOnUpdate)} />
        </SettingRow>
        <SettingRow
          label={t.settings.launchEvents}
          description={t.settings.launchEventsDesc}
        >
          <Toggle enabled={notifyOnLaunch} onChange={() => setNotifyOnLaunch(!notifyOnLaunch)} />
        </SettingRow>
      </SettingGroup>

      <SettingGroup title={t.settings.notificationHistory}>
        <SettingRow
          label={t.settings.notificationCount.replace("{n}", String(notifications.length))}
          description={t.settings.notificationSessionDesc}
        >
          <button
            className="btn-secondary"
            style={{ padding: "5px 12px", fontSize: 12 }}
            onClick={clearAllNotifications}
            disabled={notifications.length === 0}
          >
            {t.settings.clearAll}
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
    language,
  } = useLauncherStore();
  const t = getTranslations(language);
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
          ? t.settings.updatesAvailable.replace("{n}", String(outdatedApps.length))
          : t.settings.allUpToDate
      );
    } catch {
      setCheckResult(t.settings.checkFailed);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <SettingGroup title={t.settings.updatesTitle} description={t.settings.updatesDesc}>
        <SettingRow
          label={t.settings.autoCheck}
          description={t.settings.autoCheckDesc}
        >
          <Toggle enabled={autoCheckUpdates} onChange={() => setAutoCheckUpdates(!autoCheckUpdates)} />
        </SettingRow>
        <SettingRow
          label={t.settings.autoInstall}
          description={t.settings.autoInstallDesc}
        >
          <Toggle enabled={autoInstallUpdates} onChange={() => setAutoInstallUpdates(!autoInstallUpdates)} />
        </SettingRow>
        <SettingRow
          label={t.settings.checkForUpdates}
          description={checkResult ?? (outdatedApps.length > 0 ? t.settings.updatesAvailable.replace("{n}", String(outdatedApps.length)) : t.settings.lastChecked)}
        >
          <button
            className="btn-secondary"
            style={{ padding: "5px 12px", fontSize: 12 }}
            onClick={handleCheckNow}
            disabled={checking}
          >
            {checking ? t.settings.checking : t.settings.checkNow}
          </button>
        </SettingRow>
      </SettingGroup>
    </div>
  );
}

function StorageSettings() {
  const { apps, language } = useLauncherStore();
  const t = getTranslations(language);
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
        <SettingGroup title={t.settings.diskOverview} description={t.settings.diskOverviewDesc}>
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
            <span>{t.settings.used} {formatSize(diskInfo.total - diskInfo.free)}</span>
            <span>{t.settings.free} {formatSize(diskInfo.free)}</span>
            <span>{t.settings.total} {formatSize(diskInfo.total)}</span>
          </div>
        </SettingGroup>
      )}

      <SettingGroup title={t.settings.launcherStorage} description={t.settings.launcherStorageDesc}>
        <SettingRow label={t.settings.cacheSize} description={t.settings.cacheSizeDesc}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
              {storageInfo ? formatSize(storageInfo.cacheSize) : t.settings.calculating}
            </span>
            <button
              className="btn-secondary"
              style={{ padding: "5px 12px", fontSize: 12 }}
              onClick={handleClearCache}
              disabled={clearing}
            >
              {clearing ? t.settings.clearing : t.settings.clear}
            </button>
          </div>
        </SettingRow>
        <SettingRow label={t.settings.appData} description={t.settings.appDataDesc}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
            {storageInfo ? formatSize(storageInfo.dataSize) : t.settings.calculating}
          </span>
        </SettingRow>
      </SettingGroup>

      {/* Per-app storage */}
      {installedApps.length > 0 && (
        <SettingGroup title={t.settings.installedApps} description={t.settings.installedAppsDesc}>
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
  const language = useLauncherStore(s => s.language);
  const t = getTranslations(language);
  const [serverUrl, setServerUrl] = useState("");
  const [syncSettings, setSyncSettings] = useState(true);
  const [syncProjects, setSyncProjects] = useState(false);

  return (
    <div className="animate-fadeIn">
      <SettingGroup
        title={t.settings.cloudSyncTitle}
        description={t.settings.cloudSyncDesc}
      >
        <SettingRow label={t.settings.serverUrl} description={t.settings.serverUrlDesc}>
          <input
            type="text"
            value={serverUrl}
            onChange={(e) => setServerUrl(e.target.value)}
            placeholder={t.settings.serverUrlPlaceholder}
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
          label={t.settings.syncSettings}
          description={t.settings.syncSettingsDesc}
        >
          <Toggle enabled={syncSettings} onChange={() => setSyncSettings(!syncSettings)} />
        </SettingRow>
        <SettingRow
          label={t.settings.syncProjects}
          description={t.settings.syncProjectsDesc}
        >
          <Toggle enabled={syncProjects} onChange={() => setSyncProjects(!syncProjects)} />
        </SettingRow>
        <SettingRow label={t.settings.lastSync} description={t.settings.lastSyncNever}>
          <button
            className="btn-secondary"
            style={{ padding: "5px 12px", fontSize: 12 }}
            disabled={!serverUrl.trim()}
            onClick={() => {/* future: trigger sync */}}
          >
            {t.settings.syncNow}
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
            {t.settings.serverRequired}
          </div>
          <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6, maxWidth: 360, margin: "0 auto" }}>
            {t.settings.cloudSyncAlert}
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
  const language = useLauncherStore(s => s.language);
  const t = getTranslations(language);
  return (
    <div className="animate-fadeIn">
      <SettingGroup title={t.settings.aboutTitle}>
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
            <div style={{ fontSize: 20, fontWeight: 800 }}>{t.settings.aboutName}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {t.settings.aboutVersion}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>
              {t.settings.aboutDesc}
            </div>
          </div>
        </div>
      </SettingGroup>

      {systemInfo && (
        <SettingGroup title={t.settings.systemInfo} description={t.settings.systemInfoDesc}>
          <InfoTableRow label={t.settings.platform} value={systemInfo.platform} />
          <InfoTableRow label={t.settings.architecture} value={systemInfo.arch} />
          <InfoTableRow label={t.settings.hostname} value={systemInfo.hostname} />
          <InfoTableRow label={t.settings.cpuLabel} value={systemInfo.cpu} />
          <InfoTableRow label={t.settings.cpuCores} value={String(systemInfo.cpuCores)} />
          <InfoTableRow
            label={t.settings.totalMemory}
            value={`${(systemInfo.totalMemory / (1024 ** 3)).toFixed(1)} GB`}
          />
          {gpuInfo && gpuInfo.name !== "Unknown" && (
            <>
              <InfoTableRow label={t.settings.gpuLabel} value={gpuInfo.name} />
              {gpuInfo.vram > 0 && (
                <InfoTableRow
                  label={t.settings.vram}
                  value={`${(gpuInfo.vram / (1024 ** 3)).toFixed(1)} GB`}
                />
              )}
            </>
          )}
          <InfoTableRow
            label={t.settings.uptime}
            value={`${Math.floor(systemInfo.uptime / 3600)}h ${Math.floor(
              (systemInfo.uptime % 3600) / 60
            )}m`}
          />
        </SettingGroup>
      )}

      <SettingGroup title={t.settings.links}>
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
          {t.settings.githubOrg}
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
