/* ══════════════════════════════════════════════════════════════════════════════
 * Avosos Launcher — Internationalization (i18n)
 * Supports: English (en), German (de)
 * ══════════════════════════════════════════════════════════════════════════════ */

export type Language = "en" | "de";

export interface Translations {
  // ─── Titlebar ───────────────────────────────
  titlebar: {
    brand: string;
    subtitle: string;
  };
  // ─── Sidebar ────────────────────────────────
  sidebar: {
    navigation: string;
    dashboard: string;
    library: string;
    projects: string;
    store: string;
    settings: string;
    system: string;
    admin: string;
    cpu: string;
    ram: string;
    connecting: string;
    alpha: string;
  };
  // ─── Notifications ──────────────────────────
  notifications: {
    title: string;
    clearAll: string;
    empty: string;
    justNow: string;
    minutesAgo: string;
    hoursAgo: string;
    daysAgo: string;
  };
  // ─── Dashboard ──────────────────────────────
  dashboard: {
    welcome: string;
    subtitle: string;
    activeProfile: string;
    quickLaunch: string;
    installedApps: string;
    running: string;
    projects: string;
    profiles: string;
    applications: string;
    allRegistered: string;
    viewLibrary: string;
    addApplication: string;
    recentActivity: string;
    recentlyUsedTools: string;
    lastUsed: string;
    systemMonitor: string;
    cpuLabel: string;
    memoryLabel: string;
    gpuLabel: string;
    diskLabel: string;
    na: string;
    detecting: string;
    activeProfileSection: string;
    appsConfigured: string;
    manageStore: string;
    updates: string;
    allUpToDate: string;
    updatesAvailable: string;
    stop: string;
    installing: string;
    starting: string;
    removing: string;
    install: string;
    launch: string;
  };
  // ─── Library ────────────────────────────────
  library: {
    title: string;
    appsRegistered: string;
    installed: string;
    searchPlaceholder: string;
    allCategories: string;
    filterAll: string;
    filterInstalled: string;
    filterAvailable: string;
    badgeStarting: string;
    badgeRunning: string;
    badgeRemoving: string;
    stop: string;
    installing: string;
    starting: string;
    removing: string;
    install: string;
    launch: string;
    details: string;
    uninstall: string;
    noAppsFound: string;
    noAppsHint: string;
  };
  // ─── App Detail ─────────────────────────────
  appDetail: {
    notFound: string;
    backToLibrary: string;
    running: string;
    byVendor: string;
    installing: string;
    install: string;
    launch: string;
    runningBtn: string;
    github: string;
    openSource: string;
    uninstall: string;
    uninstallConfirm: string;
    tabOverview: string;
    tabChangelog: string;
    tabVersions: string;
    tabPlugins: string;
    tabCompatibility: string;
    about: string;
    tags: string;
    installedPlugins: string;
    updateSettings: string;
    autoUpdate: string;
    comingSoon: string;
    sourceLocation: string;
    version: string;
    size: string;
    updated: string;
    versionsAvailable: string;
    pluginsTotal: string;
    changelogTitle: string;
    changelogDesc: string;
    noChangelog: string;
    noChangelogHint: string;
    breaking: string;
    commitFeature: string;
    commitFix: string;
    commitRefactor: string;
    commitDocs: string;
    commitPerf: string;
    commitChore: string;
    commitStyle: string;
    commitTest: string;
    commitBuild: string;
    commitCI: string;
    commitRevert: string;
    commitGeneric: string;
    allFilter: string;
    versionManagement: string;
    versionManagementDesc: string;
    bumpVersion: string;
    currentLabel: string;
    bumpAutoDesc: string;
    bumpAuto: string;
    bumpPatch: string;
    bumpMinor: string;
    bumpMajor: string;
    detecting: string;
    bumping: string;
    current: string;
    currentlyInstalled: string;
    availableForInstall: string;
    versionInstallHint: string;
    pluginManagement: string;
    pluginManagementDesc: string;
    noPlugins: string;
    manage: string;
    pluginComingSoon: string;
    compatibilityMatrix: string;
    compatibilityDesc: string;
    noCompatData: string;
    platforms: string;
    minRam: string;
    notes: string;
    windows: string;
    macos: string;
    linux: string;
  };
  // ─── Settings ───────────────────────────────
  settings: {
    general: string;
    appearance: string;
    notificationsTab: string;
    updatesTab: string;
    storage: string;
    cloudSync: string;
    aboutTab: string;
    generalTitle: string;
    generalDesc: string;
    startOnBoot: string;
    startOnBootDesc: string;
    minimizeToTray: string;
    minimizeToTrayDesc: string;
    confirmLaunch: string;
    confirmLaunchDesc: string;
    language: string;
    languageDesc: string;
    defaultPaths: string;
    installDir: string;
    installDirDefault: string;
    projectsDir: string;
    projectsDirDefault: string;
    change: string;
    appearanceTitle: string;
    appearanceDesc: string;
    theme: string;
    dark: string;
    grey: string;
    light: string;
    accentColor: string;
    accentColorDesc: string;
    purple: string;
    blue: string;
    green: string;
    amber: string;
    red: string;
    pink: string;
    notificationsTitle: string;
    notificationsDesc: string;
    installProgress: string;
    installProgressDesc: string;
    updateAlerts: string;
    updateAlertsDesc: string;
    launchEvents: string;
    launchEventsDesc: string;
    notificationHistory: string;
    notificationCount: string;
    notificationSessionDesc: string;
    clearAll: string;
    updatesTitle: string;
    updatesDesc: string;
    autoCheck: string;
    autoCheckDesc: string;
    autoInstall: string;
    autoInstallDesc: string;
    checkForUpdates: string;
    lastChecked: string;
    updatesAvailable: string;
    allUpToDate: string;
    checkFailed: string;
    checking: string;
    checkNow: string;
    diskOverview: string;
    diskOverviewDesc: string;
    used: string;
    free: string;
    total: string;
    launcherStorage: string;
    launcherStorageDesc: string;
    cacheSize: string;
    cacheSizeDesc: string;
    calculating: string;
    clear: string;
    clearing: string;
    appData: string;
    appDataDesc: string;
    installedApps: string;
    installedAppsDesc: string;
    cloudSyncTitle: string;
    cloudSyncDesc: string;
    serverUrl: string;
    serverUrlDesc: string;
    serverUrlPlaceholder: string;
    syncSettings: string;
    syncSettingsDesc: string;
    syncProjects: string;
    syncProjectsDesc: string;
    lastSync: string;
    lastSyncNever: string;
    syncNow: string;
    serverRequired: string;
    cloudSyncAlert: string;
    aboutTitle: string;
    aboutName: string;
    aboutVersion: string;
    aboutDesc: string;
    systemInfo: string;
    systemInfoDesc: string;
    platform: string;
    architecture: string;
    hostname: string;
    cpuLabel: string;
    cpuCores: string;
    totalMemory: string;
    gpuLabel: string;
    vram: string;
    uptime: string;
    links: string;
    githubOrg: string;
  };
  // ─── Store ──────────────────────────────────
  store: {
    title: string;
    description: string;
    featured: string;
    featuredTitle: string;
    featuredDesc: string;
    searchPlaceholder: string;
    allCategories: string;
    maintenance: string;
    running: string;
    free: string;
    starting: string;
    installing: string;
    install: string;
    launch: string;
    activateLicense: string;
    uninstalling: string;
    licenseStatus: string;
    modalTitle: string;
    licenseKey: string;
    licensePlaceholder: string;
    licenseError: string;
    cancel: string;
    validating: string;
    activate: string;
  };
  // ─── Projects ───────────────────────────────
  projects: {
    title: string;
    projectCount: string;
    activeCount: string;
    newProject: string;
    searchPlaceholder: string;
    filterAll: string;
    filterActive: string;
    filterPaused: string;
    filterCompleted: string;
    filterArchived: string;
    statusActive: string;
    statusPaused: string;
    statusCompleted: string;
    statusArchived: string;
    priorityLow: string;
    priorityMedium: string;
    priorityHigh: string;
    statusLabel: string;
    priorityLabel: string;
    deadlineLabel: string;
    openFolder: string;
    toolchain: string;
    notesSection: string;
    save: string;
    edit: string;
    notesPlaceholder: string;
    noNotes: string;
    recentActivity: string;
    justNow: string;
    minutesAgo: string;
    hoursAgo: string;
    daysAgo: string;
    deleteBtn: string;
    deleteConfirm: string;
    openProject: string;
    emptyTitle: string;
    emptyDesc: string;
    createProject: string;
    modalTitle: string;
    projectName: string;
    projectNamePlaceholder: string;
    description: string;
    descriptionPlaceholder: string;
    requiredApps: string;
    tagsLabel: string;
    tagsPlaceholder: string;
    priority: string;
    deadline: string;
    projectDir: string;
    projectDirPlaceholder: string;
    cancel: string;
    createBtn: string;
  };
  // ─── Profiles ───────────────────────────────
  profiles: {
    title: string;
    description: string;
    defaultDesc: string;
    createProfile: string;
    createProfileDesc: string;
    active: string;
    applicationsCount: string;
    noApps: string;
    configure: string;
    activate: string;
    removeConfirm: string;
    editorComingSoon: string;
  };
  // ─── Admin ──────────────────────────────────
  admin: {
    title: string;
    controlPanel: string;
    tabOverview: string;
    tabAppMgmt: string;
    tabUserMgmt: string;
    tabDevTools: string;
    tabMaintenance: string;
    tabSecurity: string;
    // Overview
    overviewTitle: string;
    overviewDesc: string;
    registeredApps: string;
    running: string;
    cpu: string;
    memory: string;
    installedWithSource: string;
    noAppsRunning: string;
    registeredAppsTable: string;
    colApp: string;
    colVersion: string;
    colCategory: string;
    colSource: string;
    colStatus: string;
    statusRunning: string;
    statusInstalled: string;
    statusNotInstalled: string;
    profilesCard: string;
    profilesDesc: string;
    projectsCard: string;
    projectsDesc: string;
    platformCard: string;
    unknownCpu: string;
    // App Management
    appMgmtTitle: string;
    appMgmtDesc: string;
    scanning: string;
    scanForProjects: string;
    bumpingAll: string;
    autoBumpAll: string;
    refreshMetadata: string;
    scanResults: string;
    dismiss: string;
    noProjectsFound: string;
    runningBadge: string;
    noSourcePath: string;
    details: string;
    uncommitted: string;
    clean: string;
    ahead: string;
    behind: string;
    deployLabel: string;
    rollback: string;
    rollbackTitle: string;
    maintenanceToggle: string;
    maintenancePlaceholder: string;
    // User Management
    userMgmtTitle: string;
    userMgmtDesc: string;
    addUser: string;
    username: string;
    email: string;
    role: string;
    usernamePlaceholder: string;
    emailPlaceholder: string;
    roleUser: string;
    roleAdmin: string;
    addBtn: string;
    registeredUsers: string;
    noUsersYet: string;
    colUsername: string;
    colEmail: string;
    colRole: string;
    colLastLogin: string;
    colStatusUser: string;
    colActions: string;
    never: string;
    userActive: string;
    userInactive: string;
    demote: string;
    promote: string;
    removeUserConfirm: string;
    // Developer Tools
    devToolsTitle: string;
    devToolsDesc: string;
    detectedRuntimes: string;
    detectingRuntimes: string;
    notInstalled: string;
    envVars: string;
    hide: string;
    show: string;
    filterVars: string;
    noEnvVars: string;
    quickActions: string;
    openDataDir: string;
    openGithub: string;
    // Maintenance
    maintenanceTitle: string;
    maintenanceDesc: string;
    cacheMgmt: string;
    cacheMgmtDesc: string;
    clearingCaches: string;
    clearAllCaches: string;
    cacheCleared: string;
    cacheClearFailed: string;
    configBackup: string;
    configBackupDesc: string;
    exporting: string;
    exportToClipboard: string;
    importing: string;
    importFromClipboard: string;
    exportSuccess: string;
    exportFailed: string;
    importSuccess: string;
    importInvalid: string;
    importFailed: string;
    launcherLogs: string;
    showLogs: string;
    hideLogs: string;
    noLogs: string;
    // Security
    securityTitle: string;
    securityDesc: string;
    adminProtection: string;
    lockAdmin: string;
    lockAdminDesc: string;
    confirmDestructive: string;
    confirmDestructiveDesc: string;
    developerMode: string;
    developerModeDesc: string;
    pathRestrictions: string;
    pathRestrictionsDesc: string;
    enablePathRestrictions: string;
    enablePathRestrictionsDesc: string;
    allowedDirs: string;
    addDir: string;
    noPaths: string;
    dangerZone: string;
    dangerZoneDesc: string;
    resetConfirm: string;
    resetLauncher: string;
  };
  // ─── Default Profile Names ──────────────────
  defaultProfiles: {
    videoProduction: string;
    videoProductionDesc: string;
    development: string;
    developmentDesc: string;
    design: string;
    designDesc: string;
  };
  // ─── Common ─────────────────────────────────
  common: {
    save: string;
    cancel: string;
    delete: string;
    loading: string;
    close: string;
  };
}

const en: Translations = {
  titlebar: {
    brand: "AVOSOS",
    subtitle: "Launcher",
  },
  sidebar: {
    navigation: "Navigation",
    dashboard: "Dashboard",
    library: "Library",
    projects: "Projects",
    store: "Store",
    settings: "Settings",
    system: "System",
    admin: "Admin",
    cpu: "CPU",
    ram: "RAM",
    connecting: "Connecting…",
    alpha: "alpha",
  },
  notifications: {
    title: "Notifications",
    clearAll: "Clear all",
    empty: "No notifications",
    justNow: "just now",
    minutesAgo: "{n}m ago",
    hoursAgo: "{n}h ago",
    daysAgo: "{n}d ago",
  },
  dashboard: {
    welcome: "Welcome back",
    subtitle: "Your professional workspace is ready. Launch apps, manage projects, and orchestrate your workflow.",
    activeProfile: "Active profile:",
    quickLaunch: "Quick Launch",
    installedApps: "Installed Apps",
    running: "Running",
    projects: "Projects",
    profiles: "Profiles",
    applications: "Applications",
    allRegistered: "All registered applications",
    viewLibrary: "View Library",
    addApplication: "Add Application",
    recentActivity: "Recent Activity",
    recentlyUsedTools: "Recently used tools",
    lastUsed: "Last used {time}",
    systemMonitor: "System Monitor",
    cpuLabel: "CPU",
    memoryLabel: "Memory",
    gpuLabel: "GPU",
    diskLabel: "Disk",
    na: "N/A",
    detecting: "detecting…",
    activeProfileSection: "Active Profile",
    appsConfigured: "{n} app(s) configured",
    manageStore: "Manage Store",
    updates: "Updates",
    allUpToDate: "All applications are up to date.",
    updatesAvailable: "{n} app(s) can be updated.",
    stop: "Stop",
    installing: "Installing…",
    starting: "Starting…",
    removing: "Removing…",
    install: "Install",
    launch: "Launch",
  },
  library: {
    title: "Library",
    appsRegistered: "{n} application(s) registered",
    installed: "installed",
    searchPlaceholder: "Search applications…",
    allCategories: "All Categories",
    filterAll: "all",
    filterInstalled: "installed",
    filterAvailable: "available",
    badgeStarting: "Starting…",
    badgeRunning: "Running",
    badgeRemoving: "Removing…",
    stop: "Stop",
    installing: "Installing…",
    starting: "Starting…",
    removing: "Removing…",
    install: "Install",
    launch: "Launch",
    details: "Details",
    uninstall: "Uninstall",
    noAppsFound: "No applications found",
    noAppsHint: "Try adjusting your search or filter criteria.",
  },
  appDetail: {
    notFound: "Application not found.",
    backToLibrary: "Back to Library",
    running: "Running",
    byVendor: "by {vendor}",
    installing: "Installing…",
    install: "Install",
    launch: "Launch",
    runningBtn: "Running",
    github: "GitHub",
    openSource: "Open Source",
    uninstall: "Uninstall",
    uninstallConfirm: "Uninstall {name}? This will delete all local files.",
    tabOverview: "Overview",
    tabChangelog: "Changelog",
    tabVersions: "Versions",
    tabPlugins: "Plugins",
    tabCompatibility: "Compatibility",
    about: "About",
    tags: "Tags",
    installedPlugins: "Installed Plugins",
    updateSettings: "Update Settings",
    autoUpdate: "Auto-update",
    comingSoon: "Coming Soon",
    sourceLocation: "Source Location",
    version: "Version",
    size: "Size",
    updated: "Updated",
    versionsAvailable: "{n} available",
    pluginsTotal: "{n} total",
    changelogTitle: "Changelog",
    changelogDesc: "Recent changes from the project's git history. Uses Conventional Commits for automatic categorization.",
    noChangelog: "No changelog available",
    noChangelogHint: "This project may not have a git repository or no commits were found.",
    breaking: "BREAKING",
    commitFeature: "Feature",
    commitFix: "Fix",
    commitRefactor: "Refactor",
    commitDocs: "Docs",
    commitPerf: "Perf",
    commitChore: "Chore",
    commitStyle: "Style",
    commitTest: "Test",
    commitBuild: "Build",
    commitCI: "CI",
    commitRevert: "Revert",
    commitGeneric: "Commit",
    allFilter: "All ({n})",
    versionManagement: "Version Management",
    versionManagementDesc: "Bump, pin, or rollback versions. Changes are applied to the project's source files.",
    bumpVersion: "Bump Version",
    currentLabel: "Current:",
    bumpAutoDesc: "updates package.json and/or Cargo.toml automatically",
    bumpAuto: "Auto",
    bumpPatch: "Patch",
    bumpMinor: "Minor",
    bumpMajor: "Major",
    detecting: "Detecting...",
    bumping: "Bumping...",
    current: "Current",
    currentlyInstalled: "Currently installed and active",
    availableForInstall: "Available for installation",
    versionInstallHint: "Version-specific install not yet supported. Use Bump to manage the active version.",
    pluginManagement: "Plugin Management",
    pluginManagementDesc: "Install, manage, and configure plugins and extensions for {name}.",
    noPlugins: "No plugins available",
    manage: "Manage",
    pluginComingSoon: "Plugin management for {name} coming soon",
    compatibilityMatrix: "Compatibility Matrix",
    compatibilityDesc: "System requirements and compatibility information.",
    noCompatData: "No compatibility data available.",
    platforms: "Platforms",
    minRam: "Min. RAM",
    notes: "Notes",
    windows: "Windows",
    macos: "macOS",
    linux: "Linux",
  },
  settings: {
    general: "General",
    appearance: "Appearance",
    notificationsTab: "Notifications",
    updatesTab: "Updates",
    storage: "Storage",
    cloudSync: "Cloud Sync",
    aboutTab: "About",
    generalTitle: "General",
    generalDesc: "Basic launcher behavior",
    startOnBoot: "Start on system boot",
    startOnBootDesc: "Automatically launch Avosos when you log in",
    minimizeToTray: "Minimize to tray",
    minimizeToTrayDesc: "Keep running in the system tray when closed",
    confirmLaunch: "Confirm before launching",
    confirmLaunchDesc: "Show confirmation dialog before starting applications",
    language: "Language",
    languageDesc: "Choose the interface language",
    defaultPaths: "Default Paths",
    installDir: "Install directory",
    installDirDefault: "Not set – using default location",
    projectsDir: "Projects directory",
    projectsDirDefault: "Not set – using default location",
    change: "Change",
    appearanceTitle: "Appearance",
    appearanceDesc: "Customize the launcher look and feel",
    theme: "Theme",
    dark: "Dark",
    grey: "Grey",
    light: "Light",
    accentColor: "Accent color",
    accentColorDesc: "Primary color used throughout the launcher",
    purple: "Purple",
    blue: "Blue",
    green: "Green",
    amber: "Amber",
    red: "Red",
    pink: "Pink",
    notificationsTitle: "Notifications",
    notificationsDesc: "Control what notifications you receive",
    installProgress: "Install / Uninstall progress",
    installProgressDesc: "Show progress bar during installation and removal",
    updateAlerts: "Update alerts",
    updateAlertsDesc: "Notify when new app versions are available",
    launchEvents: "Launch events",
    launchEventsDesc: "Show notification when an app starts or stops",
    notificationHistory: "Notification History",
    notificationCount: "{n} notification(s)",
    notificationSessionDesc: "Total notifications in the current session",
    clearAll: "Clear All",
    updatesTitle: "Updates",
    updatesDesc: "How updates are handled",
    autoCheck: "Automatically check for updates",
    autoCheckDesc: "Periodically check if new versions are available",
    autoInstall: "Auto-install updates",
    autoInstallDesc: "Automatically download and install available updates",
    checkForUpdates: "Check for updates",
    lastChecked: "Last checked: unknown",
    updatesAvailable: "{n} update(s) available",
    allUpToDate: "All applications are up to date.",
    checkFailed: "Failed to check for updates.",
    checking: "Checking…",
    checkNow: "Check Now",
    diskOverview: "Disk Overview",
    diskOverviewDesc: "System drive usage",
    used: "Used:",
    free: "Free:",
    total: "Total:",
    launcherStorage: "Launcher Storage",
    launcherStorageDesc: "Manage disk space and cache",
    cacheSize: "Cache size",
    cacheSizeDesc: "Temporary files and download cache",
    calculating: "Calculating…",
    clear: "Clear",
    clearing: "Clearing…",
    appData: "Application data",
    appDataDesc: "Settings, profiles, and configuration files",
    installedApps: "Installed Applications",
    installedAppsDesc: "Storage per installed app",
    cloudSyncTitle: "Cloud Synchronization",
    cloudSyncDesc: "Sync your settings and projects across devices (requires Avosos server)",
    serverUrl: "Server URL",
    serverUrlDesc: "Your Avosos sync server address",
    serverUrlPlaceholder: "https://your-server.example.com",
    syncSettings: "Sync settings",
    syncSettingsDesc: "Synchronize launcher preferences and appearance",
    syncProjects: "Sync projects",
    syncProjectsDesc: "Synchronize project metadata and configuration",
    lastSync: "Last sync",
    lastSyncNever: "Never — server not configured",
    syncNow: "Sync Now",
    serverRequired: "Server required",
    cloudSyncAlert: "Cloud sync requires a configured Avosos server. This feature will be available in a future update.",
    aboutTitle: "About Avosos Launcher",
    aboutName: "Avosos Launcher",
    aboutVersion: "Version 0.1.0 (alpha)",
    aboutDesc: "Universal application launcher for professional workflows",
    systemInfo: "System Information",
    systemInfoDesc: "Your machine details",
    platform: "Platform",
    architecture: "Architecture",
    hostname: "Hostname",
    cpuLabel: "CPU",
    cpuCores: "CPU Cores",
    totalMemory: "Total Memory",
    gpuLabel: "GPU",
    vram: "VRAM",
    uptime: "Uptime",
    links: "Links",
    githubOrg: "GitHub Organization",
  },
  store: {
    title: "Store",
    description: "Browse, install, and manage Avosos applications. Activate licenses to unlock premium features.",
    featured: "Featured",
    featuredTitle: "Avosos Application Suite",
    featuredDesc: "Professional-grade tools for video editing, audio processing, writing, manga reading, and more. All free to install.",
    searchPlaceholder: "Search store…",
    allCategories: "All Categories",
    maintenance: "Maintenance",
    running: "Running",
    free: "Free",
    starting: "Starting…",
    installing: "Installing…",
    install: "Install",
    launch: "Launch",
    activateLicense: "Activate License",
    uninstalling: "Uninstalling…",
    licenseStatus: "License: {status}",
    modalTitle: "Activate License",
    licenseKey: "License Key",
    licensePlaceholder: "XXXX-XXXX-XXXX-XXXX",
    licenseError: "Invalid license key. Please check and try again.",
    cancel: "Cancel",
    validating: "Validating…",
    activate: "Activate",
  },
  projects: {
    title: "Projects",
    projectCount: "{n} project(s)",
    activeCount: "{n} active",
    newProject: "New Project",
    searchPlaceholder: "Search projects…",
    filterAll: "all",
    filterActive: "active",
    filterPaused: "paused",
    filterCompleted: "completed",
    filterArchived: "archived",
    statusActive: "Active",
    statusPaused: "Paused",
    statusCompleted: "Completed",
    statusArchived: "Archived",
    priorityLow: "Low",
    priorityMedium: "Medium",
    priorityHigh: "High",
    statusLabel: "Status:",
    priorityLabel: "Priority:",
    deadlineLabel: "Deadline:",
    openFolder: "Open Folder",
    toolchain: "Toolchain",
    notesSection: "Notes",
    save: "Save",
    edit: "Edit",
    notesPlaceholder: "Add notes about this project…",
    noNotes: "No notes yet. Click Edit to add some.",
    recentActivity: "Recent Activity",
    justNow: "just now",
    minutesAgo: "{n}m ago",
    hoursAgo: "{n}h ago",
    daysAgo: "{n}d ago",
    deleteBtn: "Delete",
    deleteConfirm: "Delete project \"{name}\"?",
    openProject: "Open Project",
    emptyTitle: "No projects yet",
    emptyDesc: "Projects group your applications, versions, and settings together. Create your first project to get started.",
    createProject: "Create Project",
    modalTitle: "Create Project",
    projectName: "Project Name *",
    projectNamePlaceholder: "My Video Project",
    description: "Description",
    descriptionPlaceholder: "What is this project about?",
    requiredApps: "Required Applications",
    tagsLabel: "Tags (comma separated)",
    tagsPlaceholder: "video, youtube, tutorial",
    priority: "Priority",
    deadline: "Deadline (optional)",
    projectDir: "Project Directory (optional)",
    projectDirPlaceholder: "Select a folder…",
    cancel: "Cancel",
    createBtn: "Create Project",
  },
  profiles: {
    title: "Environment Profiles",
    description: "Profiles define a curated set of tools, versions, plugins, and configurations. Switch between profiles to instantly change your working environment. Profiles are portable and can restore your setup on any machine.",
    defaultDesc: "Custom environment profile",
    createProfile: "Create Profile",
    createProfileDesc: "Define a new environment configuration",
    active: "Active",
    applicationsCount: "Applications ({n})",
    noApps: "No applications configured yet",
    configure: "Configure",
    activate: "Activate",
    removeConfirm: "Remove profile \"{name}\"?",
    editorComingSoon: "Profile editor coming soon",
  },
  admin: {
    title: "Admin",
    controlPanel: "Control Panel",
    tabOverview: "Overview",
    tabAppMgmt: "App Management",
    tabUserMgmt: "User Management",
    tabDevTools: "Developer Tools",
    tabMaintenance: "Maintenance",
    tabSecurity: "Access & Security",
    overviewTitle: "Admin Overview",
    overviewDesc: "System health, registered applications, and launcher status at a glance.",
    registeredApps: "Registered Apps",
    running: "Running",
    cpu: "CPU",
    memory: "Memory",
    installedWithSource: "installed, {n} with source",
    noAppsRunning: "No apps running",
    registeredAppsTable: "Registered Applications",
    colApp: "App",
    colVersion: "Version",
    colCategory: "Category",
    colSource: "Source",
    colStatus: "Status",
    statusRunning: "Running",
    statusInstalled: "Installed",
    statusNotInstalled: "Not installed",
    profilesCard: "Profiles",
    profilesDesc: "environment profiles configured",
    projectsCard: "Projects",
    projectsDesc: "projects tracked",
    platformCard: "Platform",
    unknownCpu: "Unknown CPU",
    appMgmtTitle: "App Management",
    appMgmtDesc: "Manage registered applications, scan for new projects, and perform bulk operations.",
    scanning: "Scanning...",
    scanForProjects: "Scan for Projects",
    bumpingAll: "Bumping all...",
    autoBumpAll: "Auto-Bump All",
    refreshMetadata: "Refresh All Metadata",
    scanResults: "Scan Results ({n} found)",
    dismiss: "Dismiss",
    noProjectsFound: "No projects found in the selected directory.",
    runningBadge: "RUNNING",
    noSourcePath: "No source path configured",
    details: "Details",
    uncommitted: "Uncommitted changes",
    clean: "Clean",
    ahead: "{n} ahead",
    behind: "{n} behind",
    deployLabel: "Deploy:",
    rollback: "Rollback",
    rollbackTitle: "Rollback to current version",
    maintenanceToggle: "Maintenance",
    maintenancePlaceholder: "Maintenance message (optional)",
    userMgmtTitle: "User Management",
    userMgmtDesc: "Manage launcher users, assign roles, and control access levels.",
    addUser: "Add User",
    username: "Username",
    email: "Email",
    role: "Role",
    usernamePlaceholder: "johndoe",
    emailPlaceholder: "john@example.com",
    roleUser: "User",
    roleAdmin: "Admin",
    addBtn: "Add",
    registeredUsers: "Registered Users ({n})",
    noUsersYet: "No users registered yet. Add a user above.",
    colUsername: "Username",
    colEmail: "Email",
    colRole: "Role",
    colLastLogin: "Last Login",
    colStatusUser: "Status",
    colActions: "Actions",
    never: "Never",
    userActive: "Active",
    userInactive: "Inactive",
    demote: "Demote",
    promote: "Promote",
    removeUserConfirm: "Remove user {username}?",
    devToolsTitle: "Developer Tools",
    devToolsDesc: "Runtime detection, environment diagnostics, and development utilities.",
    detectedRuntimes: "Detected Runtimes",
    detectingRuntimes: "Detecting installed runtimes...",
    notInstalled: "Not installed",
    envVars: "Environment Variables",
    hide: "Hide",
    show: "Show",
    filterVars: "Filter variables...",
    noEnvVars: "No environment variables available.",
    quickActions: "Quick Actions",
    openDataDir: "Open Data Directory",
    openGithub: "Open GitHub",
    maintenanceTitle: "Maintenance",
    maintenanceDesc: "Cache management, configuration backup, and launcher diagnostics.",
    cacheMgmt: "Cache Management",
    cacheMgmtDesc: "Clear temporary files, download cache, and code cache to free up disk space.",
    clearingCaches: "Clearing...",
    clearAllCaches: "Clear All Caches",
    cacheCleared: "Cleared {n} cached files.",
    cacheClearFailed: "Failed to clear cache.",
    configBackup: "Configuration Backup",
    configBackupDesc: "Export your launcher configuration to clipboard or import from clipboard.",
    exporting: "Exporting...",
    exportToClipboard: "Export to Clipboard",
    importing: "Importing...",
    importFromClipboard: "Import from Clipboard",
    exportSuccess: "Configuration copied to clipboard!",
    exportFailed: "Failed to export configuration.",
    importSuccess: "Configuration imported successfully! Restart to apply.",
    importInvalid: "Invalid configuration format.",
    importFailed: "Failed to read from clipboard.",
    launcherLogs: "Launcher Logs",
    showLogs: "Show Logs",
    hideLogs: "Hide",
    noLogs: "No logs recorded yet. Logs are captured while the launcher is running.",
    securityTitle: "Access & Security",
    securityDesc: "Control who can access admin features and restrict launcher behavior.",
    adminProtection: "Admin Protection",
    lockAdmin: "Lock admin panel",
    lockAdminDesc: "Require confirmation before accessing admin settings",
    confirmDestructive: "Confirm destructive actions",
    confirmDestructiveDesc: "Show a confirmation dialog before clearing caches or importing configs",
    developerMode: "Developer mode",
    developerModeDesc: "Enable developer features like version bumping, git status, and project scanning",
    pathRestrictions: "Path Restrictions",
    pathRestrictionsDesc: "Restrict which directories the launcher can access for scanning and launching applications.",
    enablePathRestrictions: "Enable path restrictions",
    enablePathRestrictionsDesc: "Only allow apps from specified directories",
    allowedDirs: "Allowed Directories",
    addDir: "+ Add",
    noPaths: "No paths added — all directories are currently blocked.",
    dangerZone: "Danger Zone",
    dangerZoneDesc: "Irreversible actions that affect your entire launcher state. Proceed with caution.",
    resetConfirm: "Reset all launcher settings to defaults? This cannot be undone.",
    resetLauncher: "Reset Launcher",
  },
  defaultProfiles: {
    videoProduction: "Video Production",
    videoProductionDesc: "Professional video editing setup",
    development: "Development",
    developmentDesc: "Full development environment",
    design: "Design",
    designDesc: "Graphics and design workflow",
  },
  common: {
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    loading: "Loading…",
    close: "Close",
  },
};

const de: Translations = {
  titlebar: {
    brand: "AVOSOS",
    subtitle: "Launcher",
  },
  sidebar: {
    navigation: "Navigation",
    dashboard: "Dashboard",
    library: "Bibliothek",
    projects: "Projekte",
    store: "Store",
    settings: "Einstellungen",
    system: "System",
    admin: "Admin",
    cpu: "CPU",
    ram: "RAM",
    connecting: "Verbinde…",
    alpha: "Alpha",
  },
  notifications: {
    title: "Benachrichtigungen",
    clearAll: "Alle löschen",
    empty: "Keine Benachrichtigungen",
    justNow: "gerade eben",
    minutesAgo: "vor {n} Min.",
    hoursAgo: "vor {n} Std.",
    daysAgo: "vor {n} Tagen",
  },
  dashboard: {
    welcome: "Willkommen zurück",
    subtitle: "Dein professioneller Arbeitsbereich ist bereit. Starte Apps, verwalte Projekte und koordiniere deinen Workflow.",
    activeProfile: "Aktives Profil:",
    quickLaunch: "Schnellstart",
    installedApps: "Installierte Apps",
    running: "Laufend",
    projects: "Projekte",
    profiles: "Profile",
    applications: "Anwendungen",
    allRegistered: "Alle registrierten Anwendungen",
    viewLibrary: "Bibliothek ansehen",
    addApplication: "Anwendung hinzufügen",
    recentActivity: "Letzte Aktivitäten",
    recentlyUsedTools: "Zuletzt verwendete Tools",
    lastUsed: "Zuletzt genutzt {time}",
    systemMonitor: "Systemmonitor",
    cpuLabel: "CPU",
    memoryLabel: "Arbeitsspeicher",
    gpuLabel: "GPU",
    diskLabel: "Festplatte",
    na: "N/A",
    detecting: "Erkennung…",
    activeProfileSection: "Aktives Profil",
    appsConfigured: "{n} App(s) konfiguriert",
    manageStore: "Store verwalten",
    updates: "Updates",
    allUpToDate: "Alle Anwendungen sind aktuell.",
    updatesAvailable: "{n} App(s) können aktualisiert werden.",
    stop: "Stoppen",
    installing: "Installiere…",
    starting: "Starte…",
    removing: "Entferne…",
    install: "Installieren",
    launch: "Starten",
  },
  library: {
    title: "Bibliothek",
    appsRegistered: "{n} Anwendung(en) registriert",
    installed: "installiert",
    searchPlaceholder: "Anwendungen suchen…",
    allCategories: "Alle Kategorien",
    filterAll: "Alle",
    filterInstalled: "Installiert",
    filterAvailable: "Verfügbar",
    badgeStarting: "Startet…",
    badgeRunning: "Läuft",
    badgeRemoving: "Entferne…",
    stop: "Stoppen",
    installing: "Installiere…",
    starting: "Starte…",
    removing: "Entferne…",
    install: "Installieren",
    launch: "Starten",
    details: "Details",
    uninstall: "Deinstallieren",
    noAppsFound: "Keine Anwendungen gefunden",
    noAppsHint: "Versuche, deine Suche oder Filterkriterien anzupassen.",
  },
  appDetail: {
    notFound: "Anwendung nicht gefunden.",
    backToLibrary: "Zurück zur Bibliothek",
    running: "Läuft",
    byVendor: "von {vendor}",
    installing: "Installiere…",
    install: "Installieren",
    launch: "Starten",
    runningBtn: "Läuft",
    github: "GitHub",
    openSource: "Open Source",
    uninstall: "Deinstallieren",
    uninstallConfirm: "{name} deinstallieren? Alle lokalen Dateien werden gelöscht.",
    tabOverview: "Übersicht",
    tabChangelog: "Änderungsprotokoll",
    tabVersions: "Versionen",
    tabPlugins: "Plugins",
    tabCompatibility: "Kompatibilität",
    about: "Über",
    tags: "Tags",
    installedPlugins: "Installierte Plugins",
    updateSettings: "Update-Einstellungen",
    autoUpdate: "Auto-Update",
    comingSoon: "Demnächst",
    sourceLocation: "Quellpfad",
    version: "Version",
    size: "Größe",
    updated: "Aktualisiert",
    versionsAvailable: "{n} verfügbar",
    pluginsTotal: "{n} gesamt",
    changelogTitle: "Änderungsprotokoll",
    changelogDesc: "Letzte Änderungen aus der Git-Historie des Projekts. Nutzt Conventional Commits zur automatischen Kategorisierung.",
    noChangelog: "Kein Änderungsprotokoll verfügbar",
    noChangelogHint: "Dieses Projekt hat möglicherweise kein Git-Repository oder keine Commits.",
    breaking: "BREAKING",
    commitFeature: "Feature",
    commitFix: "Fix",
    commitRefactor: "Refactor",
    commitDocs: "Doku",
    commitPerf: "Perf",
    commitChore: "Wartung",
    commitStyle: "Stil",
    commitTest: "Test",
    commitBuild: "Build",
    commitCI: "CI",
    commitRevert: "Revert",
    commitGeneric: "Commit",
    allFilter: "Alle ({n})",
    versionManagement: "Versionsverwaltung",
    versionManagementDesc: "Versionen hochsetzen, fixieren oder zurückrollen. Änderungen werden auf die Quelldateien des Projekts angewendet.",
    bumpVersion: "Version hochsetzen",
    currentLabel: "Aktuell:",
    bumpAutoDesc: "Aktualisiert package.json und/oder Cargo.toml automatisch",
    bumpAuto: "Auto",
    bumpPatch: "Patch",
    bumpMinor: "Minor",
    bumpMajor: "Major",
    detecting: "Erkennung...",
    bumping: "Wird hochgesetzt...",
    current: "Aktuell",
    currentlyInstalled: "Aktuell installiert und aktiv",
    availableForInstall: "Zur Installation verfügbar",
    versionInstallHint: "Versionsspezifische Installation wird noch nicht unterstützt. Nutze Bump, um die aktive Version zu verwalten.",
    pluginManagement: "Plugin-Verwaltung",
    pluginManagementDesc: "Plugins und Erweiterungen für {name} installieren, verwalten und konfigurieren.",
    noPlugins: "Keine Plugins verfügbar",
    manage: "Verwalten",
    pluginComingSoon: "Plugin-Verwaltung für {name} kommt bald",
    compatibilityMatrix: "Kompatibilitätsmatrix",
    compatibilityDesc: "Systemanforderungen und Kompatibilitätsinformationen.",
    noCompatData: "Keine Kompatibilitätsdaten verfügbar.",
    platforms: "Plattformen",
    minRam: "Min. RAM",
    notes: "Hinweise",
    windows: "Windows",
    macos: "macOS",
    linux: "Linux",
  },
  settings: {
    general: "Allgemein",
    appearance: "Darstellung",
    notificationsTab: "Benachrichtigungen",
    updatesTab: "Updates",
    storage: "Speicher",
    cloudSync: "Cloud-Sync",
    aboutTab: "Über",
    generalTitle: "Allgemein",
    generalDesc: "Grundlegendes Launcher-Verhalten",
    startOnBoot: "Beim Systemstart starten",
    startOnBootDesc: "Avosos automatisch beim Anmelden starten",
    minimizeToTray: "In Taskleiste minimieren",
    minimizeToTrayDesc: "Beim Schließen im Infobereich weiterlaufen",
    confirmLaunch: "Vor dem Starten bestätigen",
    confirmLaunchDesc: "Bestätigungsdialog vor dem Starten von Anwendungen anzeigen",
    language: "Sprache",
    languageDesc: "Wähle die Sprache der Benutzeroberfläche",
    defaultPaths: "Standardpfade",
    installDir: "Installationsverzeichnis",
    installDirDefault: "Nicht festgelegt – Standardort wird verwendet",
    projectsDir: "Projektverzeichnis",
    projectsDirDefault: "Nicht festgelegt – Standardort wird verwendet",
    change: "Ändern",
    appearanceTitle: "Darstellung",
    appearanceDesc: "Aussehen des Launchers anpassen",
    theme: "Farbschema",
    dark: "Dunkel",
    grey: "Grau",
    light: "Hell",
    accentColor: "Akzentfarbe",
    accentColorDesc: "Primärfarbe im gesamten Launcher",
    purple: "Lila",
    blue: "Blau",
    green: "Grün",
    amber: "Bernstein",
    red: "Rot",
    pink: "Rosa",
    notificationsTitle: "Benachrichtigungen",
    notificationsDesc: "Steuere, welche Benachrichtigungen du erhältst",
    installProgress: "Installations-/Deinstallationsfortschritt",
    installProgressDesc: "Fortschrittsbalken während Installation und Entfernung anzeigen",
    updateAlerts: "Update-Hinweise",
    updateAlertsDesc: "Benachrichtigung bei neuen App-Versionen",
    launchEvents: "Start-Ereignisse",
    launchEventsDesc: "Benachrichtigung beim Starten oder Stoppen einer App",
    notificationHistory: "Benachrichtigungsverlauf",
    notificationCount: "{n} Benachrichtigung(en)",
    notificationSessionDesc: "Benachrichtigungen in der aktuellen Sitzung",
    clearAll: "Alle löschen",
    updatesTitle: "Updates",
    updatesDesc: "Wie Updates behandelt werden",
    autoCheck: "Automatisch nach Updates suchen",
    autoCheckDesc: "Regelmäßig prüfen, ob neue Versionen verfügbar sind",
    autoInstall: "Updates automatisch installieren",
    autoInstallDesc: "Verfügbare Updates automatisch herunterladen und installieren",
    checkForUpdates: "Nach Updates suchen",
    lastChecked: "Zuletzt geprüft: unbekannt",
    updatesAvailable: "{n} Update(s) verfügbar",
    allUpToDate: "Alle Anwendungen sind aktuell.",
    checkFailed: "Update-Prüfung fehlgeschlagen.",
    checking: "Prüfe…",
    checkNow: "Jetzt prüfen",
    diskOverview: "Festplattenübersicht",
    diskOverviewDesc: "Systemlaufwerk-Nutzung",
    used: "Belegt:",
    free: "Frei:",
    total: "Gesamt:",
    launcherStorage: "Launcher-Speicher",
    launcherStorageDesc: "Speicherplatz und Cache verwalten",
    cacheSize: "Cache-Größe",
    cacheSizeDesc: "Temporäre Dateien und Download-Cache",
    calculating: "Berechne…",
    clear: "Löschen",
    clearing: "Lösche…",
    appData: "Anwendungsdaten",
    appDataDesc: "Einstellungen, Profile und Konfigurationsdateien",
    installedApps: "Installierte Anwendungen",
    installedAppsDesc: "Speicher pro installierter App",
    cloudSyncTitle: "Cloud-Synchronisation",
    cloudSyncDesc: "Einstellungen und Projekte geräteübergreifend synchronisieren (erfordert Avosos-Server)",
    serverUrl: "Server-URL",
    serverUrlDesc: "Deine Avosos-Sync-Server-Adresse",
    serverUrlPlaceholder: "https://dein-server.beispiel.de",
    syncSettings: "Einstellungen synchronisieren",
    syncSettingsDesc: "Launcher-Einstellungen und Darstellung synchronisieren",
    syncProjects: "Projekte synchronisieren",
    syncProjectsDesc: "Projektmetadaten und Konfiguration synchronisieren",
    lastSync: "Letzte Synchronisation",
    lastSyncNever: "Nie — Server nicht konfiguriert",
    syncNow: "Jetzt synchronisieren",
    serverRequired: "Server erforderlich",
    cloudSyncAlert: "Cloud-Sync erfordert einen konfigurierten Avosos-Server. Diese Funktion wird in einem zukünftigen Update verfügbar sein.",
    aboutTitle: "Über Avosos Launcher",
    aboutName: "Avosos Launcher",
    aboutVersion: "Version 0.1.0 (Alpha)",
    aboutDesc: "Universeller Anwendungs-Launcher für professionelle Arbeitsabläufe",
    systemInfo: "Systeminformationen",
    systemInfoDesc: "Details zu deinem Gerät",
    platform: "Plattform",
    architecture: "Architektur",
    hostname: "Hostname",
    cpuLabel: "CPU",
    cpuCores: "CPU-Kerne",
    totalMemory: "Gesamtspeicher",
    gpuLabel: "GPU",
    vram: "VRAM",
    uptime: "Betriebszeit",
    links: "Links",
    githubOrg: "GitHub-Organisation",
  },
  store: {
    title: "Store",
    description: "Avosos-Anwendungen durchsuchen, installieren und verwalten. Lizenzen aktivieren, um Premium-Funktionen freizuschalten.",
    featured: "Empfohlen",
    featuredTitle: "Avosos-Anwendungssuite",
    featuredDesc: "Professionelle Tools für Videobearbeitung, Audioverarbeitung, Schreiben, Manga-Lesen und mehr. Alle kostenlos installierbar.",
    searchPlaceholder: "Store durchsuchen…",
    allCategories: "Alle Kategorien",
    maintenance: "Wartung",
    running: "Läuft",
    free: "Kostenlos",
    starting: "Starte…",
    installing: "Installiere…",
    install: "Installieren",
    launch: "Starten",
    activateLicense: "Lizenz aktivieren",
    uninstalling: "Deinstalliere…",
    licenseStatus: "Lizenz: {status}",
    modalTitle: "Lizenz aktivieren",
    licenseKey: "Lizenzschlüssel",
    licensePlaceholder: "XXXX-XXXX-XXXX-XXXX",
    licenseError: "Ungültiger Lizenzschlüssel. Bitte überprüfe die Eingabe.",
    cancel: "Abbrechen",
    validating: "Überprüfe…",
    activate: "Aktivieren",
  },
  projects: {
    title: "Projekte",
    projectCount: "{n} Projekt(e)",
    activeCount: "{n} aktiv",
    newProject: "Neues Projekt",
    searchPlaceholder: "Projekte suchen…",
    filterAll: "Alle",
    filterActive: "Aktiv",
    filterPaused: "Pausiert",
    filterCompleted: "Abgeschlossen",
    filterArchived: "Archiviert",
    statusActive: "Aktiv",
    statusPaused: "Pausiert",
    statusCompleted: "Abgeschlossen",
    statusArchived: "Archiviert",
    priorityLow: "Niedrig",
    priorityMedium: "Mittel",
    priorityHigh: "Hoch",
    statusLabel: "Status:",
    priorityLabel: "Priorität:",
    deadlineLabel: "Frist:",
    openFolder: "Ordner öffnen",
    toolchain: "Toolchain",
    notesSection: "Notizen",
    save: "Speichern",
    edit: "Bearbeiten",
    notesPlaceholder: "Notizen zu diesem Projekt hinzufügen…",
    noNotes: "Noch keine Notizen. Klicke auf Bearbeiten, um welche hinzuzufügen.",
    recentActivity: "Letzte Aktivitäten",
    justNow: "gerade eben",
    minutesAgo: "vor {n} Min.",
    hoursAgo: "vor {n} Std.",
    daysAgo: "vor {n} Tagen",
    deleteBtn: "Löschen",
    deleteConfirm: "Projekt \"{name}\" löschen?",
    openProject: "Projekt öffnen",
    emptyTitle: "Noch keine Projekte",
    emptyDesc: "Projekte fassen Anwendungen, Versionen und Einstellungen zusammen. Erstelle dein erstes Projekt, um loszulegen.",
    createProject: "Projekt erstellen",
    modalTitle: "Projekt erstellen",
    projectName: "Projektname *",
    projectNamePlaceholder: "Mein Videoprojekt",
    description: "Beschreibung",
    descriptionPlaceholder: "Worum geht es in diesem Projekt?",
    requiredApps: "Benötigte Anwendungen",
    tagsLabel: "Tags (kommagetrennt)",
    tagsPlaceholder: "Video, YouTube, Tutorial",
    priority: "Priorität",
    deadline: "Frist (optional)",
    projectDir: "Projektverzeichnis (optional)",
    projectDirPlaceholder: "Ordner auswählen…",
    cancel: "Abbrechen",
    createBtn: "Projekt erstellen",
  },
  profiles: {
    title: "Umgebungsprofile",
    description: "Profile definieren ein kuratiertes Set aus Tools, Versionen, Plugins und Konfigurationen. Wechsle zwischen Profilen, um deine Arbeitsumgebung sofort zu ändern. Profile sind portabel und können dein Setup auf jedem Gerät wiederherstellen.",
    defaultDesc: "Benutzerdefiniertes Umgebungsprofil",
    createProfile: "Profil erstellen",
    createProfileDesc: "Neue Umgebungskonfiguration definieren",
    active: "Aktiv",
    applicationsCount: "Anwendungen ({n})",
    noApps: "Noch keine Anwendungen konfiguriert",
    configure: "Konfigurieren",
    activate: "Aktivieren",
    removeConfirm: "Profil \"{name}\" entfernen?",
    editorComingSoon: "Profil-Editor kommt bald",
  },
  admin: {
    title: "Admin",
    controlPanel: "Kontrollzentrum",
    tabOverview: "Übersicht",
    tabAppMgmt: "App-Verwaltung",
    tabUserMgmt: "Benutzerverwaltung",
    tabDevTools: "Entwicklertools",
    tabMaintenance: "Wartung",
    tabSecurity: "Zugriff & Sicherheit",
    overviewTitle: "Admin-Übersicht",
    overviewDesc: "Systemzustand, registrierte Anwendungen und Launcher-Status auf einen Blick.",
    registeredApps: "Registrierte Apps",
    running: "Laufend",
    cpu: "CPU",
    memory: "Arbeitsspeicher",
    installedWithSource: "installiert, {n} mit Quellpfad",
    noAppsRunning: "Keine Apps laufen",
    registeredAppsTable: "Registrierte Anwendungen",
    colApp: "App",
    colVersion: "Version",
    colCategory: "Kategorie",
    colSource: "Quelle",
    colStatus: "Status",
    statusRunning: "Läuft",
    statusInstalled: "Installiert",
    statusNotInstalled: "Nicht installiert",
    profilesCard: "Profile",
    profilesDesc: "Umgebungsprofile konfiguriert",
    projectsCard: "Projekte",
    projectsDesc: "Projekte erfasst",
    platformCard: "Plattform",
    unknownCpu: "Unbekannte CPU",
    appMgmtTitle: "App-Verwaltung",
    appMgmtDesc: "Registrierte Anwendungen verwalten, nach neuen Projekten scannen und Massenoperationen durchführen.",
    scanning: "Scanne...",
    scanForProjects: "Nach Projekten scannen",
    bumpingAll: "Alle hochsetzen...",
    autoBumpAll: "Alle auto-hochsetzen",
    refreshMetadata: "Alle Metadaten aktualisieren",
    scanResults: "Scan-Ergebnisse ({n} gefunden)",
    dismiss: "Schließen",
    noProjectsFound: "Keine Projekte im ausgewählten Verzeichnis gefunden.",
    runningBadge: "LÄUFT",
    noSourcePath: "Kein Quellpfad konfiguriert",
    details: "Details",
    uncommitted: "Nicht committet",
    clean: "Sauber",
    ahead: "{n} voraus",
    behind: "{n} hinterher",
    deployLabel: "Bereitstellen:",
    rollback: "Zurückrollen",
    rollbackTitle: "Auf aktuelle Version zurückrollen",
    maintenanceToggle: "Wartung",
    maintenancePlaceholder: "Wartungsnachricht (optional)",
    userMgmtTitle: "Benutzerverwaltung",
    userMgmtDesc: "Launcher-Benutzer verwalten, Rollen zuweisen und Zugriffsebenen steuern.",
    addUser: "Benutzer hinzufügen",
    username: "Benutzername",
    email: "E-Mail",
    role: "Rolle",
    usernamePlaceholder: "maxmustermann",
    emailPlaceholder: "max@beispiel.de",
    roleUser: "Benutzer",
    roleAdmin: "Admin",
    addBtn: "Hinzufügen",
    registeredUsers: "Registrierte Benutzer ({n})",
    noUsersYet: "Noch keine Benutzer registriert. Füge oben einen hinzu.",
    colUsername: "Benutzername",
    colEmail: "E-Mail",
    colRole: "Rolle",
    colLastLogin: "Letzter Login",
    colStatusUser: "Status",
    colActions: "Aktionen",
    never: "Nie",
    userActive: "Aktiv",
    userInactive: "Inaktiv",
    demote: "Herabstufen",
    promote: "Hochstufen",
    removeUserConfirm: "Benutzer {username} entfernen?",
    devToolsTitle: "Entwicklertools",
    devToolsDesc: "Laufzeiterkennung, Umgebungsdiagnose und Entwicklungstools.",
    detectedRuntimes: "Erkannte Laufzeiten",
    detectingRuntimes: "Installierte Laufzeiten werden erkannt...",
    notInstalled: "Nicht installiert",
    envVars: "Umgebungsvariablen",
    hide: "Ausblenden",
    show: "Einblenden",
    filterVars: "Variablen filtern...",
    noEnvVars: "Keine Umgebungsvariablen verfügbar.",
    quickActions: "Schnellaktionen",
    openDataDir: "Datenverzeichnis öffnen",
    openGithub: "GitHub öffnen",
    maintenanceTitle: "Wartung",
    maintenanceDesc: "Cache-Verwaltung, Konfigurationssicherung und Launcher-Diagnose.",
    cacheMgmt: "Cache-Verwaltung",
    cacheMgmtDesc: "Temporäre Dateien, Download-Cache und Code-Cache löschen, um Speicherplatz freizugeben.",
    clearingCaches: "Lösche...",
    clearAllCaches: "Alle Caches löschen",
    cacheCleared: "{n} zwischengespeicherte Dateien gelöscht.",
    cacheClearFailed: "Cache konnte nicht gelöscht werden.",
    configBackup: "Konfigurationssicherung",
    configBackupDesc: "Launcher-Konfiguration in die Zwischenablage exportieren oder von dort importieren.",
    exporting: "Exportiere...",
    exportToClipboard: "In Zwischenablage exportieren",
    importing: "Importiere...",
    importFromClipboard: "Aus Zwischenablage importieren",
    exportSuccess: "Konfiguration in Zwischenablage kopiert!",
    exportFailed: "Konfiguration konnte nicht exportiert werden.",
    importSuccess: "Konfiguration erfolgreich importiert! Zum Anwenden neu starten.",
    importInvalid: "Ungültiges Konfigurationsformat.",
    importFailed: "Zwischenablage konnte nicht gelesen werden.",
    launcherLogs: "Launcher-Protokolle",
    showLogs: "Protokolle anzeigen",
    hideLogs: "Ausblenden",
    noLogs: "Noch keine Protokolle. Protokolle werden aufgezeichnet, während der Launcher läuft.",
    securityTitle: "Zugriff & Sicherheit",
    securityDesc: "Steuere, wer auf Admin-Funktionen zugreifen kann und das Launcher-Verhalten einschränken.",
    adminProtection: "Admin-Schutz",
    lockAdmin: "Admin-Panel sperren",
    lockAdminDesc: "Bestätigung vor dem Zugriff auf Admin-Einstellungen erforderlich",
    confirmDestructive: "Destruktive Aktionen bestätigen",
    confirmDestructiveDesc: "Bestätigungsdialog vor dem Löschen von Caches oder Importieren von Konfigurationen",
    developerMode: "Entwicklermodus",
    developerModeDesc: "Entwicklerfunktionen wie Versionierung, Git-Status und Projekt-Scanning aktivieren",
    pathRestrictions: "Pfadbeschränkungen",
    pathRestrictionsDesc: "Einschränken, auf welche Verzeichnisse der Launcher zum Scannen und Starten von Anwendungen zugreifen kann.",
    enablePathRestrictions: "Pfadbeschränkungen aktivieren",
    enablePathRestrictionsDesc: "Nur Apps aus bestimmten Verzeichnissen erlauben",
    allowedDirs: "Erlaubte Verzeichnisse",
    addDir: "+ Hinzufügen",
    noPaths: "Keine Pfade hinzugefügt — alle Verzeichnisse sind aktuell blockiert.",
    dangerZone: "Gefahrenzone",
    dangerZoneDesc: "Unwiderrufliche Aktionen, die deinen gesamten Launcher-Zustand betreffen. Vorsicht walten lassen.",
    resetConfirm: "Alle Launcher-Einstellungen auf Standard zurücksetzen? Dies kann nicht rückgängig gemacht werden.",
    resetLauncher: "Launcher zurücksetzen",
  },
  defaultProfiles: {
    videoProduction: "Videoproduktion",
    videoProductionDesc: "Professionelles Videobearbeitungs-Setup",
    development: "Entwicklung",
    developmentDesc: "Vollständige Entwicklungsumgebung",
    design: "Design",
    designDesc: "Grafik- und Design-Workflow",
  },
  common: {
    save: "Speichern",
    cancel: "Abbrechen",
    delete: "Löschen",
    loading: "Laden…",
    close: "Schließen",
  },
};

const translations: Record<Language, Translations> = { en, de };

export function getTranslations(lang: Language): Translations {
  return translations[lang] || translations.en;
}

export const LANGUAGES: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "de", label: "Deutsch" },
];
