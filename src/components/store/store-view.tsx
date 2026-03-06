"use client";

import React, { useState, useMemo } from "react";
import {
  Store,
  Search,
  Star,
  Download,
  Play,
  Key,
  Check,
  Crown,
  Sparkles,
  ChevronDown,
  ExternalLink,
  Lock,
  X,
} from "lucide-react";
import { useLauncherStore } from "@/stores/launcher-store";
import { CATEGORY_META } from "@/lib/app-registry";
import AppIcon from "@/components/icons/app-icon";
import type { AppDefinition, AppCategory } from "@/types";

export default function StoreView() {
  const {
    apps,
    selectApp,
    installApp,
    launchApp,
    activateLicense,
  } = useLauncherStore();
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<"all" | AppCategory>("all");
  const [licenseModal, setLicenseModal] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(apps.map((a) => a.category));
    return Array.from(cats);
  }, [apps]);

  const filtered = useMemo(() => {
    let result = apps;
    if (filterCat !== "all") {
      result = result.filter((a) => a.category === filterCat);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [apps, filterCat, search]);

  // Featured apps for the hero banner
  const featuredApps = apps.slice(0, 2);

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
      <div style={{ padding: "24px 32px 0", flexShrink: 0 }}>
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
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Store size={22} />
              Store
            </h1>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
              Browse, install, and manage Avosos applications. Activate licenses to unlock premium features.
            </p>
          </div>
        </div>

        {/* Featured banner */}
        <div
          style={{
            background: "var(--accent-gradient-subtle)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 14,
            padding: "24px 28px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: "radial-gradient(circle, var(--accent-glow), transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 8,
              }}
            >
              <Sparkles size={14} style={{ color: "var(--accent)" }} />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--accent)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Featured
              </span>
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
              Avosos Application Suite
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", maxWidth: 420 }}>
              Professional-grade tools for video editing, audio processing, writing, manga reading, and more.
              All free to install.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {featuredApps.map((app) => (
              <div
                key={app.id}
                onClick={() => selectApp(app.id)}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "transform 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <AppIcon icon={app.icon} size={36} />
              </div>
            ))}
          </div>
        </div>

        {/* Filters row */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20 }}>
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
              placeholder="Search store…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 36 }}
            />
          </div>
          <div style={{ position: "relative" }}>
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value as "all" | AppCategory)}
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
        </div>
      </div>

      {/* App grid */}
      <div style={{ flex: 1, overflow: "auto", padding: "0 32px 32px" }}>
        <div
          className="animate-fadeIn"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          {filtered.map((app) => (
            <StoreCard
              key={app.id}
              app={app}
              onDetails={() => selectApp(app.id)}
              onInstall={() => installApp(app.id)}
              onLaunch={() => launchApp(app.id)}
              onActivateLicense={() => setLicenseModal(app.id)}
            />
          ))}
        </div>
      </div>

      {/* License activation modal */}
      {licenseModal && (
        <LicenseModal
          appId={licenseModal}
          appName={apps.find((a) => a.id === licenseModal)?.name ?? ""}
          onClose={() => setLicenseModal(null)}
          onActivate={async (key) => {
            const ok = await activateLicense(licenseModal, key);
            if (ok) setLicenseModal(null);
            return ok;
          }}
        />
      )}
    </div>
  );
}

function StoreCard({
  app,
  onDetails,
  onInstall,
  onLaunch,
  onActivateLicense,
}: {
  app: AppDefinition;
  onDetails: () => void;
  onInstall: () => void;
  onLaunch: () => void;
  onActivateLicense: () => void;
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
      {/* Category banner */}
      <div
        style={{
          height: 72,
          background: `linear-gradient(135deg, ${catMeta?.color}25, ${catMeta?.color}08)`,
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 14,
          position: "relative",
        }}
      >
        <AppIcon icon={app.icon} size={44} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>
            {app.name}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span className="badge" style={{ background: catMeta?.color + "18", color: catMeta?.color }}>
              {catMeta?.label}
            </span>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>v{app.version}</span>
          </div>
        </div>
        {app.maintenanceMode && (
          <span
            style={{
              position: "absolute",
              top: 8,
              right: 10,
              fontSize: 9,
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: 4,
              background: "rgba(249,115,22,0.15)",
              color: "#f97316",
              textTransform: "uppercase",
            }}
          >
            Maintenance
          </span>
        )}
        {app.isRunning && (
          <div
            style={{
              position: "absolute",
              top: 8,
              right: 10,
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "2px 8px",
              borderRadius: 12,
              background: "rgba(74,222,128,0.15)",
              fontSize: 10,
              fontWeight: 600,
              color: "var(--success)",
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success)" }} />
            Running
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "14px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
        <p
          style={{
            fontSize: 12,
            color: "var(--text-secondary)",
            lineHeight: 1.5,
            flex: 1,
            marginBottom: 12,
          }}
        >
          {app.description}
        </p>

        {/* Info row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 14,
            fontSize: 11,
            color: "var(--text-muted)",
          }}
        >
          <span>{app.vendor}</span>
          {app.size && <span>{app.size}</span>}
          <span style={{ color: "var(--success)", fontWeight: 600 }}>Free</span>
        </div>

        {/* Install progress bar */}
        {app.installing && (
          <div style={{ marginBottom: 10 }}>
            <div
              style={{
                height: 4,
                borderRadius: 2,
                background: "var(--bg-surface)",
                overflow: "hidden",
                marginBottom: 4,
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: 2,
                  background: "var(--accent)",
                  width: `${app.installProgressPercent ?? 0}%`,
                  transition: "width 0.3s ease",
                }}
              />
            </div>
            <div
              style={{
                fontSize: 10,
                color: "var(--accent)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {app.installProgress}
            </div>
          </div>
        )}

        {/* Uninstalling progress */}
        {app.uninstalling && (
          <div style={{ marginBottom: 10 }}>
            <div
              style={{
                fontSize: 10,
                color: "var(--warning)",
                padding: "6px 10px",
                borderRadius: 6,
                background: "rgba(249,115,22,0.1)",
              }}
            >
              {app.uninstallProgress || "Uninstalling…"}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn-primary"
            style={{
              flex: 1,
              justifyContent: "center",
              padding: "8px 14px",
              opacity: app.installing || app.uninstalling || app.isLaunching ? 0.7 : 1,
              cursor: app.installing || app.uninstalling || app.isLaunching ? "wait" : "pointer",
            }}
            disabled={app.installing || app.uninstalling || app.isLaunching || app.maintenanceMode}
            onClick={(e) => {
              e.stopPropagation();
              if (app.installed) {
                onLaunch();
              } else {
                onInstall();
              }
            }}
          >
            {app.isLaunching ? (
              <><Play size={13} /> Starting…</>
            ) : app.installing ? (
              <><Download size={13} /> Installing…</>
            ) : !app.installed ? (
              <><Download size={13} /> Install</>
            ) : (
              <><Play size={13} fill="white" /> Launch</>
            )}
          </button>

          {/* License key button */}
          <button
            className="btn-secondary"
            style={{ padding: "8px 10px" }}
            onClick={(e) => {
              e.stopPropagation();
              onActivateLicense();
            }}
            title="Activate License"
          >
            <Key size={13} />
          </button>
        </div>

        {/* License status */}
        {app.licenseStatus && app.licenseStatus !== "none" && (
          <div
            style={{
              marginTop: 8,
              fontSize: 10,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 4,
              color:
                app.licenseStatus === "valid"
                  ? "var(--success)"
                  : app.licenseStatus === "expired"
                  ? "var(--warning)"
                  : "var(--error)",
            }}
          >
            {app.licenseStatus === "valid" ? <Check size={10} /> : <Lock size={10} />}
            License: {app.licenseStatus}
          </div>
        )}
      </div>
    </div>
  );
}

function LicenseModal({
  appId,
  appName,
  onClose,
  onActivate,
}: {
  appId: string;
  appName: string;
  onClose: () => void;
  onActivate: (key: string) => Promise<boolean>;
}) {
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleActivate = async () => {
    if (!key.trim()) return;
    setLoading(true);
    setError(null);
    const ok = await onActivate(key.trim());
    setLoading(false);
    if (!ok) {
      setError("Invalid license key. Please check and try again.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--overlay-bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
      }}
      onClick={onClose}
    >
      <div
        className="animate-fadeIn"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-default)",
          borderRadius: 16,
          padding: 28,
          width: 420,
          boxShadow: "var(--shadow-lg)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "rgba(245,158,11,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Key size={18} style={{ color: "#f59e0b" }} />
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700 }}>Activate License</h2>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{appName}</div>
            </div>
          </div>
          <button className="btn-ghost" onClick={onClose} style={{ padding: 6 }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--text-secondary)",
              display: "block",
              marginBottom: 8,
            }}
          >
            License Key
          </label>
          <input
            className="input"
            placeholder="XXXX-XXXX-XXXX-XXXX"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            autoFocus
            style={{ fontFamily: "monospace", letterSpacing: "0.05em" }}
          />
        </div>

        {error && (
          <div
            style={{
              fontSize: 12,
              color: "var(--error)",
              padding: "8px 12px",
              borderRadius: 8,
              background: "rgba(239,68,68,0.1)",
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button className="btn-secondary" onClick={onClose} style={{ padding: "8px 16px", fontSize: 13 }}>
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={handleActivate}
            disabled={!key.trim() || loading}
            style={{ padding: "8px 20px", fontSize: 13 }}
          >
            {loading ? "Validating…" : "Activate"}
          </button>
        </div>
      </div>
    </div>
  );
}
