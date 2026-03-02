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

// ─── Install directory management ─────────────────────────
const settingsPath = path.join(dataDir, "settings.json");

function readSettings() {
  try {
    if (fs.existsSync(settingsPath)) {
      return JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
    }
  } catch { /* ignore */ }
  return {};
}

function writeSettings(settings) {
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
}

function getInstallDir() {
  const settings = readSettings();
  return settings.installDir || path.join(app.getPath("appData"), "avosos", "apps");
}

ipcMain.handle("settings:getInstallDir", () => {
  return getInstallDir();
});

ipcMain.handle("settings:setInstallDir", (_event, dirPath) => {
  const settings = readSettings();
  settings.installDir = dirPath;
  writeSettings(settings);
  return true;
});

// ─── Check if application is installed ────────────────────
ipcMain.handle("app:checkInstalled", (_event, appPath) => {
  if (!appPath) return false;
  return fs.existsSync(appPath);
});

// ─── Install application (download release archive) ───────
ipcMain.handle("app:install", async (_event, { appId, repoUrl, name }) => {
  const https = require("https");
  const { createWriteStream } = require("fs");
  const { pipeline } = require("stream/promises");

  const installDir = getInstallDir();
  if (!fs.existsSync(installDir)) fs.mkdirSync(installDir, { recursive: true });

  const appDir = path.join(installDir, appId);

  // If already exists, return early
  if (fs.existsSync(appDir)) {
    return { installed: true, installPath: appDir, alreadyExisted: true };
  }

  // Try to download latest release archive from GitHub
  if (repoUrl && repoUrl.includes("github.com")) {
    const repoPath = repoUrl.replace(/^https?:\/\/github\.com\//, "").replace(/\/$/, "");
    const apiUrl = `https://api.github.com/repos/${repoPath}/releases/latest`;

    try {
      // Fetch latest release info
      const releaseInfo = await new Promise((resolve, reject) => {
        const req = https.get(apiUrl, {
          headers: { "User-Agent": "Avosos-Launcher/0.1.0", Accept: "application/vnd.github+json" },
        }, (res) => {
          if (res.statusCode === 302 || res.statusCode === 301) {
            // follow redirect
            https.get(res.headers.location, { headers: { "User-Agent": "Avosos-Launcher/0.1.0" } }, (res2) => {
              let data = "";
              res2.on("data", (chunk) => (data += chunk));
              res2.on("end", () => resolve(JSON.parse(data)));
            }).on("error", reject);
            return;
          }
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            if (res.statusCode === 200) resolve(JSON.parse(data));
            else reject(new Error(`GitHub API returned ${res.statusCode}: ${data}`));
          });
        });
        req.on("error", reject);
      });

      // Look for a suitable archive asset
      const assets = releaseInfo.assets || [];
      const platformKey = process.platform === "win32" ? "win" : process.platform === "darwin" ? "mac" : "linux";
      const archiveAsset = assets.find(
        (a) => (a.name.includes(platformKey) || a.name.includes("x64") || a.name.includes("amd64")) &&
               (a.name.endsWith(".zip") || a.name.endsWith(".tar.gz"))
      ) || assets.find(
        (a) => a.name.endsWith(".zip") || a.name.endsWith(".tar.gz")
      );

      if (archiveAsset) {
        const archivePath = path.join(installDir, archiveAsset.name);
        // Download the asset
        await downloadFile(archiveAsset.browser_download_url, archivePath);

        // Extract
        fs.mkdirSync(appDir, { recursive: true });
        if (archiveAsset.name.endsWith(".zip")) {
          await extractZip(archivePath, appDir);
        }
        // Clean up archive
        try { fs.unlinkSync(archivePath); } catch { /* ignore */ }

        return { installed: true, installPath: appDir, method: "release" };
      }

      // If there's a source zip for the tag/release
      const tagName = releaseInfo.tag_name;
      if (tagName) {
        const zipUrl = `https://github.com/${repoPath}/archive/refs/tags/${tagName}.zip`;
        const archivePath = path.join(installDir, `${appId}-${tagName}.zip`);

        await downloadFile(zipUrl, archivePath);
        fs.mkdirSync(appDir, { recursive: true });
        await extractZip(archivePath, appDir);
        try { fs.unlinkSync(archivePath); } catch { /* ignore */ }

        return { installed: true, installPath: appDir, method: "source-release" };
      }
    } catch (err) {
      // Fall back to cloning via git if release download fails
      console.error("Release download failed, falling back to git clone:", err.message);
    }

    // Fallback: git clone
    try {
      const { execSync: ex } = require("child_process");
      ex(`git clone "${repoUrl}" "${appDir}"`, { stdio: "pipe", timeout: 120000 });
      return { installed: true, installPath: appDir, method: "git-clone" };
    } catch (cloneErr) {
      // Clean up partial clone
      try { fs.rmSync(appDir, { recursive: true, force: true }); } catch { /* ignore */ }
      throw new Error(`Failed to install ${name}: ${cloneErr.message}`);
    }
  }

  throw new Error(`Cannot install ${name}: no repository URL configured`);
});

// ─── Helper: download a file following redirects ──────────
function downloadFile(url, destPath) {
  const https = require("https");
  const http = require("http");
  return new Promise((resolve, reject) => {
    const doGet = (u) => {
      const mod = u.startsWith("https") ? https : http;
      mod.get(u, { headers: { "User-Agent": "Avosos-Launcher/0.1.0" } }, (res) => {
        if (res.statusCode === 302 || res.statusCode === 301) {
          return doGet(res.headers.location);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`Download failed: HTTP ${res.statusCode}`));
        }
        const file = fs.createWriteStream(destPath);
        res.pipe(file);
        file.on("finish", () => { file.close(); resolve(); });
        file.on("error", reject);
      }).on("error", reject);
    };
    doGet(url);
  });
}

// ─── Helper: extract zip file ─────────────────────────────
function extractZip(zipPath, destDir) {
  return new Promise((resolve, reject) => {
    // Use PowerShell on Windows to extract
    if (process.platform === "win32") {
      const cmd = `powershell -NoProfile -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${destDir}' -Force"`;
      exec(cmd, { timeout: 60000 }, (err) => {
        if (err) reject(err);
        else {
          // If the zip extracted into a single subfolder, move contents up
          flattenSingleSubdir(destDir);
          resolve();
        }
      });
    } else {
      exec(`unzip -o "${zipPath}" -d "${destDir}"`, { timeout: 60000 }, (err) => {
        if (err) reject(err);
        else {
          flattenSingleSubdir(destDir);
          resolve();
        }
      });
    }
  });
}

function flattenSingleSubdir(dir) {
  const entries = fs.readdirSync(dir);
  if (entries.length === 1) {
    const single = path.join(dir, entries[0]);
    if (fs.statSync(single).isDirectory()) {
      const subEntries = fs.readdirSync(single);
      for (const e of subEntries) {
        fs.renameSync(path.join(single, e), path.join(dir, e));
      }
      fs.rmdirSync(single);
    }
  }
}

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
ipcMain.handle("app:bumpVersion", async (_event, sourcePath, rawBumpType) => {
  // rawBumpType: "major" | "minor" | "patch" | "auto"

  // ── Auto-detect bump type from conventional commits ──
  let bumpType = rawBumpType;
  if (rawBumpType === "auto") {
    const { execSync: execSyncLocal } = require("child_process");
    const git = (cmd) => execSyncLocal(cmd, { cwd: sourcePath, stdio: "pipe", encoding: "utf-8" }).trim();

    let lastTag = null;
    try { lastTag = git('git describe --tags --abbrev=0 --match="v*"'); } catch { /* no tags */ }

    let subjects = [];
    try {
      const logCmd = lastTag
        ? `git log --pretty=format:%s ${lastTag}..HEAD`
        : "git log --pretty=format:%s";
      const raw = git(logCmd);
      subjects = raw ? raw.split("\n") : [];
    } catch { /* ignore */ }

    let hasMajor = false;
    let hasMinor = false;
    const BREAKING_RE = /^\w+(?:\(.+\))?!:|BREAKING[ -]CHANGE/i;
    const FEAT_RE = /^feat(?:\(.+\))?[!:]|^feature(?:\(.+\))?[!:]/i;
    for (const s of subjects) {
      if (BREAKING_RE.test(s)) { hasMajor = true; break; }
      if (FEAT_RE.test(s)) hasMinor = true;
    }
    bumpType = hasMajor ? "major" : hasMinor ? "minor" : "patch";
  }

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

  return { oldVersion, newVersion, filesUpdated, resolvedBumpType: bumpType };
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

// ═══════════════════════════════════════════════════════════
// ─── ADMIN IPC HANDLERS ───────────────────────────────────
// ═══════════════════════════════════════════════════════════

// ─── Detect installed runtimes ────────────────────────────
ipcMain.handle("admin:getRuntimes", async () => {
  const { execSync: ex } = require("child_process");
  const runtimes = [];

  const probe = (name, cmd) => {
    try {
      const version = ex(cmd, { stdio: "pipe", encoding: "utf-8", timeout: 5000 }).trim();
      const whichCmd = process.platform === "win32" ? `where ${name}` : `which ${name}`;
      let binPath = null;
      try { binPath = ex(whichCmd, { stdio: "pipe", encoding: "utf-8", timeout: 3000 }).trim().split("\n")[0]; } catch { /* ignore */ }
      runtimes.push({ name, version, path: binPath });
    } catch {
      runtimes.push({ name, version: null, path: null });
    }
  };

  probe("node", "node --version");
  probe("npm", "npm --version");
  probe("rust", "rustc --version");
  probe("cargo", "cargo --version");
  probe("python", "python --version");
  probe("git", "git --version");
  probe("docker", "docker --version");

  return runtimes;
});

// ─── Git status for a source path ─────────────────────────
ipcMain.handle("admin:getAppGitStatus", async (_event, sourcePath) => {
  const { execSync: ex } = require("child_process");
  const git = (cmd) => ex(cmd, { cwd: sourcePath, stdio: "pipe", encoding: "utf-8", timeout: 5000 }).trim();

  if (!fs.existsSync(path.join(sourcePath, ".git"))) {
    return { branch: null, dirty: false, lastCommit: null, ahead: 0, behind: 0 };
  }

  let branch = null;
  try { branch = git("git rev-parse --abbrev-ref HEAD"); } catch { /* ignore */ }

  let dirty = false;
  try { dirty = git("git status --porcelain").length > 0; } catch { /* ignore */ }

  let lastCommit = null;
  try { lastCommit = git("git log -1 --pretty=format:%s (%ar)"); } catch { /* ignore */ }

  let ahead = 0;
  let behind = 0;
  try {
    const tracking = git("git rev-parse --abbrev-ref @{u}");
    if (tracking) {
      const ab = git(`git rev-list --left-right --count HEAD...${tracking}`);
      const [a, b] = ab.split(/\s+/).map(Number);
      ahead = a || 0;
      behind = b || 0;
    }
  } catch { /* no upstream */ }

  return { branch, dirty, lastCommit, ahead, behind };
});

// ─── Clear launcher cache ─────────────────────────────────
ipcMain.handle("admin:clearCache", async () => {
  let cleared = 0;
  const cacheDir = path.join(app.getPath("userData"), "Cache");
  if (fs.existsSync(cacheDir)) {
    const files = fs.readdirSync(cacheDir);
    for (const f of files) {
      try { fs.unlinkSync(path.join(cacheDir, f)); cleared++; } catch { /* skip */ }
    }
  }
  const codeCacheDir = path.join(app.getPath("userData"), "Code Cache");
  if (fs.existsSync(codeCacheDir)) {
    const files = fs.readdirSync(codeCacheDir);
    for (const f of files) {
      try { fs.unlinkSync(path.join(codeCacheDir, f)); cleared++; } catch { /* skip */ }
    }
  }
  return { cleared };
});

// ─── Export launcher configuration ────────────────────────
ipcMain.handle("admin:exportConfig", async () => {
  const configFiles = {};
  const dataFiles = fs.readdirSync(dataDir).filter((f) => f.endsWith(".json"));
  for (const f of dataFiles) {
    try {
      configFiles[f] = JSON.parse(fs.readFileSync(path.join(dataDir, f), "utf-8"));
    } catch { /* skip corrupt files */ }
  }
  return JSON.stringify({ version: "1.0", exportedAt: new Date().toISOString(), data: configFiles }, null, 2);
});

// ─── Import launcher configuration ────────────────────────
ipcMain.handle("admin:importConfig", async (_event, json) => {
  try {
    const parsed = JSON.parse(json);
    if (!parsed.data || typeof parsed.data !== "object") return false;
    for (const [filename, content] of Object.entries(parsed.data)) {
      fs.writeFileSync(path.join(dataDir, filename), JSON.stringify(content, null, 2));
    }
    return true;
  } catch {
    return false;
  }
});

// ─── Launcher logs (in-memory ring buffer) ────────────────
const _launcherLogs = [];
const MAX_LOGS = 500;

function addLog(level, message) {
  _launcherLogs.push({ timestamp: Date.now(), level, message });
  if (_launcherLogs.length > MAX_LOGS) _launcherLogs.shift();
}

// Capture a few lifecycle events
app.on("ready", () => addLog("info", "Launcher started"));
app.on("before-quit", () => addLog("info", "Launcher shutting down"));

ipcMain.handle("admin:getLauncherLogs", () => {
  return [..._launcherLogs].reverse();
});

// ─── Scan a directory for projects ────────────────────────
ipcMain.handle("admin:scanDirectory", async (_event, dirPath) => {
  if (!fs.existsSync(dirPath)) return [];

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const projects = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith(".") || entry.name === "node_modules") continue;

    const fullPath = path.join(dirPath, entry.name);
    const hasPkgJson = fs.existsSync(path.join(fullPath, "package.json"));
    const hasCargoToml = fs.existsSync(path.join(fullPath, "Cargo.toml"));

    if (hasPkgJson || hasCargoToml) {
      projects.push({
        name: entry.name,
        path: fullPath,
        type: hasCargoToml ? "rust" : "node",
      });
    }
  }

  return projects;
});

// ─── App lifecycle ────────────────────────────────────────
app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
