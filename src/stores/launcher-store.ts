import { create } from "zustand";
import type {
  NavView,
  AppDefinition,
  Project,
  EnvironmentProfile,
  SystemStats,
  SystemInfo,
  GpuInfo,
  ChangelogEntry,
  LauncherNotification,
  LauncherUser,
  VersionDeployment,
} from "@/types";
import { APP_REGISTRY } from "@/lib/app-registry";
import { v4 as uuidv4 } from "uuid";
import type { Language } from "@/lib/i18n";

/* ── Theme helpers ──────────────────────────────────────── */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = hex.replace("#", "").match(/.{2}/g);
  if (!m) return null;
  return { r: parseInt(m[0], 16), g: parseInt(m[1], 16), b: parseInt(m[2], 16) };
}

function lighten(hex: string, pct: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const f = pct / 100;
  const r = Math.min(255, Math.round(rgb.r + (255 - rgb.r) * f));
  const g = Math.min(255, Math.round(rgb.g + (255 - rgb.g) * f));
  const b = Math.min(255, Math.round(rgb.b + (255 - rgb.b) * f));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function applyTheme(theme: "dark" | "light" | "grey", accent: string) {
  const root = document.documentElement;
  const rgb = hexToRgb(accent);
  if (!rgb) return;

  const accentHover = lighten(accent, 15);

  // Accent-derived vars
  root.style.setProperty("--accent", accent);
  root.style.setProperty("--accent-hover", accentHover);
  root.style.setProperty("--accent-muted", `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`);
  root.style.setProperty("--accent-glow", `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)`);
  root.style.setProperty("--accent-gradient", `linear-gradient(135deg, ${accent}, ${lighten(accent, 30)})`);
  root.style.setProperty("--accent-gradient-subtle", `linear-gradient(135deg, rgba(${rgb.r},${rgb.g},${rgb.b},0.15), rgba(${rgb.r},${rgb.g},${rgb.b},0.05))`);
  root.style.setProperty("--shadow-glow", `0 0 40px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`);

  // Theme-derived vars
  if (theme === "light") {
    root.style.setProperty("--bg-primary", "#f5f5f7");
    root.style.setProperty("--bg-secondary", "#eeeef0");
    root.style.setProperty("--bg-tertiary", "#e5e5ea");
    root.style.setProperty("--bg-elevated", "#dddde2");
    root.style.setProperty("--bg-surface", "#d5d5dc");
    root.style.setProperty("--bg-hover", "#ccccd5");
    root.style.setProperty("--bg-card", "#ffffff");
    root.style.setProperty("--border-subtle", "rgba(0, 0, 0, 0.06)");
    root.style.setProperty("--border-default", "rgba(0, 0, 0, 0.10)");
    root.style.setProperty("--border-strong", "rgba(0, 0, 0, 0.18)");
    root.style.setProperty("--text-primary", "#1a1a2e");
    root.style.setProperty("--text-secondary", "#555570");
    root.style.setProperty("--text-muted", "#8888a0");
    root.style.setProperty("--text-dim", "#aaaabc");
    root.style.setProperty("--glass-bg", "rgba(245, 245, 247, 0.88)");
    root.style.setProperty("--glass-border", "rgba(0, 0, 0, 0.08)");
    root.style.setProperty("--overlay-bg", "rgba(0, 0, 0, 0.3)");
    root.style.setProperty("--shadow-sm", "0 2px 8px rgba(0, 0, 0, 0.08)");
    root.style.setProperty("--shadow-md", "0 8px 32px rgba(0, 0, 0, 0.12)");
    root.style.setProperty("--shadow-lg", "0 24px 80px rgba(0, 0, 0, 0.16)");
    root.style.setProperty("color-scheme", "light");
  } else if (theme === "grey") {
    root.style.setProperty("--bg-primary", "#1e1f22");
    root.style.setProperty("--bg-secondary", "#2b2d31");
    root.style.setProperty("--bg-tertiary", "#313338");
    root.style.setProperty("--bg-elevated", "#383a40");
    root.style.setProperty("--bg-surface", "#404249");
    root.style.setProperty("--bg-hover", "#4e505899");
    root.style.setProperty("--bg-card", "#2b2d31");
    root.style.setProperty("--border-subtle", "rgba(255, 255, 255, 0.05)");
    root.style.setProperty("--border-default", "rgba(255, 255, 255, 0.08)");
    root.style.setProperty("--border-strong", "rgba(255, 255, 255, 0.13)");
    root.style.setProperty("--text-primary", "#f2f3f5");
    root.style.setProperty("--text-secondary", "#b5bac1");
    root.style.setProperty("--text-muted", "#949ba4");
    root.style.setProperty("--text-dim", "#6d6f78");
    root.style.setProperty("--glass-bg", "rgba(43, 45, 49, 0.88)");
    root.style.setProperty("--glass-border", "rgba(255, 255, 255, 0.06)");
    root.style.setProperty("--overlay-bg", "rgba(0, 0, 0, 0.45)");
    root.style.setProperty("--shadow-sm", "0 2px 8px rgba(0, 0, 0, 0.2)");
    root.style.setProperty("--shadow-md", "0 8px 32px rgba(0, 0, 0, 0.3)");
    root.style.setProperty("--shadow-lg", "0 24px 80px rgba(0, 0, 0, 0.4)");
    root.style.setProperty("color-scheme", "dark");
  } else {
    root.style.setProperty("--bg-primary", "#08080d");
    root.style.setProperty("--bg-secondary", "#0e0e15");
    root.style.setProperty("--bg-tertiary", "#14141e");
    root.style.setProperty("--bg-elevated", "#1a1a28");
    root.style.setProperty("--bg-surface", "#20202f");
    root.style.setProperty("--bg-hover", "#282840");
    root.style.setProperty("--bg-card", "#12121c");
    root.style.setProperty("--border-subtle", "rgba(255, 255, 255, 0.04)");
    root.style.setProperty("--border-default", "rgba(255, 255, 255, 0.08)");
    root.style.setProperty("--border-strong", "rgba(255, 255, 255, 0.14)");
    root.style.setProperty("--text-primary", "#f0f0f5");
    root.style.setProperty("--text-secondary", "#9898b0");
    root.style.setProperty("--text-muted", "#555570");
    root.style.setProperty("--text-dim", "#3a3a50");
    root.style.setProperty("--glass-bg", "rgba(14, 14, 21, 0.85)");
    root.style.setProperty("--glass-border", "rgba(255, 255, 255, 0.06)");
    root.style.setProperty("--overlay-bg", "rgba(0, 0, 0, 0.5)");
    root.style.setProperty("--shadow-sm", "0 2px 8px rgba(0, 0, 0, 0.3)");
    root.style.setProperty("--shadow-md", "0 8px 32px rgba(0, 0, 0, 0.4)");
    root.style.setProperty("--shadow-lg", "0 24px 80px rgba(0, 0, 0, 0.5)");
    root.style.setProperty("color-scheme", "dark");
  }
}

interface LauncherState {
  /* Navigation */
  currentView: NavView;
  setView: (view: NavView) => void;
  selectedAppId: string | null;
  selectApp: (id: string) => void;

  /* Applications */
  apps: AppDefinition[];
  runningApps: Set<string>;
  runningPids: Map<string, number>;
  launchApp: (id: string) => Promise<void>;
  stopApp: (id: string) => Promise<void>;
  refreshAppMeta: (id?: string) => Promise<void>;
  bumpAppVersion: (id: string, bumpType: "major" | "minor" | "patch" | "auto") => Promise<string | null>;
  installApp: (id: string) => Promise<boolean>;
  uninstallApp: (id: string) => Promise<boolean>;
  checkInstallStatus: () => Promise<void>;

  /* Dependency management */
  checkOutdated: (id: string) => Promise<void>;
  updateDeps: (id: string) => Promise<boolean>;
  outdatedPackages: Record<string, import("@/types").OutdatedPackage[]>;
  updatingDeps: Set<string>;

  /* Install directory */
  installDir: string;
  setInstallDir: (dir: string) => Promise<void>;

  /* Appearance */
  theme: "dark" | "light" | "grey";
  accentColor: string;
  setTheme: (theme: "dark" | "light" | "grey") => void;
  setAccentColor: (color: string) => void;

  /* Language */
  language: Language;
  setLanguage: (lang: Language) => void;

  /* General settings (persisted) */
  startOnBoot: boolean;
  minimizeToTray: boolean;
  confirmLaunch: boolean;
  projectsDir: string;
  setStartOnBoot: (v: boolean) => void;
  setMinimizeToTray: (v: boolean) => void;
  setConfirmLaunch: (v: boolean) => void;
  setProjectsDir: (dir: string) => Promise<void>;

  /* Projects */
  projects: Project[];
  addProject: (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => void;
  removeProject: (id: string) => void;
  updateProject: (id: string, data: Partial<Project>) => void;

  /* Profiles (kept for data compat, UI replaced by Store) */
  profiles: EnvironmentProfile[];
  activeProfileId: string | null;
  setActiveProfile: (id: string | null) => void;
  addProfile: (profile: Omit<EnvironmentProfile, "id" | "createdAt" | "updatedAt">) => void;
  removeProfile: (id: string) => void;

  /* Notifications */
  notifications: LauncherNotification[];
  addNotification: (n: Omit<LauncherNotification, "id" | "timestamp" | "read">) => string;
  dismissNotification: (id: string) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  updateNotificationProgress: (id: string, progress: number, message?: string) => void;

  /* License Keys */
  activateLicense: (appId: string, key: string) => Promise<boolean>;

  /* Admin: Version Deployments */
  versionDeployments: VersionDeployment[];
  deployVersion: (appId: string, version: string) => Promise<boolean>;
  rollbackVersion: (appId: string) => Promise<boolean>;
  setMaintenanceMode: (appId: string, enabled: boolean, message?: string) => Promise<void>;

  /* Admin: Users */
  users: LauncherUser[];
  loadUsers: () => Promise<void>;
  addUser: (user: { username: string; email?: string; role: "admin" | "user" }) => Promise<void>;
  removeUser: (userId: string) => Promise<void>;
  updateUserRole: (userId: string, role: "admin" | "user") => Promise<void>;

  /* Notification settings */
  notifyOnInstall: boolean;
  notifyOnUpdate: boolean;
  notifyOnLaunch: boolean;
  setNotifyOnInstall: (v: boolean) => void;
  setNotifyOnUpdate: (v: boolean) => void;
  setNotifyOnLaunch: (v: boolean) => void;

  /* Update settings */
  autoCheckUpdates: boolean;
  autoInstallUpdates: boolean;
  setAutoCheckUpdates: (v: boolean) => void;
  setAutoInstallUpdates: (v: boolean) => void;

  /* System */
  systemInfo: SystemInfo | null;
  gpuInfo: GpuInfo | null;
  systemStats: SystemStats | null;
  setSystemInfo: (info: SystemInfo) => void;
  setGpuInfo: (info: GpuInfo) => void;
  setSystemStats: (stats: SystemStats) => void;

  /* Search */
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  /* Init */
  initialized: boolean;
  initialize: () => Promise<void>;
}

export const useLauncherStore = create<LauncherState>((set, get) => ({
  /* ── Navigation ───────────────────────────────────────── */
  currentView: "dashboard",
  setView: (view) => set({ currentView: view, selectedAppId: view === "dashboard" ? null : get().selectedAppId }),
  selectedAppId: null,
  selectApp: (id) => set({ selectedAppId: id, currentView: "app-detail" }),

  /* ── Applications ─────────────────────────────────────── */
  apps: APP_REGISTRY,
  runningApps: new Set(),
  runningPids: new Map(),

  installApp: async (id) => {
    const app = get().apps.find((a) => a.id === id);
    if (!app) return false;

    // Create persistent notification for install progress
    const notifId = get().addNotification({
      type: "install",
      title: `Installing ${app.name}`,
      message: "Starting installation…",
      appId: app.id,
      progress: 0,
      persistent: true,
    });

    try {
      // Mark as installing in the UI
      set((s) => ({
        apps: s.apps.map((a) =>
          a.id === id ? { ...a, installing: true, installProgress: "Starting…", installProgressPercent: 0 } : a
        ),
      }));

      const result = await window.electronAPI?.installApp({
        appId: app.id,
        repoUrl: app.repoUrl,
        name: app.name,
      });

      if (result?.installed) {
        set((s) => ({
          apps: s.apps.map((a) =>
            a.id === id
              ? {
                  ...a,
                  installed: true,
                  installing: false,
                  installProgress: undefined,
                  installProgressPercent: undefined,
                  installPath: result.installPath,
                  sourcePath: result.installPath,
                }
              : a
          ),
        }));
        // Update notification to complete
        get().updateNotificationProgress(notifId, 100, `${app.name} installed successfully`);
        get().addNotification({
          type: "install",
          title: `${app.name} Installed`,
          message: "Installation completed successfully.",
          appId: app.id,
        });
        // Refresh metadata now that the app is installed
        await get().refreshAppMeta(id);
        return true;
      }
      // Reset installing state on failure
      set((s) => ({
        apps: s.apps.map((a) =>
          a.id === id ? { ...a, installing: false, installProgress: undefined, installProgressPercent: undefined } : a
        ),
      }));
      get().updateNotificationProgress(notifId, -1, `Failed to install ${app.name}`);
      return false;
    } catch (err) {
      console.error("Failed to install app:", err);
      set((s) => ({
        apps: s.apps.map((a) =>
          a.id === id ? { ...a, installing: false, installProgress: undefined, installProgressPercent: undefined } : a
        ),
      }));
      get().updateNotificationProgress(notifId, -1, `Error installing ${app.name}`);
      return false;
    }
  },

  checkInstallStatus: async () => {
    const installDir = get().installDir;
    const updates: Record<string, Partial<AppDefinition>> = {};

    await Promise.all(
      get().apps.map(async (app) => {
        // Check the install directory for this app
        const appPath = app.installPath || app.sourcePath;
        const defaultPath = installDir ? `${installDir}\\${app.id}` : null;
        const pathToCheck = appPath || defaultPath;

        if (pathToCheck) {
          try {
            const exists = await window.electronAPI?.checkInstalled(pathToCheck);
            if (exists) {
              updates[app.id] = {
                installed: true,
                installPath: pathToCheck,
                sourcePath: pathToCheck,
              };
            }
          } catch { /* ignore */ }
        }
      })
    );

    if (Object.keys(updates).length > 0) {
      set((s) => ({
        apps: s.apps.map((a) =>
          updates[a.id] ? { ...a, ...updates[a.id] } : a
        ),
      }));
    }
  },

  /* Install directory */
  installDir: "",
  setInstallDir: async (dir) => {
    await window.electronAPI?.setInstallDir(dir);
    set({ installDir: dir });
    // Re-check install status with new directory
    await get().checkInstallStatus();
  },

  /* Dependency management */
  outdatedPackages: {},
  updatingDeps: new Set(),

  checkOutdated: async (id) => {
    const app = get().apps.find((a) => a.id === id);
    if (!app) return;
    const appPath = app.installPath || app.sourcePath;
    if (!appPath) return;

    try {
      const result = await window.electronAPI?.checkOutdated(appPath);
      if (result && !result.error) {
        set((s) => ({
          outdatedPackages: { ...s.outdatedPackages, [id]: result.outdated },
        }));
      }
    } catch { /* ignore */ }
  },

  updateDeps: async (id) => {
    const app = get().apps.find((a) => a.id === id);
    if (!app) return false;
    const appPath = app.installPath || app.sourcePath;
    if (!appPath) return false;

    set((s) => {
      const next = new Set(s.updatingDeps);
      next.add(id);
      return { updatingDeps: next };
    });

    const notifId = get().addNotification({
      type: "update",
      title: `Updating ${app.name} dependencies`,
      message: "Running npm update…",
      appId: id,
      progress: 0,
      persistent: true,
    });

    try {
      const result = await window.electronAPI?.updateDeps(id, appPath);
      if (result?.success) {
        get().updateNotificationProgress(notifId, 100, `${app.name} dependencies updated`);
        get().addNotification({
          type: "update",
          title: `${app.name} Updated`,
          message: "Dependencies updated successfully.",
          appId: id,
        });
        // Re-check outdated
        await get().checkOutdated(id);

        set((s) => {
          const next = new Set(s.updatingDeps);
          next.delete(id);
          return { updatingDeps: next };
        });
        return true;
      }

      get().updateNotificationProgress(notifId, -1, `Failed to update ${app.name}`);
    } catch (err) {
      get().updateNotificationProgress(notifId, -1, `Error updating ${app.name}`);
    }

    set((s) => {
      const next = new Set(s.updatingDeps);
      next.delete(id);
      return { updatingDeps: next };
    });
    return false;
  },

  /* Appearance */
  theme: "dark" as "dark" | "light" | "grey",
  accentColor: "#7c5cfc",
  setTheme: (theme) => {
    set({ theme });
    applyTheme(theme, get().accentColor);
    window.electronAPI?.writeSettings({ theme });
  },
  setAccentColor: (color) => {
    set({ accentColor: color });
    applyTheme(get().theme, color);
    window.electronAPI?.writeSettings({ accentColor: color });
  },

  /* Language */
  language: "en" as Language,
  setLanguage: (lang) => {
    set({ language: lang });
    window.electronAPI?.writeSettings({ language: lang });
  },

  /* General settings (persisted) */
  startOnBoot: false,
  minimizeToTray: true,
  confirmLaunch: false,
  projectsDir: "",
  setStartOnBoot: (v) => {
    set({ startOnBoot: v });
    window.electronAPI?.writeSettings({ startOnBoot: v });
  },
  setMinimizeToTray: (v) => {
    set({ minimizeToTray: v });
    window.electronAPI?.writeSettings({ minimizeToTray: v });
  },
  setConfirmLaunch: (v) => {
    set({ confirmLaunch: v });
    window.electronAPI?.writeSettings({ confirmLaunch: v });
  },
  setProjectsDir: async (dir) => {
    set({ projectsDir: dir });
    await window.electronAPI?.writeSettings({ projectsDir: dir });
  },

  uninstallApp: async (id) => {
    const app = get().apps.find((a) => a.id === id);
    if (!app) return false;

    const notifId = get().addNotification({
      type: "uninstall",
      title: `Uninstalling ${app.name}`,
      message: "Removing files…",
      appId: app.id,
      progress: 0,
      persistent: true,
    });

    try {
      set((s) => ({
        apps: s.apps.map((a) =>
          a.id === id ? { ...a, uninstalling: true, uninstallProgress: "Removing files…" } : a
        ),
      }));

      const result = await window.electronAPI?.uninstallApp({
        appId: app.id,
        installPath: app.installPath || app.sourcePath,
      });

      if (result?.uninstalled) {
        set((s) => ({
          apps: s.apps.map((a) =>
            a.id === id
              ? {
                  ...a,
                  installed: false,
                  installing: false,
                  uninstalling: false,
                  uninstallProgress: undefined,
                  installPath: undefined,
                  sourcePath: undefined,
                  isRunning: false,
                }
              : a
          ),
        }));
        get().updateNotificationProgress(notifId, 100, `${app.name} uninstalled`);
        get().addNotification({
          type: "uninstall",
          title: `${app.name} Uninstalled`,
          message: "Successfully removed.",
          appId: app.id,
        });
        return true;
      }
      set((s) => ({
        apps: s.apps.map((a) =>
          a.id === id ? { ...a, uninstalling: false, uninstallProgress: undefined } : a
        ),
      }));
      get().updateNotificationProgress(notifId, -1, `Failed to uninstall ${app.name}`);
      return false;
    } catch (err) {
      console.error("Failed to uninstall app:", err);
      set((s) => ({
        apps: s.apps.map((a) =>
          a.id === id ? { ...a, uninstalling: false, uninstallProgress: undefined } : a
        ),
      }));
      get().updateNotificationProgress(notifId, -1, `Error uninstalling ${app.name}`);
      return false;
    }
  },

  launchApp: async (id) => {
    const app = get().apps.find((a) => a.id === id);
    if (!app) return;

    // Check maintenance mode
    if (app.maintenanceMode) {
      get().addNotification({
        type: "error",
        title: `${app.name} Under Maintenance`,
        message: app.maintenanceMessage || "This application is currently under maintenance.",
        appId: app.id,
      });
      return;
    }

    try {
      // Show launching indicator
      set((s) => ({
        apps: s.apps.map((a) =>
          a.id === id ? { ...a, isLaunching: true } : a
        ),
      }));

      // Check if the app is installed before launching
      const appPath = app.sourcePath || app.installPath || app.executablePath || "";
      if (appPath) {
        const exists = await window.electronAPI?.checkInstalled(appPath);
        if (!exists) {
          console.error(`App not installed at: ${appPath}`);
          set((s) => ({
            apps: s.apps.map((a) =>
              a.id === id ? { ...a, installed: false, isLaunching: false } : a
            ),
          }));
          return;
        }
      }

      const launchConfig = {
        executablePath: app.sourcePath || app.executablePath || "",
        args: app.launchArgs || [],
        launchScript: app.launchScript,
      };

      const result = await window.electronAPI?.launchApp(launchConfig);

      set((s) => {
        const running = new Set(s.runningApps);
        running.add(id);
        const pids = new Map(s.runningPids);
        if (result?.pid) {
          pids.set(id, result.pid);
        }
        const apps = s.apps.map((a) =>
          a.id === id ? { ...a, lastLaunched: Date.now(), isRunning: true, isLaunching: false } : a
        );
        return { runningApps: running, runningPids: pids, apps };
      });

      if (get().notifyOnLaunch) {
        get().addNotification({
          type: "launch",
          title: `${app.name} Launched`,
          message: "Application is now running.",
          appId: app.id,
        });
      }
    } catch (err) {
      console.error("Failed to launch app:", err);
      set((s) => ({
        apps: s.apps.map((a) =>
          a.id === id ? { ...a, isLaunching: false } : a
        ),
      }));
      get().addNotification({
        type: "error",
        title: `Failed to Launch ${app.name}`,
        message: String(err),
        appId: app.id,
      });
    }
  },
  stopApp: async (id) => {
    const pids = get().runningPids;
    const pid = pids.get(id);
    if (pid) {
      try {
        await window.electronAPI?.killProcess(pid);
      } catch { /* best effort */ }
    }
    set((s) => {
      const running = new Set(s.runningApps);
      running.delete(id);
      const newPids = new Map(s.runningPids);
      newPids.delete(id);
      const apps = s.apps.map((a) =>
        a.id === id ? { ...a, isRunning: false } : a
      );
      return { runningApps: running, runningPids: newPids, apps };
    });
  },

  refreshAppMeta: async (id) => {
    const appsToRefresh = id
      ? get().apps.filter((a) => a.id === id)
      : get().apps.filter((a) => a.sourcePath);

    const updates: Record<string, Partial<AppDefinition>> = {};

    await Promise.all(
      appsToRefresh.map(async (app) => {
        if (!app.sourcePath) return;
        try {
          const [meta, changelog] = await Promise.all([
            window.electronAPI?.getProjectMeta(app.sourcePath),
            window.electronAPI?.getChangelog(app.sourcePath, 50),
          ]);

          const patch: Partial<AppDefinition> = {};
          if (meta?.version && meta.version !== app.version) {
            patch.version = meta.version;
            // Add to availableVersions if not already there
            if (!app.availableVersions.includes(meta.version)) {
              patch.availableVersions = [...app.availableVersions, meta.version];
            }
          }
          if (changelog && changelog.length > 0) {
            patch.changelog = changelog as ChangelogEntry[];
          }
          if (Object.keys(patch).length > 0) {
            updates[app.id] = patch;
          }
        } catch { /* skip */ }
      })
    );

    if (Object.keys(updates).length > 0) {
      set((s) => ({
        apps: s.apps.map((a) =>
          updates[a.id] ? { ...a, ...updates[a.id] } : a
        ),
      }));
    }
  },

  bumpAppVersion: async (id, bumpType) => {
    const app = get().apps.find((a) => a.id === id);
    if (!app?.sourcePath) return null;

    try {
      const result = await window.electronAPI?.bumpVersion(app.sourcePath, bumpType);
      if (result?.newVersion) {
        // Refresh metadata to pick up the new version + changelog
        await get().refreshAppMeta(id);
        return result.newVersion;
      }
      return null;
    } catch (err) {
      console.error("Failed to bump version:", err);
      return null;
    }
  },

  /* ── Projects ─────────────────────────────────────────── */
  projects: [],
  addProject: (project) => {
    const newProject = {
      ...project,
      id: uuidv4(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    set((s) => {
      const projects = [...s.projects, newProject];
      window.electronAPI?.writeData("projects", projects);
      return { projects };
    });
  },
  removeProject: (id) =>
    set((s) => {
      const projects = s.projects.filter((p) => p.id !== id);
      window.electronAPI?.writeData("projects", projects);
      return { projects };
    }),
  updateProject: (id, data) =>
    set((s) => {
      const projects = s.projects.map((p) =>
        p.id === id ? { ...p, ...data, updatedAt: Date.now() } : p
      );
      window.electronAPI?.writeData("projects", projects);
      return { projects };
    }),

  /* ── Profiles ─────────────────────────────────────────── */
  profiles: [
    {
      id: "video-prod",
      name: "Video Production",
      description: "Full video editing toolchain with effects and audio",
      icon: "Film",
      color: "#e879f9",
      apps: [{ appId: "cuttamaran", version: "0.1.0", plugins: ["ct-transitions"], autoLaunch: true }],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: "dev",
      name: "Development",
      description: "Software development environment",
      icon: "Code",
      color: "#4ade80",
      apps: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: "design",
      name: "Design",
      description: "UI/UX design and graphics toolchain",
      icon: "Palette",
      color: "#60a5fa",
      apps: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ],
  activeProfileId: "video-prod",
  setActiveProfile: (id) => {
    set({ activeProfileId: id });
    window.electronAPI?.writeSettings({ activeProfileId: id });
  },
  addProfile: (profile) => {
    const newProfile = {
      ...profile,
      id: uuidv4(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    set((s) => {
      const profiles = [...s.profiles, newProfile];
      window.electronAPI?.writeData("profiles", profiles);
      return { profiles };
    });
  },
  removeProfile: (id) =>
    set((s) => {
      const profiles = s.profiles.filter((p) => p.id !== id);
      window.electronAPI?.writeData("profiles", profiles);
      // If we removed the active profile, clear selection
      const activeProfileId = s.activeProfileId === id ? null : s.activeProfileId;
      if (activeProfileId !== s.activeProfileId) {
        window.electronAPI?.writeSettings({ activeProfileId });
      }
      return { profiles, activeProfileId };
    }),

  /* ── Notifications ────────────────────────────────────── */
  notifications: [],
  addNotification: (n) => {
    const id = uuidv4();
    const notification: LauncherNotification = {
      ...n,
      id,
      timestamp: Date.now(),
      read: false,
    };
    set((s) => ({
      notifications: [notification, ...s.notifications].slice(0, 100),
    }));
    return id;
  },
  dismissNotification: (id) =>
    set((s) => ({
      notifications: s.notifications.filter((n) => n.id !== id),
    })),
  markNotificationRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  clearAllNotifications: () => set({ notifications: [] }),
  updateNotificationProgress: (id, progress, message) =>
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id
          ? {
              ...n,
              progress: progress >= 0 ? progress : undefined,
              message: message ?? n.message,
              persistent: progress < 100 && progress >= 0,
            }
          : n
      ),
    })),

  /* ── License Keys ─────────────────────────────────────── */
  activateLicense: async (appId, key) => {
    try {
      const result = await window.electronAPI?.validateLicenseKey(appId, key);
      if (result?.valid) {
        set((s) => ({
          apps: s.apps.map((a) =>
            a.id === appId ? { ...a, licenseKey: key, licenseStatus: "valid" } : a
          ),
        }));
        await window.electronAPI?.writeSettings({ [`license_${appId}`]: key });
        get().addNotification({
          type: "license",
          title: "License Activated",
          message: `License key for ${get().apps.find((a) => a.id === appId)?.name ?? appId} activated successfully.`,
          appId,
        });
        return true;
      }
      set((s) => ({
        apps: s.apps.map((a) =>
          a.id === appId ? { ...a, licenseStatus: "invalid" } : a
        ),
      }));
      return false;
    } catch {
      return false;
    }
  },

  /* ── Admin: Version Deployments ───────────────────────── */
  versionDeployments: [],
  deployVersion: async (appId, version) => {
    try {
      const result = await window.electronAPI?.deployVersion(appId, version);
      if (result?.deployed) {
        const deployment: VersionDeployment = {
          appId,
          version,
          deployedAt: Date.now(),
          deployedBy: "admin",
          isActive: true,
        };
        set((s) => ({
          versionDeployments: [
            ...s.versionDeployments.map((d) =>
              d.appId === appId ? { ...d, isActive: false } : d
            ),
            deployment,
          ],
          apps: s.apps.map((a) =>
            a.id === appId ? { ...a, deployedVersion: version } : a
          ),
        }));
        await window.electronAPI?.writeData("versionDeployments", get().versionDeployments);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
  rollbackVersion: async (appId) => {
    try {
      const result = await window.electronAPI?.rollbackVersion(appId);
      if (result?.rolledBack && result.newVersion) {
        set((s) => ({
          apps: s.apps.map((a) =>
            a.id === appId ? { ...a, deployedVersion: result.newVersion, version: result.newVersion! } : a
          ),
        }));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
  setMaintenanceMode: async (appId, enabled, message) => {
    try {
      await window.electronAPI?.setMaintenanceMode(appId, enabled, message);
      set((s) => ({
        apps: s.apps.map((a) =>
          a.id === appId ? { ...a, maintenanceMode: enabled, maintenanceMessage: message } : a
        ),
      }));
    } catch { /* ignore */ }
  },

  /* ── Admin: Users ─────────────────────────────────────── */
  users: [],
  loadUsers: async () => {
    try {
      const users = await window.electronAPI?.getUsers();
      if (users) set({ users });
    } catch { /* ignore */ }
  },
  addUser: async (userData) => {
    try {
      const user = await window.electronAPI?.addUser(userData);
      if (user) {
        set((s) => ({ users: [...s.users, user] }));
      }
    } catch { /* ignore */ }
  },
  removeUser: async (userId) => {
    try {
      const ok = await window.electronAPI?.removeUser(userId);
      if (ok) {
        set((s) => ({ users: s.users.filter((u) => u.id !== userId) }));
      }
    } catch { /* ignore */ }
  },
  updateUserRole: async (userId, role) => {
    try {
      const ok = await window.electronAPI?.updateUserRole(userId, role);
      if (ok) {
        set((s) => ({
          users: s.users.map((u) =>
            u.id === userId ? { ...u, role } : u
          ),
        }));
      }
    } catch { /* ignore */ }
  },

  /* ── Notification Settings ────────────────────────────── */
  notifyOnInstall: true,
  notifyOnUpdate: true,
  notifyOnLaunch: false,
  setNotifyOnInstall: (v) => {
    set({ notifyOnInstall: v });
    window.electronAPI?.writeSettings({ notifyOnInstall: v });
  },
  setNotifyOnUpdate: (v) => {
    set({ notifyOnUpdate: v });
    window.electronAPI?.writeSettings({ notifyOnUpdate: v });
  },
  setNotifyOnLaunch: (v) => {
    set({ notifyOnLaunch: v });
    window.electronAPI?.writeSettings({ notifyOnLaunch: v });
  },

  /* ── Update Settings ──────────────────────────────────── */
  autoCheckUpdates: true,
  autoInstallUpdates: false,
  setAutoCheckUpdates: (v) => {
    set({ autoCheckUpdates: v });
    window.electronAPI?.writeSettings({ autoCheckUpdates: v });
  },
  setAutoInstallUpdates: (v) => {
    set({ autoInstallUpdates: v });
    window.electronAPI?.writeSettings({ autoInstallUpdates: v });
  },

  /* ── System ───────────────────────────────────────────── */
  systemInfo: null,
  gpuInfo: null,
  systemStats: null,
  setSystemInfo: (info) => set({ systemInfo: info }),
  setGpuInfo: (info) => set({ gpuInfo: info }),
  setSystemStats: (stats) => set({ systemStats: stats }),

  /* ── Search ───────────────────────────────────────────── */
  searchQuery: "",
  setSearchQuery: (q) => set({ searchQuery: q }),

  /* ── Initialization ───────────────────────────────────── */
  initialized: false,
  initialize: async () => {
    if (get().initialized) return;

    // Load persisted data
    try {
      const projects = (await window.electronAPI?.readData("projects")) as Project[] | null;
      if (projects) set({ projects });
    } catch { /* first run */ }

    // Load persisted profiles
    try {
      const profiles = (await window.electronAPI?.readData("profiles")) as EnvironmentProfile[] | null;
      if (profiles && profiles.length > 0) set({ profiles });
    } catch { /* first run */ }

    // Hydrate install directory
    try {
      const installDir = await window.electronAPI?.getInstallDir();
      if (installDir) set({ installDir: installDir as string });
    } catch { /* browser mode */ }

    // Hydrate theme/accent + general settings
    try {
      const settings = await window.electronAPI?.readSettings();
      if (settings) {
        const theme = (settings.theme as "dark" | "light" | "grey") || "dark";
        const accentColor = (settings.accentColor as string) || "#7c5cfc";
        set({
          theme,
          accentColor,
          language: (settings.language as Language) || "en",
          startOnBoot: settings.startOnBoot as boolean ?? false,
          minimizeToTray: settings.minimizeToTray as boolean ?? true,
          confirmLaunch: settings.confirmLaunch as boolean ?? false,
          projectsDir: (settings.projectsDir as string) || "",
          activeProfileId: (settings.activeProfileId as string) || get().activeProfileId,
          notifyOnInstall: settings.notifyOnInstall as boolean ?? true,
          notifyOnUpdate: settings.notifyOnUpdate as boolean ?? true,
          notifyOnLaunch: settings.notifyOnLaunch as boolean ?? false,
          autoCheckUpdates: settings.autoCheckUpdates as boolean ?? true,
          autoInstallUpdates: settings.autoInstallUpdates as boolean ?? false,
        });
        applyTheme(theme, accentColor);
      }
    } catch { /* browser mode */ }

    // Check which apps are actually installed on disk
    try {
      await get().checkInstallStatus();
    } catch { /* browser mode */ }

    // System info
    try {
      const info = await window.electronAPI?.getSystemInfo();
      if (info) set({ systemInfo: info });
      const gpu = await window.electronAPI?.getGpuInfo();
      if (gpu) set({ gpuInfo: gpu });
    } catch { /* browser mode */ }

    // Hydrate live versions + changelogs from project source directories
    try {
      await get().refreshAppMeta();
    } catch { /* browser mode */ }

    // Subscribe to install progress events from main process
    try {
      window.electronAPI?.onInstallProgress(({ appId, stage, detail, percent }) => {
        set((s) => ({
          apps: s.apps.map((a) =>
            a.id === appId ? { ...a, installProgress: detail, installProgressPercent: percent } : a
          ),
        }));
        // Update matching notification
        const notif = get().notifications.find(
          (n) => n.appId === appId && n.type === "install" && n.persistent
        );
        if (notif && percent !== undefined) {
          get().updateNotificationProgress(notif.id, percent, detail);
        }
      });
    } catch { /* browser mode */ }

    // Load version deployments
    try {
      const deployments = (await window.electronAPI?.readData("versionDeployments")) as VersionDeployment[] | null;
      if (deployments) set({ versionDeployments: deployments });
    } catch { /* first run */ }

    // Load users
    try {
      await get().loadUsers();
    } catch { /* browser mode */ }

    set({ initialized: true });
  },
}));
