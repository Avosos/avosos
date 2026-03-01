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

interface LauncherState {
  /* Navigation */
  currentView: NavView;
  setView: (view: NavView) => void;
  selectedAppId: string | null;
  selectApp: (id: string) => void;

  /* Applications */
  apps: AppDefinition[];
  runningApps: Set<string>;
  launchApp: (id: string) => Promise<void>;
  stopApp: (id: string) => void;
  refreshAppMeta: (id?: string) => Promise<void>;
  bumpAppVersion: (id: string, bumpType: "major" | "minor" | "patch") => Promise<string | null>;

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
  launchApp: async (id) => {
    const app = get().apps.find((a) => a.id === id);
    if (!app) return;

    try {
      const launchConfig = {
        executablePath: app.sourcePath || app.executablePath || "",
        args: app.launchArgs || [],
      };

      await window.electronAPI?.launchApp(launchConfig);

      set((s) => {
        const running = new Set(s.runningApps);
        running.add(id);
        // Update lastLaunched
        const apps = s.apps.map((a) =>
          a.id === id ? { ...a, lastLaunched: Date.now(), isRunning: true } : a
        );
        return { runningApps: running, apps };
      });
    } catch (err) {
      console.error("Failed to launch app:", err);
    }
  },
  stopApp: (id) =>
    set((s) => {
      const running = new Set(s.runningApps);
      running.delete(id);
      const apps = s.apps.map((a) =>
        a.id === id ? { ...a, isRunning: false } : a
      );
      return { runningApps: running, apps };
    }),

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
  addProject: (project) =>
    set((s) => ({
      projects: [
        ...s.projects,
        {
          ...project,
          id: uuidv4(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ],
    })),
  removeProject: (id) =>
    set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),
  updateProject: (id, data) =>
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id === id ? { ...p, ...data, updatedAt: Date.now() } : p
      ),
    })),

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
  setActiveProfile: (id) => set({ activeProfileId: id }),
  addProfile: (profile) =>
    set((s) => ({
      profiles: [
        ...s.profiles,
        {
          ...profile,
          id: uuidv4(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ],
    })),

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
