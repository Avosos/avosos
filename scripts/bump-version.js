#!/usr/bin/env node
// ============================================================================
// bump-version.js — Universal version bump for Avosos-managed projects
// ============================================================================
//
// Usage:
//   node scripts/bump-version.js <project-path> <major|minor|patch|auto>
//
// Supports:
//   - package.json (Node.js / Electron projects)
//   - Cargo.toml   (Rust projects)
//
// Both files are updated if they exist in the same project.
// After bumping, a git commit + tag is created automatically if the project
// is inside a git repository.
//
// "auto" mode analyzes conventional commits since the last version tag and
// picks the appropriate bump:
//   - BREAKING CHANGE / feat!:  → major
//   - feat:                     → minor
//   - fix, chore, docs, …       → patch
//
// Examples:
//   node scripts/bump-version.js ../cuttamaran patch
//   node scripts/bump-version.js ../voician minor
//   node scripts/bump-version.js ../cuttamaran auto
//   node scripts/bump-version.js . patch
// ============================================================================

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// ─── Parse args ───────────────────────────────────────────
const [,, rawPath, rawBumpType] = process.argv;

if (!rawPath || !["major", "minor", "patch", "auto"].includes(rawBumpType)) {
  console.error("\nUsage: node scripts/bump-version.js <project-path> <major|minor|patch|auto>\n");
  console.error("Examples:");
  console.error("  node scripts/bump-version.js ../cuttamaran patch");
  console.error("  node scripts/bump-version.js ../voician minor");
  console.error("  node scripts/bump-version.js ../cuttamaran auto");
  process.exit(1);
}

const projectPath = path.resolve(rawPath);

if (!fs.existsSync(projectPath)) {
  console.error(`\n  Error: path does not exist: ${projectPath}\n`);
  process.exit(1);
}

// ─── Helpers ──────────────────────────────────────────────
function bumpVersion(version, type) {
  const parts = version.split(".").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  if (type === "major") return `${parts[0] + 1}.0.0`;
  if (type === "minor") return `${parts[0]}.${parts[1] + 1}.0`;
  return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
}

function isGitRepo(dir) {
  return fs.existsSync(path.join(dir, ".git"));
}

function git(cmd, cwd) {
  return execSync(cmd, { cwd, stdio: "pipe", encoding: "utf-8" }).trim();
}

/**
 * Analyze conventional commits since the last tag and return
 * the appropriate bump type: "major", "minor", or "patch".
 */
function detectBumpType(projectDir) {
  if (!isGitRepo(projectDir)) {
    console.log("  ℹ No git repo — defaulting to patch");
    return "patch";
  }

  // Find the latest semver tag reachable from HEAD
  let lastTag = null;
  try {
    lastTag = git("git describe --tags --abbrev=0 --match=\"v*\"", projectDir);
  } catch {
    // No tags yet
  }

  // Get commit subjects since last tag (or all commits if no tag)
  let logCmd = "git log --pretty=format:%s";
  if (lastTag) {
    logCmd += ` ${lastTag}..HEAD`;
    console.log(`  ℹ Analysing commits since ${lastTag}`);
  } else {
    console.log("  ℹ No previous tag found — analysing all commits");
  }

  let subjects = [];
  try {
    const raw = git(logCmd, projectDir);
    subjects = raw ? raw.split("\n") : [];
  } catch {
    return "patch";
  }

  if (subjects.length === 0) {
    console.log("  ℹ No new commits — defaulting to patch");
    return "patch";
  }

  console.log(`  ℹ Found ${subjects.length} commit(s) to analyse`);

  let hasMajor = false;
  let hasMinor = false;

  const BREAKING_RE = /^\w+(?:\(.+\))?!:|BREAKING[ -]CHANGE/i;
  const FEAT_RE = /^feat(?:\(.+\))?[!:]|^feature(?:\(.+\))?[!:]/i;

  for (const subject of subjects) {
    if (BREAKING_RE.test(subject)) {
      hasMajor = true;
      break; // Can't go higher
    }
    if (FEAT_RE.test(subject)) {
      hasMinor = true;
    }
  }

  const result = hasMajor ? "major" : hasMinor ? "minor" : "patch";
  console.log(`  ℹ Detected bump type: ${result}`);
  return result;
}

// ─── Resolve bump type ───────────────────────────────────
const bumpType = rawBumpType === "auto" ? detectBumpType(projectPath) : rawBumpType;

// ─── Detect current version ──────────────────────────────
let currentVersion = null;
const filesUpdated = [];

// package.json
const pkgPath = path.join(projectPath, "package.json");
if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  currentVersion = pkg.version;
}

// Cargo.toml
const cargoPath = path.join(projectPath, "Cargo.toml");
if (fs.existsSync(cargoPath)) {
  const content = fs.readFileSync(cargoPath, "utf-8");
  const match = content.match(/^version\s*=\s*"([^"]+)"/m);
  if (match) currentVersion = currentVersion || match[1];
}

if (!currentVersion) {
  console.error("\n  Error: could not find a version in package.json or Cargo.toml\n");
  process.exit(1);
}

const newVersion = bumpVersion(currentVersion, bumpType);
if (!newVersion) {
  console.error(`\n  Error: invalid version format: ${currentVersion}\n`);
  process.exit(1);
}

// ─── Apply bump ──────────────────────────────────────────
console.log(`\n  ${path.basename(projectPath)}: ${currentVersion} → ${newVersion} (${bumpType})\n`);

if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  pkg.version = newVersion;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  filesUpdated.push("package.json");
  console.log("  ✓ Updated package.json");
}

if (fs.existsSync(cargoPath)) {
  let content = fs.readFileSync(cargoPath, "utf-8");
  content = content.replace(/^(version\s*=\s*")([^"]+)(")/m, `$1${newVersion}$3`);
  fs.writeFileSync(cargoPath, content);
  filesUpdated.push("Cargo.toml");
  console.log("  ✓ Updated Cargo.toml");
}

// Also update Cargo.lock if it exists (cargo will do this, but for consistency)
const cargoLock = path.join(projectPath, "Cargo.lock");
if (fs.existsSync(cargoLock) && fs.existsSync(cargoPath)) {
  try {
    execSync("cargo check --quiet", { cwd: projectPath, stdio: "ignore" });
    console.log("  ✓ Updated Cargo.lock");
  } catch {
    // Not critical
  }
}

// ─── Git commit + tag ────────────────────────────────────
if (isGitRepo(projectPath)) {
  try {
    // Stage the updated files
    for (const f of filesUpdated) {
      git(`git add ${f}`, projectPath);
    }
    // Also stage Cargo.lock if it changed
    if (fs.existsSync(cargoLock)) {
      try { git("git add Cargo.lock", projectPath); } catch { /* ignore */ }
    }

    git(`git commit -m "chore: bump version to ${newVersion}"`, projectPath);
    console.log(`  ✓ Created commit: chore: bump version to ${newVersion}`);

    git(`git tag -a v${newVersion} -m "v${newVersion}"`, projectPath);
    console.log(`  ✓ Created tag: v${newVersion}`);
  } catch (err) {
    console.error(`  ⚠ Git operations failed: ${err.message}`);
  }
}

console.log(`\n  Done! ${path.basename(projectPath)} is now at v${newVersion}\n`);
