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
});
