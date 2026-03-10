"use client";

import React from "react";
import { ClipboardCheck } from "lucide-react";

/**
 * Appliview icon — ClipboardCheck icon with teal-to-blue gradient background.
 */
export default function AppliviewIcon({ size = 40 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.19,
        background: "linear-gradient(135deg, #2dd4bf, #3b82f6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <ClipboardCheck size={size * 0.5} color="#fff" />
    </div>
  );
}
