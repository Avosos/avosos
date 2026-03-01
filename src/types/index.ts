/* ─── Registered Application ─────────────────────────────── */
export interface AppDefinition {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  vendor: string;
  version: string;
  availableVersions: string[];
  category: AppCategory;
  tags: string[];
  icon: string; // path or SVG inline
  headerImage?: string;
  installed: boolean;
  installPath?: string;
  sourcePath?: string; // source code path for dev apps
  repoUrl?: string;
  websiteUrl?: string;
  executablePath?: string;
  launchScript?: string;
  launchCommand?: string; // e.g. "cargo" for Rust apps
  launchArgs?: string[]; // e.g. ["run", "--release"]
  size?: string;
  lastLaunched?: number;
  lastUpdated?: number;
  plugins?: AppPlugin[];
  compatibility?: CompatibilityEntry[];
  resourceUsage?: ResourceUsage;
  isRunning?: boolean;
  pinnedVersion?: string;
  updateAvailable?: string;
  autoUpdate?: boolean;
}

export type AppCategory =
  | "video"
  | "design"
  | "development"
  | "audio"
  | "3d"
  | "utilities"
  | "productivity"
  | "ai";

export interface AppPlugin {
  id: string;
  name: string;
  version: string;
  installed: boolean;
  description?: string;
  appVersionConstraint?: string;
}

export interface CompatibilityEntry {
  appVersion: string;
  os: string[];
  minRam?: number;
  minGpu?: string;
  notes?: string;
}

export interface ResourceUsage {
  cpu: number; // percentage
  memory: number; // bytes
  gpu?: number; // percentage
  vram?: number; // bytes
}

/* ─── Projects ───────────────────────────────────────────── */
export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  path?: string;
  thumbnail?: string;
  requiredApps: ProjectAppRef[];
  environmentVars?: Record<string, string>;
  tags?: string[];
  profileId?: string;
}

export interface ProjectAppRef {
  appId: string;
  version?: string; // pinned version for this project
  plugins?: string[]; // plugin IDs required
}

/* ─── Environment Profiles ───────────────────────────────── */
export interface EnvironmentProfile {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  apps: ProfileAppConfig[];
  environmentVars?: Record<string, string>;
  systemConfig?: Record<string, unknown>;
  createdAt: number;
  updatedAt: number;
}

export interface ProfileAppConfig {
  appId: string;
  version: string;
  plugins: string[];
  autoLaunch?: boolean;
}

/* ─── System Stats ───────────────────────────────────────── */
export interface SystemStats {
  cpuUsage: number;
  totalMemory: number;
  freeMemory: number;
  usedMemory: number;
  memoryUsage: number;
  timestamp: number;
}

export interface SystemInfo {
  platform: string;
  arch: string;
  hostname: string;
  cpu: string;
  cpuCores: number;
  totalMemory: number;
  freeMemory: number;
  usedMemory: number;
  uptime: number;
}

export interface GpuInfo {
  name: string;
  vram: number;
}

/* ─── Navigation ─────────────────────────────────────────── */
export type NavView =
  | "dashboard"
  | "library"
  | "projects"
  | "profiles"
  | "settings"
  | "app-detail";

/* ─── Electron API ───────────────────────────────────────── */
declare global {
  interface Window {
    electronAPI?: {
      minimize: () => Promise<void>;
      maximize: () => Promise<void>;
      close: () => Promise<void>;
      isMaximized: () => Promise<boolean>;
      onMaximizedChange: (cb: (isMax: boolean) => void) => () => void;
      getSystemInfo: () => Promise<SystemInfo>;
      getGpuInfo: () => Promise<GpuInfo>;
      startMonitor: () => Promise<void>;
      stopMonitor: () => Promise<void>;
      onSystemStats: (cb: (stats: SystemStats) => void) => () => void;
      launchApp: (config: {
        executablePath: string;
        args?: string[];
        cwd?: string;
      }) => Promise<{ pid: number; launched: boolean }>;
      exists: (path: string) => Promise<boolean>;
      readData: (key: string) => Promise<unknown>;
      writeData: (key: string, value: unknown) => Promise<boolean>;
      openExternal: (url: string) => Promise<void>;
      openPath: (path: string) => Promise<void>;
      openFolderDialog: (options?: Record<string, unknown>) => Promise<string | null>;
      openFileDialog: (options?: Record<string, unknown>) => Promise<string | null>;
    };
  }
}
