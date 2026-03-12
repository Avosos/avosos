"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Play,
  ExternalLink,
  FolderOpen,
  Download,
  Trash2,
  Settings,
  Package,
  Clock,
  Shield,
  GitBranch,
  HardDrive,
  Check,
  AlertTriangle,
  Puzzle,
  RefreshCw,
  ChevronRight,
  History,
  ArrowUp,
  Tag,
  Zap,
  Bug,
  FileText,
  Wrench,
} from "lucide-react";
import { useLauncherStore } from "@/stores/launcher-store";
import { getTranslations } from "@/lib/i18n";
import { CATEGORY_META } from "@/lib/app-registry";
import AppIcon from "@/components/icons/app-icon";
import type { AppPlugin, ChangelogEntry } from "@/types";

type DetailTab = "overview" | "versions" | "plugins" | "compatibility" | "changelog" | "dependencies";

export default function AppDetailView() {
  const { selectedAppId, apps, setView, launchApp, installApp, uninstallApp, language } = useLauncherStore();
  const t = getTranslations(language);
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  const app = apps.find((a) => a.id === selectedAppId);
  if (!app) {
    return (
      <div style={{ padding: 32, color: "var(--text-muted)" }}>
        {t.appDetail.notFound}
      </div>
    );
  }

  const catMeta = CATEGORY_META[app.category];
  const version = selectedVersion ?? app.version;

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Back navigation + Hero */}
      <div style={{ flexShrink: 0 }}>
        {/* Hero */}
        <div
          style={{
            position: "relative",
            background: `linear-gradient(135deg, ${catMeta?.color}18, ${catMeta?.color}05)`,
            padding: "20px 32px 28px",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          {/* Back button */}
          <button
            className="btn-ghost"
            onClick={() => setView("library")}
            style={{
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: "var(--text-muted)",
            }}
          >
            <ArrowLeft size={14} />
            {t.appDetail.backToLibrary}
          </button>

          <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
            {/* Icon */}
            <div
              style={{
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }}
            >
              <AppIcon icon={app.icon} size={80} />
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                <h1
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    color: "var(--text-primary)",
                  }}
                >
                  {app.name}
                </h1>
                {app.isRunning && (
                  <span
                    className="badge"
                    style={{
                      background: "var(--success-muted)",
                      color: "var(--success)",
                      fontSize: 11,
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "var(--success)",
                      }}
                    />
                    Running
                  </span>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 10,
                }}
              >
                <span
                  className="badge"
                  style={{
                    background: catMeta?.color + "18",
                    color: catMeta?.color,
                  }}
                >
                  {catMeta?.label}
                </span>
                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  {t.appDetail.byVendor.replace("{vendor}", app.vendor)}
                </span>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  · v{app.version}
                </span>
                {app.size && (
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    · {app.size}
                  </span>
                )}
              </div>

              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                  maxWidth: 600,
                }}
              >
                {app.description}
              </p>
            </div>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                minWidth: 160,
              }}
            >
              <button
                className="btn-primary"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  padding: "10px 20px",
                  fontSize: 14,
                  opacity: app.installing ? 0.7 : 1,
                  cursor: app.installing ? "wait" : "pointer",
                }}
                disabled={app.installing}
                onClick={() => {
                  if (!app.installed && !app.installing) {
                    installApp(app.id);
                  } else if (app.installed) {
                    launchApp(app.id);
                  }
                }}
              >
                {app.installing ? (
                  <><Download size={15} /> {t.appDetail.installing}</>
                ) : !app.installed ? (
                  <><Download size={15} /> {t.appDetail.install}</>
                ) : (
                  <><Play size={15} fill="white" /> {app.isRunning ? t.appDetail.runningBtn : t.appDetail.launch}</>
                )}
              </button>

              {app.installing && app.installProgress && (
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--accent)",
                    padding: "8px 12px",
                    borderRadius: 8,
                    background: "var(--accent-muted)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    textAlign: "center",
                  }}
                  title={app.installProgress}
                >
                  {app.installProgress}
                </div>
              )}

              {app.repoUrl && (
                <button
                  className="btn-secondary"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={() =>
                    window.electronAPI?.openExternal(app.repoUrl!)
                  }
                >
                  <ExternalLink size={13} />
                  {t.appDetail.github}
                </button>
              )}

              {app.sourcePath && (
                <button
                  className="btn-secondary"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={() =>
                    window.electronAPI?.openPath(app.sourcePath!)
                  }
                >
                  <FolderOpen size={13} />
                  {t.appDetail.openSource}
                </button>
              )}

              {app.installed && (
                <button
                  className="btn-secondary"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    color: "var(--error)",
                    borderColor: "var(--error-muted)",
                  }}
                  onClick={() => {
                    if (confirm(t.appDetail.uninstallConfirm.replace("{name}", app.name))) {
                      uninstallApp(app.id);
                    }
                  }}
                >
                  <Trash2 size={13} />
                  {t.appDetail.uninstall}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 0,
            padding: "0 32px",
            borderBottom: "1px solid var(--border-subtle)",
            background: "var(--bg-secondary)",
          }}
        >
          {(
            [
              { id: "overview", label: t.appDetail.tabOverview, icon: Package },
              { id: "changelog", label: t.appDetail.tabChangelog, icon: History },
              { id: "versions", label: t.appDetail.tabVersions, icon: GitBranch },
              { id: "plugins", label: t.appDetail.tabPlugins, icon: Puzzle },
              { id: "dependencies", label: "Dependencies", icon: RefreshCw },
              { id: "compatibility", label: t.appDetail.tabCompatibility, icon: Shield },
            ] as const
          ).map((tab) => {
            const active = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "12px 20px",
                  border: "none",
                  borderBottom: active
                    ? "2px solid var(--accent)"
                    : "2px solid transparent",
                  background: "transparent",
                  color: active
                    ? "var(--text-primary)"
                    : "var(--text-muted)",
                  fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "all 0.15s",
                }}
              >
                <Icon size={14} />
                {tab.label}
                {tab.id === "plugins" && app.plugins && (
                  <span
                    style={{
                      fontSize: 10,
                      background: "var(--bg-hover)",
                      padding: "1px 6px",
                      borderRadius: 8,
                    }}
                  >
                    {app.plugins.length}
                  </span>
                )}
                {tab.id === "changelog" && app.changelog && app.changelog.length > 0 && (
                  <span
                    style={{
                      fontSize: 10,
                      background: "var(--bg-hover)",
                      padding: "1px 6px",
                      borderRadius: 8,
                    }}
                  >
                    {app.changelog.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div
        className="animate-fadeIn"
        style={{
          flex: 1,
          overflow: "auto",
          padding: "24px 32px 32px",
        }}
      >
        {activeTab === "overview" && <OverviewTab app={app} />}
        {activeTab === "changelog" && <ChangelogTab app={app} />}
        {activeTab === "versions" && (
          <VersionsTab
            app={app}
            selectedVersion={version}
            onSelectVersion={setSelectedVersion}
          />
        )}
        {activeTab === "plugins" && <PluginsTab app={app} />}
        {activeTab === "dependencies" && <DependenciesTab app={app} />}
        {activeTab === "compatibility" && <CompatibilityTab app={app} />}
      </div>
    </div>
  );
}

/* ─── Overview Tab ─────────────────────────────────────── */
function OverviewTab({ app }: { app: import("@/types").AppDefinition }) {
  const language = useLauncherStore(s => s.language);
  const t = getTranslations(language);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 300px",
        gap: 24,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Description */}
        <DetailSection title={t.appDetail.about}>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              lineHeight: 1.7,
            }}
          >
            {app.longDescription ?? app.description}
          </p>
        </DetailSection>

        {/* Tags */}
        <DetailSection title={t.appDetail.tags}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {app.tags.map((tag) => (
              <span
                key={tag}
                className="badge"
                style={{
                  background: "var(--bg-surface)",
                  color: "var(--text-secondary)",
                  padding: "4px 12px",
                  fontSize: 12,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </DetailSection>

        {/* Plugins summary */}
        {app.plugins && app.plugins.length > 0 && (
          <DetailSection title={t.appDetail.installedPlugins}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {app.plugins
                .filter((p) => p.installed)
                .map((p) => (
                  <div
                    key={p.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 12px",
                      borderRadius: 8,
                      background: "var(--bg-tertiary)",
                    }}
                  >
                    <Check
                      size={14}
                      style={{ color: "var(--success)" }}
                    />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>
                      {p.name}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--text-muted)",
                        marginLeft: "auto",
                      }}
                    >
                      v{p.version}
                    </span>
                  </div>
                ))}
            </div>
          </DetailSection>
        )}
      </div>

      {/* Sidebar info */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <InfoCard>
          <InfoRow icon={<Package size={13} />} label={t.appDetail.version} value={app.version} />
          <InfoRow icon={<HardDrive size={13} />} label={t.appDetail.size} value={app.size ?? "—"} />
          <InfoRow
            icon={<Clock size={13} />}
            label={t.appDetail.updated}
            value={
              app.lastUpdated
                ? new Date(app.lastUpdated).toLocaleDateString()
                : "—"
            }
          />
          <InfoRow
            icon={<GitBranch size={13} />}
            label={t.appDetail.tabVersions}
            value={t.appDetail.versionsAvailable.replace("{n}", String(app.availableVersions.length))}
          />
          <InfoRow
            icon={<Puzzle size={13} />}
            label={t.appDetail.tabPlugins}
            value={t.appDetail.pluginsTotal.replace("{n}", String(app.plugins?.length ?? 0))}
          />
        </InfoCard>

        <InfoCard>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>
            {t.appDetail.updateSettings}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{t.appDetail.autoUpdate}</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--text-muted)",
              }}
              title={t.appDetail.comingSoon}
            >
              {t.appDetail.comingSoon}
            </span>
          </div>
        </InfoCard>

        {app.sourcePath && (
          <InfoCard>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>
              {t.appDetail.sourceLocation}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                wordBreak: "break-all",
                lineHeight: 1.5,
              }}
            >
              {app.sourcePath}
            </div>
          </InfoCard>
        )}
      </div>
    </div>
  );
}

/* ─── Changelog Tab ────────────────────────────────────── */

const COMMIT_TYPE_CONFIG: Record<string, { label: string; color: string; icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }> }> = {
  feat: { label: "Feature", color: "#4ade80", icon: Zap },
  fix: { label: "Fix", color: "#f87171", icon: Bug },
  refactor: { label: "Refactor", color: "#a78bfa", icon: Wrench },
  docs: { label: "Docs", color: "#60a5fa", icon: FileText },
  perf: { label: "Perf", color: "#fbbf24", icon: Zap },
  chore: { label: "Chore", color: "#94a3b8", icon: Settings },
  style: { label: "Style", color: "#e879f9", icon: Package },
  test: { label: "Test", color: "#2dd4bf", icon: Shield },
  build: { label: "Build", color: "#fb923c", icon: Package },
  ci: { label: "CI", color: "#818cf8", icon: RefreshCw },
  revert: { label: "Revert", color: "#f43f5e", icon: RefreshCw },
  other: { label: "Commit", color: "#64748b", icon: GitBranch },
};

function ChangelogTab({ app }: { app: import("@/types").AppDefinition }) {
  const language = useLauncherStore(s => s.language);
  const t = getTranslations(language);
  const commitLabels: Record<string, string> = {
    feat: t.appDetail.commitFeature, fix: t.appDetail.commitFix, refactor: t.appDetail.commitRefactor,
    docs: t.appDetail.commitDocs, perf: t.appDetail.commitPerf, chore: t.appDetail.commitChore,
    style: t.appDetail.commitStyle, test: t.appDetail.commitTest, build: t.appDetail.commitBuild,
    ci: t.appDetail.commitCI, revert: t.appDetail.commitRevert, other: t.appDetail.commitGeneric,
  };
  const changelog = app.changelog ?? [];
  const [filter, setFilter] = useState<string | null>(null);

  const filtered = filter
    ? changelog.filter((e) => e.type === filter)
    : changelog;

  // Group by date
  const grouped = filtered.reduce<Record<string, ChangelogEntry[]>>(
    (acc, entry) => {
      const day = entry.date.split("T")[0];
      if (!acc[day]) acc[day] = [];
      acc[day].push(entry);
      return acc;
    },
    {}
  );

  // Count types for filter chips
  const typeCounts = changelog.reduce<Record<string, number>>((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>
          {t.appDetail.changelogTitle}
        </h3>
        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
          {t.appDetail.changelogDesc}
        </p>
      </div>

      {/* Filter chips */}
      {Object.keys(typeCounts).length > 1 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          <button
            className={filter === null ? "btn-primary" : "btn-secondary"}
            style={{ padding: "4px 12px", fontSize: 11 }}
            onClick={() => setFilter(null)}
          >
            All ({changelog.length})
          </button>
          {Object.entries(typeCounts)
            .sort(([, a], [, b]) => b - a)
            .map(([type, count]) => {
              const cfg = COMMIT_TYPE_CONFIG[type] || COMMIT_TYPE_CONFIG.other;
              return (
                <button
                  key={type}
                  className={filter === type ? "btn-primary" : "btn-secondary"}
                  style={{ padding: "4px 12px", fontSize: 11 }}
                  onClick={() => setFilter(filter === type ? null : type)}
                >
                  {commitLabels[type] ?? t.appDetail.commitGeneric} ({count})
                </button>
              );
            })}
        </div>
      )}

      {changelog.length === 0 ? (
        <div
          style={{
            padding: "40px 20px",
            textAlign: "center",
            color: "var(--text-muted)",
          }}
        >
          <History size={36} style={{ marginBottom: 12, opacity: 0.3 }} />
          <div style={{ fontSize: 14, fontWeight: 500 }}>{t.appDetail.noChangelog}</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>
            {t.appDetail.noChangelogHint}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {Object.entries(grouped).map(([date, entries]) => (
            <div key={date}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: 8,
                  paddingBottom: 6,
                  borderBottom: "1px solid var(--border-subtle)",
                }}
              >
                {new Date(date + "T00:00:00").toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {entries.map((entry) => {
                  const cfg = COMMIT_TYPE_CONFIG[entry.type] || COMMIT_TYPE_CONFIG.other;
                  const Icon = cfg.icon;
                  return (
                    <div
                      key={entry.hash}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        padding: "8px 12px",
                        borderRadius: 8,
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "var(--bg-hover)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      {/* Type badge */}
                      <span
                        className="badge"
                        style={{
                          background: cfg.color + "18",
                          color: cfg.color,
                          fontSize: 10,
                          minWidth: 64,
                          justifyContent: "center",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        <Icon size={10} />
                        {commitLabels[entry.type] ?? t.appDetail.commitGeneric}
                      </span>

                      {/* Message */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 13,
                            color: "var(--text-primary)",
                            fontWeight: entry.breaking ? 700 : 500,
                          }}
                        >
                          {entry.breaking && (
                            <span style={{ color: "#f43f5e", marginRight: 6 }}>
                              {t.appDetail.breaking}
                            </span>
                          )}
                          {entry.scope && (
                            <span
                              style={{
                                color: "var(--text-muted)",
                                fontWeight: 400,
                              }}
                            >
                              ({entry.scope}){" "}
                            </span>
                          )}
                          {entry.message}
                        </div>
                        {entry.body && (
                          <div
                            style={{
                              fontSize: 11,
                              color: "var(--text-muted)",
                              marginTop: 2,
                              lineHeight: 1.5,
                            }}
                          >
                            {entry.body}
                          </div>
                        )}
                      </div>

                      {/* Hash + author */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          flexShrink: 0,
                          gap: 2,
                        }}
                      >
                        <code
                          style={{
                            fontSize: 10,
                            color: "var(--text-muted)",
                            background: "var(--bg-surface)",
                            padding: "2px 6px",
                            borderRadius: 4,
                          }}
                        >
                          {entry.shortHash}
                        </code>
                        <span
                          style={{
                            fontSize: 10,
                            color: "var(--text-muted)",
                          }}
                        >
                          {entry.author}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Versions Tab ─────────────────────────────────────── */
function VersionsTab({
  app,
  selectedVersion,
  onSelectVersion,
}: {
  app: import("@/types").AppDefinition;
  selectedVersion: string;
  onSelectVersion: (v: string) => void;
}) {
  const { bumpAppVersion, launchApp, installApp, language } = useLauncherStore();
  const t = getTranslations(language);
  const [bumping, setBumping] = useState<string | null>(null);

  const handleBump = async (bumpType: "major" | "minor" | "patch" | "auto") => {
    if (!app.sourcePath || bumping) return;
    setBumping(bumpType);
    try {
      await bumpAppVersion(app.id, bumpType);
    } finally {
      setBumping(null);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>
          {t.appDetail.versionManagement}
        </h3>
        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
          {t.appDetail.versionManagementDesc}
        </p>
      </div>

      {/* Version bump controls */}
      {app.sourcePath && (
        <div
          className="card"
          style={{
            padding: 16,
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
              <Tag size={13} style={{ marginRight: 6, verticalAlign: "middle" }} />
              {t.appDetail.bumpVersion}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {t.appDetail.currentLabel} <strong style={{ color: "var(--text-primary)" }}>v{app.version}</strong>
              {" \u2014 "}{t.appDetail.bumpAutoDesc}
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {/* Auto-bump button */}
            <button
              className="btn-secondary"
              style={{
                padding: "6px 14px",
                fontSize: 11,
                borderColor: bumping === "auto" ? "var(--accent)" : undefined,
                opacity: bumping && bumping !== "auto" ? 0.5 : 1,
                background: bumping !== "auto" ? "var(--accent-muted)" : undefined,
              }}
              onClick={() => handleBump("auto")}
              disabled={!!bumping}
            >
              <Zap size={11} />
              {bumping === "auto" ? t.appDetail.detecting : t.appDetail.bumpAuto}
            </button>

            <div style={{ width: 1, background: "var(--border-subtle)", margin: "2px 4px" }} />

            {(["patch", "minor", "major"] as const).map((type) => {
              const colors: Record<string, string> = {
                patch: "var(--success)",
                minor: "var(--accent)",
                major: "#f97316",
              };
              return (
                <button
                  key={type}
                  className="btn-secondary"
                  style={{
                    padding: "6px 14px",
                    fontSize: 11,
                    borderColor: bumping === type ? colors[type] : undefined,
                    opacity: bumping && bumping !== type ? 0.5 : 1,
                  }}
                  onClick={() => handleBump(type)}
                  disabled={!!bumping}
                >
                  <ArrowUp size={11} />
                  {bumping === type ? t.appDetail.bumping : ({ patch: t.appDetail.bumpPatch, minor: t.appDetail.bumpMinor, major: t.appDetail.bumpMajor } as Record<string, string>)[type]}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[...app.availableVersions].reverse().map((v) => {
          const isCurrent = v === app.version;
          const isSelected = v === selectedVersion;
          return (
            <div
              key={v}
              onClick={() => onSelectVersion(v)}
              style={{
                padding: "14px 18px",
                borderRadius: 10,
                border: `1px solid ${
                  isSelected ? "var(--accent)" : "var(--border-subtle)"
                }`,
                background: isSelected
                  ? "var(--accent-muted)"
                  : "var(--bg-card)",
                display: "flex",
                alignItems: "center",
                gap: 16,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "var(--bg-surface)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <GitBranch size={18} style={{ color: "var(--text-muted)" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>v{v}</span>
                  {isCurrent && (
                    <span
                      className="badge"
                      style={{
                        background: "var(--success-muted)",
                        color: "var(--success)",
                      }}
                    >
                      {t.appDetail.current}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                  {isCurrent ? t.appDetail.currentlyInstalled : t.appDetail.availableForInstall}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {isCurrent ? (
                  <button className="btn-primary" style={{ padding: "6px 14px" }} onClick={() => launchApp(app.id)}>
                    <Play size={12} fill="white" />
                    {t.appDetail.launch}
                  </button>
                ) : (
                  <button className="btn-secondary" style={{ padding: "6px 14px" }} onClick={() => alert(t.appDetail.versionInstallHint)}>
                    <Download size={12} />
                    {t.appDetail.install}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Plugins Tab ──────────────────────────────────────── */
function PluginsTab({ app }: { app: import("@/types").AppDefinition }) {
  const language = useLauncherStore(s => s.language);
  const t = getTranslations(language);
  const plugins = app.plugins ?? [];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>
          {t.appDetail.pluginManagement}
        </h3>
        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
          {t.appDetail.pluginManagementDesc.replace("{name}", app.name)}
        </p>
      </div>

      {plugins.length === 0 ? (
        <div
          style={{
            padding: "40px 20px",
            textAlign: "center",
            color: "var(--text-muted)",
          }}
        >
          <Puzzle size={36} style={{ marginBottom: 12, opacity: 0.3 }} />
          <div style={{ fontSize: 14, fontWeight: 500 }}>{t.appDetail.noPlugins}</div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 12,
          }}
        >
          {plugins.map((plugin) => (
            <PluginCard key={plugin.id} plugin={plugin} appName={app.name} />
          ))}
        </div>
      )}
    </div>
  );
}

function PluginCard({
  plugin,
  appName,
}: {
  plugin: AppPlugin;
  appName: string;
}) {
  const language = useLauncherStore(s => s.language);
  const t = getTranslations(language);
  return (
    <div
      className="card"
      style={{
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: plugin.installed
              ? "var(--accent-muted)"
              : "var(--bg-surface)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Puzzle
            size={16}
            style={{
              color: plugin.installed
                ? "var(--accent)"
                : "var(--text-muted)",
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{plugin.name}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
            v{plugin.version}
          </div>
        </div>
        {plugin.installed && (
          <Check size={16} style={{ color: "var(--success)" }} />
        )}
      </div>

      {plugin.description && (
        <p
          style={{
            fontSize: 12,
            color: "var(--text-secondary)",
            lineHeight: 1.5,
          }}
        >
          {plugin.description}
        </p>
      )}

      <button
        className={plugin.installed ? "btn-secondary" : "btn-primary"}
        style={{ width: "100%", justifyContent: "center", padding: "7px 14px" }}
        onClick={() => alert(t.appDetail.pluginComingSoon.replace("{name}", appName))}
      >
        {plugin.installed ? (
          <>
            <Settings size={12} />
            {t.appDetail.manage}
          </>
        ) : (
          <>
            <Download size={12} />
            {t.appDetail.install}
          </>
        )}
      </button>
    </div>
  );
}

/* ─── Compatibility Tab ────────────────────────────────── */
function CompatibilityTab({ app }: { app: import("@/types").AppDefinition }) {
  const language = useLauncherStore(s => s.language);
  const t = getTranslations(language);
  const entries = app.compatibility ?? [];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>
          {t.appDetail.compatibilityMatrix}
        </h3>
        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
          {t.appDetail.compatibilityDesc}
        </p>
      </div>

      {entries.length === 0 ? (
        <div
          style={{
            padding: "40px 20px",
            textAlign: "center",
            color: "var(--text-muted)",
          }}
        >
          {t.appDetail.noCompatData}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {entries.map((entry, i) => (
            <div
              key={i}
              className="card"
              style={{ padding: "16px" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                <Shield size={14} style={{ color: "var(--accent)" }} />
                <span style={{ fontSize: 14, fontWeight: 600 }}>
                  v{entry.appVersion}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--text-muted)",
                      marginBottom: 4,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {t.appDetail.platforms}
                  </div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {entry.os.map((os) => (
                      <span
                        key={os}
                        className="badge"
                        style={{
                          background: "var(--bg-surface)",
                          color: "var(--text-secondary)",
                          fontSize: 11,
                        }}
                      >
                        {os === "win32" ? t.appDetail.windows : os === "darwin" ? t.appDetail.macos : t.appDetail.linux}
                      </span>
                    ))}
                  </div>
                </div>

                {entry.minRam && (
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "var(--text-muted)",
                        marginBottom: 4,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {t.appDetail.minRam}
                    </div>
                    <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                      {Math.round(entry.minRam / (1024 * 1024 * 1024))} GB
                    </span>
                  </div>
                )}

                {entry.notes && (
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "var(--text-muted)",
                        marginBottom: 4,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {t.appDetail.notes}
                    </div>
                    <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                      {entry.notes}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Shared Components ────────────────────────────────── */
function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: "var(--text-primary)",
          marginBottom: 10,
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

/* ─── Dependencies Tab ─────────────────────────────────── */
function DependenciesTab({ app }: { app: import("@/types").AppDefinition }) {
  const { checkOutdated, updateDeps, outdatedPackages, updatingDeps } = useLauncherStore();
  const [checked, setChecked] = React.useState(false);
  const [checking, setChecking] = React.useState(false);

  const outdated = outdatedPackages[app.id] ?? [];
  const isUpdating = updatingDeps.has(app.id);
  const isNodeApp = app.id !== "voician"; // Rust apps don't have npm deps
  const appPath = app.installPath || app.sourcePath;

  const handleCheck = async () => {
    setChecking(true);
    await checkOutdated(app.id);
    setChecking(false);
    setChecked(true);
  };

  const handleUpdate = async () => {
    await updateDeps(app.id);
  };

  if (!isNodeApp) {
    return (
      <div style={{ padding: 24, textAlign: "center", color: "var(--text-muted)" }}>
        <Wrench size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
        <div style={{ fontSize: 14, fontWeight: 500 }}>
          This is a Rust project — dependency management is handled via Cargo.
        </div>
      </div>
    );
  }

  if (!appPath) {
    return (
      <div style={{ padding: 24, textAlign: "center", color: "var(--text-muted)" }}>
        <AlertTriangle size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
        <div style={{ fontSize: 14, fontWeight: 500 }}>
          App is not installed. Install it first to manage dependencies.
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Actions bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 0",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <button
          className="btn btn-secondary"
          onClick={handleCheck}
          disabled={checking || isUpdating}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500,
            background: "var(--bg-surface)", border: "1px solid var(--border-default)",
            color: "var(--text-primary)", cursor: checking ? "wait" : "pointer",
          }}
        >
          <RefreshCw size={14} style={checking ? { animation: "spin 1s linear infinite" } : undefined} />
          {checking ? "Checking…" : "Check for Updates"}
        </button>

        {outdated.length > 0 && (
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500,
              background: "var(--accent)", border: "none",
              color: "#fff", cursor: isUpdating ? "wait" : "pointer",
            }}
          >
            <ArrowUp size={14} />
            {isUpdating ? "Updating…" : `Update ${outdated.length} package${outdated.length > 1 ? "s" : ""}`}
          </button>
        )}

        {checked && outdated.length === 0 && (
          <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--success)", fontSize: 13 }}>
            <Check size={14} /> All packages are up to date
          </span>
        )}
      </div>

      {/* Outdated packages list */}
      {outdated.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Header */}
          <div
            style={{
              display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 120px", gap: 12,
              padding: "8px 16px", fontSize: 11, fontWeight: 600,
              color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em",
            }}
          >
            <span>Package</span>
            <span>Current</span>
            <span>Wanted</span>
            <span>Latest</span>
            <span>Type</span>
          </div>

          {/* Rows */}
          {outdated.map((pkg) => {
            const isMajor = pkg.current.split(".")[0] !== pkg.latest.split(".")[0];
            return (
              <div
                key={pkg.name}
                style={{
                  display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 120px", gap: 12,
                  padding: "10px 16px", fontSize: 13,
                  background: "var(--bg-card)", borderRadius: 6,
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>
                  {pkg.name}
                </span>
                <span style={{ color: "var(--text-secondary)", fontFamily: "monospace", fontSize: 12 }}>
                  {pkg.current}
                </span>
                <span style={{ color: "var(--success)", fontFamily: "monospace", fontSize: 12 }}>
                  {pkg.wanted}
                </span>
                <span
                  style={{
                    color: isMajor ? "var(--warning)" : "var(--success)",
                    fontFamily: "monospace", fontSize: 12,
                  }}
                >
                  {pkg.latest}
                  {isMajor && " ⚠"}
                </span>
                <span
                  style={{
                    fontSize: 11, padding: "2px 8px", borderRadius: 4,
                    background: pkg.type === "devDependencies" ? "var(--info-muted)" : "var(--accent-muted)",
                    color: pkg.type === "devDependencies" ? "var(--info)" : "var(--accent)",
                    fontWeight: 500, textAlign: "center", alignSelf: "center",
                  }}
                >
                  {pkg.type === "devDependencies" ? "dev" : "prod"}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Info text */}
      <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6, padding: "8px 0" }}>
        <Package size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
        Click <strong>Check for Updates</strong> to scan for outdated npm packages.
        {" "}Packages flagged with ⚠ have a major version update available.
      </div>
    </div>
  );
}

function InfoCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="card"
      style={{
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {children}
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: "var(--text-muted)",
        }}
      >
        {icon}
        <span style={{ fontSize: 12 }}>{label}</span>
      </div>
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "var(--text-secondary)",
        }}
      >
        {value}
      </span>
    </div>
  );
}
