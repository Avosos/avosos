const {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  shell,
  nativeImage,
} = require("electron");
const path = require("path");
const { spawn, exec } = require("child_process");
const fs = require("fs");
const os = require("os");

const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;
let mainWindow = null;

// ─── Data directory for launcher state ─────────────────────
const dataDir = path.join(app.getPath("userData"), "avosos-data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

function getIconPath() {
  if (process.platform === "win32")
    return path.join(__dirname, "../public/icon.ico");
  return path.join(__dirname, "../public/icon.png");
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 600,
    frame: false,
    titleBarStyle: "hidden",
    backgroundColor: "#08080d",
    show: false,
    center: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true,
    },
    icon: getIconPath(),
  });

  mainWindow.once("ready-to-show", () => mainWindow.show());

  if (isDev) {
    const devUrl = process.env.ELECTRON_DEV_URL || "http://localhost:3100";
    mainWindow.loadURL(devUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../out/index.html"));
  }

  mainWindow.webContents.setWindowOpenHandler(({ url: linkUrl }) => {
    if (linkUrl.startsWith("http")) shell.openExternal(linkUrl);
    return { action: "deny" };
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// ─── Window controls ──────────────────────────────────────
ipcMain.handle("window:minimize", () => mainWindow?.minimize());
ipcMain.handle("window:maximize", () => {
  if (mainWindow?.isMaximized()) mainWindow.unmaximize();
  else mainWindow?.maximize();
});
ipcMain.handle("window:close", () => mainWindow?.close());
ipcMain.handle("window:isMaximized", () => mainWindow?.isMaximized() ?? false);

// Notify renderer of maximize state changes
app.on("browser-window-created", (_, win) => {
  const update = () =>
    win.webContents.send("window:maximized", win.isMaximized());
  win.on("maximize", update);
  win.on("unmaximize", update);
});

// ─── System info ──────────────────────────────────────────
ipcMain.handle("system:info", () => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  return {
    platform: os.platform(),
    arch: os.arch(),
    hostname: os.hostname(),
    cpu: cpus[0]?.model ?? "Unknown",
    cpuCores: cpus.length,
    totalMemory: totalMem,
    freeMemory: freeMem,
    usedMemory: totalMem - freeMem,
    uptime: os.uptime(),
  };
});

// ─── System resource polling ──────────────────────────────
let monitorInterval = null;

ipcMain.handle("system:startMonitor", () => {
  if (monitorInterval) return;
  monitorInterval = setInterval(() => {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const cpus = os.cpus();

    // Calculate CPU usage
    let totalIdle = 0;
    let totalTick = 0;
    for (const cpu of cpus) {
      for (const type in cpu.times) totalTick += cpu.times[type];
      totalIdle += cpu.times.idle;
    }
    const cpuUsage = Math.round(
      ((totalTick - totalIdle) / totalTick) * 100
    );

    mainWindow?.webContents.send("system:stats", {
      cpuUsage,
      totalMemory: totalMem,
      freeMemory: freeMem,
      usedMemory: totalMem - freeMem,
      memoryUsage: Math.round(((totalMem - freeMem) / totalMem) * 100),
      timestamp: Date.now(),
    });
  }, 2000);
});

ipcMain.handle("system:stopMonitor", () => {
  if (monitorInterval) {
    clearInterval(monitorInterval);
    monitorInterval = null;
  }
});

// ─── Launch external applications ─────────────────────────
ipcMain.handle("app:launch", async (_event, config) => {
  const { executablePath, args = [], cwd } = config;

  // If it's a directory with Cargo.toml, try running the compiled binary directly
  if (fs.existsSync(path.join(executablePath, "Cargo.toml"))) {
    // Determine binary name from the directory name (Cargo convention)
    const projectName = path.basename(executablePath);
    const binaryExt = process.platform === "win32" ? ".exe" : "";
    const releaseBin = path.join(executablePath, "target", "release", projectName + binaryExt);
    const debugBin = path.join(executablePath, "target", "debug", projectName + binaryExt);

    // Prefer running the prebuilt binary directly (much faster, no shell issues)
    const binaryPath = fs.existsSync(releaseBin) ? releaseBin : fs.existsSync(debugBin) ? debugBin : null;

    if (binaryPath) {
      const child = spawn(binaryPath, [], {
        cwd: executablePath,
        stdio: "ignore",
        windowsHide: true,
      });
      child.unref();
      return { pid: child.pid, launched: true };
    }

    // Fallback: build and run via cargo (for first-time launch)
    const cmd = process.platform === "win32" ? "cargo.cmd" : "cargo";
    const cmdArgs = args.length > 0 ? args : ["run", "--release"];

    const child = spawn(cmd, cmdArgs, {
      cwd: executablePath,
      stdio: "ignore",
      shell: true,
      windowsHide: true,
    });
    child.unref();

    return { pid: child.pid, launched: true };
  }

  // If it's a directory with package.json, try electron dev
  if (
    fs.existsSync(path.join(executablePath, "package.json"))
  ) {
    const pkgPath = path.join(executablePath, "package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

    // Check for electron scripts
    const scripts = pkg.scripts || {};
    let cmd, cmdArgs;

    if (scripts["dev:electron"]) {
      cmd = process.platform === "win32" ? "npm.cmd" : "npm";
      cmdArgs = ["run", "dev:electron"];
    } else if (scripts.start) {
      cmd = process.platform === "win32" ? "npm.cmd" : "npm";
      cmdArgs = ["run", "start"];
    } else if (pkg.main) {
      cmd = "electron";
      cmdArgs = ["."];
    } else {
      throw new Error("No launch configuration found for this application");
    }

    const child = spawn(cmd, cmdArgs, {
      cwd: executablePath,
      stdio: "ignore",
      shell: true,
      windowsHide: true,
    });
    child.unref();

    return { pid: child.pid, launched: true };
  }

  // Direct executable
  if (fs.existsSync(executablePath)) {
    const child = spawn(executablePath, args, {
      cwd: cwd || path.dirname(executablePath),
      stdio: "ignore",
      windowsHide: true,
    });
    child.unref();
    return { pid: child.pid, launched: true };
  }

  throw new Error(`Application not found: ${executablePath}`);
});

// ─── Read project metadata (version, description) ─────────
ipcMain.handle("app:getProjectMeta", async (_event, sourcePath) => {
  const meta = { version: null, description: null, name: null };

  // Try package.json first
  const pkgPath = path.join(sourcePath, "package.json");
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
      meta.version = pkg.version || null;
      meta.description = pkg.description || null;
      meta.name = pkg.name || null;
    } catch { /* ignore */ }
  }

  // Try Cargo.toml (Rust projects)
  const cargoPath = path.join(sourcePath, "Cargo.toml");
  if (fs.existsSync(cargoPath)) {
    try {
      const content = fs.readFileSync(cargoPath, "utf-8");
      const versionMatch = content.match(/^version\s*=\s*"([^"]+)"/m);
      const descMatch = content.match(/^description\s*=\s*"([^"]+)"/m);
      const nameMatch = content.match(/^name\s*=\s*"([^"]+)"/m);
      if (versionMatch) meta.version = versionMatch[1];
      if (descMatch) meta.description = descMatch[1];
      if (nameMatch) meta.name = nameMatch[1];
    } catch { /* ignore */ }
  }

  return meta;
});

// ─── Read git changelog from a project ────────────────────
ipcMain.handle("app:getChangelog", async (_event, sourcePath, maxEntries = 50) => {
  return new Promise((resolve) => {
    // Check if it's a git repo
    if (!fs.existsSync(path.join(sourcePath, ".git"))) {
      return resolve([]);
    }

    const gitCmd = `git log --pretty=format:"%H|||%h|||%an|||%ae|||%aI|||%s|||%b###END###" -n ${maxEntries}`;
    exec(gitCmd, { cwd: sourcePath, maxBuffer: 1024 * 1024 }, (err, stdout) => {
      if (err) return resolve([]);

      const entries = stdout
        .split("###END###")
        .filter((s) => s.trim())
        .map((raw) => {
          const parts = raw.trim().split("|||");
          if (parts.length < 6) return null;
          const [hash, shortHash, author, email, date, subject, body] = parts;

          // Parse conventional commit type
          const typeMatch = subject.match(
            /^(feat|fix|refactor|docs|style|perf|test|chore|build|ci|revert)(?:\(([^)]*)\))?(!)?:\s*(.+)/
          );

          return {
            hash,
            shortHash,
            author,
            email,
            date,
            subject,
            body: (body || "").trim(),
            type: typeMatch ? typeMatch[1] : "other",
            scope: typeMatch ? typeMatch[2] || null : null,
            breaking: typeMatch ? !!typeMatch[3] : false,
            message: typeMatch ? typeMatch[4] : subject,
          };
        })
        .filter(Boolean);

      resolve(entries);
    });
  });
});

// ─── Version bump for a project ───────────────────────────
ipcMain.handle("app:bumpVersion", async (_event, sourcePath, bumpType) => {
  // bumpType: "major" | "minor" | "patch"
  const bump = (current) => {
    const parts = current.split(".").map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return null;
    if (bumpType === "major") return `${parts[0] + 1}.0.0`;
    if (bumpType === "minor") return `${parts[0]}.${parts[1] + 1}.0`;
    if (bumpType === "patch") return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
    return null;
  };

  let oldVersion = null;
  let newVersion = null;
  const filesUpdated = [];

  // Bump package.json
  const pkgPath = path.join(sourcePath, "package.json");
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
      oldVersion = pkg.version;
      newVersion = bump(pkg.version);
      if (newVersion) {
        pkg.version = newVersion;
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
        filesUpdated.push("package.json");
      }
    } catch { /* ignore */ }
  }

  // Bump Cargo.toml
  const cargoPath = path.join(sourcePath, "Cargo.toml");
  if (fs.existsSync(cargoPath)) {
    try {
      let content = fs.readFileSync(cargoPath, "utf-8");
      const match = content.match(/^(version\s*=\s*")([^"]+)(")/m);
      if (match) {
        oldVersion = oldVersion || match[2];
        newVersion = newVersion || bump(match[2]);
        if (newVersion) {
          content = content.replace(
            /^(version\s*=\s*")([^"]+)(")/m,
            `$1${newVersion}$3`
          );
          fs.writeFileSync(cargoPath, content);
          filesUpdated.push("Cargo.toml");
        }
      }
    } catch { /* ignore */ }
  }

  if (!newVersion) {
    throw new Error("Could not determine version to bump");
  }

  return { oldVersion, newVersion, filesUpdated };
});

// ─── Check if a path exists ───────────────────────────────
ipcMain.handle("fs:exists", (_event, filePath) => {
  return fs.existsSync(filePath);
});

// ─── Read launcher data ───────────────────────────────────
ipcMain.handle("data:read", (_event, key) => {
  const filePath = path.join(dataDir, `${key}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
});

ipcMain.handle("data:write", (_event, key, value) => {
  const filePath = path.join(dataDir, `${key}.json`);
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
  return true;
});

// ─── Open external links ──────────────────────────────────
ipcMain.handle("shell:openExternal", (_event, url) => {
  shell.openExternal(url);
});

ipcMain.handle("shell:openPath", (_event, filePath) => {
  shell.openPath(filePath);
});

// ─── File dialogs ─────────────────────────────────────────
ipcMain.handle("dialog:openFolder", async (_event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
    ...options,
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle("dialog:openFile", async (_event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openFile"],
    ...options,
  });
  return result.canceled ? null : result.filePaths[0];
});

// ─── GPU info (Windows) ───────────────────────────────────
ipcMain.handle("system:gpu", () => {
  return new Promise((resolve) => {
    if (process.platform === "win32") {
      exec(
        'wmic path win32_VideoController get Name,AdapterRAM /format:list',
        (err, stdout) => {
          if (err) return resolve({ name: "Unknown", vram: 0 });
          const nameMatch = stdout.match(/Name=(.+)/);
          const vramMatch = stdout.match(/AdapterRAM=(\d+)/);
          resolve({
            name: nameMatch ? nameMatch[1].trim() : "Unknown",
            vram: vramMatch ? parseInt(vramMatch[1]) : 0,
          });
        }
      );
    } else {
      resolve({ name: "Unknown", vram: 0 });
    }
  });
});

// ─── App lifecycle ────────────────────────────────────────
app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
