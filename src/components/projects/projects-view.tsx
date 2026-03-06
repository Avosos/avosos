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
  const { projects, apps, addProject, removeProject, updateProject, launchApp, selectApp } =
    useLauncherStore();
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "paused" | "completed" | "archived">("all");
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const filtered = projects.filter(
    (p) =>
      (!search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))) &&
      (statusFilter === "all" || (p.status ?? "active") === statusFilter)
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
              {projects.length} project{projects.length !== 1 ? "s" : ""}
              {" · "}
              {projects.filter((p) => (p.status ?? "active") === "active").length} active
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

        {/* Search + filter */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
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
              placeholder="Search projects…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 36 }}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: 2,
              background: "var(--bg-tertiary)",
              borderRadius: 8,
              padding: 3,
            }}
          >
            {(["all", "active", "paused", "completed", "archived"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 6,
                  border: "none",
                  background: statusFilter === s ? "var(--bg-hover)" : "transparent",
                  color: statusFilter === s ? "var(--text-primary)" : "var(--text-muted)",
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
                expanded={expandedProject === project.id}
                onToggleExpand={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
                onRemove={() => removeProject(project.id)}
                onUpdate={(data) => updateProject(project.id, data)}
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

const STATUS_META: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  active: { label: "Active", color: "var(--success)", icon: Activity },
  paused: { label: "Paused", color: "var(--warning)", icon: Pause },
  completed: { label: "Completed", color: "var(--accent)", icon: CheckCircle2 },
  archived: { label: "Archived", color: "var(--text-dim)", icon: Archive },
};

const PRIORITY_META: Record<string, { label: string; color: string }> = {
  low: { label: "Low", color: "var(--text-muted)" },
  medium: { label: "Medium", color: "var(--warning)" },
  high: { label: "High", color: "var(--error, #ef4444)" },
};

function ProjectCard({
  project,
  apps,
  expanded,
  onToggleExpand,
  onRemove,
  onUpdate,
  onLaunchApp,
  onViewApp,
}: {
  project: Project;
  apps: import("@/types").AppDefinition[];
  expanded: boolean;
  onToggleExpand: () => void;
  onRemove: () => void;
  onUpdate: (data: Partial<Project>) => void;
  onLaunchApp: (id: string) => void;
  onViewApp: (id: string) => void;
}) {
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState(project.notes ?? "");

  const reqApps = project.requiredApps
    .map((ref) => apps.find((a) => a.id === ref.appId))
    .filter(Boolean);
  const status = project.status ?? "active";
  const statusMeta = STATUS_META[status] ?? STATUS_META.active;
  const StatusIcon = statusMeta.icon;
  const priorityMeta = project.priority ? PRIORITY_META[project.priority] : null;

  return (
    <div
      className="card"
      style={{
        padding: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        borderLeft: `3px solid ${project.color ?? statusMeta.color}`,
      }}
    >
      {/* Header */}
      <div
        style={{ padding: "16px 20px", cursor: "pointer" }}
        onClick={onToggleExpand}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>
                {project.name}
              </h3>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "2px 8px",
                  borderRadius: 10,
                  fontSize: 10,
                  fontWeight: 600,
                  background: `${statusMeta.color}18`,
                  color: statusMeta.color,
                }}
              >
                <StatusIcon size={10} />
                {statusMeta.label}
              </span>
              {priorityMeta && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 3,
                    fontSize: 10,
                    fontWeight: 600,
                    color: priorityMeta.color,
                  }}
                >
                  <Flag size={10} />
                  {priorityMeta.label}
                </span>
              )}
            </div>
            {project.description && (
              <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                {project.description}
              </p>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <ChevronDown
              size={16}
              style={{
                color: "var(--text-muted)",
                transition: "transform 0.2s",
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </div>
        </div>

        {/* Tags + metadata row */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
          {/* Toolchain icons */}
          <div style={{ display: "flex", gap: -4 }}>
            {reqApps.slice(0, 5).map((app) => (
              <div key={app!.id} title={app!.name} style={{ marginRight: 4 }}>
                <AppIcon icon={app!.icon} size={20} />
              </div>
            ))}
          </div>

          {project.tags && project.tags.length > 0 && (
            <div style={{ display: "flex", gap: 4 }}>
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="badge"
                  style={{ background: "var(--bg-surface)", color: "var(--text-muted)", fontSize: 10 }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {project.deadline && (
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text-muted)" }}>
              <Calendar size={11} />
              {new Date(project.deadline).toLocaleDateString()}
            </span>
          )}

          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text-dim)", marginLeft: "auto" }}>
            <Clock size={11} />
            {new Date(project.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div style={{ borderTop: "1px solid var(--border-subtle)" }}>
          {/* Status + priority controls */}
          <div style={{ display: "flex", gap: 12, padding: "12px 20px", borderBottom: "1px solid var(--border-subtle)", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)" }}>Status:</span>
              <select
                value={status}
                onChange={(e) => onUpdate({ status: e.target.value as Project["status"] })}
                style={{
                  padding: "4px 20px 4px 8px",
                  borderRadius: 6,
                  border: "1px solid var(--border-default)",
                  background: "var(--bg-tertiary)",
                  color: "var(--text-primary)",
                  fontSize: 11,
                  appearance: "none",
                  cursor: "pointer",
                }}
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)" }}>Priority:</span>
              <select
                value={project.priority ?? "medium"}
                onChange={(e) => onUpdate({ priority: e.target.value as Project["priority"] })}
                style={{
                  padding: "4px 20px 4px 8px",
                  borderRadius: 6,
                  border: "1px solid var(--border-default)",
                  background: "var(--bg-tertiary)",
                  color: "var(--text-primary)",
                  fontSize: 11,
                  appearance: "none",
                  cursor: "pointer",
                }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)" }}>Deadline:</span>
              <input
                type="date"
                value={project.deadline ? new Date(project.deadline).toISOString().split("T")[0] : ""}
                onChange={(e) => onUpdate({ deadline: e.target.value ? new Date(e.target.value).getTime() : undefined })}
                style={{
                  padding: "4px 8px",
                  borderRadius: 6,
                  border: "1px solid var(--border-default)",
                  background: "var(--bg-tertiary)",
                  color: "var(--text-primary)",
                  fontSize: 11,
                }}
              />
            </div>
            {project.path && (
              <button
                className="btn-ghost"
                style={{ fontSize: 11, padding: "4px 8px", marginLeft: "auto" }}
                onClick={() => window.electronAPI?.openPath(project.path!)}
              >
                <FolderOpen size={11} /> Open Folder
              </button>
            )}
          </div>

          {/* Toolchain apps */}
          {reqApps.length > 0 && (
            <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--border-subtle)" }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
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
                    <span style={{ fontSize: 12, fontWeight: 500, flex: 1 }}>{app!.name}</span>
                    <span style={{ fontSize: 10, color: "var(--text-muted)" }}>v{app!.version}</span>
                    <button
                      className="btn-ghost"
                      style={{ padding: "4px 8px", fontSize: 11 }}
                      onClick={() => onLaunchApp(app!.id)}
                    >
                      <Play size={10} fill="currentColor" /> Launch
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 4 }}>
                <FileText size={11} /> Notes
              </div>
              <button
                className="btn-ghost"
                style={{ fontSize: 10, padding: "3px 8px" }}
                onClick={() => {
                  if (editingNotes) {
                    onUpdate({ notes: notesText });
                  }
                  setEditingNotes(!editingNotes);
                }}
              >
                {editingNotes ? <><Save size={10} /> Save</> : <><Edit3 size={10} /> Edit</>}
              </button>
            </div>
            {editingNotes ? (
              <textarea
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="Add notes about this project…"
                style={{
                  width: "100%",
                  minHeight: 80,
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: "1px solid var(--border-subtle)",
                  background: "var(--bg-tertiary)",
                  color: "var(--text-primary)",
                  fontSize: 12,
                  lineHeight: 1.6,
                  resize: "vertical",
                }}
              />
            ) : (
              <p style={{ fontSize: 12, color: project.notes ? "var(--text-secondary)" : "var(--text-dim)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {project.notes || "No notes yet. Click Edit to add some."}
              </p>
            )}
          </div>

          {/* Activity timeline */}
          {project.activity && project.activity.length > 0 && (
            <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--border-subtle)" }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
                <Activity size={11} /> Recent Activity
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {project.activity.slice(0, 5).map((act) => (
                  <div key={act.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "var(--text-secondary)" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{act.message}</span>
                    <span style={{ color: "var(--text-dim)", fontSize: 10, whiteSpace: "nowrap" }}>
                      {formatRelative(act.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions footer */}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 20px" }}>
            <button
              className="btn-ghost"
              style={{ fontSize: 11, color: "var(--error, #ef4444)", padding: "4px 8px" }}
              onClick={() => {
                if (confirm(`Delete project "${project.name}"?`)) onRemove();
              }}
            >
              <Trash2 size={12} /> Delete
            </button>
            <button
              className="btn-primary"
              style={{ padding: "6px 16px", fontSize: 12 }}
              onClick={() => {
                project.requiredApps.forEach((ref) => onLaunchApp(ref.appId));
              }}
            >
              <Play size={11} fill="white" /> Open Project
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
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
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [projectPath, setProjectPath] = useState("");
  const [deadline, setDeadline] = useState("");

  const canCreate = name.trim().length > 0;

  const handlePickDir = async () => {
    const dir = await window.electronAPI?.openFolderDialog({
      title: "Select project directory",
    });
    if (dir) setProjectPath(dir);
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

          {/* Priority + deadline */}
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
                className="input"
                style={{ appearance: "none" }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>
                Deadline (optional)
              </label>
              <input
                type="date"
                className="input"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>

          {/* Project directory */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>
              Project Directory (optional)
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                className="input"
                placeholder="Select a folder…"
                value={projectPath}
                readOnly
                style={{ flex: 1, cursor: "pointer" }}
                onClick={handlePickDir}
              />
              <button
                className="btn-secondary"
                style={{ padding: "6px 12px", fontSize: 12 }}
                onClick={handlePickDir}
              >
                <FolderOpen size={12} />
              </button>
            </div>
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
                priority,
                status: "active",
                path: projectPath || undefined,
                deadline: deadline ? new Date(deadline).getTime() : undefined,
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
