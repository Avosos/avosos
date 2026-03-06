"use client";

import React, { useState } from "react";
import {
  Bell,
  X,
  Download,
  Trash2,
  Play,
  AlertTriangle,
  Info,
  Key,
} from "lucide-react";
import { useLauncherStore } from "@/stores/launcher-store";
import type { LauncherNotification } from "@/types";

export default function NotificationPanel() {
  const {
    notifications,
    dismissNotification,
    markNotificationRead,
    clearAllNotifications,
  } = useLauncherStore();
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const persistentNotifs = notifications.filter((n) => n.persistent);
  const regularNotifs = notifications.filter((n) => !n.persistent);

  return (
    <div style={{ position: "relative" }}>
      {/* Bell button */}
      <button
        onClick={() => {
          setOpen(!open);
          // Mark all as read on open
          if (!open) {
            notifications.forEach((n) => {
              if (!n.read) markNotificationRead(n.id);
            });
          }
        }}
        style={{
          background: "none",
          border: "none",
          color: "var(--text-secondary)",
          cursor: "pointer",
          padding: "6px",
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          transition: "color 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <div
            style={{
              position: "absolute",
              top: 2,
              right: 2,
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "var(--accent)",
              fontSize: 9,
              fontWeight: 800,
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1,
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </div>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            width: 380,
            maxHeight: 480,
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-default)",
            borderRadius: 12,
            boxShadow: "var(--shadow-lg)",
            zIndex: 300,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "14px 16px",
              borderBottom: "1px solid var(--border-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 700 }}>Notifications</span>
            <div style={{ display: "flex", gap: 6 }}>
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    fontSize: 11,
                    fontWeight: 500,
                  }}
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  padding: 2,
                }}
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Persistent progress bars (like Epic Games) */}
          {persistentNotifs.length > 0 && (
            <div
              style={{
                borderBottom: "1px solid var(--border-subtle)",
                padding: "8px 0",
              }}
            >
              {persistentNotifs.map((n) => (
                <ProgressNotification
                  key={n.id}
                  notification={n}
                  onDismiss={() => dismissNotification(n.id)}
                />
              ))}
            </div>
          )}

          {/* Regular notifications */}
          <div style={{ flex: 1, overflow: "auto" }}>
            {regularNotifs.length === 0 && persistentNotifs.length === 0 ? (
              <div
                style={{
                  padding: "40px 20px",
                  textAlign: "center",
                  color: "var(--text-muted)",
                  fontSize: 13,
                }}
              >
                No notifications
              </div>
            ) : (
              regularNotifs.map((n) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onDismiss={() => dismissNotification(n.id)}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* Persistent progress toasts at bottom-right (visible even when panel closed) */}
      {!open && persistentNotifs.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 400,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            width: 340,
          }}
        >
          {persistentNotifs.slice(0, 3).map((n) => (
            <ProgressToast
              key={n.id}
              notification={n}
              onDismiss={() => dismissNotification(n.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProgressNotification({
  notification: n,
  onDismiss,
}: {
  notification: LauncherNotification;
  onDismiss: () => void;
}) {
  const typeIcon = getTypeIcon(n.type);
  const progress = n.progress ?? 0;

  return (
    <div
      style={{
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div style={{ color: getTypeColor(n.type), flexShrink: 0 }}>{typeIcon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{n.title}</div>
        <div
          style={{
            height: 4,
            borderRadius: 2,
            background: "var(--bg-surface)",
            overflow: "hidden",
            marginBottom: 3,
          }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: 2,
              background: "var(--accent)",
              width: `${Math.max(0, Math.min(100, progress))}%`,
              transition: "width 0.3s ease",
            }}
          />
        </div>
        <div
          style={{
            fontSize: 10,
            color: "var(--text-muted)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {n.message} {progress > 0 && progress < 100 ? `(${Math.round(progress)}%)` : ""}
        </div>
      </div>
      <button
        onClick={onDismiss}
        style={{
          background: "none",
          border: "none",
          color: "var(--text-dim)",
          cursor: "pointer",
          padding: 2,
          flexShrink: 0,
        }}
      >
        <X size={12} />
      </button>
    </div>
  );
}

function ProgressToast({
  notification: n,
  onDismiss,
}: {
  notification: LauncherNotification;
  onDismiss: () => void;
}) {
  const progress = n.progress ?? 0;

  return (
    <div
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-default)",
        borderRadius: 10,
        padding: "12px 14px",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ color: getTypeColor(n.type) }}>{getTypeIcon(n.type)}</div>
          <span style={{ fontSize: 12, fontWeight: 600 }}>{n.title}</span>
        </div>
        <button
          onClick={onDismiss}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-dim)",
            cursor: "pointer",
            padding: 2,
          }}
        >
          <X size={12} />
        </button>
      </div>
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
            width: `${Math.max(0, Math.min(100, progress))}%`,
            transition: "width 0.3s ease",
          }}
        />
      </div>
      <div
        style={{
          fontSize: 10,
          color: "var(--text-muted)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {n.message} {progress > 0 && progress < 100 ? `(${Math.round(progress)}%)` : ""}
      </div>
    </div>
  );
}

function NotificationItem({
  notification: n,
  onDismiss,
}: {
  notification: LauncherNotification;
  onDismiss: () => void;
}) {
  const typeIcon = getTypeIcon(n.type);
  const ago = formatTimeAgo(n.timestamp);

  return (
    <div
      style={{
        padding: "12px 16px",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
      }}
    >
      <div style={{ color: getTypeColor(n.type), flexShrink: 0, marginTop: 2 }}>
        {typeIcon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600 }}>{n.title}</div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{n.message}</div>
        <div style={{ fontSize: 10, color: "var(--text-dim)", marginTop: 4 }}>{ago}</div>
      </div>
      <button
        onClick={onDismiss}
        style={{
          background: "none",
          border: "none",
          color: "var(--text-dim)",
          cursor: "pointer",
          padding: 2,
          flexShrink: 0,
        }}
      >
        <X size={12} />
      </button>
    </div>
  );
}

function getTypeIcon(type: LauncherNotification["type"]) {
  switch (type) {
    case "install": return <Download size={14} />;
    case "uninstall": return <Trash2 size={14} />;
    case "update": return <Download size={14} />;
    case "launch": return <Play size={14} />;
    case "error": return <AlertTriangle size={14} />;
    case "license": return <Key size={14} />;
    default: return <Info size={14} />;
  }
}

function getTypeColor(type: LauncherNotification["type"]) {
  switch (type) {
    case "install": return "var(--accent)";
    case "uninstall": return "var(--warning)";
    case "update": return "var(--info)";
    case "launch": return "var(--success)";
    case "error": return "var(--error)";
    case "license": return "#f59e0b";
    default: return "var(--text-muted)";
  }
}

function formatTimeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
