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
} from "@/types";
import { APP_REGISTRY } from "@/lib/app-registry";
import { v4 as uuidv4 } from "uuid";

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

function applyTheme(theme: "dark" | "light", accent: string) {
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

  /* Install directory */
  installDir: string;
  setInstallDir: (dir: string) => Promise<void>;

  /* Appearance */
  theme: "dark" | "light";
  accentColor: string;
  setTheme: (theme: "dark" | "light") => void;
  setAccentColor: (color: string) => void;

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

  /* Profiles */
  profiles: EnvironmentProfile[];
  activeProfileId: string | null;
  setActiveProfile: (id: string | null) => void;
  addProfile: (profile: Omit<EnvironmentProfile, "id" | "createdAt" | "updatedAt">) => void;
  removeProfile: (id: string) => void;

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

    try {
      // Mark as installing in the UI
      set((s) => ({
        apps: s.apps.map((a) =>
          a.id === id ? { ...a, installing: true } : a
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
                  installPath: result.installPath,
                  sourcePath: result.installPath,
                }
              : a
          ),
        }));
        // Refresh metadata now that the app is installed
        await get().refreshAppMeta(id);
        return true;
      }
      // Reset installing state on failure
      set((s) => ({
        apps: s.apps.map((a) =>
          a.id === id ? { ...a, installing: false } : a
        ),
      }));
      return false;
    } catch (err) {
      console.error("Failed to install app:", err);
      set((s) => ({
        apps: s.apps.map((a) =>
          a.id === id ? { ...a, installing: false } : a
        ),
      }));
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

  /* Appearance */
  theme: "dark" as "dark" | "light",
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

    try {
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
                  installPath: undefined,
                  sourcePath: undefined,
                  isRunning: false,
                }
              : a
          ),
        }));
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to uninstall app:", err);
      return false;
    }
  },

  launchApp: async (id) => {
    const app = get().apps.find((a) => a.id === id);
    if (!app) return;

    try {
      // Check if the app is installed before launching
      const appPath = app.sourcePath || app.installPath || app.executablePath || "";
      if (appPath) {
        const exists = await window.electronAPI?.checkInstalled(appPath);
        if (!exists) {
          console.error(`App not installed at: ${appPath}`);
          // Mark as not installed so UI can react
          set((s) => ({
            apps: s.apps.map((a) =>
              a.id === id ? { ...a, installed: false } : a
            ),
          }));
          return;
        }
      }

      const launchConfig = {
        executablePath: app.sourcePath || app.executablePath || "",
        args: app.launchArgs || [],
      };

      await window.electronAPI?.launchApp(launchConfig);

      set((s) => {
        const running = new Set(s.runningApps);
        running.add(id);
        const pids = new Map(s.runningPids);
        // Store PID if we got one back (future: parse from launchApp return)
        const apps = s.apps.map((a) =>
          a.id === id ? { ...a, lastLaunched: Date.now(), isRunning: true } : a
        );
        return { runningApps: running, runningPids: pids, apps };
      });
    } catch (err) {
      console.error("Failed to launch app:", err);
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
        const theme = (settings.theme as "dark" | "light") || "dark";
        const accentColor = (settings.accentColor as string) || "#7c5cfc";
        set({
          theme,
          accentColor,
          startOnBoot: settings.startOnBoot as boolean ?? false,
          minimizeToTray: settings.minimizeToTray as boolean ?? true,
          confirmLaunch: settings.confirmLaunch as boolean ?? false,
          projectsDir: (settings.projectsDir as string) || "",
          activeProfileId: (settings.activeProfileId as string) || get().activeProfileId,
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

    set({ initialized: true });
  },
}));
