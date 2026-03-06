"use client";

import React, { useState, useEffect } from "react";
import { Minus, Square, X, Copy } from "lucide-react";
import NotificationPanel from "./notification-panel";

export default function Titlebar() {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    window.electronAPI?.isMaximized().then(setIsMaximized);
    const unsub = window.electronAPI?.onMaximizedChange(setIsMaximized);
    return () => unsub?.();
  }, []);

  return (
    <header
      className="titlebar-drag"
      style={{
        height: "var(--titlebar-height)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: 16,
        paddingRight: 0,
        background: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border-subtle)",
        position: "relative",
        zIndex: 100,
        flexShrink: 0,
      }}
    >
      {/* Brand */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <AvososLogo size={22} />
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "var(--text-primary)",
            letterSpacing: "0.03em",
          }}
        >
          AVOSOS
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 500,
            color: "var(--text-muted)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Launcher
        </span>
      </div>

      {/* Notification bell + Window controls */}
      <div className="titlebar-no-drag" style={{ display: "flex", height: "100%", alignItems: "center" }}>
        <div style={{ padding: "0 8px", display: "flex", alignItems: "center" }}>
          <NotificationPanel />
        </div>
        <WindowButton onClick={() => window.electronAPI?.minimize()}>
          <Minus size={14} />
        </WindowButton>
        <WindowButton onClick={() => window.electronAPI?.maximize()}>
          {isMaximized ? <Copy size={12} /> : <Square size={12} />}
        </WindowButton>
        <WindowButton
          onClick={() => window.electronAPI?.close()}
          isClose
        >
          <X size={14} />
        </WindowButton>
      </div>
    </header>
  );
}

function WindowButton({
  children,
  onClick,
  isClose = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  isClose?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 46,
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        border: "none",
        color: "var(--text-secondary)",
        cursor: "pointer",
        transition: "all 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = isClose
          ? "#e81123"
          : "rgba(255,255,255,0.06)";
        e.currentTarget.style.color = "#fff";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "var(--text-secondary)";
      }}
    >
      {children}
    </button>
  );
}

function AvososLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="none">
      <defs>
        <linearGradient id="avosos-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c5cfc" />
          <stop offset="100%" stopColor="#e879f9" />
        </linearGradient>
      </defs>
      <rect width="256" height="256" rx="56" fill="url(#avosos-bg)" />
      {/* Stylized "A" with orbiting dots — launch/orchestration motif */}
      <path
        d="M128 50 L70 200 L90 200 L103 165 L153 165 L166 200 L186 200 Z M128 90 L110 150 L146 150 Z"
        fill="white"
        opacity="0.95"
      />
      {/* Orbit ring */}
      <ellipse
        cx="128"
        cy="128"
        rx="90"
        ry="30"
        stroke="white"
        strokeWidth="4"
        fill="none"
        opacity="0.3"
        transform="rotate(-25 128 128)"
      />
      <circle cx="205" cy="105" r="8" fill="white" opacity="0.8" />
    </svg>
  );
}
