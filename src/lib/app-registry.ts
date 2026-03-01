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
    installed: true,
    sourcePath: "C:\\Users\\Marius\\Desktop\\projects\\cuttamaran",
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
  productivity: { label: "Productivity", color: "#2dd4bf", icon: "Layout" },
  ai: { label: "AI", color: "#f43f5e", icon: "Sparkles" },
};

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
    installed: true,
    sourcePath: "C:\\Users\\Marius\\Desktop\\projects\\voician",
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
];

export function getAppById(id: string): AppDefinition | undefined {
  return APP_REGISTRY.find((a) => a.id === id);
}

export function getAppsByCategory(category: string): AppDefinition[] {
  return APP_REGISTRY.filter((a) => a.category === category);
}
