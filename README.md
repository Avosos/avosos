# Avosos Launcher

A universal desktop application launcher for professional workflow orchestration. Manage, launch, and monitor all your Avosos applications from a single, unified interface.

![Electron](https://img.shields.io/badge/Electron-40-47848F?logo=electron&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-Private-red)

---

## Features

- **Dashboard** — At-a-glance overview of running applications and real-time system stats (CPU, RAM, GPU)
- **Application Library** — Browse, search, and manage registered Avosos apps with detailed info, changelogs, and plugin support
- **Project Management** — Organise projects that span multiple applications and track required dependencies
- **Environment Profiles** — Create and switch between environment profiles with custom variables
- **Settings & Admin** — Fine-tune preferences, view system information, and access administrative tools
- **Version Management** — Bump application versions with semver support and view Git-based changelogs
- **Cross-Platform** — Builds for Windows (NSIS / Portable), macOS (DMG), and Linux (AppImage)

## Registered Applications

| App | Category | Description |
|---|---|---|
| **Cuttamaran** | Video | Open-source desktop video editor with a professional timeline and GPU-accelerated rendering |
| **Voician** | Audio | Real-time expressive voice-to-MIDI engine built in Rust with < 30 ms latency |

> The application registry lives in `src/lib/app-registry.ts` and is easily extensible.

## Tech Stack

| Layer | Technology |
|---|---|
| Desktop Shell | Electron 40 |
| UI Framework | Next.js 16 (static export) |
| Rendering | React 19 |
| State Management | Zustand 5 |
| Styling | Tailwind CSS 4 + CSS custom properties |
| Charts | Recharts |
| Language | TypeScript 5 |
| Build & Package | electron-builder |

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** (ships with Node)
- **Git**

### Installation

```bash
# Clone the repository
git clone https://github.com/Avosos/avosos.git
cd avosos

# Install dependencies
npm install
```

### Development

```bash
# Start Next.js dev server + Electron together
npm run dev:electron

# Or run the Next.js dev server only (http://localhost:3100)
npm run dev
```

### Production Build

```bash
# Build the Next.js static export and package with electron-builder
npm run build:electron
```

Distribution artifacts are written to the `dist/` directory.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Next.js dev server on port 3100 |
| `npm run dev:electron` | Start Next.js + Electron in development mode |
| `npm run build` | Build the Next.js static export |
| `npm run build:electron` | Build Next.js and package the Electron app |
| `npm start` | Launch the packaged Electron app |
| `npm run lint` | Run ESLint |
| `npm run bump` | Bump the launcher version (`scripts/bump-version.js`) |

## Project Structure

```
avosos/
├── electron/              # Electron main & preload processes
│   ├── main.js            # Main process — window management, IPC, system monitoring
│   └── preload.js         # Context bridge exposing safe APIs to the renderer
├── public/                # Static assets and app icons
├── scripts/               # Utility scripts (version bumping)
├── src/
│   ├── app/               # Next.js App Router entry (layout, page, global styles)
│   ├── components/
│   │   ├── admin/         # Admin board
│   │   ├── dashboard/     # Dashboard view with system stats
│   │   ├── icons/         # Custom SVG icon components
│   │   ├── layout/        # Shell layout — sidebar, titlebar, main layout
│   │   ├── library/       # App library & detail views
│   │   ├── profiles/      # Environment profiles management
│   │   ├── projects/      # Project management view
│   │   └── settings/      # User settings view
│   ├── lib/               # App registry and shared utilities
│   ├── stores/            # Zustand state stores
│   └── types/             # TypeScript type definitions
├── package.json
├── next.config.ts         # Next.js config (static export)
├── tsconfig.json
└── eslint.config.mjs
```

## Architecture

The launcher follows a **frameless Electron** window pattern with a custom titlebar. The renderer process is a statically exported **Next.js** app loaded from the `out/` directory in production, or served via the dev server during development.

All communication between the renderer and main process goes through a secure **context bridge** (`preload.js`), exposing a typed `window.electronAPI` surface for:

- Window controls (minimise, maximise, close)
- Application launching & process management
- System information & real-time resource monitoring
- File system access & persistent data storage
- Git-based project metadata and version management
- Native dialogs and shell integration

Global state is managed with **Zustand**, centralised in a single launcher store that handles navigation, application state, projects, profiles, and system stats.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m "feat: add my feature"`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## Author

**Avosos** — [github.com/Avosos](https://github.com/Avosos)
