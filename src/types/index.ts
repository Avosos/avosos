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
  isLaunching?: boolean; // show starting-up indicator
  installing?: boolean;
  installProgress?: string; // human-readable progress detail
  installProgressPercent?: number; // 0-100 for progress bar
  uninstalling?: boolean;
  uninstallProgress?: string;
  pinnedVersion?: string;
  updateAvailable?: string;
  autoUpdate?: boolean;
  changelog?: ChangelogEntry[];
  licenseKey?: string;
  licenseStatus?: "none" | "valid" | "invalid" | "expired";
  requiresLicense?: boolean;
  deployedVersion?: string; // admin-controlled version that users should run
  maintenanceMode?: boolean; // admin can put app in maintenance
  maintenanceMessage?: string;
}

/* ─── Changelog ──────────────────────────────────────────── */
export interface ChangelogEntry {
  hash: string;
  shortHash: string;
  author: string;
  email: string;
  date: string;
  subject: string;
  body: string;
  type: string; // feat, fix, refactor, docs, style, perf, test, chore, other
  scope: string | null;
  breaking: boolean;
  message: string;
}

export type AppCategory =
  | "video"
  | "design"
  | "development"
  | "audio"
  | "3d"
  | "utilities"
  | "entertainment"
  | "productivity"
  | "writing"
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

/* ─── Admin ──────────────────────────────────────────────── */
export interface RuntimeInfo {
  name: string;
  version: string | null;
  path: string | null;
}

export interface AdminAppEntry {
  id: string;
  name: string;
  sourcePath?: string;
  version: string;
  installed: boolean;
  isRunning: boolean;
  hasGit: boolean;
  gitBranch: string | null;
  gitDirty: boolean;
  lastCommit: string | null;
}

export interface LauncherLogEntry {
  timestamp: number;
  level: "info" | "warn" | "error";
  message: string;
}

/* ─── Notifications ──────────────────────────────────────── */
export interface LauncherNotification {
  id: string;
  type: "install" | "uninstall" | "update" | "launch" | "error" | "info" | "license";
  title: string;
  message: string;
  appId?: string;
  progress?: number; // 0-100 for progress-type notifications
  timestamp: number;
  read: boolean;
  persistent?: boolean; // stays until dismissed (like Epic Games install bar)
}

/* ─── User / Admin Roles ─────────────────────────────────── */
export type UserRole = "admin" | "user";

export interface LauncherUser {
  id: string;
  username: string;
  email?: string;
  role: UserRole;
  createdAt: number;
  lastLogin?: number;
  isActive: boolean;
  avatar?: string;
}

/* ─── Version Deployment (Admin) ─────────────────────────── */
export interface VersionDeployment {
  appId: string;
  version: string;
  deployedAt: number;
  deployedBy: string;
  isActive: boolean;
  rollbackVersion?: string;
  notes?: string;
}

/* ─── Store Page ─────────────────────────────────────────── */
export interface StoreApp {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AppCategory;
  vendor: string;
  version: string;
  size?: string;
  rating?: number;
  downloads?: number;
  featured?: boolean;
  isOwned: boolean;
  requiresLicense: boolean;
  price?: string; // "Free" or price string
}

/* ─── Navigation ─────────────────────────────────────────── */
export type NavView =
  | "dashboard"
  | "library"
  | "projects"
  | "store"
  | "settings"
  | "admin"
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
        launchScript?: string;
      }) => Promise<{ pid: number; launched: boolean }>;
      checkInstalled: (appPath: string) => Promise<boolean>;
      installApp: (config: {
        appId: string;
        repoUrl?: string;
        name: string;
      }) => Promise<{ installed: boolean; installPath: string; method?: string; alreadyExisted?: boolean }>;
      uninstallApp: (config: {
        appId: string;
        installPath?: string;
      }) => Promise<{ uninstalled: boolean; path: string; reason?: string }>;
      getInstallDir: () => Promise<string>;
      setInstallDir: (dirPath: string) => Promise<boolean>;
      readSettings: () => Promise<Record<string, unknown>>;
      writeSettings: (patch: Record<string, unknown>) => Promise<boolean>;
      getProjectMeta: (sourcePath: string) => Promise<{
        version: string | null;
        description: string | null;
        name: string | null;
      }>;
      getChangelog: (sourcePath: string, maxEntries?: number) => Promise<ChangelogEntry[]>;
      bumpVersion: (sourcePath: string, bumpType: "major" | "minor" | "patch" | "auto") => Promise<{
        oldVersion: string;
        newVersion: string;
        filesUpdated: string[];
        resolvedBumpType: "major" | "minor" | "patch";
      }>;
      exists: (path: string) => Promise<boolean>;
      readData: (key: string) => Promise<unknown>;
      writeData: (key: string, value: unknown) => Promise<boolean>;
      openExternal: (url: string) => Promise<void>;
      openPath: (path: string) => Promise<void>;
      openFolderDialog: (options?: Record<string, unknown>) => Promise<string | null>;
      openFileDialog: (options?: Record<string, unknown>) => Promise<string | null>;

      // Admin
      getRuntimes: () => Promise<import("@/types").RuntimeInfo[]>;
      getAppGitStatus: (sourcePath: string) => Promise<{
        branch: string | null;
        dirty: boolean;
        lastCommit: string | null;
        ahead: number;
        behind: number;
      }>;
      clearCache: () => Promise<{ cleared: number }>;
      exportConfig: () => Promise<string>;
      importConfig: (json: string) => Promise<boolean>;
      getLauncherLogs: () => Promise<import("@/types").LauncherLogEntry[]>;
      scanDirectory: (dirPath: string) => Promise<{ name: string; path: string; type: "node" | "rust" | "unknown" }[]>;
      resetLauncher: () => Promise<{ reset: boolean; error?: string }>;
      getDiskInfo: () => Promise<{ total: number; free: number }>;
      getEnvVars: () => Promise<{ key: string; value: string }[]>;
      getStorageInfo: () => Promise<{ cacheSize: number; dataSize: number }>;
      getDataDir: () => Promise<string>;
      killProcess: (pid: number) => Promise<{ killed: boolean; error?: string }>;
      onInstallProgress: (callback: (data: { appId: string; stage: string; detail: string; percent?: number }) => void) => () => void;
      onUninstallProgress: (callback: (data: { appId: string; stage: string; detail: string }) => void) => () => void;

      // License
      validateLicenseKey: (appId: string, key: string) => Promise<{ valid: boolean; expiresAt?: number; message?: string }>;
      getLicenseStatus: (appId: string) => Promise<{ status: "none" | "valid" | "invalid" | "expired"; key?: string }>;

      // Version management (admin)
      getAvailableVersions: (appId: string) => Promise<string[]>;
      deployVersion: (appId: string, version: string) => Promise<{ deployed: boolean; error?: string }>;
      rollbackVersion: (appId: string) => Promise<{ rolledBack: boolean; newVersion?: string; error?: string }>;
      setMaintenanceMode: (appId: string, enabled: boolean, message?: string) => Promise<boolean>;

      // User management
      getUsers: () => Promise<import("@/types").LauncherUser[]>;
      addUser: (user: { username: string; email?: string; role: import("@/types").UserRole }) => Promise<import("@/types").LauncherUser>;
      removeUser: (userId: string) => Promise<boolean>;
      updateUserRole: (userId: string, role: import("@/types").UserRole) => Promise<boolean>;
    };
  }
}
