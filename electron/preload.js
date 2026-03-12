const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // Window controls
  minimize: () => ipcRenderer.invoke("window:minimize"),
  maximize: () => ipcRenderer.invoke("window:maximize"),
  close: () => ipcRenderer.invoke("window:close"),
  isMaximized: () => ipcRenderer.invoke("window:isMaximized"),

  onMaximizedChange: (callback) => {
    const handler = (_event, isMaximized) => callback(isMaximized);
    ipcRenderer.on("window:maximized", handler);
    return () => ipcRenderer.removeListener("window:maximized", handler);
  },

  // System info
  getSystemInfo: () => ipcRenderer.invoke("system:info"),
  getGpuInfo: () => ipcRenderer.invoke("system:gpu"),
  startMonitor: () => ipcRenderer.invoke("system:startMonitor"),
  stopMonitor: () => ipcRenderer.invoke("system:stopMonitor"),
  onSystemStats: (callback) => {
    const handler = (_event, stats) => callback(stats);
    ipcRenderer.on("system:stats", handler);
    return () => ipcRenderer.removeListener("system:stats", handler);
  },

  // Application launching
  launchApp: (config) => ipcRenderer.invoke("app:launch", config),
  checkInstalled: (appPath) => ipcRenderer.invoke("app:checkInstalled", appPath),
  installApp: (config) => ipcRenderer.invoke("app:install", config),
  uninstallApp: (config) => ipcRenderer.invoke("app:uninstall", config),

  // Install progress events
  onInstallProgress: (callback) => {
    const handler = (_event, data) => callback(data);
    ipcRenderer.on("install:progress", handler);
    return () => ipcRenderer.removeListener("install:progress", handler);
  },

  // Install directory settings
  getInstallDir: () => ipcRenderer.invoke("settings:getInstallDir"),
  setInstallDir: (dirPath) => ipcRenderer.invoke("settings:setInstallDir", dirPath),

  // Settings (general key-value)
  readSettings: () => ipcRenderer.invoke("settings:read"),
  writeSettings: (patch) => ipcRenderer.invoke("settings:write", patch),

  // Project metadata & versioning
  getProjectMeta: (sourcePath) => ipcRenderer.invoke("app:getProjectMeta", sourcePath),
  getChangelog: (sourcePath, maxEntries) => ipcRenderer.invoke("app:getChangelog", sourcePath, maxEntries),
  bumpVersion: (sourcePath, bumpType) => ipcRenderer.invoke("app:bumpVersion", sourcePath, bumpType),

  // Filesystem
  exists: (path) => ipcRenderer.invoke("fs:exists", path),

  // Persistent data
  readData: (key) => ipcRenderer.invoke("data:read", key),
  writeData: (key, value) => ipcRenderer.invoke("data:write", key, value),

  // Shell
  openExternal: (url) => ipcRenderer.invoke("shell:openExternal", url),
  openPath: (path) => ipcRenderer.invoke("shell:openPath", path),

  // Dialogs
  openFolderDialog: (options) => ipcRenderer.invoke("dialog:openFolder", options),
  openFileDialog: (options) => ipcRenderer.invoke("dialog:openFile", options),

  // System extended
  getDiskInfo: () => ipcRenderer.invoke("system:disk"),
  getEnvVars: () => ipcRenderer.invoke("system:envVars"),
  getStorageInfo: () => ipcRenderer.invoke("system:storageInfo"),
  getDataDir: () => ipcRenderer.invoke("system:dataDir"),

  // Process management
  killProcess: (pid) => ipcRenderer.invoke("app:kill", pid),

  // Admin
  getRuntimes: () => ipcRenderer.invoke("admin:getRuntimes"),
  getAppGitStatus: (sourcePath) => ipcRenderer.invoke("admin:getAppGitStatus", sourcePath),
  clearCache: () => ipcRenderer.invoke("admin:clearCache"),
  exportConfig: () => ipcRenderer.invoke("admin:exportConfig"),
  importConfig: (json) => ipcRenderer.invoke("admin:importConfig", json),
  getLauncherLogs: () => ipcRenderer.invoke("admin:getLauncherLogs"),
  scanDirectory: (dirPath) => ipcRenderer.invoke("admin:scanDirectory", dirPath),
  resetLauncher: () => ipcRenderer.invoke("admin:resetLauncher"),

  // Uninstall progress events
  onUninstallProgress: (callback) => {
    const handler = (_event, data) => callback(data);
    ipcRenderer.on("uninstall:progress", handler);
    return () => ipcRenderer.removeListener("uninstall:progress", handler);
  },

  // License key management
  validateLicenseKey: (appId, key) => ipcRenderer.invoke("license:validate", appId, key),
  getLicenseStatus: (appId) => ipcRenderer.invoke("license:status", appId),

  // Version deployment (admin)
  getAvailableVersions: (appId) => ipcRenderer.invoke("version:available", appId),
  deployVersion: (appId, version) => ipcRenderer.invoke("version:deploy", appId, version),
  rollbackVersion: (appId) => ipcRenderer.invoke("version:rollback", appId),

  // Maintenance mode (admin)
  setMaintenanceMode: (appId, enabled, message) => ipcRenderer.invoke("admin:setMaintenance", appId, enabled, message),

  // User management (admin)
  getUsers: () => ipcRenderer.invoke("admin:getUsers"),
  addUser: (username, email, role) => ipcRenderer.invoke("admin:addUser", username, email, role),
  removeUser: (userId) => ipcRenderer.invoke("admin:removeUser", userId),
  updateUserRole: (userId, role) => ipcRenderer.invoke("admin:updateUserRole", userId, role),

  // Updates
  checkForUpdates: () => ipcRenderer.invoke("app:checkForUpdates"),

  // Dependency management
  checkOutdated: (appPath) => ipcRenderer.invoke("app:checkOutdated", { appPath }),
  updateDeps: (appId, appPath) => ipcRenderer.invoke("app:updateDeps", { appId, appPath }),
  auditFix: (appId, appPath) => ipcRenderer.invoke("app:auditFix", { appId, appPath }),
  installPackage: (pkgPath) => ipcRenderer.invoke("app:installPackage", { pkgPath }),

  onDepsProgress: (callback) => {
    const handler = (_event, data) => callback(data);
    ipcRenderer.on("deps:progress", handler);
    return () => ipcRenderer.removeListener("deps:progress", handler);
  },
});
