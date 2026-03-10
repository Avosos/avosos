"use client";

import React from "react";
import { PenTool } from "lucide-react";

/**
 * NovelTea icon — PenTool icon with lime-green gradient background.
 */
export default function NovelteaIcon({ size = 40 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.19,
        background: "linear-gradient(135deg, #a3e635, #65a30d)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <PenTool size={size * 0.5} color="#fff" />
    </div>
  );
}
