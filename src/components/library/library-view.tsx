"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Grid3X3,
  List,
  Filter,
  Play,
  Download,
  ExternalLink,
  ChevronDown,
  Square,
  Loader,
  Trash2,
} from "lucide-react";
import { useLauncherStore } from "@/stores/launcher-store";
import { CATEGORY_META } from "@/lib/app-registry";
import AppIcon from "@/components/icons/app-icon";
import type { AppDefinition, AppCategory } from "@/types";

type ViewMode = "grid" | "list";
type FilterCategory = "all" | AppCategory;

export default function LibraryView() {
  const { apps, selectApp, launchApp, installApp, stopApp, uninstallApp, searchQuery, setSearchQuery } =
    useLauncherStore();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");
  const [filterState, setFilterState] = useState<"all" | "installed" | "available">("all");

  const filteredApps = useMemo(() => {
    let result = apps;
    if (filterCategory !== "all") {
      result = result.filter((a) => a.category === filterCategory);
    }
    if (filterState === "installed") {
      result = result.filter((a) => a.installed);
    }
    if (filterState === "available") {
      result = result.filter((a) => !a.installed);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)) ||
          a.vendor.toLowerCase().includes(q)
      );
    }
    return result;
  }, [apps, filterCategory, filterState, searchQuery]);

  const categories = useMemo(() => {
    const cats = new Set(apps.map((a) => a.category));
    return Array.from(cats);
  }, [apps]);

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "24px 32px 0",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "var(--text-primary)",
                marginBottom: 4,
              }}
            >
              Library
            </h1>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
              {apps.length} application{apps.length !== 1 ? "s" : ""} registered
              {" · "}
              {apps.filter((a) => a.installed).length} installed
            </p>
          </div>

          {/* View mode toggle */}
          <div
            style={{
              display: "flex",
              gap: 2,
              background: "var(--bg-tertiary)",
              borderRadius: 8,
              padding: 3,
            }}
          >
            <ViewToggle
              active={viewMode === "grid"}
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 size={14} />
            </ViewToggle>
            <ViewToggle
              active={viewMode === "list"}
              onClick={() => setViewMode("list")}
            >
              <List size={14} />
            </ViewToggle>
          </div>
        </div>

        {/* Filters bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
          }}
        >
          {/* Search */}
          <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
            <Search
              size={15}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
            />
            <input
              className="input"
              placeholder="Search applications…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: 36 }}
            />
          </div>

          {/* Category filter */}
          <div style={{ position: "relative" }}>
            <select
              value={filterCategory}
              onChange={(e) =>
                setFilterCategory(e.target.value as FilterCategory)
              }
              style={{
                appearance: "none",
                background: "var(--bg-tertiary)",
                border: "1px solid var(--border-default)",
                borderRadius: 8,
                padding: "8px 32px 8px 12px",
                color: "var(--text-primary)",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_META[cat]?.label ?? cat}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                color: "var(--text-muted)",
              }}
            />
          </div>

          {/* State filter */}
          <div
            style={{
              display: "flex",
              gap: 2,
              background: "var(--bg-tertiary)",
              borderRadius: 8,
              padding: 3,
            }}
          >
            {(["all", "installed", "available"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterState(s)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 6,
                  border: "none",
                  background:
                    filterState === s
                      ? "var(--bg-hover)"
                      : "transparent",
                  color:
                    filterState === s
                      ? "var(--text-primary)"
                      : "var(--text-muted)",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  textTransform: "capitalize",
                  transition: "all 0.15s",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* App grid/list */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "0 32px 32px",
        }}
      >
        {filteredApps.length === 0 ? (
          <EmptyState />
        ) : viewMode === "grid" ? (
          <div
            className="animate-fadeIn"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {filteredApps.map((app) => (
              <GridCard
                key={app.id}
                app={app}
                onLaunch={() => app.installed ? launchApp(app.id) : installApp(app.id)}
                onStop={() => stopApp(app.id)}
                onUninstall={() => uninstallApp(app.id)}
                onDetails={() => selectApp(app.id)}
              />
            ))}
          </div>
        ) : (
          <div className="animate-fadeIn" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filteredApps.map((app) => (
              <ListRow
                key={app.id}
                app={app}
                onLaunch={() => app.installed ? launchApp(app.id) : installApp(app.id)}
                onStop={() => stopApp(app.id)}
                onUninstall={() => uninstallApp(app.id)}
                onDetails={() => selectApp(app.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Grid Card ────────────────────────────────────────── */
function GridCard({
  app,
  onLaunch,
  onStop,
  onUninstall,
  onDetails,
}: {
  app: AppDefinition;
  onLaunch: () => void;
  onStop: () => void;
  onUninstall: () => void;
  onDetails: () => void;
}) {
  const catMeta = CATEGORY_META[app.category];

  return (
    <div
      className="card"
      style={{
        padding: 0,
        overflow: "hidden",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
      }}
      onClick={onDetails}
    >
      {/* Header banner */}
      <div
        style={{
          height: 80,
          background: `linear-gradient(135deg, ${catMeta?.color}22, ${catMeta?.color}08)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <AppIcon icon={app.icon} size={48} />
        {app.isLaunching && (
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "2px 8px",
              borderRadius: 12,
              background: "var(--accent-muted)",
              fontSize: 10,
              fontWeight: 600,
              color: "var(--accent)",
            }}
          >
            <Loader size={10} style={{ animation: "spin 1s linear infinite" }} />
            Starting…
          </div>
        )}
        {app.isRunning && !app.isLaunching && (
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "2px 8px",
              borderRadius: 12,
              background: "var(--success-muted)",
              fontSize: 10,
              fontWeight: 600,
              color: "var(--success)",
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
          </div>
        )}
        {app.uninstalling && (
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "2px 8px",
              borderRadius: 12,
              background: "var(--error-muted, rgba(239,68,68,0.12))",
              fontSize: 10,
              fontWeight: 600,
              color: "var(--error, #ef4444)",
            }}
          >
            <Loader size={10} style={{ animation: "spin 1s linear infinite" }} />
            Removing…
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "var(--text-primary)",
            }}
          >
            {app.name}
          </h3>
          {app.repoUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.electronAPI?.openExternal(app.repoUrl!);
              }}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: 2,
              }}
            >
              <ExternalLink size={13} />
            </button>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
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
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
            v{app.version}
          </span>
          <span style={{ fontSize: 11, color: "var(--text-dim)" }}>
            · {app.vendor}
          </span>
        </div>

        <p
          style={{
            fontSize: 12,
            color: "var(--text-secondary)",
            lineHeight: 1.5,
            flex: 1,
            marginBottom: 14,
          }}
        >
          {app.description}
        </p>

        {app.installing && (
          <div style={{ marginBottom: 8 }}>
            <div
              style={{
                fontSize: 11,
                color: "var(--accent)",
                marginBottom: 4,
                padding: "4px 0",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={app.installProgress ?? "Installing…"}
            >
              {app.installProgress ?? "Installing…"}
            </div>
            <div className="progress-bar" style={{ height: 4 }}>
              <div
                className="progress-bar-fill"
                style={{
                  width: `${app.installProgressPercent ?? 0}%`,
                  background: "var(--accent)",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>
        )}

        {app.uninstalling && (
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: "var(--error, #ef4444)", marginBottom: 4 }}>
              {app.uninstallProgress ?? "Removing…"}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 8 }}>
          {app.isRunning ? (
            <button
              className="btn-primary"
              style={{
                flex: 1,
                justifyContent: "center",
                padding: "8px 14px",
                background: "var(--error, #ef4444)",
              }}
              onClick={(e) => {
                e.stopPropagation();
                onStop();
              }}
            >
              <Square size={13} fill="white" /> Stop
            </button>
          ) : (
            <button
              className="btn-primary"
              style={{
                flex: 1,
                justifyContent: "center",
                padding: "8px 14px",
                opacity: app.installing || app.isLaunching || app.uninstalling ? 0.7 : 1,
                cursor: app.installing || app.isLaunching || app.uninstalling ? "wait" : "pointer",
              }}
              disabled={app.installing || app.isLaunching || app.uninstalling}
              onClick={(e) => {
                e.stopPropagation();
                onLaunch();
              }}
            >
              {app.installing ? (
                <><Download size={13} /> Installing…</>
              ) : app.isLaunching ? (
                <><Loader size={13} style={{ animation: "spin 1s linear infinite" }} /> Starting…</>
              ) : app.uninstalling ? (
                <><Loader size={13} style={{ animation: "spin 1s linear infinite" }} /> Removing…</>
              ) : !app.installed ? (
                <><Download size={13} /> Install</>
              ) : (
                <><Play size={13} fill="white" /> Launch</>
              )}
            </button>
          )}
          {app.installed && !app.isRunning && !app.installing && !app.uninstalling && (
            <button
              className="btn-secondary"
              style={{ padding: "8px 10px", color: "var(--error, #ef4444)" }}
              title="Uninstall"
              onClick={(e) => {
                e.stopPropagation();
                onUninstall();
              }}
            >
              <Trash2 size={13} />
            </button>
          )}
          <button
            className="btn-secondary"
            style={{ padding: "8px 14px" }}
            onClick={(e) => {
              e.stopPropagation();
              onDetails();
            }}
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── List Row ─────────────────────────────────────────── */
function ListRow({
  app,
  onLaunch,
  onStop,
  onUninstall,
  onDetails,
}: {
  app: AppDefinition;
  onLaunch: () => void;
  onStop: () => void;
  onUninstall: () => void;
  onDetails: () => void;
}) {
  const catMeta = CATEGORY_META[app.category];

  return (
    <div
      className="card"
      style={{
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        cursor: "pointer",
      }}
      onClick={onDetails}
    >
      <AppIcon icon={app.icon} size={36} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>{app.name}</span>
          <span
            className="badge"
            style={{
              background: catMeta?.color + "18",
              color: catMeta?.color,
            }}
          >
            {catMeta?.label}
          </span>
          {app.isRunning && (
            <span
              className="badge"
              style={{
                background: "var(--success-muted)",
                color: "var(--success)",
              }}
            >
              Running
            </span>
          )}
          {app.isLaunching && !app.isRunning && (
            <span
              className="badge"
              style={{
                background: "var(--accent-muted)",
                color: "var(--accent)",
              }}
            >
              <Loader size={10} style={{ animation: "spin 1s linear infinite" }} /> Starting…
            </span>
          )}
          {app.uninstalling && (
            <span
              className="badge"
              style={{
                background: "var(--error-muted, rgba(239,68,68,0.12))",
                color: "var(--error, #ef4444)",
              }}
            >
              Removing…
            </span>
          )}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "var(--text-secondary)",
            marginTop: 2,
          }}
        >
          {app.description}
        </div>
      </div>

      <div
        style={{
          fontSize: 11,
          color: "var(--text-muted)",
          whiteSpace: "nowrap",
        }}
      >
        v{app.version}
      </div>

      {app.installing && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 160 }}>
          <div style={{ flex: 1 }}>
            <div className="progress-bar" style={{ height: 4 }}>
              <div className="progress-bar-fill" style={{ width: `${app.installProgressPercent ?? 0}%`, background: "var(--accent)", transition: "width 0.3s ease" }} />
            </div>
          </div>
          <span style={{ fontSize: 10, color: "var(--accent)", whiteSpace: "nowrap" }}>
            {app.installProgressPercent ?? 0}%
          </span>
        </div>
      )}

      {!app.installing && app.installProgress && !app.uninstalling && null}

      <div style={{ display: "flex", gap: 6 }}>
        {app.isRunning ? (
          <button
            className="btn-primary"
            style={{ padding: "6px 16px", background: "var(--error, #ef4444)" }}
            onClick={(e) => {
              e.stopPropagation();
              onStop();
            }}
          >
            <Square size={12} fill="white" /> Stop
          </button>
        ) : (
          <button
            className="btn-primary"
            style={{
              padding: "6px 16px",
              opacity: app.installing || app.isLaunching || app.uninstalling ? 0.7 : 1,
              cursor: app.installing || app.isLaunching || app.uninstalling ? "wait" : "pointer",
            }}
            disabled={app.installing || app.isLaunching || app.uninstalling}
            onClick={(e) => {
              e.stopPropagation();
              onLaunch();
            }}
          >
            {app.installing ? (
              <><Download size={12} /> Installing…</>
            ) : app.isLaunching ? (
              <><Loader size={12} style={{ animation: "spin 1s linear infinite" }} /> Starting…</>
            ) : app.uninstalling ? (
              <><Loader size={12} style={{ animation: "spin 1s linear infinite" }} /> Removing…</>
            ) : !app.installed ? (
              <><Download size={12} /> Install</>
            ) : (
              <><Play size={12} fill="white" /> Launch</>
            )}
          </button>
        )}
        {app.installed && !app.isRunning && !app.installing && !app.uninstalling && (
          <button
            className="btn-secondary"
            style={{ padding: "6px 10px", color: "var(--error, #ef4444)" }}
            title="Uninstall"
            onClick={(e) => {
              e.stopPropagation();
              onUninstall();
            }}
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Helpers ──────────────────────────────────────────── */
function ViewToggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 10px",
        borderRadius: 6,
        border: "none",
        background: active ? "var(--bg-hover)" : "transparent",
        color: active ? "var(--text-primary)" : "var(--text-muted)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
        color: "var(--text-muted)",
      }}
    >
      <Filter size={40} style={{ marginBottom: 16, opacity: 0.3 }} />
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
        No applications found
      </div>
      <div style={{ fontSize: 13 }}>
        Try adjusting your search or filter criteria.
      </div>
    </div>
  );
}
