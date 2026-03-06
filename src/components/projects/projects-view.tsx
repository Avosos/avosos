"use client";

import React, { useState } from "react";
import {
  Plus,
  FolderOpen,
  Clock,
  Search,
  Trash2,
  Play,
  X,
  FileText,
  Calendar,
  CheckCircle2,
  Pause,
  Archive,
  Activity,
  Flag,
  ChevronDown,
  Edit3,
  Save,
} from "lucide-react";
import { useLauncherStore } from "@/stores/launcher-store";
import AppIcon from "@/components/icons/app-icon";
import type { Project } from "@/types";

export default function ProjectsView() {
  const { projects, apps, addProject, removeProject, launchApp, selectApp } =
    useLauncherStore();
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = projects.filter(
    (p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

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
              Projects
            </h1>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
              Organize your work by project. Each project can have its own application
              toolchain, versions, and environment.
            </p>
          </div>

          <button
            className="btn-primary"
            onClick={() => setShowCreate(true)}
          >
            <Plus size={14} />
            New Project
          </button>
        </div>

        {/* Search */}
        <div style={{ position: "relative", maxWidth: 360, marginBottom: 20 }}>
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
            placeholder="Search projects…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 36 }}
          />
        </div>
      </div>

      {/* Project list */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "0 32px 32px",
        }}
      >
        {filtered.length === 0 && !showCreate ? (
          <EmptyProjects onCreateClick={() => setShowCreate(true)} />
        ) : (
          <div
            className="animate-fadeIn"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 16,
            }}
          >
            {filtered.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                apps={apps}
                onRemove={() => removeProject(project.id)}
                onLaunchApp={launchApp}
                onViewApp={selectApp}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create modal */}
      {showCreate && (
        <CreateProjectModal
          apps={apps}
          onClose={() => setShowCreate(false)}
          onCreate={(data) => {
            addProject(data);
            setShowCreate(false);
          }}
        />
      )}
    </div>
  );
}

function ProjectCard({
  project,
  apps,
  onRemove,
  onLaunchApp,
  onViewApp,
}: {
  project: Project;
  apps: import("@/types").AppDefinition[];
  onRemove: () => void;
  onLaunchApp: (id: string) => void;
  onViewApp: (id: string) => void;
}) {
  const reqApps = project.requiredApps
    .map((ref) => apps.find((a) => a.id === ref.appId))
    .filter(Boolean);

  return (
    <div
      className="card"
      style={{
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: 4,
            }}
          >
            {project.name}
          </h3>
          {project.description && (
            <p
              style={{
                fontSize: 12,
                color: "var(--text-secondary)",
                lineHeight: 1.5,
              }}
            >
              {project.description}
            </p>
          )}
        </div>
        <button
          className="btn-ghost"
          onClick={onRemove}
          style={{ padding: 6, color: "var(--text-dim)" }}
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Required apps */}
      {reqApps.length > 0 && (
        <div>
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
            Toolchain
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {reqApps.map((app) => (
              <div
                key={app!.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 10px",
                  borderRadius: 8,
                  background: "var(--bg-tertiary)",
                }}
              >
                <AppIcon icon={app!.icon} size={24} />
                <span style={{ fontSize: 12, fontWeight: 500, flex: 1 }}>
                  {app!.name}
                </span>
                <button
                  className="btn-ghost"
                  style={{ padding: "4px 8px", fontSize: 11 }}
                  onClick={() => onLaunchApp(app!.id)}
                >
                  <Play size={10} fill="currentColor" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="badge"
              style={{
                background: "var(--bg-surface)",
                color: "var(--text-muted)",
                fontSize: 10,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 8,
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Clock size={12} style={{ color: "var(--text-dim)" }} />
          <span style={{ fontSize: 11, color: "var(--text-dim)" }}>
            Updated {new Date(project.updatedAt).toLocaleDateString()}
          </span>
        </div>

        <button
          className="btn-primary"
          style={{ padding: "6px 14px", fontSize: 12 }}
          onClick={() => {
            // Launch all apps in the project
            project.requiredApps.forEach((ref) => onLaunchApp(ref.appId));
          }}
        >
          <Play size={11} fill="white" />
          Open Project
        </button>
      </div>
    </div>
  );
}

function EmptyProjects({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 20px",
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 20,
          background: "var(--accent-muted)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <FolderOpen size={32} style={{ color: "var(--accent)" }} />
      </div>
      <h3
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: "var(--text-primary)",
          marginBottom: 8,
        }}
      >
        No projects yet
      </h3>
      <p
        style={{
          fontSize: 13,
          color: "var(--text-muted)",
          maxWidth: 400,
          textAlign: "center",
          marginBottom: 20,
          lineHeight: 1.6,
        }}
      >
        Projects group your applications, versions, and settings together.
        Create your first project to get started.
      </p>
      <button className="btn-primary" onClick={onCreateClick}>
        <Plus size={14} />
        Create Project
      </button>
    </div>
  );
}

function CreateProjectModal({
  apps,
  onClose,
  onCreate,
}: {
  apps: import("@/types").AppDefinition[];
  onClose: () => void;
  onCreate: (data: Omit<Project, "id" | "createdAt" | "updatedAt">) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [tags, setTags] = useState("");

  const canCreate = name.trim().length > 0;

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
          width: 480,
          maxHeight: "80vh",
          overflow: "auto",
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
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Create Project</h2>
          <button className="btn-ghost" onClick={onClose} style={{ padding: 6 }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Name */}
          <div>
            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text-secondary)",
                display: "block",
                marginBottom: 6,
              }}
            >
              Project Name *
            </label>
            <input
              className="input"
              placeholder="My Video Project"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text-secondary)",
                display: "block",
                marginBottom: 6,
              }}
            >
              Description
            </label>
            <textarea
              className="input"
              placeholder="What is this project about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              style={{ resize: "vertical" }}
            />
          </div>

          {/* App selection */}
          <div>
            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text-secondary)",
                display: "block",
                marginBottom: 8,
              }}
            >
              Required Applications
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {apps
                .filter((a) => a.installed)
                .map((app) => {
                  const selected = selectedApps.includes(app.id);
                  return (
                    <div
                      key={app.id}
                      onClick={() =>
                        setSelectedApps((prev) =>
                          selected
                            ? prev.filter((id) => id !== app.id)
                            : [...prev, app.id]
                        )
                      }
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 12px",
                        borderRadius: 8,
                        border: `1px solid ${
                          selected ? "var(--accent)" : "var(--border-subtle)"
                        }`,
                        background: selected
                          ? "var(--accent-muted)"
                          : "var(--bg-tertiary)",
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      <AppIcon icon={app.icon} size={28} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>
                          {app.name}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                          v{app.version}
                        </div>
                      </div>
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 4,
                          border: `2px solid ${
                            selected
                              ? "var(--accent)"
                              : "var(--border-default)"
                          }`,
                          background: selected
                            ? "var(--accent)"
                            : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {selected && (
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
                            fill="none"
                          >
                            <path
                              d="M2 5l2.5 2.5L8 3"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text-secondary)",
                display: "block",
                marginBottom: 6,
              }}
            >
              Tags (comma separated)
            </label>
            <input
              className="input"
              placeholder="video, youtube, tutorial"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            marginTop: 24,
            paddingTop: 16,
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary"
            disabled={!canCreate}
            onClick={() => {
              onCreate({
                name: name.trim(),
                description: description.trim() || undefined,
                requiredApps: selectedApps.map((appId) => ({
                  appId,
                })),
                tags: tags
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean),
              });
            }}
            style={{
              opacity: canCreate ? 1 : 0.5,
              cursor: canCreate ? "pointer" : "not-allowed",
            }}
          >
            <Plus size={14} />
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
}
