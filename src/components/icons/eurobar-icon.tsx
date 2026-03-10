"use client";

import React from "react";
import { ScanBarcode } from "lucide-react";

/**
 * Eurobar icon — ScanBarcode icon with orange-to-amber gradient background.
 */
export default function EurobarIcon({ size = 40 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.19,
        background: "linear-gradient(135deg, #f97316, #eab308)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <ScanBarcode size={size * 0.5} color="#fff" />
    </div>
  );
}
