#!/usr/bin/env node
// ============================================================================
// bump-version.js — Universal version bump for Avosos-managed projects
// ============================================================================
//
// Usage:
//   node scripts/bump-version.js <project-path> <major|minor|patch>
//
// Supports:
//   - package.json (Node.js / Electron projects)
//   - Cargo.toml   (Rust projects)
//
// Both files are updated if they exist in the same project.
// After bumping, a git commit + tag is created automatically if the project
// is inside a git repository.
//
// Examples:
//   node scripts/bump-version.js ../cuttamaran patch
//   node scripts/bump-version.js ../voician minor
//   node scripts/bump-version.js . patch
// ============================================================================

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// ─── Parse args ───────────────────────────────────────────
const [,, rawPath, bumpType] = process.argv;

if (!rawPath || !["major", "minor", "patch"].includes(bumpType)) {
  console.error("\nUsage: node scripts/bump-version.js <project-path> <major|minor|patch>\n");
  console.error("Examples:");
  console.error("  node scripts/bump-version.js ../cuttamaran patch");
  console.error("  node scripts/bump-version.js ../voician minor");
  process.exit(1);
}

const projectPath = path.resolve(rawPath);

if (!fs.existsSync(projectPath)) {
  console.error(`\n  Error: path does not exist: ${projectPath}\n`);
  process.exit(1);
}

// ─── Helpers ──────────────────────────────────────────────
function bump(version) {
  const parts = version.split(".").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  if (bumpType === "major") return `${parts[0] + 1}.0.0`;
  if (bumpType === "minor") return `${parts[0]}.${parts[1] + 1}.0`;
  return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
}

function isGitRepo(dir) {
  return fs.existsSync(path.join(dir, ".git"));
}

function git(cmd, cwd) {
  return execSync(cmd, { cwd, stdio: "pipe", encoding: "utf-8" }).trim();
}

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

const newVersion = bump(currentVersion);
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
