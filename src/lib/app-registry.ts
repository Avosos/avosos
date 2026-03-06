import type { AppDefinition } from "@/types";

/**
 * Registry of all known applications in the Avosos launcher.
 * Cuttamaran is the first registered application.
 */
export const APP_REGISTRY: AppDefinition[] = [
  {
    id: "cuttamaran",
    name: "Cuttamaran",
    slug: "cuttamaran",
    description: "A beautiful, open-source desktop video editor",
    longDescription:
      "Cuttamaran is a modern desktop video editor built with Electron and Next.js. " +
      "It features a professional timeline, multi-track editing, real-time preview, " +
      "GPU-accelerated rendering, and a plugin-ready architecture. Designed for " +
      "creators who want powerful editing without the subscription fees.",
    vendor: "Avosos",
    version: "0.1.0",
    availableVersions: ["0.1.0"],
    category: "video",
    tags: ["video editing", "timeline", "open-source", "electron", "creative"],
    icon: "cuttamaran",
    installed: false,
    repoUrl: "https://github.com/Avosos/cuttamaran",
    launchScript: "dev:electron",
    size: "285 MB",
    lastUpdated: Date.now(),
    autoUpdate: true,
    plugins: [
      {
        id: "ct-transitions",
        name: "Transition Pack",
        version: "1.0.0",
        installed: true,
        description: "Built-in video transitions: fade, dissolve, wipe, slide",
      },
      {
        id: "ct-color-grading",
        name: "Color Grading",
        version: "1.0.0",
        installed: false,
        description: "Advanced color grading tools with LUT support",
      },
      {
        id: "ct-audio-sync",
        name: "Audio Sync",
        version: "0.9.0",
        installed: false,
        description: "Automatic audio synchronization across clips",
      },
    ],
    compatibility: [
      {
        appVersion: "0.1.0",
        os: ["win32", "darwin", "linux"],
        minRam: 4 * 1024 * 1024 * 1024,
        notes: "Requires FFmpeg for export",
      },
    ],
  },

  // ── Voician ───────────────────────────────────────────────
  {
    id: "voician",
    name: "Voician",
    slug: "voician",
    description: "Real-time expressive voice-to-MIDI engine",
    longDescription:
      "Voician is a real-time voice-to-MIDI engine built in Rust. Sing or hum into " +
      "your microphone and Voician converts your voice into expressive MIDI with " +
      "velocity, pitch bend, and CC 74 brightness — all with <30ms latency. " +
      "Features YIN pitch detection, spectral analysis, a lock-free multi-threaded " +
      "architecture, and both minimal and advanced GUI modes with live waveform visualization.",
    vendor: "Avosos",
    version: "0.3.0",
    availableVersions: ["0.1.0", "0.2.0", "0.3.0"],
    category: "audio",
    tags: [
      "audio",
      "MIDI",
      "voice",
      "pitch detection",
      "real-time",
      "rust",
      "music production",
    ],
    icon: "voician",
    installed: false,
    repoUrl: "https://github.com/Avosos/voician",
    launchCommand: "cargo",
    launchArgs: ["run", "--release"],
    size: "18 MB",
    lastUpdated: Date.now(),
    autoUpdate: true,
    plugins: [
      {
        id: "vc-loopback",
        name: "Virtual Loopback",
        version: "1.0.0",
        installed: false,
        description: "Route Voician MIDI output through a virtual loopback device",
      },
      {
        id: "vc-scale-lock",
        name: "Scale Lock",
        version: "0.9.0",
        installed: false,
        description: "Quantize pitch output to a selected musical scale",
      },
    ],
    compatibility: [
      {
        appVersion: "0.3.0",
        os: ["win32", "darwin", "linux"],
        minRam: 512 * 1024 * 1024,
        notes: "Requires a microphone and loopMIDI (Windows) for MIDI routing",
      },
    ],
  },

  // ── ManwhaWham ─────────────────────────────────────────────
  {
    id: "manwhawham",
    name: "ManwhaWham",
    slug: "manwhawham",
    description: "Manga & Manhwa reader powered by MangaDex",
    longDescription:
      "ManwhaWham is a sleek desktop manga and manhwa reader built with Electron " +
      "and Next.js. Browse, search, and read from the MangaDex catalog with a " +
      "beautiful dark UI, vertical/horizontal reading modes, library management, " +
      "reading history, offline downloads, and image proxying — all without ads.",
    vendor: "Avosos",
    version: "0.1.0",
    availableVersions: ["0.1.0"],
    category: "entertainment",
    tags: ["manga", "manhwa", "reader", "mangadex", "comics", "electron"],
    icon: "manwhawham",
    installed: false,
    repoUrl: "https://github.com/Avosos/manwhawham",
    launchScript: "dev",
    size: "95 MB",
    lastUpdated: Date.now(),
    autoUpdate: true,
    plugins: [
      {
        id: "mw-tracker",
        name: "Reading Tracker",
        version: "1.0.0",
        installed: true,
        description: "Track reading progress and history across all manga",
      },
      {
        id: "mw-downloader",
        name: "Offline Reader",
        version: "1.0.0",
        installed: true,
        description: "Download chapters for offline reading",
      },
    ],
    compatibility: [
      {
        appVersion: "0.1.0",
        os: ["win32", "darwin", "linux"],
        minRam: 512 * 1024 * 1024,
        notes: "Requires internet connection for MangaDex API access",
      },
    ],
  },

  // ── NovelTea ───────────────────────────────────────────────
  {
    id: "noveltea",
    name: "NovelTea",
    slug: "noveltea",
    description: "Structured authoring environment for novels",
    longDescription:
      "NovelTea is a specialised authoring environment for novelists. It offers " +
      "chapter & scene organisation, worldbuilding entities with bidirectional linking, " +
      "conflict & Chekhov's gun tracking, three-act story mapping, timeline visualisation, " +
      "a contextual writing editor, and detailed statistics — all in a beautiful dark UI.",
    vendor: "Avosos",
    version: "0.1.0",
    availableVersions: ["0.1.0"],
    category: "writing",
    tags: ["writing", "novel", "authoring", "worldbuilding", "electron", "creative"],
    icon: "noveltea",
    installed: false,
    repoUrl: "https://github.com/Avosos/noveltea",
    launchScript: "dev",
    size: "78 MB",
    lastUpdated: Date.now(),
    autoUpdate: true,
    plugins: [
      {
        id: "nt-export",
        name: "Export Pack",
        version: "1.0.0",
        installed: true,
        description: "Export your novel to EPUB, PDF, Markdown, and DOCX",
      },
      {
        id: "nt-distraction-free",
        name: "Distraction Free",
        version: "1.0.0",
        installed: true,
        description: "Full-screen distraction-free writing mode with ambient sounds",
      },
    ],
    compatibility: [
      {
        appVersion: "0.1.0",
        os: ["win32", "darwin", "linux"],
        minRam: 512 * 1024 * 1024,
        notes: "Projects stored as JSON files on disk",
      },
    ],
  },

  // ── StreamPad ──────────────────────────────────────────────
  {
    id: "streampad",
    name: "StreamPad",
    slug: "streampad",
    description: "Turn your Launchpad into a macro & automation surface",
    longDescription:
      "StreamPad transforms your Novation Launchpad into a fully configurable macro " +
      "and automation surface — like a Stream Deck, but with 64+ RGB pads, velocity " +
      "sensitivity, and MIDI flexibility. Features real-time bidirectional MIDI " +
      "communication, full RGB LED control with animations, multi-profile support with " +
      "auto-switching, layers & banks, advanced input detection (hold, double/triple-tap, " +
      "velocity, aftertouch), and an extensible plugin architecture for OBS, IDE " +
      "integration, media control, smart home, and more.",
    vendor: "Avosos",
    version: "1.0.0",
    availableVersions: ["1.0.0"],
    category: "utilities",
    tags: [
      "MIDI",
      "launchpad",
      "macro",
      "streamdeck",
      "automation",
      "LED",
      "electron",
      "productivity",
    ],
    icon: "streampad",
    installed: false,
    repoUrl: "https://github.com/Avosos/streampad",
    launchScript: "dev",
    size: "62 MB",
    lastUpdated: Date.now(),
    autoUpdate: true,
    plugins: [
      {
        id: "sp-obs",
        name: "OBS Control",
        version: "1.0.0",
        installed: false,
        description: "Control OBS scenes, sources, and streaming via pad presses",
      },
      {
        id: "sp-media",
        name: "Media Control",
        version: "1.0.0",
        installed: false,
        description: "Play, pause, skip, and control volume from your Launchpad",
      },
      {
        id: "sp-smart-home",
        name: "Smart Home",
        version: "0.9.0",
        installed: false,
        description: "Toggle smart lights, scenes, and devices via HTTP/MQTT",
      },
    ],
    compatibility: [
      {
        appVersion: "1.0.0",
        os: ["win32", "darwin", "linux"],
        minRam: 512 * 1024 * 1024,
        notes:
          "Requires a Novation Launchpad (Pro MK2, MK3, X, Mini MK3, or MK2)",
      },
    ],
  },

  // ── BangerBot ──────────────────────────────────────────────
  {
    id: "bangerbot",
    name: "BangerBot",
    slug: "bangerbot",
    description: "Feature-rich Discord bot with levels, tickets & premium",
    longDescription:
      "BangerBot is a versatile Discord bot built with Python and ezcord. It features " +
      "a complete leveling system with XP tracking and role rewards, a configurable " +
      "ticket support system with HTML transcript export, a premium code system with " +
      "time-based expiry, server join/leave tracking, moderation tools (ban, logging), " +
      "and developer administration commands — all powered by SQLite.",
    vendor: "Avosos",
    version: "1.1.5",
    availableVersions: ["1.1.5"],
    category: "bots",
    tags: [
      "discord",
      "bot",
      "python",
      "leveling",
      "tickets",
      "premium",
      "moderation",
    ],
    icon: "bangerbot",
    installed: false,
    repoUrl: "https://github.com/Avosos/bangerbot",
    launchCommand: "python",
    launchArgs: ["main.py"],
    size: "12 MB",
    lastUpdated: Date.now(),
    autoUpdate: true,
    plugins: [
      {
        id: "bb-levelsys",
        name: "Level System",
        version: "1.0.0",
        installed: true,
        description:
          "XP tracking, level-up notifications, role rewards, and leaderboards",
      },
      {
        id: "bb-tickets",
        name: "Ticket System",
        version: "1.0.0",
        installed: true,
        description:
          "Configurable support tickets with dropdown selection and HTML transcripts",
      },
      {
        id: "bb-premium",
        name: "Premium System",
        version: "1.0.0",
        installed: true,
        description:
          "Premium code generation, redemption, and time-based expiry management",
      },
    ],
    compatibility: [
      {
        appVersion: "1.1.5",
        os: ["win32", "darwin", "linux"],
        minRam: 256 * 1024 * 1024,
        notes: "Requires Python 3.12+ and a Discord bot token",
      },
    ],
  },
];

export const CATEGORY_META: Record<
  string,
  { label: string; color: string; icon: string }
> = {
  video: { label: "Video", color: "#e879f9", icon: "Film" },
  design: { label: "Design", color: "#60a5fa", icon: "Palette" },
  development: { label: "Development", color: "#4ade80", icon: "Code" },
  audio: { label: "Audio", color: "#fbbf24", icon: "Music" },
  "3d": { label: "3D", color: "#f97316", icon: "Box" },
  utilities: { label: "Utilities", color: "#a78bfa", icon: "Wrench" },
  bots: { label: "Bots", color: "#5865F2", icon: "Bot" },
  entertainment: { label: "Entertainment", color: "#f43f5e", icon: "BookOpen" },
  productivity: { label: "Productivity", color: "#2dd4bf", icon: "Layout" },
  writing: { label: "Writing", color: "#a3e635", icon: "PenTool" },
  ai: { label: "AI", color: "#ec4899", icon: "Sparkles" },
};

export function getAppById(id: string): AppDefinition | undefined {
  return APP_REGISTRY.find((a) => a.id === id);
}

export function getAppsByCategory(category: string): AppDefinition[] {
  return APP_REGISTRY.filter((a) => a.category === category);
}
