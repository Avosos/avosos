"use client";

import React from "react";
import {
  Film,
  Code,
  Palette,
  Music,
  Box,
  Wrench,
  Layout,
  Sparkles,
  Check,
  ChevronRight,
  Plus,
  Settings,
} from "lucide-react";
import { useLauncherStore } from "@/stores/launcher-store";
import CuttamaranIcon from "@/components/icons/cuttamaran-icon";
import type { EnvironmentProfile } from "@/types";

const ICON_MAP: Record<string, React.ElementType> = {
  Film,
  Code,
  Palette,
  Music,
  Box,
  Wrench,
  Layout,
  Sparkles,
};

export default function ProfilesView() {
  const { profiles, activeProfileId, setActiveProfile, apps } =
    useLauncherStore();

  return (
    <div
      style={{
        padding: "28px 32px",
        height: "100%",
        overflow: "auto",
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: 4,
          }}
        >
          Environment Profiles
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 600 }}>
          Profiles define a curated set of tools, versions, plugins, and configurations.
          Switch between profiles to instantly change your working environment.
          Profiles are portable and can restore your setup on any machine.
        </p>
      </div>

      <div
        className="animate-fadeIn"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: 16,
        }}
      >
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            isActive={profile.id === activeProfileId}
            onActivate={() => setActiveProfile(profile.id)}
            apps={apps}
          />
        ))}

        {/* Add profile placeholder */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 10,
            padding: 32,
            borderRadius: 12,
            border: "2px dashed var(--border-default)",
            cursor: "pointer",
            transition: "all 0.2s",
            minHeight: 200,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.background = "var(--accent-muted)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border-default)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          <Plus size={28} style={{ color: "var(--text-muted)" }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)" }}>
            Create Profile
          </span>
          <span style={{ fontSize: 11, color: "var(--text-dim)", textAlign: "center" }}>
            Define a new environment configuration
          </span>
        </div>
      </div>
    </div>
  );
}

function ProfileCard({
  profile,
  isActive,
  onActivate,
  apps,
}: {
  profile: EnvironmentProfile;
  isActive: boolean;
  onActivate: () => void;
  apps: import("@/types").AppDefinition[];
}) {
  const IconComp = ICON_MAP[profile.icon] ?? Layout;
  const profileApps = profile.apps
    .map((ref) => apps.find((a) => a.id === ref.appId))
    .filter(Boolean);

  return (
    <div
      className="card"
      style={{
        padding: 0,
        overflow: "hidden",
        borderColor: isActive ? profile.color + "40" : undefined,
      }}
    >
      {/* Header with color accent */}
      <div
        style={{
          height: 6,
          background: profile.color,
          opacity: isActive ? 1 : 0.3,
          transition: "opacity 0.3s",
        }}
      />

      <div style={{ padding: "20px" }}>
        {/* Title row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: profile.color + "18",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconComp size={22} style={{ color: profile.color }} />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>{profile.name}</h3>
              {isActive && (
                <span
                  className="badge"
                  style={{
                    background: profile.color + "18",
                    color: profile.color,
                  }}
                >
                  <Check size={10} />
                  Active
                </span>
              )}
            </div>
            <p
              style={{
                fontSize: 12,
                color: "var(--text-secondary)",
                marginTop: 2,
              }}
            >
              {profile.description}
            </p>
          </div>
        </div>

        {/* Apps in profile */}
        {profileApps.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 8,
              }}
            >
              Applications ({profileApps.length})
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {profileApps.map((app) => (
                <div
                  key={app!.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 10px",
                    borderRadius: 8,
                    background: "var(--bg-tertiary)",
                  }}
                >
                  <CuttamaranIcon size={20} />
                  <span style={{ fontSize: 12, fontWeight: 500 }}>
                    {app!.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {profileApps.length === 0 && (
          <div
            style={{
              padding: "12px",
              borderRadius: 8,
              background: "var(--bg-tertiary)",
              fontSize: 12,
              color: "var(--text-muted)",
              textAlign: "center",
              marginBottom: 14,
            }}
          >
            No applications configured yet
          </div>
        )}

        {/* Actions */}
        <div
          style={{
            display: "flex",
            gap: 8,
            paddingTop: 12,
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          {isActive ? (
            <button
              className="btn-secondary"
              style={{ flex: 1, justifyContent: "center" }}
            >
              <Settings size={13} />
              Configure
            </button>
          ) : (
            <button
              className="btn-primary"
              style={{ flex: 1, justifyContent: "center" }}
              onClick={onActivate}
            >
              <Check size={13} />
              Activate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
