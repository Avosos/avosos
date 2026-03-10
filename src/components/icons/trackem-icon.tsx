"use client";

import React from "react";
import { Bookmark } from "lucide-react";

/**
 * TrackEm icon — Bookmark icon with purple gradient background.
 */
export default function TrackemIcon({ size = 40 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.19,
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Bookmark size={size * 0.5} color="#fff" />
    </div>
  );
}
