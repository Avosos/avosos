"use client";

import React, { useEffect } from "react";
import Titlebar from "./titlebar";
import Sidebar from "./sidebar";
import DashboardView from "@/components/dashboard/dashboard-view";
import LibraryView from "@/components/library/library-view";
import AppDetailView from "@/components/library/app-detail-view";
import ProjectsView from "@/components/projects/projects-view";
import StoreView from "@/components/store/store-view";
import SettingsView from "@/components/settings/settings-view";
import AdminBoard from "@/components/admin/admin-board";
import NotificationPanel from "@/components/layout/notification-panel";
import { useLauncherStore } from "@/stores/launcher-store";

export default function MainLayout() {
  const { currentView, initialize, setSystemStats } = useLauncherStore();

  useEffect(() => {
    initialize();

    // Start system monitor
    window.electronAPI?.startMonitor();
    const unsub = window.electronAPI?.onSystemStats((stats) => {
      setSystemStats(stats);
    });

    return () => {
      unsub?.();
      window.electronAPI?.stopMonitor();
    };
  }, [initialize, setSystemStats]);

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardView />;
      case "library":
        return <LibraryView />;
      case "app-detail":
        return <AppDetailView />;
      case "projects":
        return <ProjectsView />;
      case "profiles":
        return <ProfilesView />;
      case "settings":
        return <SettingsView />;
      case "admin":
        return <AdminBoard />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Titlebar />

      <div
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
        }}
      >
        <Sidebar />

        {/* Main content area */}
        <main
          style={{
            flex: 1,
            overflow: "auto",
            padding: 0,
          }}
        >
          {renderView()}
        </main>
      </div>
    </div>
  );
}
